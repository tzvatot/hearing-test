/**
 * Audio Generator for Hearing Test
 * Uses Web Audio API to generate pure tones at specific frequencies
 */

class AudioGenerator {
    constructor() {
        this.audioContext = null;
        this.oscillator = null;
        this.gainNode = null;
        this.stereoPanner = null;
        this.isPlaying = false;

        // Initialize audio context (must be done after user interaction)
        this.initAudioContext();
    }

    initAudioContext() {
        try {
            // Create AudioContext (Safari uses webkitAudioContext)
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('Audio context initialized');
        } catch (error) {
            console.error('Web Audio API not supported:', error);
            alert('Your browser does not support Web Audio API. Please use a modern browser like Chrome, Firefox, or Safari.');
        }
    }

    /**
     * Resume audio context if suspended (required by browser autoplay policies)
     */
    async resumeContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }

    /**
     * Convert dB HL (Hearing Level) to gain value
     * Note: This is a simplified approximation for non-calibrated systems
     * Real audiometry requires proper calibration
     *
     * @param {number} dbHL - Decibels Hearing Level (0-100)
     * @returns {number} - Gain value (0-1)
     */
    dbHLToGain(dbHL) {
        // Logarithmic conversion from dB HL to gain (0-1)
        // -10 dB HL = very quiet (better than average hearing)
        // 0 dB HL = quiet but audible (average threshold)
        // 40 dB HL = comfortable
        // 80 dB HL = loud
        // This is NOT medically accurate calibration but provides a reasonable range

        const minGain = 0.00003;  // Very quiet, for -10 dB HL
        const maxGain = 1.0;      // Maximum volume

        // Support range from -10 to 100 dB HL
        const normalizedDB = Math.max(-10, Math.min(100, dbHL));

        // Logarithmic conversion: gain = 10^(dB/20)
        // Offset to handle negative dB values
        // Formula: gain = minGain * 10^((dB + 10) / 20)
        const gain = minGain * Math.pow(10, (normalizedDB + 10) / 20);

        return Math.min(maxGain, gain);
    }

    /**
     * Play a pure tone at specified frequency, volume, and ear
     *
     * @param {number} frequency - Frequency in Hz (e.g., 1000)
     * @param {number} dbHL - Volume in dB HL (0-80)
     * @param {string} ear - 'left', 'right', or 'both'
     * @param {number} duration - Duration in seconds (default: 2)
     */
    async playTone(frequency, dbHL = 40, ear = 'both', duration = 2) {
        await this.resumeContext();

        // Stop any currently playing tone
        this.stopTone();

        try {
            // Create oscillator (tone generator)
            this.oscillator = this.audioContext.createOscillator();
            this.oscillator.type = 'sine'; // Pure sine wave
            this.oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

            // Create gain node (volume control)
            this.gainNode = this.audioContext.createGain();
            const gainValue = this.dbHLToGain(dbHL);
            this.gainNode.gain.setValueAtTime(gainValue, this.audioContext.currentTime);

            // Create stereo panner (left/right control)
            this.stereoPanner = this.audioContext.createStereoPanner();

            // Set pan: -1 = full left, 0 = center, 1 = full right
            let panValue = 0;
            if (ear === 'left') {
                panValue = -1;
            } else if (ear === 'right') {
                panValue = 1;
            }
            this.stereoPanner.pan.setValueAtTime(panValue, this.audioContext.currentTime);

            // Connect the audio graph: oscillator -> gain -> panner -> output
            this.oscillator.connect(this.gainNode);
            this.gainNode.connect(this.stereoPanner);
            this.stereoPanner.connect(this.audioContext.destination);

            // Add smooth fade in/out to avoid clicks
            const now = this.audioContext.currentTime;
            const fadeTime = 0.01; // 10ms fade

            this.gainNode.gain.setValueAtTime(0, now);
            this.gainNode.gain.linearRampToValueAtTime(gainValue, now + fadeTime);
            this.gainNode.gain.setValueAtTime(gainValue, now + duration - fadeTime);
            this.gainNode.gain.linearRampToValueAtTime(0, now + duration);

            // Start and schedule stop
            this.oscillator.start(now);
            this.oscillator.stop(now + duration);

            this.isPlaying = true;

            // Clean up after tone finishes
            this.oscillator.onended = () => {
                this.isPlaying = false;
                this.oscillator = null;
            };

        } catch (error) {
            console.error('Error playing tone:', error);
        }
    }

    /**
     * Stop currently playing tone
     */
    stopTone() {
        try {
            const now = this.audioContext ? this.audioContext.currentTime : 0;

            // Cancel any scheduled gain changes and silence immediately
            if (this.gainNode) {
                this.gainNode.gain.cancelScheduledValues(now);
                this.gainNode.gain.setValueAtTime(0, now);
            }

            // Disconnect and stop the oscillator
            if (this.oscillator) {
                try {
                    this.oscillator.stop(now);
                } catch (e) {
                    // Oscillator might already be stopped, ignore
                }
                try {
                    this.oscillator.disconnect();
                } catch (e) {
                    // Already disconnected, ignore
                }
                this.oscillator = null;
            }

            // Disconnect other nodes
            if (this.gainNode) {
                try {
                    this.gainNode.disconnect();
                } catch (e) {
                    // Already disconnected, ignore
                }
                this.gainNode = null;
            }

            if (this.stereoPanner) {
                try {
                    this.stereoPanner.disconnect();
                } catch (e) {
                    // Already disconnected, ignore
                }
                this.stereoPanner = null;
            }

            this.isPlaying = false;
        } catch (error) {
            console.error('Error stopping tone:', error);
            this.isPlaying = false;
        }
    }

    /**
     * Play calibration tone (1000 Hz at comfortable level)
     */
    async playCalibrationTone() {
        await this.playTone(1000, 40, 'both', 2);
    }

    /**
     * Play test tone for headphone verification
     */
    async playHeadphoneTest(ear) {
        await this.playTone(1000, 50, ear, 1.5);
    }

    /**
     * Get audio context state
     */
    getState() {
        return this.audioContext ? this.audioContext.state : 'not initialized';
    }

    /**
     * Close audio context (cleanup)
     */
    close() {
        if (this.oscillator) {
            this.stopTone();
        }
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}

// Create global audio generator instance
const audioGen = new AudioGenerator();
