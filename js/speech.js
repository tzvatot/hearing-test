/**
 * Speech Audiometry Test
 * Implements Speech Recognition Threshold (SRT) testing
 */

// Word lists for speech recognition testing
const speechWordLists = {
    en: [
        // Simple, common 2-syllable words (spondees)
        'airplane', 'armchair', 'baseball', 'birthday', 'sidewalk',
        'cowboy', 'cupcake', 'daylight', 'doorbell', 'downtown',
        'eardrum', 'eyebrow', 'football', 'goodbye', 'grandson',
        'hardware', 'headlight', 'hotdog', 'iceberg', 'inkwell',
        'mushroom', 'northwest', 'oatmeal', 'padlock', 'pancake',
        'playground', 'railroad', 'rainbow', 'scarecrow', 'schoolboy',
        'skateboard', 'snowman', 'stairway', 'sunset', 'toothbrush',
        'airplane', 'backyard', 'campfire', 'cookbook', 'doughnut'
    ],
    he: [
        // Common Hebrew words
        'מטוס', 'כיסא', 'כדור', 'יומולדת', 'מדרכה',
        'בוקר', 'עוגה', 'אור', 'פעמון', 'מרכז',
        'אוזן', 'גבה', 'כדורגל', 'להתראות', 'נכד',
        'חומרה', 'פנס', 'נקניק', 'קרחון', 'דיו',
        'פטריה', 'צפון', 'שיבולת', 'מנעול', 'לביבה',
        'מגרש', 'רכבת', 'קשת', 'דחליל', 'תלמיד',
        'סקייטבורד', 'איש שלג', 'מדרגות', 'שקיעה', 'מברשת',
        'אופניים', 'חצר', 'מדורה', 'ספר בישול', 'סופגנייה'
    ]
};

// Distractors (wrong answer options) for multiple choice
const distractors = {
    en: [
        'window', 'pencil', 'computer', 'keyboard', 'outside',
        'garden', 'chicken', 'blanket', 'fireplace', 'mailbox',
        'notebook', 'popcorn', 'strawberry', 'butterfly', 'doorway',
        'highway', 'blackboard', 'goldfish', 'grapefruit', 'lipstick',
        'watchdog', 'teaspoon', 'mousetrap', 'moonlight', 'rosebud',
        'workshop', 'bedtime', 'fingernail', 'lighthouse', 'earthquake'
    ],
    he: [
        'חלון', 'עיפרון', 'מחשב', 'מקלדת', 'בחוץ',
        'גן', 'עוף', 'שמיכה', 'אח', 'תיבת דואר',
        'מחברת', 'פופקורן', 'תות', 'פרפר', 'פתח',
        'כביש מהיר', 'לוח', 'דג זהב', 'אשכולית', 'שפתון',
        'כלב שמירה', 'כפית', 'מלכודת עכברים', 'אור ירח', 'ניצן ורד',
        'בית מלאכה', 'שעת שינה', 'ציפורן', 'מגדלור', 'רעידת אדמה'
    ]
};

class SpeechTest {
    constructor() {
        // Test configuration
        this.wordsPerLevel = 5; // Words to test at each volume level
        this.volumeLevels = [1.0, 0.8, 0.6, 0.4, 0.3, 0.2, 0.15, 0.1]; // Descending volumes

        // Test state
        this.currentVolumeIndex = 0;
        this.currentWordIndex = 0;
        this.testWords = [];
        this.currentWord = null;
        this.currentOptions = [];

        // Results
        this.results = {
            byVolume: {}, // { volume: { correct: 0, total: 0 } }
            threshold: null, // Volume level at which 50% correct achieved
            timestamp: null
        };

        // Speech synthesis
        this.synthesis = window.speechSynthesis;
        this.voice = null;

        // UI elements (will be set when screen is shown)
        this.elements = {};
    }

    initUI() {
        this.elements = {
            wordDisplay: document.getElementById('speech-word-display'),
            option1: document.getElementById('speech-option-1'),
            option2: document.getElementById('speech-option-2'),
            option3: document.getElementById('speech-option-3'),
            option4: document.getElementById('speech-option-4'),
            volumeIndicator: document.getElementById('speech-volume-indicator'),
            progressText: document.getElementById('speech-progress-text'),
            progressBar: document.getElementById('speech-progress-fill'),
            instruction: document.getElementById('speech-instruction')
        };

        // Add click handlers for option buttons
        [1, 2, 3, 4].forEach(num => {
            const btn = this.elements[`option${num}`];
            if (btn) {
                btn.addEventListener('click', () => this.handleAnswer(num - 1));
            }
        });
    }

