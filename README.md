# Online Hearing Test

A free, open-source web-based audiometry tool for comprehensive self-administered hearing tests. This application offers both **Pure Tone Audiometry** and **Speech Recognition Testing** to evaluate your hearing from multiple perspectives.

![License](https://img.shields.io/badge/license-Dual%20License-blue.svg)

## ⚠️ Important Disclaimer

**This is NOT a medical device and should not replace professional audiological evaluation.**

- This tool is for educational and screening purposes only
- Results are not calibrated to clinical audiometry standards
- Accuracy depends on your audio equipment and testing environment
- Please consult a licensed audiologist for accurate hearing assessment and diagnosis
- Do not use this tool to make medical decisions

## Features

### Two Types of Hearing Tests

**Pure Tone Audiometry**
- ✅ Standard audiometric frequencies: 250, 500, 1000, 2000, 3000, 4000, 6000, 8000 Hz
- ✅ Hughson-Westlake threshold detection method
- ✅ Separate left and right ear testing
- ✅ Visual audiogram chart generation
- ✅ Available in English and Hebrew

**Speech Recognition Testing**
- ✅ Word recognition at multiple volume levels
- ✅ 40-word vocabulary with multiple choice format
- ✅ Speech Recognition Threshold (SRT) calculation
- ✅ Real-world hearing ability assessment
- ✅ Available in English (uses Web Speech Synthesis)

### General Features
- ✅ Practice tutorial mode to learn the test procedure
- ✅ Choose between Pure Tone, Speech, or Complete Assessment
- ✅ Export results as PNG image
- ✅ No installation required - runs in modern web browsers
- ✅ No data collection - everything runs locally
- ✅ Mobile and desktop compatible
- ✅ Bilingual support (English/Hebrew)
- ✅ Free for personal, educational, and non-commercial use

## How It Works

### Testing Procedure

1. **Setup**: Calibrate your volume and verify headphone placement
2. **Tutorial**: Practice with the test interface (optional, can skip)
3. **Test Selection**: Choose Pure Tone, Speech, or Complete Assessment
4. **Testing**: Complete your selected test(s)
5. **Results**: View comprehensive results with audiogram and/or speech performance

### Pure Tone Test - Hughson-Westlake Method

This application implements the standard clinical threshold detection procedure:

1. Start at 40 dB HL (comfortable level)
2. When tone is heard, decrease by 10 dB
3. When tone is not heard, increase by 5 dB
4. Threshold = quietest level where tone is heard in 2 out of 3 ascending trials
5. Tests 8 frequencies in both ears (16 measurements total)

### Speech Recognition Test

1. Listen to spoken words at decreasing volume levels
2. Select the word you heard from 4 multiple-choice options
3. Tests 5 words at each of 8 volume levels (40 words total)
4. Calculates Speech Recognition Threshold (50% accuracy point)
5. Shows performance chart across all volume levels

## Requirements

### For Best Results

- **Headphones**: Quality headphones or earbuds (not speakers)
- **Environment**: Quiet room with minimal background noise
- **Browser**: Modern browser with Web Audio API support:
  - Chrome 35+ (recommended for speech test)
  - Firefox 25+
  - Safari 14.1+
  - Edge 79+
- **For Speech Test**:
  - English language support only (uses browser text-to-speech)
  - Chrome/Edge recommended for best voice quality
  - System must have English TTS voices (usually pre-installed)

### Volume Settings

- Set system volume to approximately 50% before starting
- Calibration tone will help you adjust to comfortable level
- **DO NOT** set volume too high - this could damage your hearing

## Usage

### Running Locally

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/hearing-test.git
   cd hearing-test
   ```

2. Open `index.html` in your web browser:
   ```bash
   # On macOS
   open index.html

   # On Linux
   xdg-open index.html

   # On Windows
   start index.html
   ```

   Or simply drag `index.html` into your browser window.

### Hosting

You can host this application on any static web hosting service:

- **GitHub Pages**: Free hosting for GitHub repositories
- **Netlify**: Drag and drop deployment
- **Vercel**: Git-based deployment
- **Any web server**: Just upload the files

Example for GitHub Pages:
```bash
git add .
git commit -m "Initial commit"
git push origin main
# Enable GitHub Pages in repository settings
```

## Project Structure

```
hearing-test/
├── index.html          # Main HTML page
├── css/
│   └── style.css      # Styling and responsive design
├── js/
│   ├── audio.js       # Web Audio API tone generation
│   ├── speech.js      # Speech recognition test logic
│   ├── test.js        # Test flow and coordination
│   ├── audiogram.js   # Canvas-based audiogram chart
│   └── i18n.js        # Internationalization (English/Hebrew)
├── README.md          # This file
└── LICENSE            # Dual License (Non-Commercial/Commercial)
```

## Technical Details

### Pure Tone Audio Generation

- Uses Web Audio API `OscillatorNode` for pure sine wave generation
- Implements stereo panning for left/right ear isolation
- Smooth fade in/out to prevent clicking artifacts
- Approximate dB HL to gain conversion (not calibrated)
- Random inter-tone intervals (1-3 seconds) to prevent anticipation

### Speech Test Implementation

- Uses Web Speech Synthesis API for word playback
- 40-word vocabulary per language (English/Hebrew word lists included)
- Multiple-choice format with 3 distractors per word
- 8 volume levels from 100% to 10%
- Adaptive threshold calculation (50% recognition point)
- Replay option available for each word

### Audiogram Chart

- Standard audiogram format (frequency vs hearing level)
- Frequency axis: 250-8000 Hz (logarithmic scale)
- Hearing level axis: -10 to 100 dB HL
- Right ear: Red circles (O)
- Left ear: Blue crosses (X)
- Canvas-based rendering with high DPI support

### Internationalization

- Full bilingual support (English/Hebrew)
- RTL (right-to-left) layout for Hebrew
- Speech test currently English-only due to browser TTS limitations
- All UI elements translated dynamically

### Limitations

1. **Calibration**: Not calibrated to ISO 389 or ANSI standards
2. **Equipment**: Results depend on headphone frequency response
3. **Environment**: Background noise affects accuracy
4. **Self-administration**: No audiologist to ensure proper procedure
5. **Bone conduction**: Only tests air conduction
6. **Masking**: No contralateral masking for cross-hearing
7. **Speech Test Language**: Currently English-only due to browser text-to-speech voice availability
8. **Speech Test Accuracy**: Depends on browser TTS quality and system voices

## Understanding Your Results

### Hearing Level Classification

- **-10 to 25 dB HL**: Normal hearing
- **26 to 40 dB HL**: Mild hearing loss
- **41 to 55 dB HL**: Moderate hearing loss
- **56 to 70 dB HL**: Moderately severe hearing loss
- **71 to 90 dB HL**: Severe hearing loss
- **91+ dB HL**: Profound hearing loss

### What to Do Next

If your results show potential hearing loss:

1. **Consult a professional**: Schedule an appointment with an audiologist
2. **Get a proper test**: Clinical audiometry is calibrated and comprehensive
3. **Medical evaluation**: Hearing loss can have various causes requiring different treatments
4. **Don't panic**: This test has limitations and may not be accurate

## Contributing

Contributions are welcome! This is an open-source project.

### Ways to Contribute

- Report bugs or issues
- Suggest new features
- Improve documentation
- Submit pull requests
- Share feedback

### Development

To contribute code:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m "Description"`
6. Push: `git push origin feature-name`
7. Create a Pull Request

## License

This project is available under a **dual license model**:

### Non-Commercial License (Free)

Free to use for:
- Personal use
- Educational and academic purposes
- Non-profit organizations
- Internal business use (not for resale or redistribution)

You can use, copy, and modify the software for these purposes at no cost.

### Commercial License (Paid)

A commercial license is required if you want to:
- Sell or distribute the software or derivatives
- Include it in a commercial product or service
- Provide paid services using this software
- Redistribute for profit

**To obtain a commercial license, please contact the project owner.**

See the LICENSE file for complete terms and conditions.

## Acknowledgments

- Inspired by clinical audiometry procedures
- Built with standard Web Audio API
- Follows audiogram conventions from audiology literature

## Privacy

- **No data collection**: All testing happens in your browser
- **No tracking**: No analytics or third-party scripts
- **No uploads**: Results stay on your device
- **No cookies**: No persistent data storage (except localStorage for optional result saving)

## Support

This is a free, open-source project. For issues or questions:

- Open an issue on GitHub
- Check existing documentation
- Review the code - it's designed to be readable!

## Disclaimer (Repeated)

**THIS SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND.**

The authors and contributors are not responsible for any damages, injuries, or medical decisions made based on this software. Always consult qualified medical professionals for hearing health concerns.

---

**Made with ❤️ for better hearing health awareness**

*Remember: This is a screening tool, not a replacement for professional hearing care.*
