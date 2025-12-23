/**
 * Game-based Hearing Test
 * Interactive, gamified version of pure tone audiometry
 */

class GameTest {
    constructor() {
        // Test configuration
        this.frequencies = [250, 500, 1000, 2000, 3000, 4000, 6000, 8000];
        this.ears = ['right', 'left'];
        this.maxAttemptsPerFreq = 8;
        this.successesNeeded = 2; // Need 2 correct at same level to establish threshold
        this.toneDuration = 1.5; // seconds

        // Current state
        this.currentEarIndex = 0;
        this.currentFrequencyIndex = 0;
        this.currentLevel = 40; // dB HL starting point
        this.currentScenarioIndex = 0;
        this.correctButtonIndex = 0; // 0, 1, or 2
        this.buttonPositions = [0, 1, 2]; // will be shuffled
        this.isPlaying = false;
        this.attemptsAtCurrentFreq = 0;

        // Validation tracking
        this.validationAttempts = {}; // { 'right_1000': [{level, correct, scenario, timestamp}] }
        this.successCountAtLevel = {}; // { 'right_1000': {40: 1, 30: 2} }

        // Test matrix tracking (for visualization)
        this.testMatrix = {}; // { 'right_1000': {40: 'V', 50: 'X', 30: '?'} }
        this.dbLevels = [-10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]; // All possible dB levels
        this.matrixExpanded = false;

        // Results (same format as pure tone test)
        this.results = {
            right: {},
            left: {},
            timestamp: null
        };

        // UI elements (will be set when screen is shown)
        this.elements = {};
    }

    /**
     * Initialize UI elements
     */
    initUI() {
        this.elements = {
            screen: document.getElementById('game-test-screen'),
            ear: document.getElementById('game-ear'),
            frequency: document.getElementById('game-frequency'),
            progressFill: document.getElementById('game-progress-fill'),
            instruction: document.getElementById('game-instruction'),
            scene: document.getElementById('game-scene'),
            option0: document.getElementById('game-option-0'),
            option1: document.getElementById('game-option-1'),
            option2: document.getElementById('game-option-2'),
            helpBtn: document.getElementById('game-help-btn'),
            feedback: document.getElementById('game-feedback'),
            expandMatrixBtn: document.getElementById('game-expand-matrix-btn'),
            matrixContainer: document.getElementById('game-matrix-container'),
            matrixTable: document.getElementById('game-matrix-table')
        };

        // Set initial instruction text in current language
        this.elements.instruction.innerHTML = `<p>${i18n.t('game.instruction')}</p>`;

        // Attach event listeners for tile clicks (to test/play sound)
        this.elements.option0.addEventListener('click', () => this.handleTileClick(0));
        this.elements.option1.addEventListener('click', () => this.handleTileClick(1));
        this.elements.option2.addEventListener('click', () => this.handleTileClick(2));

        // Get confirmation buttons
        this.elements.confirm0 = document.getElementById('game-confirm-0');
        this.elements.confirm1 = document.getElementById('game-confirm-1');
        this.elements.confirm2 = document.getElementById('game-confirm-2');

        // Attach event listeners for confirmation buttons
        this.elements.confirm0.addEventListener('click', () => this.handleAnswer(0));
        this.elements.confirm1.addEventListener('click', () => this.handleAnswer(1));
        this.elements.confirm2.addEventListener('click', () => this.handleAnswer(2));

        this.elements.helpBtn.addEventListener('click', () => this.handleIDontKnow());

        // Attach event listener for matrix expand button
        if (this.elements.expandMatrixBtn) {
            this.elements.expandMatrixBtn.addEventListener('click', () => this.toggleMatrix());
        }
    }

