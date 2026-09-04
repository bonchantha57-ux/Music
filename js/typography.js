/**
 * ALBUM STUDIO PRO - TYPOGRAPHY & TEXT STYLING ENGINE
 * Handles advanced text effects, Google Fonts rendering, Khmer typography, and dynamic lyrics sync.
 */

class TypographyEngine {
  constructor() {
    this.fontsLoaded = new Set();
  }

  /**
   * Applies text effect and renders on target Canvas 2D context
   */
  renderText(ctx, text, x, y, options = {}) {
    if (!text) return;

    const {
      fontFamily = 'Kantumruy Pro',
      fontSize = 40,
      fontWeight = 'bold',
      color = '#ffffff',
      style = 'neon', // 'neon', 'gold', 'chrome', 'glitch', '3d_shadow', 'floating_glass', 'outline', 'soft_shadow'
      glowColor = '#6366f1',
      strokeWidth = 0,
      strokeColor = '#000000',
      alignment = 'center',
      maxWidth = null,
      letterSpacing = 0
    } = options;

    ctx.save();
    ctx.textAlign = alignment;
    ctx.textBaseline = 'middle';
    ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}", sans-serif`;

    if (letterSpacing > 0 && ctx.letterSpacing !== undefined) {
      ctx.letterSpacing = `${letterSpacing}px`;
    }

    // Effect logic
    switch (style) {
      case 'neon':
        // Layered neon glow
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = fontSize * 0.5;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y, maxWidth || undefined);

        ctx.shadowBlur = fontSize * 0.25;
        ctx.fillText(text, x, y, maxWidth || undefined);

        // Core bright center
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(text, x, y, maxWidth || undefined);
        break;

      case 'gold':
        // Luxury metallic gold gradient
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        let startX = x;
        if (alignment === 'center') startX = x - textWidth / 2;
        else if (alignment === 'right') startX = x - textWidth;

        const goldGrad = ctx.createLinearGradient(startX, y - fontSize / 2, startX, y + fontSize / 2);
        goldGrad.addColorStop(0, '#fef08a');
        goldGrad.addColorStop(0.3, '#f59e0b');
        goldGrad.addColorStop(0.6, '#fbbf24');
        goldGrad.addColorStop(1, '#b45309');

        ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';
        ctx.shadowBlur = 12;

        if (strokeWidth > 0) {
          ctx.lineWidth = strokeWidth;
          ctx.strokeStyle = strokeColor || '#000000';
          ctx.strokeText(text, x, y, maxWidth || undefined);
        }

        ctx.fillStyle = goldGrad;
        ctx.fillText(text, x, y, maxWidth || undefined);
        break;

      case 'chrome':
        // Metallic Silver Reflection
        const chromeGrad = ctx.createLinearGradient(0, y - fontSize / 2, 0, y + fontSize / 2);
        chromeGrad.addColorStop(0, '#ffffff');
        chromeGrad.addColorStop(0.48, '#cbd5e1');
        chromeGrad.addColorStop(0.52, '#475569');
        chromeGrad.addColorStop(1, '#f1f5f9');

        ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
        ctx.shadowBlur = 10;
        ctx.fillStyle = chromeGrad;
        ctx.fillText(text, x, y, maxWidth || undefined);
        break;

      case 'glitch':
        // Cyberpunk Chromatic Aberration
        ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
        ctx.fillText(text, x - 3, y - 1, maxWidth || undefined);

        ctx.fillStyle = 'rgba(6, 182, 212, 0.8)';
        ctx.fillText(text, x + 3, y + 1, maxWidth || undefined);

        ctx.fillStyle = color;
        ctx.fillText(text, x, y, maxWidth || undefined);
        break;

      case '3d_shadow':
        // Stacked extruded shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        for (let s = 6; s >= 1; s--) {
          ctx.fillText(text, x + s, y + s, maxWidth || undefined);
        }
        ctx.fillStyle = color;
        ctx.fillText(text, x, y, maxWidth || undefined);
        break;

      case 'floating_glass':
        // Frosted card behind text
        const metrics = ctx.measureText(text);
        const w = (maxWidth ? Math.min(metrics.width, maxWidth) : metrics.width) + 32;
        const h = fontSize + 20;
        let boxX = x;
        if (alignment === 'center') boxX = x - w / 2;
        else if (alignment === 'right') boxX = x - w;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.55)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.lineWidth = 1.5;
        this.roundRect(ctx, boxX, y - h / 2, w, h, 12);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.fillText(text, x, y, maxWidth || undefined);
        break;

      case 'outline':
        ctx.lineWidth = strokeWidth || 4;
        ctx.strokeStyle = strokeColor || '#000000';
        ctx.strokeText(text, x, y, maxWidth || undefined);
        ctx.fillStyle = color;
        ctx.fillText(text, x, y, maxWidth || undefined);
        break;

      case 'soft_shadow':
      default:
        ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 4;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y, maxWidth || undefined);
        break;
    }

    ctx.restore();
  }

  /**
   * Renders active lyrics with smooth highlight animation
   */
  renderLyrics(ctx, lyrics, currentTime, canvasWidth, canvasHeight, options = {}) {
    if (!lyrics || lyrics.length === 0) return;

    const {
      fontFamily = 'Kantumruy Pro',
      fontSize = 24,
      color = '#ffffff',
      activeColor = '#38bdf8',
      yPercent = 0.80
    } = options;

    // Find current active lyric line
    let activeIndex = 0;
    for (let i = 0; i < lyrics.length; i++) {
      if (currentTime >= lyrics[i].time) {
        activeIndex = i;
      }
    }

    const currentLine = lyrics[activeIndex];
    if (!currentLine) return;

    const y = canvasHeight * yPercent;

    // Glass pill background for lyric line
    ctx.save();
    ctx.font = `600 ${fontSize}px "${fontFamily}", sans-serif`;
    const metrics = ctx.measureText(currentLine.text);
    const boxW = Math.min(canvasWidth * 0.85, metrics.width + 40);
    const boxH = fontSize + 24;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    this.roundRect(ctx, (canvasWidth - boxW) / 2, y - boxH / 2, boxW, boxH, 16);
    ctx.fill();
    ctx.stroke();

    // Render text with subtle pulse
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = activeColor;
    ctx.shadowColor = activeColor;
    ctx.shadowBlur = 8;
    ctx.fillText(currentLine.text, canvasWidth / 2, y, canvasWidth * 0.8);
    ctx.restore();
  }

  /**
   * Helper to draw rounded rectangles on Canvas
   */
  roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}

// Global instance
window.typographyEngine = new TypographyEngine();
