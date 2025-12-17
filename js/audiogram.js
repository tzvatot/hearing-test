/**
 * Audiogram Chart Visualization
 * Draws standard audiogram using Canvas API
 */

/**
 * Draw audiogram chart
 * @param {Object} results - Test results with right and left ear data
 */
function drawAudiogram(results) {
    const canvas = document.getElementById('audiogram-chart');
    const ctx = canvas.getContext('2d');

    // Set canvas size (high DPI support)
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Canvas dimensions (CSS pixels)
    const width = rect.width;
    const height = rect.height;

    // Chart margins
    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Standard audiometric frequencies
    const frequencies = [250, 500, 1000, 2000, 3000, 4000, 6000, 8000];

    // Hearing level range (dB HL)
    const minDB = -10;
    const maxDB = 100;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Helper functions for coordinate conversion
    const getX = (freq) => {
        const index = frequencies.indexOf(freq);
        return margin.left + (index / (frequencies.length - 1)) * chartWidth;
    };

    const getY = (db) => {
        return margin.top + ((db - minDB) / (maxDB - minDB)) * chartHeight;
    };

    // Draw title
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(i18n.t('audiogram.title'), width / 2, 25);

    // Draw grid
    ctx.strokeStyle = '#ecf0f1';
    ctx.lineWidth = 1;

    // Horizontal grid lines (every 10 dB)
    for (let db = minDB; db <= maxDB; db += 10) {
        const y = getY(db);
        ctx.beginPath();
        ctx.moveTo(margin.left, y);
        ctx.lineTo(margin.left + chartWidth, y);
        ctx.stroke();

        // Highlight normal hearing range (0-25 dB)
        if (db === 25) {
            ctx.fillStyle = 'rgba(46, 204, 113, 0.1)';
            ctx.fillRect(margin.left, margin.top, chartWidth, y - margin.top);
        }
    }

    // Vertical grid lines (frequencies)
    frequencies.forEach(freq => {
        const x = getX(freq);
        ctx.strokeStyle = '#ecf0f1';
        ctx.beginPath();
        ctx.moveTo(x, margin.top);
        ctx.lineTo(x, margin.top + chartHeight);
        ctx.stroke();
    });

    // Draw axes
    ctx.strokeStyle = '#34495e';
    ctx.lineWidth = 2;

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + chartHeight);
    ctx.stroke();

    // X-axis
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top + chartHeight);
    ctx.lineTo(margin.left + chartWidth, margin.top + chartHeight);
    ctx.stroke();

    // Y-axis labels (dB HL)
    ctx.fillStyle = '#2c3e50';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    for (let db = minDB; db <= maxDB; db += 10) {
        const y = getY(db);
        ctx.fillText(db, margin.left - 10, y);
    }

    // Y-axis title
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(i18n.t('audiogram.ylabel'), 0, 0);
    ctx.restore();

    // X-axis labels (frequencies)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    frequencies.forEach(freq => {
        const x = getX(freq);
        ctx.fillText(freq, x, margin.top + chartHeight + 10);
    });

    // X-axis title
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(i18n.t('audiogram.xlabel'), width / 2, height - 20);

    // Draw data points and lines
    const drawEarData = (earData, color, symbol) => {
        if (!earData || Object.keys(earData).length === 0) return;

        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 3;

        // Separate skipped and measured frequencies
        const measuredFreqs = frequencies.filter(f => earData[f] !== undefined && earData[f] !== 'skipped');
        const skippedFreqs = frequencies.filter(f => earData[f] === 'skipped');

        // Draw line connecting measured points (break line at skipped points)
        ctx.beginPath();
        let lineStarted = false;
        measuredFreqs.forEach((freq, index) => {
            const x = getX(freq);
            const y = getY(earData[freq]);

            // Check if previous frequency was skipped
            const freqIndex = frequencies.indexOf(freq);
            const prevFreq = frequencies[freqIndex - 1];
            const isPrevSkipped = prevFreq && earData[prevFreq] === 'skipped';

            if (index === 0 || isPrevSkipped || !lineStarted) {
                ctx.moveTo(x, y);
                lineStarted = true;
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        // Draw symbols at each measured point
        measuredFreqs.forEach(freq => {
            const x = getX(freq);
            const y = getY(earData[freq]);

            if (symbol === 'circle') {
                // Right ear: Circle (O)
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, Math.PI * 2);
                ctx.stroke();
            } else if (symbol === 'cross') {
                // Left ear: Cross (X)
                ctx.beginPath();
                ctx.moveTo(x - 6, y - 6);
                ctx.lineTo(x + 6, y + 6);
                ctx.moveTo(x + 6, y - 6);
                ctx.lineTo(x - 6, y + 6);
                ctx.stroke();
            }
        });

        // Draw skipped markers (gray "S" or dash)
        ctx.fillStyle = '#95a5a6';
        ctx.strokeStyle = '#95a5a6';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        skippedFreqs.forEach(freq => {
            const x = getX(freq);
            const y = margin.top + chartHeight / 2; // Middle of chart

            // Draw "SKIP" text
            ctx.fillText(i18n.t('audiogram.skip'), x, y);

            // Draw a small horizontal line through it
            ctx.beginPath();
            ctx.moveTo(x - 15, y);
            ctx.lineTo(x + 15, y);
            ctx.stroke();
        });

        // Reset text align for other text
        ctx.textAlign = 'left';
    };

    // Draw right ear (red circles)
    if (results.right) {
        drawEarData(results.right, '#e74c3c', 'circle');
    }

    // Draw left ear (blue crosses)
    if (results.left) {
        drawEarData(results.left, '#3498db', 'cross');
    }

    // Draw legend
    const legendX = margin.left + 20;
    const legendY = margin.top + 20;

    // Right ear legend
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(legendX, legendY, 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#2c3e50';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Right Ear', legendX + 15, legendY + 4);

    // Left ear legend
    ctx.strokeStyle = '#3498db';
    ctx.beginPath();
    ctx.moveTo(legendX - 6, legendY + 30 - 6);
    ctx.lineTo(legendX + 6, legendY + 30 + 6);
    ctx.moveTo(legendX + 6, legendY + 30 - 6);
    ctx.lineTo(legendX - 6, legendY + 30 + 6);
    ctx.stroke();
    ctx.fillText('Left Ear', legendX + 15, legendY + 34);

    // Add interpretation zones
    drawInterpretationZones(ctx, margin, chartWidth, chartHeight, getY);
}

/**
 * Draw colored zones for hearing level interpretation
 */
function drawInterpretationZones(ctx, margin, chartWidth, chartHeight, getY) {
    const zones = [
        { label: 'Normal', range: [-10, 25], color: 'rgba(46, 204, 113, 0.05)' },
        { label: 'Mild Loss', range: [26, 40], color: 'rgba(241, 196, 15, 0.05)' },
        { label: 'Moderate', range: [41, 55], color: 'rgba(230, 126, 34, 0.05)' },
        { label: 'Mod-Severe', range: [56, 70], color: 'rgba(231, 76, 60, 0.08)' },
        { label: 'Severe', range: [71, 90], color: 'rgba(192, 57, 43, 0.1)' },
    ];

    // Draw zones on right side
    const zoneX = margin.left + chartWidth + 10;

    zones.forEach(zone => {
        const y1 = getY(zone.range[0]);
        const y2 = getY(zone.range[1]);

        // Color indicator
        ctx.fillStyle = zone.color;
        ctx.fillRect(margin.left, y1, chartWidth, y2 - y1);

        // Label (small text on far right)
        ctx.fillStyle = '#7f8c8d';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(zone.label, zoneX, (y1 + y2) / 2);
    });
}

// Redraw audiogram on window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const resultsScreen = document.getElementById('results-screen');
        if (resultsScreen && resultsScreen.classList.contains('active')) {
            // Redraw if results are showing
            if (typeof app !== 'undefined' && app.results) {
                drawAudiogram(app.results);
            }
        }
    }, 250);
});