    /**
     * Update language-dependent UI elements when language changes
     */
    updateLanguage() {
        if (!this.elements || !this.elements.instruction) return;

        // Update instruction if we have a current scenario
        if (this.currentScenarioIndex !== undefined && this.currentScenarioIndex >= 0) {
            const scenarioIndex = (this.currentScenarioIndex - 1 + gameScenarios.length) % gameScenarios.length;
            const scenario = gameScenarios[scenarioIndex];
            this.elements.instruction.innerHTML = `<p>${i18n.t(scenario.instructionKey)}</p>`;
        } else {
            this.elements.instruction.innerHTML = `<p>${i18n.t('game.instruction')}</p>`;
        }

        // Update progress labels (ear and frequency are already handled by updateProgress)
        if (this.currentEarIndex !== undefined) {
            this.updateProgress();
        }

        // Update feedback if showing
        if (this.elements.feedback && this.elements.feedback.textContent) {
            const feedbackClasses = this.elements.feedback.className;
            if (feedbackClasses.includes('info')) {
                this.showFeedback('clicktotest', 'info');
            }
        }
    }

    /**
     * Start the game test sequence
     */
    async startTest() {
        // Reset state
        this.currentEarIndex = 0;
        this.currentFrequencyIndex = 0;
        this.currentLevel = 40;
        this.validationAttempts = {};
        this.successCountAtLevel = {};
        this.results = {
            right: {},
            left: {},
            timestamp: new Date().toISOString()
        };

        // Initialize test matrix
        this.initializeMatrix();

        // Start with right ear
        this.updateProgress();
        await this.presentTrial();
    }

    /**
     * Update progress display
     */
    updateProgress() {
        const currentEar = this.ears[this.currentEarIndex];
        const currentFreq = this.frequencies[this.currentFrequencyIndex];
        const totalSteps = this.frequencies.length * this.ears.length;
        const currentStep = this.currentEarIndex * this.frequencies.length + this.currentFrequencyIndex;
        const progressPercent = (currentStep / totalSteps) * 100;

        // Update UI
        this.elements.ear.textContent = i18n.t(`test.ear.${currentEar}`);
        this.elements.frequency.textContent = `${currentFreq} Hz`;
        this.elements.progressFill.style.width = `${progressPercent}%`;
    }

    /**
     * Present a trial with current scenario
     */
    async presentTrial() {
        // Select and rotate scenario
        const scenario = gameScenarios[this.currentScenarioIndex];
        this.currentScenarioIndex = (this.currentScenarioIndex + 1) % gameScenarios.length;

        // Randomize button positions
        this.buttonPositions = this.shuffleArray([0, 1, 2]);
        this.correctButtonIndex = Math.floor(Math.random() * 3);

        // Update instruction text
        this.elements.instruction.innerHTML = `<p>${i18n.t(scenario.instructionKey)}</p>`;

        // Render scene and buttons
        this.renderScene(scenario);
        this.renderButtons(scenario);

        // Clear previous feedback
        this.elements.feedback.textContent = '';
        this.elements.feedback.className = 'game-feedback';

        // Enable tile buttons, but disable confirmation buttons until user tests a tile
        this.enableTileButtons();
        this.disableConfirmButtons();
        this.elements.helpBtn.disabled = false;
        this.showFeedback('clicktotest', 'info');
    }

    /**
     * Render the game scene background
     */
    renderScene(scenario) {
        if (scenario.renderScene) {
            this.elements.scene.innerHTML = scenario.renderScene();
        } else {
            this.elements.scene.innerHTML = ''; // No background for this scenario
        }
    }

    /**
     * Render the three button options
     */
    renderButtons(scenario) {
        const buttons = [this.elements.option0, this.elements.option1, this.elements.option2];

        for (let i = 0; i < 3; i++) {
            const position = this.buttonPositions[i];
            // Don't reveal which is correct - all tiles look the same
            const buttonConfig = scenario.buttons[position];

            // Render button SVG WITHOUT revealing the correct one
            buttons[i].innerHTML = scenario.renderButton(buttonConfig, false, i);
            buttons[i].className = 'game-option-btn';
        }
    }

