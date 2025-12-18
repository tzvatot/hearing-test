/**
 * Simple i18n (Internationalization) System
 * Supports multiple languages without external dependencies
 */

const translations = {
    en: {
        // App title
        'app.title': 'Online Hearing Test',
        'app.subtitle': 'Free Self-Administered Audiometry',

        // Welcome screen
        'welcome.disclaimer.title': '⚠️ Important Disclaimer',
        'welcome.disclaimer.text': 'This is NOT a medical device and should not replace professional audiological evaluation. This tool is for educational and screening purposes only. Results are not calibrated to clinical standards. Please consult a licensed audiologist for accurate hearing assessment.',
        'welcome.before.title': 'Before You Start',
        'welcome.before.item1': 'Use quality headphones or earbuds (not speakers)',
        'welcome.before.item2': 'Find a quiet environment',
        'welcome.before.item3': 'Set your system volume to about 50%',
        'welcome.before.item4': 'Test takes approximately 10-15 minutes',
        'welcome.before.item5': 'You\'ll hear tones at different frequencies and volumes',
        'welcome.before.item6': 'Press the button or spacebar when you hear a sound',
        'welcome.btn.start': 'Start Test',

        // Calibration screen
        'calibration.title': 'Setup & Calibration',
        'calibration.volume.title': 'Step 1: Volume Check',
        'calibration.volume.text': 'We\'ll play a reference tone. Adjust your system volume to a comfortable level - loud enough to hear clearly but not uncomfortably loud.',
        'calibration.volume.btn': 'Play Reference Tone (1000 Hz)',
        'calibration.volume.continue': 'Volume is Good - Continue',
        'calibration.headphones.title': 'Step 2: Headphone Check',
        'calibration.headphones.text': 'Make sure your headphones are on correctly. We\'ll play sounds in each ear.',
        'calibration.headphones.left': 'Test Left Ear',
        'calibration.headphones.right': 'Test Right Ear',
        'calibration.headphones.hint': 'You should hear the tone only in the specified ear.',
        'calibration.headphones.continue': 'Headphones Correct - Continue',

        // Tutorial screen
        'tutorial.title': 'Practice Tutorial',
        'tutorial.badge': 'This is NOT the real test - just practice!',
        'tutorial.how.title': 'How It Works:',
        'tutorial.how.item1': 'You will hear tones at different volumes and frequencies',
        'tutorial.how.item2': 'Press the button below (or SPACEBAR) immediately when you hear a sound',
        'tutorial.how.item3': 'Even very faint sounds - if you hear it, press the button',
        'tutorial.how.item4': 'If you don\'t hear anything, just wait - a new tone will play automatically',
        'tutorial.practice.title': 'Let\'s Practice:',
        'tutorial.practice.text': 'We\'ll play a few practice tones. Press the button when you hear them.',
        'tutorial.btn.hear': 'I Hear It',
        'tutorial.btn.hear.hint': 'or press SPACEBAR',
        'tutorial.status.ready': 'Ready to start practice',
        'tutorial.btn.start': 'Start Practice',
        'tutorial.btn.finish': 'I\'m Ready - Begin Real Test',
        'tutorial.hint': 'Don\'t worry - you can skip this tutorial if you\'ve done it before',
        'tutorial.btn.skip': 'Skip Tutorial',
        'tutorial.status.listen': '🔊 Listen... Press the button when you hear the tone!',
        'tutorial.status.correct': '✓ Great! You heard it correctly.',
        'tutorial.status.noresponse': 'No response - that\'s okay, let\'s continue.',
        'tutorial.status.complete': '🎉 Tutorial complete! You\'re ready for the real test.',

        // Test screen
        'test.title': 'Hearing Test in Progress',
        'test.testing': 'Testing',
        'test.frequency': 'Frequency',
        'test.ear.right': 'Right Ear',
        'test.ear.left': 'Left Ear',
        'test.progress': 'Complete',
        'test.instruction.main': 'Listen carefully. Press the button below (or press SPACEBAR) whenever you hear a tone.',
        'test.instruction.hint': 'Even if the sound is very faint, press the button.',
        'test.btn.hear': 'I Hear It',
        'test.btn.hear.hint': 'or press SPACEBAR',
        'test.btn.skip': 'Skip This Frequency',
        'test.skip.hint': 'Use if you cannot hear the tone at all or want to skip this test',
        'test.status.waiting': 'Waiting for tone...',
        'test.status.listening': 'Listening... (press button if you hear a tone)',
        'test.status.heard': 'Heard! Testing quieter...',
        'test.status.louder': 'Testing louder...',
        'test.status.threshold': 'Threshold found! Moving to next frequency...',
        'test.status.skipped': 'Frequency skipped. Moving to next...',
        'test.status.complete': 'Test complete!',

        // Results screen
        'results.title': 'Your Audiogram Results',
        'results.understanding': 'Understanding Your Results',
        'results.legend.right': 'Right Ear',
        'results.legend.left': 'Left Ear',
        'results.legend.skipped': 'Skipped Test',
        'results.classification.title': 'Hearing Level Classification:',
        'results.classification.normal': 'Normal hearing',
        'results.classification.mild': 'Mild hearing loss',
        'results.classification.moderate': 'Moderate hearing loss',
        'results.classification.modsevere': 'Moderately severe hearing loss',
        'results.classification.severe': 'Severe hearing loss',
        'results.classification.profound': 'Profound hearing loss',
        'results.reminder.title': 'Remember:',
        'results.reminder.text': 'This test is not calibrated to medical standards. If you have concerns about your hearing, please consult a licensed audiologist.',
        'results.btn.save': 'Save Results (PNG)',
        'results.btn.print': 'Print',
        'results.btn.restart': 'Take Test Again',

        // Audiogram
        'audiogram.title': 'Audiogram',
        'audiogram.ylabel': 'Hearing Level (dB HL)',
        'audiogram.xlabel': 'Frequency (Hz)',
        'audiogram.skip': 'SKIP',
    },

    he: {
        // App title
        'app.title': 'בדיקת שמיעה מקוונת',
        'app.subtitle': 'אודיומטריה עצמית בחינם',

        // Welcome screen
        'welcome.disclaimer.title': '⚠️ הצהרת אחריות חשובה',
        'welcome.disclaimer.text': 'זהו אינו מכשיר רפואי ואינו מחליף הערכה אודיולוגית מקצועית. כלי זה מיועד למטרות חינוכיות ובדיקה בלבד. התוצאות אינן מכוילות לסטנדרטים קליניים. אנא התייעצו עם אודיולוג מוסמך להערכת שמיעה מדויקת.',
        'welcome.before.title': 'לפני שמתחילים',
        'welcome.before.item1': 'השתמשו באוזניות או באירבאדס איכותיים (לא רמקולים)',
        'welcome.before.item2': 'מצאו סביבה שקטה',
        'welcome.before.item3': 'הגדירו את עוצמת הקול של המערכת לכ-50%',
        'welcome.before.item4': 'הבדיקה אורכת כ-10-15 דקות',
        'welcome.before.item5': 'תשמעו צלילים בתדרים ועוצמות שונות',
        'welcome.before.item6': 'לחצו על הכפתור או על מקש הרווח כאשר אתם שומעים צליל',
        'welcome.btn.start': 'התחל בדיקה',

        // Calibration screen
        'calibration.title': 'הגדרה וכיול',
        'calibration.volume.title': 'שלב 1: בדיקת עוצמת קול',
        'calibration.volume.text': 'נשמיע צליל ייחוס. התאימו את עוצמת הקול של המערכת לרמה נוחה - חזק מספיק כדי לשמוע בבירור אך לא חזק מדי.',
        'calibration.volume.btn': 'השמע צליל ייחוס (1000 הרץ)',
        'calibration.volume.continue': 'עוצמת הקול טובה - המשך',
        'calibration.headphones.title': 'שלב 2: בדיקת אוזניות',
        'calibration.headphones.text': 'וודאו שהאוזניות על ראשכם נכון. נשמיע צלילים בכל אוזן.',
        'calibration.headphones.left': 'בדוק אוזן שמאל',
        'calibration.headphones.right': 'בדוק אוזן ימין',
        'calibration.headphones.hint': 'אתם אמורים לשמוע את הצליל רק באוזן המצוינת.',
        'calibration.headphones.continue': 'האוזניות נכונות - המשך',

        // Tutorial screen
        'tutorial.title': 'הדרכה מעשית',
        'tutorial.badge': 'זו לא הבדיקה האמיתית - רק תרגול!',
        'tutorial.how.title': 'איך זה עובד:',
        'tutorial.how.item1': 'תשמעו צלילים בעוצמות ותדרים שונים',
        'tutorial.how.item2': 'לחצו על הכפתור (או על מקש הרווח) מיד כשאתם שומעים צליל',
        'tutorial.how.item3': 'גם צלילים חלשים מאוד - אם שמעתם, לחצו על הכפתור',
        'tutorial.how.item4': 'אם אינכם שומעים כלום, פשוט המתינו - צליל חדש יושמע אוטומטית',
        'tutorial.practice.title': 'בואו נתרגל:',
        'tutorial.practice.text': 'נשמיע כמה צלילי תרגול. לחצו על הכפתור כשאתם שומעים אותם.',
        'tutorial.btn.hear': 'אני שומע',
        'tutorial.btn.hear.hint': 'או לחץ על רווח',
        'tutorial.status.ready': 'מוכן להתחיל תרגול',
        'tutorial.btn.start': 'התחל תרגול',
        'tutorial.btn.finish': 'אני מוכן - התחל בדיקה אמיתית',
        'tutorial.hint': 'אל דאגה - אפשר לדלג על ההדרכה אם כבר עשיתם אותה',
        'tutorial.btn.skip': 'דלג על הדרכה',
        'tutorial.status.listen': '🔊 הקשב... לחץ על הכפתור כשאתה שומע את הצליל!',
        'tutorial.status.correct': '✓ מצוין! שמעת אותו נכון.',
        'tutorial.status.noresponse': 'אין תגובה - זה בסדר, בוא נמשיך.',
        'tutorial.status.complete': '🎉 ההדרכה הושלמה! אתה מוכן לבדיקה האמיתית.',

        // Test screen
        'test.title': 'בדיקת שמיעה בתהליך',
        'test.testing': 'בודק',
        'test.frequency': 'תדר',
        'test.ear.right': 'אוזן ימין',
        'test.ear.left': 'אוזן שמאל',
        'test.progress': 'הושלם',
        'test.instruction.main': 'הקשיבו היטב. לחצו על הכפתור (או על מקש הרווח) בכל פעם שאתם שומעים צליל.',
        'test.instruction.hint': 'גם אם הצליל חלש מאוד, לחצו על הכפתור.',
        'test.btn.hear': 'אני שומע',
        'test.btn.hear.hint': 'או לחץ על רווח',
        'test.btn.skip': 'דלג על תדר זה',
        'test.skip.hint': 'השתמשו אם אינכם שומעים את הצליל כלל או רוצים לדלג על בדיקה זו',
        'test.status.waiting': 'ממתין לצליל...',
        'test.status.listening': 'מאזין... (לחץ על הכפתור אם אתה שומע צליל)',
        'test.status.heard': 'נשמע! בודק שקט יותר...',
        'test.status.louder': 'בודק חזק יותר...',
        'test.status.threshold': 'סף נמצא! עובר לתדר הבא...',
        'test.status.skipped': 'התדר דולג. עובר הלאה...',
        'test.status.complete': 'הבדיקה הושלמה!',

        // Results screen
        'results.title': 'תוצאות האודיוגרמה שלך',
        'results.understanding': 'הבנת התוצאות',
        'results.legend.right': 'אוזן ימין',
        'results.legend.left': 'אוזן שמאל',
        'results.legend.skipped': 'בדיקה שדולגה',
        'results.classification.title': 'סיווג רמת שמיעה:',
        'results.classification.normal': 'שמיעה תקינה',
        'results.classification.mild': 'אובדן שמיעה קל',
        'results.classification.moderate': 'אובדן שמיעה בינוני',
        'results.classification.modsevere': 'אובדן שמיעה בינוני-חמור',
        'results.classification.severe': 'אובדן שמיעה חמור',
        'results.classification.profound': 'אובדן שמיעה עמוק',
        'results.reminder.title': 'זכרו:',
        'results.reminder.text': 'בדיקה זו אינה מכוילת לסטנדרטים רפואיים. אם יש לכם חששות לגבי השמיעה שלכם, אנא התייעצו עם אודיולוג מוסמך.',
        'results.btn.save': 'שמור תוצאות (PNG)',
        'results.btn.print': 'הדפס',
        'results.btn.restart': 'בצע בדיקה שוב',

        // Audiogram
        'audiogram.title': 'אודיוגרמה',
        'audiogram.ylabel': 'רמת שמיעה (dB HL)',
        'audiogram.xlabel': 'תדר (הרץ)',
        'audiogram.skip': 'דולג',
    }
};

