/**
 * Game Scenarios for Gamified Hearing Test
 * Config-driven scenario definitions with SVG rendering
 */

const gameScenarios = [
    // Scenario 1: Dog & Doghouse Doorbell
    {
        id: 'dog_doorbell',
        titleKey: 'game.scenario.dog.title',
        instructionKey: 'game.scenario.dog.instruction',

        buttons: [
            { id: 'doghouse1', color: '#E67E22', roofColor: '#C0392B' },
            { id: 'doghouse2', color: '#3498DB', roofColor: '#2C3E50' },
            { id: 'doghouse3', color: '#2ECC71', roofColor: '#27AE60' }
        ],

        renderButton: function(config, isActive, position) {
            const bellAnimation = isActive ? 'class="doorbell-ring"' : '';
            return `
                <svg viewBox="0 0 200 200" class="game-button-svg">
                    <!-- Doghouse base -->
                    <rect x="50" y="100" width="100" height="60"
                          fill="${config.color}" stroke="#2c3e50" stroke-width="3" rx="5"/>

                    <!-- Doghouse roof -->
                    <path d="M 40 100 L 100 60 L 160 100 Z"
                          fill="${config.roofColor}" stroke="#2c3e50" stroke-width="3"/>

                    <!-- Arched entrance -->
                    <ellipse cx="100" cy="130" rx="25" ry="30"
                             fill="#2c3e50" stroke="#2c3e50" stroke-width="2"/>

                    <!-- Dog bowl -->
                    <ellipse cx="140" cy="155" rx="12" ry="5"
                             fill="#3498db" stroke="#2c3e50" stroke-width="2"/>

                    <!-- Bone decoration -->
                    <text x="130" y="90" font-size="16">🦴</text>

                    ${isActive ? `
                        <!-- Bell ringing (active with animation) -->
                        <text x="45" y="95" font-size="28" ${bellAnimation}>🔔</text>
                        <text x="155" y="95" font-size="28" ${bellAnimation}>🔔</text>
                        <!-- Sound waves from doorbell -->
                        <circle cx="100" cy="80" r="30" fill="none" stroke="#f39c12"
                                stroke-width="2" opacity="0.4" class="sound-wave"/>
                    ` : ''}
                </svg>
            `;
        },

        renderScene: function() {
            return `
                <svg viewBox="0 0 600 150" class="game-scene-svg">
                    <!-- Sky -->
                    <rect width="600" height="150" fill="#87CEEB"/>

                    <!-- Sun -->
                    <circle cx="550" cy="30" r="25" fill="#FFD700"/>

                    <!-- Grass -->
                    <rect y="120" width="600" height="30" fill="#90EE90"/>

                    <!-- Fence (positioned to not overlap) -->
                    <rect x="500" y="110" width="10" height="25" fill="#8B4513"/>
                    <rect x="520" y="110" width="10" height="25" fill="#8B4513"/>
                    <rect x="540" y="110" width="10" height="25" fill="#8B4513"/>
                    <rect x="560" y="110" width="10" height="25" fill="#8B4513"/>
                    <rect x="580" y="110" width="10" height="25" fill="#8B4513"/>
                    <line x1="500" y1="115" x2="600" y2="115" stroke="#8B4513" stroke-width="3"/>
                    <line x1="500" y1="125" x2="600" y2="125" stroke="#8B4513" stroke-width="3"/>

                    <!-- Dog -->
                    <text x="50" y="115" font-size="48">🐕</text>
                </svg>
            `;
        }
    },

    // Scenario 2: Treasure Chest
    {
        id: 'treasure_chest',
        titleKey: 'game.scenario.treasure.title',
        instructionKey: 'game.scenario.treasure.instruction',

        buttons: [
            { id: 'chest1', color: '#8B4513', accent: '#FFD700' },
            { id: 'chest2', color: '#654321', accent: '#C0C0C0' },
            { id: 'chest3', color: '#A0522D', accent: '#CD7F32' }
        ],

        renderButton: function(config, isActive, position) {
            const glowClass = isActive ? 'class="treasure-glow"' : '';

            if (isActive) {
                // Open chest with golden coins
                return `
                    <svg viewBox="0 0 200 200" class="game-button-svg">
                        <!-- Chest base -->
                        <rect x="60" y="110" width="80" height="50"
                              fill="${config.color}" stroke="#2c3e50" stroke-width="3" rx="5"/>

                        <!-- Open chest lid (tilted back) -->
                        <path d="M 60 110 L 55 70 L 145 70 L 140 110"
                              fill="${config.color}" stroke="#2c3e50" stroke-width="3"/>

                        <!-- Golden coins inside -->
                        <circle cx="80" cy="130" r="8" fill="#FFD700" stroke="#DAA520" stroke-width="2"/>
                        <circle cx="100" cy="125" r="8" fill="#FFD700" stroke="#DAA520" stroke-width="2"/>
                        <circle cx="120" cy="130" r="8" fill="#FFD700" stroke="#DAA520" stroke-width="2"/>
                        <circle cx="90" cy="140" r="8" fill="#FFD700" stroke="#DAA520" stroke-width="2"/>
                        <circle cx="110" cy="140" r="8" fill="#FFD700" stroke="#DAA520" stroke-width="2"/>

                        <!-- Sparkles around coins -->
                        <text x="50" y="105" font-size="20" ${glowClass}>✨</text>
                        <text x="135" y="110" font-size="20" ${glowClass}>✨</text>

                        <!-- Musical notes -->
                        <text x="145" y="95" font-size="24" ${glowClass}>🎵</text>
                        <text x="155" y="80" font-size="20" ${glowClass}>🎶</text>

                        <!-- Sound waves -->
                        <circle cx="100" cy="100" r="40" fill="none" stroke="${config.accent}"
                                stroke-width="2" opacity="0.3" class="sound-wave"/>
                    </svg>
                `;
            } else {
                // Closed chest
                return `
                    <svg viewBox="0 0 200 200" class="game-button-svg">
                        <!-- Chest base -->
                        <rect x="60" y="110" width="80" height="50"
                              fill="${config.color}" stroke="#2c3e50" stroke-width="3" rx="5"/>

                        <!-- Chest lid (closed) -->
                        <path d="M 60 110 Q 100 80 140 110"
                              fill="${config.color}" stroke="#2c3e50" stroke-width="3"/>

                        <!-- Lock -->
                        <rect x="95" y="125" width="10" height="15"
                              fill="${config.accent}" stroke="#2c3e50" stroke-width="2"/>
                        <circle cx="100" cy="135" r="5" fill="#2c3e50"/>
                    </svg>
                `;
            }
        },

        renderScene: function() {
            return `
                <svg viewBox="0 0 600 150" class="game-scene-svg">
                    <!-- Ocean background -->
                    <rect width="600" height="150" fill="#4A90A4"/>

                    <!-- Waves -->
                    <path d="M 0 100 Q 50 90 100 100 T 200 100 T 300 100 T 400 100 T 500 100 T 600 100"
                          fill="none" stroke="#2E5F6F" stroke-width="2" opacity="0.5"/>

                    <!-- Sand -->
                    <rect y="120" width="600" height="30" fill="#F4A460"/>

                    <!-- Pirate -->
                    <text x="50" y="115" font-size="52">🏴‍☠️</text>

                    <!-- Small island with palm tree -->
                    <ellipse cx="550" cy="120" rx="40" ry="15" fill="#C19A6B"/>
                    <text x="535" y="115" font-size="32">🌴</text>
                </svg>
            `;
        }
    },

    // Scenario 3: Bird Nest
    {
        id: 'bird_nest',
        titleKey: 'game.scenario.bird.title',
        instructionKey: 'game.scenario.bird.instruction',

        buttons: [
            { id: 'tree1', leafColor: '#228B22', trunkColor: '#8B4513' },
            { id: 'tree2', leafColor: '#32CD32', trunkColor: '#A0522D' },
            { id: 'tree3', leafColor: '#006400', trunkColor: '#654321' }
        ],

        renderButton: function(config, isActive, position) {
            const birdAnimation = isActive ? 'class="bird-sing"' : '';
            return `
                <svg viewBox="0 0 200 200" class="game-button-svg">
                    <!-- Tree trunk -->
                    <rect x="85" y="80" width="30" height="90"
                          fill="${config.trunkColor}" stroke="#2c3e50" stroke-width="3" rx="5"/>

                    <!-- Tree foliage -->
                    <circle cx="100" cy="70" r="45" fill="${config.leafColor}"
                            stroke="#2c3e50" stroke-width="3"/>
                    <circle cx="75" cy="85" r="30" fill="${config.leafColor}"
                            stroke="#2c3e50" stroke-width="3"/>
                    <circle cx="125" cy="85" r="30" fill="${config.leafColor}"
                            stroke="#2c3e50" stroke-width="3"/>

                    <!-- Nest -->
                    <ellipse cx="100" cy="90" rx="20" ry="10"
                             fill="#8B4513" stroke="#654321" stroke-width="2"/>

                    ${isActive ? `
                        <!-- Bird (singing) -->
                        <text x="88" y="95" font-size="28" ${birdAnimation}>🐦</text>
                        <text x="125" y="75" font-size="18">🎵</text>
                    ` : `
                        <!-- Bird (quiet) -->
                        <text x="88" y="95" font-size="28">🐦</text>
                    `}
                </svg>
            `;
        },

        renderScene: function() {
            return `
                <svg viewBox="0 0 600 150" class="game-scene-svg">
                    <!-- Sky -->
                    <rect width="600" height="150" fill="#87CEEB"/>

                    <!-- Clouds -->
                    <ellipse cx="100" cy="30" rx="40" ry="20" fill="white" opacity="0.8"/>
                    <ellipse cx="500" cy="40" rx="50" ry="25" fill="white" opacity="0.8"/>

                    <!-- Background trees (left side) -->
                    <!-- Tree 1 -->
                    <rect x="40" y="60" width="15" height="60" fill="#654321" stroke="#4A2511" stroke-width="1"/>
                    <circle cx="47" cy="50" r="25" fill="#228B22" stroke="#1B6B1B" stroke-width="2"/>
                    <circle cx="30" cy="60" r="18" fill="#228B22" stroke="#1B6B1B" stroke-width="2"/>
                    <circle cx="64" cy="60" r="18" fill="#228B22" stroke="#1B6B1B" stroke-width="2"/>

                    <!-- Tree 2 -->
                    <rect x="520" y="55" width="18" height="65" fill="#8B4513" stroke="#654321" stroke-width="1"/>
                    <circle cx="529" cy="45" r="28" fill="#2E8B57" stroke="#246B47" stroke-width="2"/>
                    <circle cx="510" cy="57" r="20" fill="#2E8B57" stroke="#246B47" stroke-width="2"/>
                    <circle cx="548" cy="57" r="20" fill="#2E8B57" stroke="#246B47" stroke-width="2"/>

                    <!-- Tree 3 (smaller, in distance) -->
                    <rect x="150" y="70" width="10" height="50" fill="#654321" stroke="#4A2511" stroke-width="1"/>
                    <circle cx="155" cy="60" r="18" fill="#3CB371" stroke="#2E8B57" stroke-width="1.5"/>
                    <circle cx="142" cy="68" r="12" fill="#3CB371" stroke="#2E8B57" stroke-width="1.5"/>
                    <circle cx="168" cy="68" r="12" fill="#3CB371" stroke="#2E8B57" stroke-width="1.5"/>

                    <!-- Flying birds -->
                    <text x="250" y="35" font-size="16" fill="#2c3e50">🦅</text>
                    <text x="350" y="50" font-size="14" fill="#2c3e50">🕊️</text>

                    <!-- Grass -->
                    <rect y="120" width="600" height="30" fill="#90EE90"/>
                </svg>
            `;
        }
    },

    // Scenario 4: Magic Potion
    {
        id: 'magic_potion',
        titleKey: 'game.scenario.potion.title',
        instructionKey: 'game.scenario.potion.instruction',

        buttons: [
            { id: 'potion1', color: '#9B59B6', glow: '#E056FD' },
            { id: 'potion2', color: '#3498DB', glow: '#5DADE2' },
            { id: 'potion3', color: '#E74C3C', glow: '#EC7063' }
        ],

        renderButton: function(config, isActive, position) {
            const bubbleClass = isActive ? 'class="potion-bubble"' : '';
            return `
                <svg viewBox="0 0 200 200" class="game-button-svg">
                    <!-- Bottle base -->
                    <path d="M 70 100 L 70 150 Q 70 165 85 165 L 115 165 Q 130 165 130 150 L 130 100 Z"
                          fill="${config.color}" stroke="#2c3e50" stroke-width="3"/>

                    <!-- Bottle neck -->
                    <rect x="85" y="70" width="30" height="30"
                          fill="${config.color}" stroke="#2c3e50" stroke-width="3"/>

                    <!-- Cork -->
                    <rect x="80" y="60" width="40" height="15"
                          fill="#8B4513" stroke="#654321" stroke-width="2" rx="3"/>

                    ${isActive ? `
                        <!-- Bubbles (active) -->
                        <circle cx="85" cy="130" r="5" fill="${config.glow}" opacity="0.7" ${bubbleClass}/>
                        <circle cx="100" cy="140" r="6" fill="${config.glow}" opacity="0.8" ${bubbleClass}/>
                        <circle cx="115" cy="125" r="4" fill="${config.glow}" opacity="0.6" ${bubbleClass}/>

                        <!-- Sparkles -->
                        <text x="65" y="95" font-size="16">✨</text>
                        <text x="125" y="110" font-size="16">✨</text>

                        <!-- Glow effect -->
                        <circle cx="100" cy="115" r="40" fill="none" stroke="${config.glow}"
                                stroke-width="2" opacity="0.3" class="potion-glow"/>
                    ` : ''}
                </svg>
            `;
        },

        renderScene: function() {
            return `
                <svg viewBox="0 0 600 150" class="game-scene-svg">
                    <!-- Magical background -->
                    <defs>
                        <linearGradient id="magicGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style="stop-color:#2C3E50;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#8E44AD;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                    <rect width="600" height="150" fill="url(#magicGradient)"/>

                    <!-- Stars -->
                    <text x="50" y="30" font-size="20">⭐</text>
                    <text x="550" y="50" font-size="18">⭐</text>
                    <text x="300" y="25" font-size="16">⭐</text>

                    <!-- Wizard -->
                    <text x="50" y="110" font-size="48">🧙‍♂️</text>
                </svg>
            `;
        }
    },

    // Scenario 5: Flower Garden
    {
        id: 'flower_garden',
        titleKey: 'game.scenario.flower.title',
        instructionKey: 'game.scenario.flower.instruction',

        buttons: [
            { id: 'flower1', color: '#FF4444', center: '#FFD700', stroke: '#CC0000' },  // Red flower
            { id: 'flower2', color: '#9B59B6', center: '#FFA500', stroke: '#7D3C98' },  // Purple flower
            { id: 'flower3', color: '#FFD700', center: '#FF6B35', stroke: '#FFA500' }   // Yellow/golden flower
        ],

        renderButton: function(config, isActive, position) {
            const beeAnimation = isActive ? 'class="bee-buzz"' : '';
            return `
                <svg viewBox="0 0 200 200" class="game-button-svg">
                    <!-- Stem -->
                    <rect x="95" y="100" width="10" height="70"
                          fill="#2ecc71" stroke="#27ae60" stroke-width="2" rx="3"/>

                    <!-- Leaves -->
                    <ellipse cx="75" cy="130" rx="15" ry="8"
                             fill="#2ecc71" stroke="#27ae60" stroke-width="2" transform="rotate(-30 75 130)"/>
                    <ellipse cx="125" cy="145" rx="15" ry="8"
                             fill="#2ecc71" stroke="#27ae60" stroke-width="2" transform="rotate(30 125 145)"/>

                    <!-- Flower petals -->
                    <circle cx="100" cy="75" r="18" fill="${config.color}" stroke="${config.stroke}" stroke-width="2"/>
                    <circle cx="85" cy="90" r="18" fill="${config.color}" stroke="${config.stroke}" stroke-width="2"/>
                    <circle cx="115" cy="90" r="18" fill="${config.color}" stroke="${config.stroke}" stroke-width="2"/>
                    <circle cx="90" cy="105" r="18" fill="${config.color}" stroke="${config.stroke}" stroke-width="2"/>
                    <circle cx="110" cy="105" r="18" fill="${config.color}" stroke="${config.stroke}" stroke-width="2"/>

                    <!-- Flower center -->
                    <circle cx="100" cy="93" r="15" fill="${config.center}" stroke="#2c3e50" stroke-width="2"/>

                    ${isActive ? `
                        <!-- Bee (buzzing) -->
                        <text x="120" y="85" font-size="24" ${beeAnimation}>🐝</text>
                        <text x="140" y="75" font-size="16">♪</text>
                    ` : ''}
                </svg>
            `;
        },

        renderScene: function() {
            return `
                <svg viewBox="0 0 600 150" class="game-scene-svg">
                    <!-- Sky -->
                    <rect width="600" height="150" fill="#87CEEB"/>

                    <!-- Sun -->
                    <circle cx="550" cy="30" r="25" fill="#FFD700"/>
                    <!-- Sun rays -->
                    <line x1="550" y1="30" x2="575" y2="15" stroke="#FFD700" stroke-width="2" stroke-linecap="round"/>
                    <line x1="550" y1="30" x2="580" y2="30" stroke="#FFD700" stroke-width="2" stroke-linecap="round"/>
                    <line x1="550" y1="30" x2="575" y2="45" stroke="#FFD700" stroke-width="2" stroke-linecap="round"/>

                    <!-- Grass -->
                    <rect y="120" width="600" height="30" fill="#90EE90"/>

                    <!-- Butterflies (varied sizes and positions) -->
                    <text x="100" y="50" font-size="24">🦋</text>
                    <text x="180" y="35" font-size="20">🦋</text>
                    <text x="280" y="60" font-size="22">🦋</text>
                    <text x="380" y="45" font-size="26">🦋</text>
                    <text x="450" y="70" font-size="20">🦋</text>
                    <text x="500" y="55" font-size="24">🦋</text>

                    <!-- Small flowers in grass -->
                    <text x="80" y="140" font-size="18">🌼</text>
                    <text x="200" y="138" font-size="16">🌺</text>
                    <text x="350" y="140" font-size="18">🌼</text>
                    <text x="480" y="137" font-size="17">🌸</text>
                </svg>
            `;
        }
    },

    // Scenario 6: Musical Instruments
    {
        id: 'musical_instruments',
        titleKey: 'game.scenario.instrument.title',
        instructionKey: 'game.scenario.instrument.instruction',

        buttons: [
            { id: 'guitar', type: 'guitar', color: '#E67E22', accent: '#D35400' },
            { id: 'piano', type: 'piano', color: '#2C3E50', accent: '#34495E' },
            { id: 'drum', type: 'drum', color: '#C0392B', accent: '#E74C3C' }
        ],

        renderButton: function(config, isActive, position) {
            const noteAnimation = isActive ? 'class="music-note"' : '';

            if (config.type === 'guitar') {
                return `
                    <svg viewBox="0 0 200 200" class="game-button-svg">
                        <!-- Guitar body -->
                        <ellipse cx="100" cy="110" rx="35" ry="45"
                                 fill="${config.color}" stroke="#2c3e50" stroke-width="3"/>
                        <!-- Body shading for depth -->
                        <ellipse cx="85" cy="105" rx="15" ry="20" fill="${config.accent}" opacity="0.3"/>
                        <!-- Sound hole with decorative rosette -->
                        <circle cx="100" cy="110" r="15" fill="#2c3e50"/>
                        <circle cx="100" cy="110" r="18" fill="none" stroke="${config.accent}" stroke-width="1.5"/>
                        <circle cx="100" cy="110" r="20" fill="none" stroke="${config.accent}" stroke-width="1"/>
                        <!-- Bridge -->
                        <rect x="90" y="145" width="20" height="4" fill="#654321" stroke="#2c3e50" stroke-width="1" rx="1"/>
                        <!-- Guitar neck -->
                        <rect x="95" y="30" width="10" height="80"
                              fill="${config.accent}" stroke="#2c3e50" stroke-width="2"/>
                        <!-- Headstock -->
                        <rect x="92" y="25" width="16" height="8" fill="${config.accent}" stroke="#2c3e50" stroke-width="2" rx="2"/>
                        <!-- Tuning pegs -->
                        <circle cx="95" cy="29" r="2" fill="#FFD700" stroke="#2c3e50" stroke-width="1"/>
                        <circle cx="105" cy="29" r="2" fill="#FFD700" stroke="#2c3e50" stroke-width="1"/>
                        <!-- Frets -->
                        <line x1="90" y1="45" x2="110" y2="45" stroke="#C0C0C0" stroke-width="1.5"/>
                        <line x1="90" y1="60" x2="110" y2="60" stroke="#C0C0C0" stroke-width="1.5"/>
                        <line x1="90" y1="75" x2="110" y2="75" stroke="#C0C0C0" stroke-width="1.5"/>
                        <line x1="90" y1="90" x2="110" y2="90" stroke="#C0C0C0" stroke-width="1.5"/>
                        <!-- Strings -->
                        <line x1="96" y1="30" x2="94" y2="148" stroke="#D4D4D4" stroke-width="1"/>
                        <line x1="98" y1="30" x2="97" y2="148" stroke="#B8B8B8" stroke-width="1.2"/>
                        <line x1="100" y1="30" x2="100" y2="148" stroke="#A0A0A0" stroke-width="1.5"/>
                        <line x1="102" y1="30" x2="103" y2="148" stroke="#B8B8B8" stroke-width="1.2"/>
                        <line x1="104" y1="30" x2="106" y2="148" stroke="#D4D4D4" stroke-width="1"/>

                        ${isActive ? `
                            <!-- Musical notes -->
                            <text x="140" y="80" font-size="28" ${noteAnimation}>🎵</text>
                            <text x="145" y="110" font-size="24" ${noteAnimation}>🎶</text>
                            <text x="135" y="135" font-size="20" ${noteAnimation}>♪</text>
                            <!-- Vibration lines -->
                            <line x1="60" y1="110" x2="50" y2="110" stroke="${config.color}" stroke-width="2" opacity="0.6" class="sound-wave"/>
                            <line x1="140" y1="110" x2="150" y2="110" stroke="${config.color}" stroke-width="2" opacity="0.6" class="sound-wave"/>
                        ` : ''}
                    </svg>
                `;
            } else if (config.type === 'piano') {
                return `
                    <svg viewBox="0 0 200 200" class="game-button-svg">
                        <!-- Piano body -->
                        <rect x="50" y="80" width="100" height="80"
                              fill="${config.color}" stroke="#2c3e50" stroke-width="3" rx="5"/>
                        <!-- Piano lid -->
                        <rect x="50" y="70" width="100" height="10"
                              fill="${config.accent}" stroke="#2c3e50" stroke-width="2"/>
                        <!-- White keys -->
                        <rect x="60" y="100" width="15" height="50" fill="white" stroke="#2c3e50" stroke-width="2"/>
                        <rect x="80" y="100" width="15" height="50" fill="white" stroke="#2c3e50" stroke-width="2"/>
                        <rect x="100" y="100" width="15" height="50" fill="white" stroke="#2c3e50" stroke-width="2"/>
                        <rect x="120" y="100" width="15" height="50" fill="white" stroke="#2c3e50" stroke-width="2"/>
                        <!-- Black keys -->
                        <rect x="72" y="100" width="10" height="30" fill="#2c3e50" stroke="#2c3e50" stroke-width="1"/>
                        <rect x="92" y="100" width="10" height="30" fill="#2c3e50" stroke="#2c3e50" stroke-width="1"/>
                        <rect x="112" y="100" width="10" height="30" fill="#2c3e50" stroke="#2c3e50" stroke-width="1"/>

                        ${isActive ? `
                            <!-- Musical notes -->
                            <text x="140" y="90" font-size="28" ${noteAnimation}>🎵</text>
                            <text x="145" y="120" font-size="24" ${noteAnimation}>🎶</text>
                            <!-- Sound waves -->
                            <circle cx="100" cy="110" r="60" fill="none" stroke="${config.accent}"
                                    stroke-width="2" opacity="0.2" class="sound-wave"/>
                        ` : ''}
                    </svg>
                `;
            } else { // drum
                return `
                    <svg viewBox="0 0 200 200" class="game-button-svg">
                        <!-- Drum shell -->
                        <ellipse cx="100" cy="100" rx="45" ry="15"
                                 fill="${config.color}" stroke="#2c3e50" stroke-width="3"/>
                        <rect x="55" y="100" width="90" height="50"
                              fill="${config.accent}" stroke="#2c3e50" stroke-width="3"/>
                        <ellipse cx="100" cy="150" rx="45" ry="15"
                                 fill="${config.color}" stroke="#2c3e50" stroke-width="3"/>

                        <!-- Tension rods -->
                        <circle cx="70" cy="105" r="3" fill="#C0C0C0" stroke="#2c3e50" stroke-width="1"/>
                        <circle cx="130" cy="105" r="3" fill="#C0C0C0" stroke="#2c3e50" stroke-width="1"/>
                        <circle cx="70" cy="125" r="3" fill="#C0C0C0" stroke="#2c3e50" stroke-width="1"/>
                        <circle cx="130" cy="125" r="3" fill="#C0C0C0" stroke="#2c3e50" stroke-width="1"/>
                        <circle cx="70" cy="145" r="3" fill="#C0C0C0" stroke="#2c3e50" stroke-width="1"/>
                        <circle cx="130" cy="145" r="3" fill="#C0C0C0" stroke="#2c3e50" stroke-width="1"/>

                        <!-- Decorative bands -->
                        <line x1="55" y1="110" x2="145" y2="110" stroke="#FFD700" stroke-width="2.5"/>
                        <line x1="55" y1="140" x2="145" y2="140" stroke="#FFD700" stroke-width="2.5"/>
                        <!-- Center badge/logo -->
                        <circle cx="100" cy="125" r="8" fill="#FFD700" stroke="#2c3e50" stroke-width="1.5"/>
                        <text x="100" y="129" font-size="10" text-anchor="middle" fill="#2c3e50" font-weight="bold">★</text>

                        <!-- Drumsticks with more detail -->
                        <line x1="75" y1="65" x2="88" y2="95" stroke="#8B4513" stroke-width="5" stroke-linecap="round"/>
                        <line x1="125" y1="65" x2="112" y2="95" stroke="#8B4513" stroke-width="5" stroke-linecap="round"/>
                        <!-- Stick tips -->
                        <ellipse cx="75" cy="64" rx="5" ry="6" fill="#F5DEB3" stroke="#654321" stroke-width="1"/>
                        <ellipse cx="125" cy="64" rx="5" ry="6" fill="#F5DEB3" stroke="#654321" stroke-width="1"/>
                        <!-- Stick grip area -->
                        <rect x="83" y="87" width="3" height="6" fill="#654321" opacity="0.3"/>
                        <rect x="107" y="87" width="3" height="6" fill="#654321" opacity="0.3"/>

                        ${isActive ? `
                            <!-- Musical notes -->
                            <text x="140" y="95" font-size="28" ${noteAnimation}>🎵</text>
                            <text x="145" y="125" font-size="24" ${noteAnimation}>🎶</text>
                            <text x="138" y="150" font-size="20" ${noteAnimation}>♪</text>
                            <!-- Impact lines and vibration -->
                            <line x1="85" y1="95" x2="75" y2="80" stroke="${config.color}" stroke-width="3" opacity="0.7"/>
                            <line x1="115" y1="95" x2="125" y2="80" stroke="${config.color}" stroke-width="3" opacity="0.7"/>
                            <line x1="90" y1="98" x2="85" y2="88" stroke="#FFD700" stroke-width="2" opacity="0.5"/>
                            <line x1="110" y1="98" x2="115" y2="88" stroke="#FFD700" stroke-width="2" opacity="0.5"/>
                        ` : ''}
                    </svg>
                `;
            }
        },

        renderScene: function() {
            return `
                <svg viewBox="0 0 600 150" class="game-scene-svg">
                    <!-- Stage background -->
                    <defs>
                        <linearGradient id="stageGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style="stop-color:#34495E;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#2C3E50;stop-opacity:1" />
                        </linearGradient>
                        <linearGradient id="curtainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style="stop-color:#8B0000;stop-opacity:1" />
                            <stop offset="50%" style="stop-color:#DC143C;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#8B0000;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                    <rect width="600" height="150" fill="url(#stageGradient)"/>

                    <!-- Stage curtains (left) -->
                    <path d="M 0 0 Q 15 20 10 40 Q 5 60 15 80 Q 10 100 5 120 L 0 120 Z"
                          fill="url(#curtainGradient)" stroke="#5C0000" stroke-width="1"/>
                    <path d="M 10 0 Q 25 20 20 40 Q 15 60 25 80 Q 20 100 15 120 L 10 120 Z"
                          fill="url(#curtainGradient)" stroke="#5C0000" stroke-width="1" opacity="0.8"/>
                    <!-- Stage curtains (right) -->
                    <path d="M 600 0 Q 585 20 590 40 Q 595 60 585 80 Q 590 100 595 120 L 600 120 Z"
                          fill="url(#curtainGradient)" stroke="#5C0000" stroke-width="1"/>
                    <path d="M 590 0 Q 575 20 580 40 Q 585 60 575 80 Q 580 100 585 120 L 590 120 Z"
                          fill="url(#curtainGradient)" stroke="#5C0000" stroke-width="1" opacity="0.8"/>

                    <!-- Stage lights with beams -->
                    <circle cx="150" cy="20" r="10" fill="#F39C12" opacity="0.9"/>
                    <path d="M 150 30 L 130 120 L 170 120 Z" fill="#F39C12" opacity="0.1"/>
                    <circle cx="300" cy="20" r="10" fill="#E74C3C" opacity="0.9"/>
                    <path d="M 300 30 L 280 120 L 320 120 Z" fill="#E74C3C" opacity="0.1"/>
                    <circle cx="450" cy="20" r="10" fill="#3498DB" opacity="0.9"/>
                    <path d="M 450 30 L 430 120 L 470 120 Z" fill="#3498DB" opacity="0.1"/>

                    <!-- Speakers -->
                    <rect x="40" y="80" width="25" height="40" fill="#1C1C1C" stroke="#000" stroke-width="2" rx="3"/>
                    <circle cx="52.5" cy="95" r="6" fill="#2C3E50" stroke="#000" stroke-width="1"/>
                    <circle cx="52.5" cy="110" r="6" fill="#2C3E50" stroke="#000" stroke-width="1"/>
                    <rect x="535" y="80" width="25" height="40" fill="#1C1C1C" stroke="#000" stroke-width="2" rx="3"/>
                    <circle cx="547.5" cy="95" r="6" fill="#2C3E50" stroke="#000" stroke-width="1"/>
                    <circle cx="547.5" cy="110" r="6" fill="#2C3E50" stroke="#000" stroke-width="1"/>

                    <!-- Floating musical notes -->
                    <text x="100" y="50" font-size="20" fill="#FFD700" opacity="0.6">♪</text>
                    <text x="250" y="60" font-size="24" fill="#FFD700" opacity="0.7">🎵</text>
                    <text x="400" y="45" font-size="20" fill="#FFD700" opacity="0.6">♫</text>
                    <text x="500" y="70" font-size="22" fill="#FFD700" opacity="0.65">♪</text>

                    <!-- Floor with stage edge -->
                    <rect y="120" width="600" height="30" fill="#7F8C8D"/>
                    <rect y="120" width="600" height="5" fill="#5A6268"/>
                </svg>
            `;
        }
    }
];