    /**
     * Handle tile click (user testing which tile makes sound)
     */
    async handleTileClick(tileIndex) {
        // Stop any currently playing sound immediately
        if (this.isPlaying) {
            audioGen.stopTone();
            this.isPlaying = false;

            // Remove playing-sound class from all buttons
            const buttons = [this.elements.option0, this.elements.option1, this.elements.option2];
            buttons.forEach(btn => btn.classList.remove('playing-sound'));
        }

        // Disable tile buttons during playback, but keep "This!" buttons enabled
        this.disableTileButtons();

        // Only play sound if this is the CORRECT tile
        if (tileIndex === this.correctButtonIndex) {
            // Play tone WITHOUT visual feedback (don't give away the answer!)
            await this.playTone();
        } else {
            // Wait the same duration even for wrong tiles to prevent visual tells
            await this.delay(this.toneDuration * 1000 + 100);
        }

        // Re-enable tile buttons and enable confirmation buttons after testing
        this.enableTileButtons();
        this.enableConfirmButtons();
    }

    /**
     * Play tone at current test frequency and level
     */
    async playTone() {
        const currentEar = this.ears[this.currentEarIndex];
        const currentFreq = this.frequencies[this.currentFrequencyIndex];

        this.isPlaying = true;

        // Play the tone
        audioGen.playTone(currentFreq, this.currentLevel, currentEar, this.toneDuration);

        // Wait for tone to complete
        await this.delay(this.toneDuration * 1000 + 100);

        this.isPlaying = false;
    }

    /**
     * Handle user's confirmation button click ("This!")
     */
    async handleAnswer(selectedIndex) {
        // Stop any currently playing sound immediately
        if (this.isPlaying) {
            audioGen.stopTone();
            this.isPlaying = false;
        }

        // Disable all buttons immediately
        this.disableButtons();

        const isCorrect = (selectedIndex === this.correctButtonIndex);
        const scenario = gameScenarios[(this.currentScenarioIndex - 1 + gameScenarios.length) % gameScenarios.length];

        // Record this attempt
        this.recordAttempt(this.currentLevel, isCorrect, scenario.id);

        // Visual feedback
        const buttons = [this.elements.option0, this.elements.option1, this.elements.option2];
        buttons[selectedIndex].classList.add(isCorrect ? 'correct' : 'incorrect');

        if (isCorrect) {
            // NOW show the visual indicator on the correct tile (doorbell, bird, etc.)
            const position = this.buttonPositions[this.correctButtonIndex];
            const buttonConfig = scenario.buttons[position];
            buttons[this.correctButtonIndex].innerHTML = scenario.renderButton(buttonConfig, true, this.correctButtonIndex);

            this.showFeedback('correct', 'success');

            // Check if threshold found
            if (this.checkThreshold()) {
                // Threshold found, move to next frequency
                await this.delay(1500);
                this.moveToNextFrequency();
            } else {
                // Continue testing at lower level
                this.currentLevel = Math.max(-10, this.currentLevel - 10);
                await this.delay(1500);
                this.presentTrial();
            }
        } else {
            this.showFeedback('incorrect', 'error');

            // Increase level and retry
            this.currentLevel = Math.min(100, this.currentLevel + 5);
            this.attemptsAtCurrentFreq++;

            // Check if max attempts reached
            if (this.attemptsAtCurrentFreq >= this.maxAttemptsPerFreq) {
                // Record threshold at current level and move on
                this.recordThreshold(this.currentLevel);
                await this.delay(1500);
                this.moveToNextFrequency();
            } else {
                await this.delay(1500);
                this.presentTrial();
            }
        }
    }

    /**
     * Handle "I Don't Know / Skip" button
     * First few times: increases volume
     * After 3 attempts or max volume: skips to next frequency
     */
    async handleIDontKnow() {
        if (this.isPlaying || this.elements.option0.disabled) {
            return; // Ignore during playback or when disabled
        }

        // Disable buttons
        this.disableButtons();

        // Record as attempt (not correct)
        const scenario = gameScenarios[(this.currentScenarioIndex - 1 + gameScenarios.length) % gameScenarios.length];
        this.recordAttempt(this.currentLevel, false, scenario.id);

        this.attemptsAtCurrentFreq++;

        // After 3 "I don't know" clicks or max volume, skip to next frequency
        if (this.attemptsAtCurrentFreq >= 3 || this.currentLevel >= 100) {
            this.showFeedback('skipping', 'info');
            this.recordThreshold(100); // Record as unable to hear
            await this.delay(1500);
            this.moveToNextFrequency();
        } else {
            // Increase volume and try again
            this.currentLevel = Math.min(100, this.currentLevel + 10);
            this.showFeedback('louder', 'info');
            await this.delay(1500);
            this.presentTrial();
        }
    }

