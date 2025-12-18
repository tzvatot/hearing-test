/**
 * Hearing Test Application Logic
 * Implements Hughson-Westlake procedure for threshold detection
 */

class HearingTest {
    constructor() {
        // Test frequencies in Hz (standard audiometric frequencies)
        this.frequencies = [250, 500, 1000, 2000, 3000, 4000, 6000, 8000];

        // Test configuration
        this.ears = ['right', 'left'];
        this.currentEarIndex = 0;
        this.currentFrequencyIndex = 0;

        // Threshold detection parameters (Hughson-Westlake method)
        this.currentLevel = 40; // Starting level in dB HL
        this.minLevel = -10;    // Extended to support excellent hearing
        this.maxLevel = 100;    // Extended upper range
        this.stepSizeDown = 10; // Decrease by 10 dB when heard
        this.stepSizeUp = 5;    // Increase by 5 dB when not heard
        this.responsesAtLevel = [];
        this.ascendingRun = false;

        // Results storage
        this.results = {
            right: {},
            left: {},
            timestamp: null
        };

        // Test state
        this.isWaitingForResponse = false;
        this.toneTimeout = null;
        this.responseTimeout = null;
        this.heardCount = 0;
        this.notHeardCount = 0;

        // Tutorial state
        this.isTutorialMode = false;
        this.tutorialTonesCompleted = 0;
        this.tutorialTotalTones = 4;
        this.tutorialTones = [
            { freq: 1000, level: 50, ear: 'right' },
            { freq: 2000, level: 45, ear: 'left' },
            { freq: 500, level: 40, ear: 'right' },
            { freq: 4000, level: 50, ear: 'left' }
        ];

        // UI elements (will be initialized when DOM is ready)
        this.screens = {};
        this.elements = {};

        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initUI());
        } else {
            this.initUI();
        }
    }

    initUI() {
        // Cache screen elements
        this.screens = {
            welcome: document.getElementById('welcome-screen'),
            calibration: document.getElementById('calibration-screen'),
            tutorial: document.getElementById('tutorial-screen'),
            test: document.getElementById('test-screen'),
            results: document.getElementById('results-screen')
        };

        // Cache other UI elements
        this.elements = {
            currentEar: document.getElementById('current-ear'),
            currentFrequency: document.getElementById('current-frequency'),
            progressFill: document.getElementById('progress-fill'),
            progressText: document.getElementById('progress-text'),
            testStatus: document.getElementById('test-status'),
            hearButton: document.getElementById('hear-button'),
            tutorialButton: document.getElementById('tutorial-button'),
            tutorialStatus: document.getElementById('tutorial-status'),
            tutorialCounter: document.getElementById('tutorial-counter'),
            startTutorialBtn: document.getElementById('start-tutorial-btn'),
            finishTutorialBtn: document.getElementById('finish-tutorial-btn')
        };

        // Add keyboard listener for spacebar
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.isWaitingForResponse) {
                e.preventDefault();
                if (this.isTutorialMode) {
                    this.handleTutorialResponse();
                } else {
                    this.handleResponse(true);
                }
            }
        });

        // Add click listener for hear button (test mode)
        if (this.elements.hearButton) {
            this.elements.hearButton.addEventListener('click', () => {
                if (this.isWaitingForResponse && !this.isTutorialMode) {
                    this.handleResponse(true);
                }
            });
        }

        // Add click listener for tutorial button
        if (this.elements.tutorialButton) {
            this.elements.tutorialButton.addEventListener('click', () => {
                if (this.isWaitingForResponse && this.isTutorialMode) {
                    this.handleTutorialResponse();
                }
            });
        }
    }

    // Screen management
    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        if (this.screens[screenName]) {
            this.screens[screenName].classList.add('active');
        }
    }

    // Calibration flow
    startCalibration() {
        this.showScreen('calibration');
        document.getElementById('calibration-volume').classList.remove('hidden');
        document.getElementById('calibration-headphones').classList.add('hidden');
    }

    playCalibrationTone() {
        audioGen.playCalibrationTone();
    }

    nextCalibrationStep() {
        // Stop any playing calibration tone
        audioGen.stopTone();

        document.getElementById('calibration-volume').classList.add('hidden');
        document.getElementById('calibration-headphones').classList.remove('hidden');
    }

    playTestTone(ear) {
        audioGen.playHeadphoneTest(ear);
    }

    // Tutorial methods
    showTutorial() {
        // Stop any playing headphone test tone
        audioGen.stopTone();

        this.showScreen('tutorial');
        this.tutorialTonesCompleted = 0;
        this.isTutorialMode = false;
        this.updateTutorialUI();
    }

    startTutorial() {
        this.isTutorialMode = true;
        this.tutorialTonesCompleted = 0;
        this.elements.startTutorialBtn.classList.add('hidden');
        this.elements.tutorialButton.style.opacity = '1';
        this.updateTutorialUI();

        // Start first practice tone after a short delay
        setTimeout(() => {
            this.playNextTutorialTone();
        }, 1500);
    }

    playNextTutorialTone() {
        if (this.tutorialTonesCompleted >= this.tutorialTotalTones) {
            this.completeTutorial();
            return;
        }

        const currentTone = this.tutorialTones[this.tutorialTonesCompleted];
        this.isWaitingForResponse = true;
        this.elements.tutorialStatus.textContent = i18n.t('tutorial.status.listen');
        this.elements.tutorialButton.style.opacity = '1';

        // Play the tone
        audioGen.playTone(currentTone.freq, currentTone.level, currentTone.ear, 1.5);

        // Auto-advance if no response after 4 seconds (tone is 1.5s + 2.5s wait)
        this.responseTimeout = setTimeout(() => {
            if (this.isWaitingForResponse) {
                this.handleTutorialResponse(false);
            }
        }, 4000);
    }

    handleTutorialResponse(heard = true) {
        if (!this.isWaitingForResponse || !this.isTutorialMode) return;

        this.isWaitingForResponse = false;
        clearTimeout(this.responseTimeout);

        this.elements.tutorialButton.style.opacity = '0.7';

        if (heard) {
            this.tutorialTonesCompleted++;
            this.elements.tutorialStatus.textContent = i18n.t('tutorial.status.correct');
        } else {
            this.tutorialTonesCompleted++;
            this.elements.tutorialStatus.textContent = i18n.t('tutorial.status.noresponse');
        }

        this.updateTutorialUI();

        // Wait a moment then play next tone
        setTimeout(() => {
            this.playNextTutorialTone();
        }, 1500);
    }

    updateTutorialUI() {
        if (this.elements.tutorialCounter) {
            this.elements.tutorialCounter.textContent = `${this.tutorialTonesCompleted} / ${this.tutorialTotalTones}`;
        }
    }

    completeTutorial() {
        this.isTutorialMode = false;
        this.isWaitingForResponse = false;
        this.elements.tutorialStatus.textContent = i18n.t('tutorial.status.complete');
        this.elements.tutorialButton.style.opacity = '0.5';
        this.elements.finishTutorialBtn.classList.remove('hidden');
    }

    finishTutorial() {
        this.startTest();
    }

    skipTutorial() {
        this.isTutorialMode = false;
        this.isWaitingForResponse = false;
        if (this.responseTimeout) {
            clearTimeout(this.responseTimeout);
        }
        this.startTest();
    }

    // Start the actual hearing test
    startTest() {
        this.showScreen('test');
        this.currentEarIndex = 0;
        this.currentFrequencyIndex = 0;
        this.results = {
            right: {},
            left: {},
            timestamp: new Date().toISOString()
        };

        this.updateProgress();
        this.startFrequencyTest();
    }

    // Update progress display
    updateProgress() {
        const totalTests = this.frequencies.length * this.ears.length;
        const completedTests = this.currentEarIndex * this.frequencies.length + this.currentFrequencyIndex;
        const progress = (completedTests / totalTests) * 100;

        this.elements.progressFill.style.width = progress + '%';
        this.elements.progressText.textContent = Math.round(progress) + '% ' + i18n.t('test.progress');

        const currentEar = this.ears[this.currentEarIndex];
        const currentFreq = this.frequencies[this.currentFrequencyIndex];

        this.elements.currentEar.textContent = currentEar === 'right' ? i18n.t('test.ear.right') : i18n.t('test.ear.left');
        this.elements.currentFrequency.textContent = currentFreq;
    }

    // Start testing a new frequency (Hughson-Westlake procedure)
    startFrequencyTest() {
        // Reset threshold detection parameters
        this.currentLevel = 40; // Start at 40 dB HL
        this.responsesAtLevel = [];
        this.ascendingRun = false;
        this.heardCount = 0;
        this.notHeardCount = 0;

        this.updateProgress();

        // Wait a random interval before first tone (1-3 seconds)
        const delay = 1000 + Math.random() * 2000;
        this.toneTimeout = setTimeout(() => {
            this.presentTone();
        }, delay);
    }

    // Present a tone and wait for response
    presentTone() {
        const currentEar = this.ears[this.currentEarIndex];
        const currentFreq = this.frequencies[this.currentFrequencyIndex];

        this.isWaitingForResponse = true;
        this.elements.testStatus.textContent = i18n.t('test.status.listening');
        this.elements.hearButton.style.opacity = '1';

        // Play the tone
        audioGen.playTone(currentFreq, this.currentLevel, currentEar, 1.5);

        // Wait for response (3 seconds max)
        this.responseTimeout = setTimeout(() => {
            // No response = didn't hear it
            if (this.isWaitingForResponse) {
                this.handleResponse(false);
            }
        }, 3500); // Wait a bit longer than tone duration
    }

    // Handle user response
    handleResponse(heard) {
        if (!this.isWaitingForResponse) return;

        this.isWaitingForResponse = false;
        clearTimeout(this.responseTimeout);

        this.elements.hearButton.style.opacity = '0.7';

        // Hughson-Westlake procedure:
        // 1. Decrease by 10 dB when heard
        // 2. Increase by 5 dB when not heard
        // 3. Threshold = lowest level with 2+ responses during ascending trials

        if (heard) {
            this.heardCount++;

            // When heard, always decrease by 10 dB
            this.currentLevel -= this.stepSizeDown;
            if (this.currentLevel < this.minLevel) {
                this.currentLevel = this.minLevel;
            }

            this.elements.testStatus.textContent = i18n.t('test.status.heard');

            // Track if this was an ascending trial (after a "not heard")
            if (this.ascendingRun) {
                // Record the level where we heard it (before we decreased)
                const levelHeard = this.currentLevel + this.stepSizeDown;
                this.responsesAtLevel.push({ level: levelHeard, heard: true });

                // Check if we have threshold (2+ responses at the threshold level)
                const thresholdLevel = this.findThreshold();
                if (thresholdLevel !== null) {
                    this.recordThreshold(thresholdLevel);
                    return;
                }
            }

            // Reset ascending flag since we heard it
            this.ascendingRun = false;

        } else {
            this.notHeardCount++;
            this.elements.testStatus.textContent = i18n.t('test.status.louder');

            // When not heard, increase by 5 dB
            this.currentLevel += this.stepSizeUp;

            if (this.currentLevel > this.maxLevel) {
                // Can't hear even at max level
                this.recordThreshold(this.maxLevel);
                return;
            }

            // Mark that we're in ascending phase
            this.ascendingRun = true;
            this.responsesAtLevel.push({ level: this.currentLevel, heard: false });
        }

        // Schedule next tone with random delay
        const delay = 1000 + Math.random() * 2000;
        this.toneTimeout = setTimeout(() => {
            this.presentTone();
        }, delay);
    }

    // Find threshold from responses (Hughson-Westlake: lowest level with 2+ ascending responses)
    findThreshold() {
        if (this.responsesAtLevel.length < 3) return null;

        // Group responses by level
        const responsesByLevel = {};
        this.responsesAtLevel.forEach(resp => {
            if (!responsesByLevel[resp.level]) {
                responsesByLevel[resp.level] = [];
            }
            responsesByLevel[resp.level].push(resp.heard);
        });

        // Find lowest level with at least 2 "heard" responses
        const levels = Object.keys(responsesByLevel).map(Number).sort((a, b) => a - b);

        for (let level of levels) {
            const heardCount = responsesByLevel[level].filter(h => h).length;
            if (heardCount >= 2) {
                return level;
            }
        }

        // If we have enough attempts without finding threshold, use most common level
        if (this.responsesAtLevel.length >= 6) {
            // Find the level with most "heard" responses
            let maxHeard = 0;
            let bestLevel = this.currentLevel;

            for (let level of levels) {
                const heardCount = responsesByLevel[level].filter(h => h).length;
                if (heardCount > maxHeard) {
                    maxHeard = heardCount;
                    bestLevel = level;
                }
            }

            return bestLevel;
        }

        return null;
    }

    // Record threshold for current frequency and move to next
    recordThreshold(threshold = null, skipped = false) {
        const currentEar = this.ears[this.currentEarIndex];
        const currentFreq = this.frequencies[this.currentFrequencyIndex];

        // Record threshold (or current level if not provided)
        // Use special marker for skipped frequencies
        const thresholdValue = skipped ? 'skipped' : (threshold !== null ? threshold : this.currentLevel);
        this.results[currentEar][currentFreq] = thresholdValue;

        console.log(`Threshold recorded: ${currentEar} ear, ${currentFreq} Hz = ${thresholdValue}${skipped ? '' : ' dB HL'}`);

        if (skipped) {
            this.elements.testStatus.textContent = i18n.t('test.status.skipped');
        } else {
            this.elements.testStatus.textContent = i18n.t('test.status.threshold');
        }

        // Move to next frequency or ear
        this.currentFrequencyIndex++;

        if (this.currentFrequencyIndex >= this.frequencies.length) {
            // Move to next ear
            this.currentFrequencyIndex = 0;
            this.currentEarIndex++;

            if (this.currentEarIndex >= this.ears.length) {
                // Test complete!
                this.completeTest();
                return;
            }
        }

        // Continue with next frequency
        this.toneTimeout = setTimeout(() => {
            this.startFrequencyTest();
        }, 2000);
    }

    // Skip current frequency test
    skipCurrentFrequency() {
        // Stop any playing tones
        audioGen.stopTone();

        // Clear any pending timeouts
        if (this.responseTimeout) {
            clearTimeout(this.responseTimeout);
        }
        if (this.toneTimeout) {
            clearTimeout(this.toneTimeout);
        }

        // Reset waiting state
        this.isWaitingForResponse = false;

        // Record as skipped and move to next
        this.recordThreshold(null, true);
    }

    // Complete the test and show results
    completeTest() {
        // Stop all audio and clear all timeouts
        this.stopAllAudio();

        this.elements.testStatus.textContent = i18n.t('test.status.complete');
        console.log('Test results:', this.results);

        // Wait a moment then show results
        setTimeout(() => {
            this.showResults();
        }, 1500);
    }

    // Stop all audio playback and clear all timeouts
    stopAllAudio() {
        // Stop any currently playing tone
        audioGen.stopTone();

        // Clear all pending timeouts
        if (this.responseTimeout) {
            clearTimeout(this.responseTimeout);
            this.responseTimeout = null;
        }
        if (this.toneTimeout) {
            clearTimeout(this.toneTimeout);
            this.toneTimeout = null;
        }

        // Reset waiting state
        this.isWaitingForResponse = false;
    }

    // Show results screen
    showResults() {
        this.showScreen('results');
        drawAudiogram(this.results);
    }

    // Save results as image
    saveResults() {
        const canvas = document.getElementById('audiogram-chart');
        const link = document.createElement('a');
        link.download = `hearing-test-${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL();
        link.click();
    }

    // Print results
    printResults() {
        window.print();
    }

    // Restart test
    restartTest() {
        // Stop all audio first
        this.stopAllAudio();

        this.currentEarIndex = 0;
        this.currentFrequencyIndex = 0;
        this.showScreen('welcome');
    }
}

// Create global app instance
const app = new HearingTest();