// Current language (default to browser language or English)
let currentLanguage = 'en';

// i18n class
class I18n {
    constructor() {
        // Detect browser language
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0]; // Get 'en' from 'en-US'

        // Load saved language or use detected language
        const savedLang = localStorage.getItem('hearing-test-language');
        this.currentLanguage = savedLang || (translations[langCode] ? langCode : 'en');
    }

    /**
     * Get translation for a key
     */
    t(key) {
        return translations[this.currentLanguage]?.[key] || translations['en'][key] || key;
    }

    /**
     * Set language and update UI
     */
    setLanguage(lang) {
        if (!translations[lang]) {
            console.error(`Language '${lang}' not supported`);
            return;
        }

        this.currentLanguage = lang;
        localStorage.setItem('hearing-test-language', lang);

        // Update HTML lang attribute
        document.documentElement.lang = lang;

        // Update RTL direction for Hebrew
        if (lang === 'he') {
            document.documentElement.dir = 'rtl';
            document.body.classList.add('rtl');
        } else {
            document.documentElement.dir = 'ltr';
            document.body.classList.remove('rtl');
        }

        // Update all elements with data-i18n attribute
        this.updateUI();

        // Update language selector
        const selector = document.getElementById('language-selector');
        if (selector) {
            selector.value = lang;
        }
    }

    /**
     * Update all translatable elements
     */
    updateUI() {
        // Update elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);

            if (element.tagName === 'INPUT' && element.type === 'button') {
                element.value = translation;
            } else if (element.tagName === 'INPUT' && element.placeholder !== undefined) {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Update page title
        document.title = this.t('app.title');
    }

    /**
     * Get current language
     */
    getLanguage() {
        return this.currentLanguage;
    }

    /**
     * Get available languages
     */
    getAvailableLanguages() {
        return Object.keys(translations).map(code => ({
            code,
            name: code === 'en' ? 'English' : code === 'he' ? 'עברית' : code
        }));
    }
}

// Create global i18n instance
const i18n = new I18n();

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        i18n.setLanguage(i18n.getLanguage());
    });
} else {
    i18n.setLanguage(i18n.getLanguage());
}