    /**
     * Record a validation attempt
     */
    recordAttempt(level, correct, scenarioId) {
        const currentEar = this.ears[this.currentEarIndex];
        const currentFreq = this.frequencies[this.currentFrequencyIndex];
        const key = `${currentEar}_${currentFreq}`;

        // Initialize arrays if needed
        if (!this.validationAttempts[key]) {
            this.validationAttempts[key] = [];
        }
        if (!this.successCountAtLevel[key]) {
            this.successCountAtLevel[key] = {};
        }

        // Record attempt
        this.validationAttempts[key].push({
            level: level,
            correct: correct,
            scenario: scenarioId,
            timestamp: Date.now()
        });

        // Update success count if correct
        if (correct) {
            if (!this.successCountAtLevel[key][level]) {
                this.successCountAtLevel[key][level] = 0;
            }
            this.successCountAtLevel[key][level]++;
        }

        // Update matrix visualization
        this.updateMatrixCell(currentEar, currentFreq, level, correct ? 'V' : 'X');
    }

    /**
     * Check if threshold has been found at current level
     * Returns true if we have enough successful validations
     */
    checkThreshold() {
        const currentEar = this.ears[this.currentEarIndex];
        const currentFreq = this.frequencies[this.currentFrequencyIndex];
        const key = `${currentEar}_${currentFreq}`;

        // Check if we have enough successes at current level
        const successesAtThisLevel = this.successCountAtLevel[key]?.[this.currentLevel] || 0;

        if (successesAtThisLevel >= this.successesNeeded) {
            // Threshold found!
            this.recordThreshold(this.currentLevel);
            return true;
        }

        return false;
    }

    /**
     * Record the threshold for current frequency/ear
     */
    recordThreshold(threshold) {
        const currentEar = this.ears[this.currentEarIndex];
        const currentFreq = this.frequencies[this.currentFrequencyIndex];

        this.results[currentEar][currentFreq] = threshold;
    }

    /**
     * Move to next frequency or ear
     */
    moveToNextFrequency() {
        this.currentFrequencyIndex++;
        this.attemptsAtCurrentFreq = 0;
        this.currentLevel = 40; // Reset to starting level

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
        this.updateProgress();
        this.presentTrial();
    }

    /**
     * Complete the test and show results
     */
    completeTest() {
        this.results.timestamp = new Date().toISOString();

        // Pass results to main app
        app.showGameResults(this.results);
    }

    /**
     * Show feedback message
     */
    showFeedback(type, className) {
        const messages = {
            'listening': i18n.t('game.listening'),
            'instruction': i18n.t('game.instruction'),
            'clicktotest': i18n.t('game.clicktotest'),
            'correct': i18n.t('game.feedback.correct'),
            'incorrect': i18n.t('game.feedback.incorrect'),
            'louder': i18n.t('game.feedback.louder'),
            'skipping': i18n.t('game.feedback.skipping')
        };

        this.elements.feedback.textContent = messages[type] || '';
        this.elements.feedback.className = `game-feedback ${className}`;
    }

    /**
     * Disable all button options
     */
    disableButtons() {
        this.elements.option0.disabled = true;
        this.elements.option1.disabled = true;
        this.elements.option2.disabled = true;
        this.elements.confirm0.disabled = true;
        this.elements.confirm1.disabled = true;
        this.elements.confirm2.disabled = true;
        this.elements.helpBtn.disabled = true;
    }