    // Initialize speech synthesis voice for current language
    async initVoice(language) {
        return new Promise((resolve) => {
            const setVoice = () => {
                const voices = this.synthesis.getVoices();
                console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));

                // Find voice for the language with multiple patterns
                let voice = null;

                if (language === 'he') {
                    // Try various Hebrew locale codes
                    voice = voices.find(v =>
                        v.lang === 'he-IL' ||
                        v.lang === 'he' ||
                        v.lang.startsWith('he-') ||
                        v.name.toLowerCase().includes('hebrew')
                    );
                } else {
                    // English
                    voice = voices.find(v =>
                        v.lang === 'en-US' ||
                        v.lang === 'en' ||
                        v.lang.startsWith('en-')
                    );
                }

                // Fallback to any voice in that language
                if (!voice) {
                    voice = voices.find(v => v.lang.startsWith(language));
                }

                // Last resort: use default voice
                if (!voice && voices.length > 0) {
                    voice = voices[0];
                    console.warn(`No ${language} voice found, using default: ${voice.name} (${voice.lang})`);
                }

                this.voice = voice;
                console.log(`Selected voice: ${voice ? voice.name : 'none'} (${voice ? voice.lang : 'none'})`);

                resolve(voice);
            };

            // Voices might not be loaded yet
            if (this.synthesis.getVoices().length > 0) {
                setVoice();
            } else {
                this.synthesis.onvoiceschanged = setVoice;
            }
        });
    }

    // Start the speech test
    async startTest(language = 'en') {
        this.currentLanguage = language;
        this.currentVolumeIndex = 0;
        this.currentWordIndex = 0;
        this.results = {
            byVolume: {},
            threshold: null,
            timestamp: new Date().toISOString()
        };

        console.log(`Starting speech test in language: ${language}`);

        // Initialize voice
        await this.initVoice(language);

        // Check if we got a voice for the requested language
        if (this.voice && !this.voice.lang.startsWith(language)) {
            const languageName = language === 'he' ? 'Hebrew' : 'English';
            const message = language === 'he'
                ? `מצטערים! הדפדפן שלך לא תומך בקול עברי.\n\nבדיקת דיבור בעברית לא זמינה במערכת שלך.\nאנא בחר בבדיקת צלילים טהורים במקום זאת, או התקן קול עברי במערכת שלך.\n\nהאם תרצה לחזור למסך בחירת הבדיקה?`
                : `Sorry! Your browser doesn't have ${languageName} voices installed.\n\nSpeech test is not available in ${languageName}.\nPlease choose Pure Tone Test instead, or install ${languageName} voices on your system.\n\nWould you like to go back to test selection?`;

            if (confirm(message)) {
                app.showTestSelection();
                return;
            } else {
                // User wants to continue anyway (won't work well but let them try)
                console.warn('User chose to continue despite voice mismatch');
            }
        }

        // Select random words from the word list
        const wordList = speechWordLists[language];
        console.log(`Word list for ${language}:`, wordList ? wordList.slice(0, 5) : 'NOT FOUND');

        if (!wordList || wordList.length === 0) {
            console.error(`No word list found for language: ${language}`);
            alert(`Error: No words available for language ${language}`);
            return;
        }

        const totalWords = this.volumeLevels.length * this.wordsPerLevel;
        this.testWords = this.shuffleArray([...wordList]).slice(0, totalWords);
        console.log(`Selected ${this.testWords.length} words for test`);

        // Start first word
        this.nextWord();
    }

    // Present next word
    nextWord() {
        // Check if we've completed all words
        const totalWords = this.volumeLevels.length * this.wordsPerLevel;
        const currentProgress = this.currentVolumeIndex * this.wordsPerLevel + this.currentWordIndex;

        if (currentProgress >= totalWords) {
            this.completeTest();
            return;
        }

        // Get current word
        const wordIndex = this.currentVolumeIndex * this.wordsPerLevel + this.currentWordIndex;
        this.currentWord = this.testWords[wordIndex];

        // Generate multiple choice options (correct word + 3 distractors)
        this.currentOptions = this.generateOptions(this.currentWord, this.currentLanguage);

        // Update UI
        this.updateUI();

        // Speak the word after a short delay
        setTimeout(() => {
            this.speakWord(this.currentWord, this.volumeLevels[this.currentVolumeIndex]);
        }, 1000);
    }

    // Generate 4 multiple choice options
    generateOptions(correctWord, language) {
        const wordList = speechWordLists[language];
        const distractorList = distractors[language];

        // Get 3 random distractors that are different from correct word
        const availableDistractors = [...distractorList, ...wordList]
            .filter(w => w !== correctWord);

        const shuffled = this.shuffleArray(availableDistractors);
        const selectedDistractors = shuffled.slice(0, 3);

        // Combine correct word with distractors and shuffle
        const options = [correctWord, ...selectedDistractors];
        return this.shuffleArray(options);
    }

    // Speak a word using speech synthesis
    speakWord(word, volume) {
        if (!this.synthesis) return;

        // Cancel any ongoing speech
        this.synthesis.cancel();

        console.log(`Speaking word: "${word}" at volume ${volume} using voice: ${this.voice ? this.voice.name : 'default'} (${this.voice ? this.voice.lang : 'unknown'})`);

        const utterance = new SpeechSynthesisUtterance(word);
        utterance.voice = this.voice;
        utterance.volume = volume;
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1.0;
        utterance.lang = this.currentLanguage === 'he' ? 'he-IL' : 'en-US'; // Explicitly set language

        this.synthesis.speak(utterance);
    }

    // Handle user's answer
    handleAnswer(optionIndex) {
        const selectedWord = this.currentOptions[optionIndex];
        const isCorrect = selectedWord === this.currentWord;

        // Record result
        const volume = this.volumeLevels[this.currentVolumeIndex];
        if (!this.results.byVolume[volume]) {
            this.results.byVolume[volume] = { correct: 0, total: 0 };
        }
        this.results.byVolume[volume].total++;
        if (isCorrect) {
            this.results.byVolume[volume].correct++;
        }

        // Visual feedback
        const selectedButton = this.elements[`option${optionIndex + 1}`];
        if (selectedButton) {
            selectedButton.style.background = isCorrect ? '#27ae60' : '#e74c3c';
            setTimeout(() => {
                selectedButton.style.background = '';
            }, 500);
        }

        // Move to next word
        setTimeout(() => {
            this.currentWordIndex++;

            // Check if we need to move to next volume level
            if (this.currentWordIndex >= this.wordsPerLevel) {
                this.currentWordIndex = 0;
                this.currentVolumeIndex++;
            }

            this.nextWord();
        }, 800);
    }

    // Update UI elements
    updateUI() {
        if (!this.elements.option1) return;

        // Update options
        this.currentOptions.forEach((word, index) => {
            const btn = this.elements[`option${index + 1}`];
            if (btn) {
                btn.textContent = word;
            }
        });

        // Update progress
        const totalWords = this.volumeLevels.length * this.wordsPerLevel;
        const currentProgress = this.currentVolumeIndex * this.wordsPerLevel + this.currentWordIndex;
        const percentage = Math.round((currentProgress / totalWords) * 100);

        if (this.elements.progressBar) {
            this.elements.progressBar.style.width = percentage + '%';
        }
        if (this.elements.progressText) {
            this.elements.progressText.textContent = `${percentage}% ${i18n.t('test.progress')}`;
        }

        // Update volume indicator
        const volumePercent = Math.round(this.volumeLevels[this.currentVolumeIndex] * 100);
        if (this.elements.volumeIndicator) {
            this.elements.volumeIndicator.textContent = `${volumePercent}%`;
        }
    }

    // Calculate threshold (50% correct volume level)
    calculateThreshold() {
        // Find the volume level where performance drops to ~50%
        const volumes = Object.keys(this.results.byVolume)
            .map(Number)
            .sort((a, b) => b - a); // Sort descending

        for (let volume of volumes) {
            const data = this.results.byVolume[volume];
            const percentage = (data.correct / data.total) * 100;

            if (percentage >= 50) {
                return volume;
            }
        }

        // If never reached 50%, return lowest tested volume
        return volumes[volumes.length - 1];
    }

    // Complete test and show results
    completeTest() {
        this.results.threshold = this.calculateThreshold();
        console.log('Speech test results:', this.results);

        // Show results screen
        app.showSpeechResults(this.results);
    }

    // Utility: Shuffle array
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Replay current word (if user wants to hear it again)
    replayWord() {
        if (this.currentWord) {
            this.speakWord(this.currentWord, this.volumeLevels[this.currentVolumeIndex]);
        }
    }
}

// Create global speech test instance
const speechTest = new SpeechTest();