    /**
     * Enable all button options
     */
    enableButtons() {
        this.elements.option0.disabled = false;
        this.elements.option1.disabled = false;
        this.elements.option2.disabled = false;
        this.elements.confirm0.disabled = false;
        this.elements.confirm1.disabled = false;
        this.elements.confirm2.disabled = false;
        this.elements.helpBtn.disabled = false;
    }

    /**
     * Disable only tile buttons (keep "This!" buttons enabled)
     */
    disableTileButtons() {
        this.elements.option0.disabled = true;
        this.elements.option1.disabled = true;
        this.elements.option2.disabled = true;
        // Keep confirmation buttons and help button enabled
    }

    /**
     * Enable only tile buttons
     */
    enableTileButtons() {
        this.elements.option0.disabled = false;
        this.elements.option1.disabled = false;
        this.elements.option2.disabled = false;
    }

    /**
     * Disable only confirmation buttons
     */
    disableConfirmButtons() {
        this.elements.confirm0.disabled = true;
        this.elements.confirm1.disabled = true;
        this.elements.confirm2.disabled = true;
    }

    /**
     * Enable confirmation buttons
     */
    enableConfirmButtons() {
        this.elements.confirm0.disabled = false;
        this.elements.confirm1.disabled = false;
        this.elements.confirm2.disabled = false;
    }

    /**
     * Shuffle array (Fisher-Yates algorithm)
     */
    shuffleArray(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    /**
     * Initialize test matrix with '?' for all untested combinations
     */
    initializeMatrix() {
        for (const ear of this.ears) {
            for (const freq of this.frequencies) {
                const key = `${ear}_${freq}`;
                this.testMatrix[key] = {};
                for (const db of this.dbLevels) {
                    this.testMatrix[key][db] = '?';
                }
            }
        }
    }

    /**
     * Update matrix cell based on test result
     */
    updateMatrixCell(ear, freq, level, result) {
        const key = `${ear}_${freq}`;
        if (!this.testMatrix[key]) {
            this.testMatrix[key] = {};
        }
        this.testMatrix[key][level] = result; // 'V' for success, 'X' for fail, '?' for not tested
        this.renderMatrix();
    }

    /**
     * Toggle matrix visibility
     */
    toggleMatrix() {
        this.matrixExpanded = !this.matrixExpanded;
        if (this.matrixExpanded) {
            this.elements.matrixContainer.classList.add('expanded');
            this.elements.expandMatrixBtn.textContent = '▼ ' + i18n.t('game.matrix.hide');
            this.renderMatrix();
        } else {
            this.elements.matrixContainer.classList.remove('expanded');
            this.elements.expandMatrixBtn.textContent = '▶ ' + i18n.t('game.matrix.show');
        }
    }

    /**
     * Render the test matrix table
     */
    renderMatrix() {
        if (!this.elements.matrixTable || !this.matrixExpanded) return;

        const currentEar = this.ears[this.currentEarIndex];

        // Build table HTML
        let html = '<table class="matrix-table"><thead><tr><th>Hz / dB</th>';

        // Header row with dB levels
        for (const db of this.dbLevels) {
            html += `<th>${db}</th>`;
        }
        html += '</tr></thead><tbody>';

        // Rows for each frequency
        for (const freq of this.frequencies) {
            const key = `${currentEar}_${freq}`;
            html += `<tr><td class="freq-label">${freq} Hz</td>`;

            for (const db of this.dbLevels) {
                const result = this.testMatrix[key]?.[db] || '?';
                let cellClass = 'matrix-cell';
                let displayChar = result;

                if (result === 'V') {
                    cellClass += ' cell-success';
                    displayChar = '✓';
                } else if (result === 'X') {
                    cellClass += ' cell-fail';
                    displayChar = '✗';
                } else {
                    cellClass += ' cell-unknown';
                }

                html += `<td class="${cellClass}">${displayChar}</td>`;
            }
            html += '</tr>';
        }

        html += '</tbody></table>';
        this.elements.matrixTable.innerHTML = html;
    }

    /**
     * Delay helper
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Create global instance
let gameTest;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        gameTest = new GameTest();
    });
} else {
    gameTest = new GameTest();
}
