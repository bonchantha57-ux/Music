/**
 * ALBUM STUDIO PRO - CANVAS VISUALIZER & STAGE RENDERER (FIXED & EXTENDED)
 * 60 FPS HTML5 Canvas engine with adjustable Y-positioning, On-Screen Tracklist auto-highlight, custom cover uploads and 110+ themes.
 */

class VisualizerEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.animationId = null;

    // Configuration
    this.config = {
      aspectRatio: '16:9',
      width: 1920,
      height: 1080,
      presetId: 'synthwave_80s',
      background: {
        type: 'radial_glow',
        primaryColor: '#0b1120',
        secondaryColor: '#1e1b4b',
        accentColor: '#fbbf24',
        blur: 0,
        opacity: 1,
        customImage: null
      },
      visualizer: {
        type: 'double_mirror_bars',
        barCount: 64,
        barWidth: 6,
        barGap: 3,
        glow: 25,
        colorMode: 'gradient',
        color1: '#f59e0b',
        color2: '#fbbf24',
        sensitivity: 1.3,
        positionY: 0.85
      },
      typography: {
        titleFont: 'Moul',
        artistFont: 'Kantumruy Pro',
        titleSize: 52,
        artistSize: 26,
        titleColor: '#fef3c7',
        artistColor: '#fde68a',
        textStyle: 'gold',
        glowColor: '#f59e0b',
        strokeWidth: 2,
        strokeColor: 'rgba(0,0,0,0.6)',
        alignment: 'center',
        titleY: 0.22,
        artistY: 0.30,
        lyricsY: 0.78,
        showTrackNumber: true,
        showDuration: true
      },
      artwork: {
        type: 'golden_mandala',
        size: 280,
        positionY: 0.50,
        rotationSpeed: 0.5,
        showVinylArm: true
      },
      tracklistOverlay: {
        enabled: true,
        position: 'left', // 'left', 'right', 'top_left'
        fontSize: 20,
        fontFamily: 'Kantumruy Pro',
        style: 'glass_card',
        highlightColor: '#f59e0b',
        activeGlow: '#fbbf24',
        bgOpacity: 0.75
      }
    };

    // Runtime state
    this.currentTrack = null;
    this.coverImageObj = new Image();
    this.coverImageObj.crossOrigin = 'anonymous';
    this.backgroundImageObj = null;
    this.rotationAngle = 0;
    this.particles = [];
    this.petals = [];
    this.matrixColumns = [];
    this.gridOffset = 0;
    this.laserAngle = 0;
    this.smoothedBass = 0;
    this.smoothedVolume = 0;

    this.initParticles();
    this.initPetals();
    this.initMatrix();
    this.updateCanvasDimensions();
  }

  setTrack(track) {
    this.currentTrack = track;
    if (track && track.coverUrl) {
      this.coverImageObj.src = track.coverUrl;
    }
  }

  setCustomCoverImage(imageSrc) {
    this.customCoverSrc = imageSrc;
    if (this.currentTrack) {
      this.currentTrack.coverUrl = imageSrc;
    }
    this.coverImageObj.src = imageSrc;
  }

  setCustomBackgroundImage(imageSrc) {
    this.backgroundImageObj = new Image();
    this.backgroundImageObj.crossOrigin = 'anonymous';
    this.backgroundImageObj.src = imageSrc;
    this.config.background.type = 'custom_image';
    this.config.background.customImage = imageSrc;
  }

  removeCustomBackgroundImage() {
    this.backgroundImageObj = null;
    this.config.background.customImage = null;
    this.config.background.type = 'radial_glow';
  }

  /**
   * Helper to draw an image scaled and cropped (object-fit: cover) into a destination rect
   */
  drawCoverImageFit(ctx, img, dx, dy, dw, dh) {
    if (!img || !img.complete || img.naturalWidth === 0) return false;
    const srcW = img.naturalWidth;
    const srcH = img.naturalHeight;
    const srcRatio = srcW / srcH;
    const dstRatio = dw / dh;
    let sx = 0, sy = 0, sWidth = srcW, sHeight = srcH;
    if (srcRatio > dstRatio) {
      sWidth = srcH * dstRatio;
      sx = (srcW - sWidth) / 2;
    } else {
      sHeight = srcW / dstRatio;
      sy = (srcH - sHeight) / 2;
    }
    ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dw, dh);
    return true;
  }

  applyPreset(preset) {
    if (!preset) return;
    this.config.presetId = preset.id;
    
    const prevCustomBg = this.config.background.customImage;
    const prevBgType = this.config.background.type;

    this.config.background = JSON.parse(JSON.stringify(preset.background));
    if (prevBgType === 'custom_image' && prevCustomBg) {
      this.config.background.type = 'custom_image';
      this.config.background.customImage = prevCustomBg;
    }

    this.config.visualizer = JSON.parse(JSON.stringify(preset.visualizer));
    this.config.typography = JSON.parse(JSON.stringify(preset.typography));
    this.config.artwork = JSON.parse(JSON.stringify(preset.artwork));

    if (this.config.visualizer.positionY === undefined) this.config.visualizer.positionY = 0.85;
    if (this.config.visualizer.heightScale === undefined) this.config.visualizer.heightScale = 0.40;
    if (this.config.visualizer.widthPercent === undefined) this.config.visualizer.widthPercent = this.config.aspectRatio === '9:16' ? 0.72 : 0.60;
    if (this.config.visualizer.layout === undefined) this.config.visualizer.layout = 'symmetric';

    if (this.config.artwork.positionY === undefined) this.config.artwork.positionY = 0.50;
    if (!this.config.tracklistOverlay) {
      this.config.tracklistOverlay = {
        enabled: true,
        position: 'left',
        fontSize: 18,
        fontFamily: 'Kantumruy Pro',
        style: 'glass_card',
        highlightColor: preset.visualizer?.color1 || '#f59e0b',
        activeGlow: preset.visualizer?.color2 || '#fbbf24',
        bgOpacity: 0.78
      };
    }

    this.initParticles();
  }

  setAspectRatio(ratio) {
    this.config.aspectRatio = ratio;
    switch (ratio) {
      case '16:9':
        this.config.width = 1920;
        this.config.height = 1080;
        this.config.visualizer.widthPercent = 0.60;
        this.config.visualizer.heightScale = 0.40;
        this.config.visualizer.positionY = 0.85;
        this.config.artwork.positionY = 0.50;
        this.config.typography.titleY = 0.22;
        this.config.typography.artistY = 0.30;
        this.canvas.style.aspectRatio = '16 / 9';
        break;
      case '9:16':
        this.config.width = 1080;
        this.config.height = 1920;
        this.config.visualizer.widthPercent = 0.72;
        this.config.visualizer.heightScale = 0.35;
        this.config.visualizer.positionY = 0.78;
        this.config.artwork.positionY = 0.44;
        this.config.typography.titleY = 0.16;
        this.config.typography.artistY = 0.22;
        this.canvas.style.aspectRatio = '9 / 16';
        break;
      case '1:1':
        this.config.width = 1080;
        this.config.height = 1080;
        this.config.visualizer.widthPercent = 0.65;
        this.config.visualizer.heightScale = 0.35;
        this.config.visualizer.positionY = 0.84;
        this.config.artwork.positionY = 0.48;
        this.config.typography.titleY = 0.18;
        this.config.typography.artistY = 0.25;
        this.canvas.style.aspectRatio = '1 / 1';
        break;
      case '4:5':
        this.config.width = 1080;
        this.config.height = 1350;
        this.config.visualizer.widthPercent = 0.68;
        this.config.visualizer.heightScale = 0.35;
        this.config.visualizer.positionY = 0.80;
        this.config.artwork.positionY = 0.46;
        this.config.typography.titleY = 0.17;
        this.config.typography.artistY = 0.23;
        this.canvas.style.aspectRatio = '4 / 5';
        break;
    }
    this.updateCanvasDimensions();
  }

  updateCanvasDimensions() {
    this.canvas.width = this.config.width;
    this.canvas.height = this.config.height;
    this.initMatrix();
  }

  initParticles() {
    this.particles = [];
    const count = 100;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.config.width,
        y: Math.random() * this.config.height,
        size: Math.random() * 3.5 + 1,
        speedX: (Math.random() - 0.5) * 1.8,
        speedY: (Math.random() - 0.5) * 1.8 - 0.5,
        alpha: Math.random() * 0.7 + 0.3,
        color: Math.random() > 0.5 ? this.config.visualizer.color1 : this.config.visualizer.color2
      });
    }
  }

  initPetals() {
    this.petals = [];
    const count = 40;
    for (let i = 0; i < count; i++) {
      this.petals.push({
        x: Math.random() * this.config.width,
        y: Math.random() * this.config.height,
        size: Math.random() * 12 + 8,
        speedY: Math.random() * 1.5 + 1.0,
        speedX: Math.sin(Math.random() * Math.PI * 2) * 1.2,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04
      });
    }
  }

  initMatrix() {
    this.matrixColumns = [];
    const colCount = Math.floor(this.config.width / 24);
    for (let i = 0; i < colCount; i++) {
      this.matrixColumns.push({
        x: i * 24,
        y: Math.random() * this.config.height,
        speed: Math.random() * 4 + 3,
        chars: '01234567890ABCDEFកខគឃងចឆជ'
      });
    }
  }

  start() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    const loop = () => {
      this.render();
      this.animationId = requestAnimationFrame(loop);
    };
    loop();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Main Render Step (60 FPS)
   */
  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    const analysis = window.audioEngine ? window.audioEngine.getAudioAnalysis() : {
      frequencyData: new Uint8Array(64),
      timeDomainData: new Uint8Array(64),
      bass: 0,
      mid: 0,
      treble: 0,
      averageVolume: 0
    };

    // Smooth audio reactivity
    this.smoothedBass += (analysis.bass - this.smoothedBass) * 0.15;
    this.smoothedVolume += (analysis.averageVolume - this.smoothedVolume) * 0.15;

    ctx.clearRect(0, 0, w, h);

    // 1. Render Background Layer
    this.renderBackground(ctx, w, h, analysis);

    // 2. Render Visualizer (Adjustable Y-Position)
    this.renderVisualizer(ctx, w, h, analysis);

    // 3. Render Centerpiece Artwork (Adjustable Y-Position)
    this.renderArtwork(ctx, w, h, analysis);

    // 4. Render Main Titles & Lyrics
    this.renderTypography(ctx, w, h, analysis);

    // 5. Render On-Screen Album Tracklist (Auto-Highlight active song)
    if (this.config.tracklistOverlay?.enabled) {
      this.renderTracklistOverlay(ctx, w, h, analysis);
    }
  }

  /**
   * Background Layer Rendering
   */
  renderBackground(ctx, w, h, analysis) {
    const bg = this.config.background;

    // Check if custom background image is loaded
    if (bg.type === 'custom_image' && this.backgroundImageObj && this.backgroundImageObj.complete && this.backgroundImageObj.naturalWidth > 0) {
      ctx.save();
      if (bg.blur > 0) ctx.filter = `blur(${bg.blur}px)`;
      this.drawCoverImageFit(ctx, this.backgroundImageObj, 0, 0, w, h);
      ctx.filter = 'none';

      // Darkness / Dim overlay for high text legibility
      const dim = bg.dim !== undefined ? bg.dim / 100 : 0.35;
      if (dim > 0) {
        ctx.fillStyle = `rgba(0, 0, 0, ${dim})`;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.restore();

      // Gentle floating ambient particles
      this.renderParticles(ctx, w, h);
      return;
    }

    if (bg.type === 'synthwave_grid') {
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.65);
      skyGrad.addColorStop(0, '#0a0017');
      skyGrad.addColorStop(0.7, '#1f073a');
      skyGrad.addColorStop(1, bg.secondaryColor || '#ec4899');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h * 0.65);

      const sunY = h * 0.52;
      const sunRadius = Math.min(w, h) * 0.22 + (this.smoothedBass * 25);
      const sunGrad = ctx.createLinearGradient(0, sunY - sunRadius, 0, sunY + sunRadius);
      sunGrad.addColorStop(0, '#fde047');
      sunGrad.addColorStop(0.5, '#f43f5e');
      sunGrad.addColorStop(1, '#a855f7');

      ctx.save();
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 40 + (this.smoothedBass * 30);
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(w / 2, sunY, sunRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1f073a';
      for (let i = 0; i < 6; i++) {
        const stripeY = sunY + i * 18 + 10;
        const stripeH = 3 + i * 1.5;
        if (stripeY < sunY + sunRadius) {
          ctx.fillRect(w / 2 - sunRadius - 10, stripeY, (sunRadius + 10) * 2, stripeH);
        }
      }
      ctx.restore();

      const horizonY = h * 0.65;
      const floorGrad = ctx.createLinearGradient(0, horizonY, 0, h);
      floorGrad.addColorStop(0, '#10002b');
      floorGrad.addColorStop(1, '#000000');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, horizonY, w, h - horizonY);

      ctx.save();
      ctx.strokeStyle = bg.accentColor || '#06b6d4';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = bg.accentColor || '#06b6d4';
      ctx.shadowBlur = 8;

      const vanishingX = w / 2;
      for (let x = -w * 0.8; x <= w * 1.8; x += 70) {
        ctx.beginPath();
        ctx.moveTo(vanishingX, horizonY);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      this.gridOffset = (this.gridOffset + (window.audioEngine?.isPlaying ? 2.5 : 0.5)) % 40;
      for (let y = horizonY; y < h; y += 15 + (y - horizonY) * 0.15) {
        const lineY = y + (this.gridOffset * ((y - horizonY) / (h - horizonY)));
        if (lineY <= h) {
          ctx.beginPath();
          ctx.moveTo(0, lineY);
          ctx.lineTo(w, lineY);
          ctx.stroke();
        }
      }
      ctx.restore();

    } else if (bg.type === 'matrix_rain') {
      ctx.fillStyle = 'rgba(2, 44, 34, 0.95)';
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.font = '16px monospace';
      ctx.fillStyle = '#22c55e';
      ctx.shadowColor = '#22c55e';
      ctx.shadowBlur = 8;

      this.matrixColumns.forEach(col => {
        const char = col.chars[Math.floor(Math.random() * col.chars.length)];
        ctx.fillText(char, col.x, col.y);
        col.y += col.speed * (1 + this.smoothedBass * 1.5);
        if (col.y > h) col.y = 0;
      });
      ctx.restore();

    } else if (bg.type === 'disco_lasers') {
      ctx.fillStyle = '#05020c';
      ctx.fillRect(0, 0, w, h);

      if (window.audioEngine?.isPlaying) this.laserAngle += 0.02;

      ctx.save();
      const numLasers = 8;
      for (let i = 0; i < numLasers; i++) {
        const a = this.laserAngle + (i * Math.PI * 2) / numLasers;
        const targetX = w / 2 + Math.cos(a) * w * 1.2;
        const targetY = h / 2 + Math.sin(a) * h * 1.2;

        const laserGrad = ctx.createLinearGradient(w / 2, h / 2, targetX, targetY);
        const col = i % 2 === 0 ? this.config.visualizer.color1 : this.config.visualizer.color2;
        laserGrad.addColorStop(0, 'rgba(255,255,255,0.8)');
        laserGrad.addColorStop(0.2, col);
        laserGrad.addColorStop(1, 'transparent');

        ctx.strokeStyle = laserGrad;
        ctx.lineWidth = 6 + (this.smoothedBass * 10);
        ctx.shadowColor = col;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(w / 2, h / 2);
        ctx.lineTo(targetX, targetY);
        ctx.stroke();
      }
      ctx.restore();

    } else if (bg.type === 'sakura_petals') {
      const baseGrad = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w * 0.7);
      baseGrad.addColorStop(0, bg.secondaryColor || '#831843');
      baseGrad.addColorStop(1, bg.primaryColor || '#500724');
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      this.petals.forEach(p => {
        p.y += p.speedY;
        p.x += Math.sin(p.y * 0.02) * 1.5;
        p.rot += p.rotSpeed;

        if (p.y > h) p.y = -20;
        if (p.x > w) p.x = 0;
        if (p.x < 0) p.x = w;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = 'rgba(251, 207, 232, 0.75)';
        ctx.shadowColor = '#f472b6';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      ctx.restore();

    } else if (bg.type === 'blurred_cover' && this.coverImageObj.complete && this.coverImageObj.naturalWidth > 0) {
      ctx.save();
      ctx.filter = `blur(${bg.blur || 30}px) brightness(0.45)`;
      ctx.drawImage(this.coverImageObj, -50, -50, w + 100, h + 100);
      ctx.filter = 'none';

      const overlayGrad = ctx.createRadialGradient(w / 2, h / 2, 100, w / 2, h / 2, w * 0.7);
      overlayGrad.addColorStop(0, 'rgba(0,0,0,0.2)');
      overlayGrad.addColorStop(1, 'rgba(0,0,0,0.85)');
      ctx.fillStyle = overlayGrad;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

    } else {
      const baseGrad = ctx.createRadialGradient(
        w / 2, h / 2, 10,
        w / 2, h / 2, w * (0.6 + this.smoothedBass * 0.2)
      );
      baseGrad.addColorStop(0, bg.secondaryColor || '#1e1b4b');
      baseGrad.addColorStop(0.7, bg.primaryColor || '#07090e');
      baseGrad.addColorStop(1, '#000000');
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, w, h);

      this.renderParticles(ctx, w, h);
    }
  }

  renderParticles(ctx, w, h) {
    ctx.save();
    for (let p of this.particles) {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      const size = p.size * (1 + this.smoothedBass * 0.8);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  /**
   * Audio Visualizer Rendering (Uses Dynamic Y-Position, Height & Width Scale)
   */
  renderVisualizer(ctx, w, h, analysis) {
    const viz = this.config.visualizer;
    const freq = analysis.frequencyData;
    if (!freq || freq.length === 0) return;

    const customY = h * (viz.positionY !== undefined ? viz.positionY : 0.85);
    const widthPct = viz.widthPercent !== undefined ? viz.widthPercent : (this.config.aspectRatio === '9:16' ? 0.72 : 0.60);
    const heightScale = viz.heightScale !== undefined ? viz.heightScale : 0.40;

    // Elegant restrained max height so visualizer never blocks artwork
    const maxBarHeight = Math.min(140, (h * 0.12) * (heightScale * 2.2));

    ctx.save();
    ctx.shadowColor = viz.color1;
    ctx.shadowBlur = viz.glow || 20;

    if (viz.type === 'bars' || viz.type === 'cyber_equalizer') {
      const count = viz.barCount || 54;
      const totalWidth = w * widthPct;
      const barWidth = Math.max(3, Math.floor(totalWidth / count * 0.65));
      const gap = Math.max(2, Math.floor(totalWidth / count * 0.35));
      const startX = (w - (count * (barWidth + gap))) / 2;
      const baseY = customY;

      for (let i = 0; i < count; i++) {
        let freqIndex;
        if (viz.layout === 'linear') {
          freqIndex = Math.floor((i / count) * (freq.length * 0.55));
        } else {
          // Symmetric Center Peak: Highest energy in center, tapers gracefully to both edges
          const normDist = 1 - Math.abs((i - (count - 1) / 2) / ((count - 1) / 2));
          freqIndex = Math.floor((1 - normDist) * (freq.length * 0.45));
        }

        const val = (freq[freqIndex] / 255) * (viz.sensitivity || 1.2);
        const barH = Math.max(3, val * maxBarHeight);
        const x = startX + i * (barWidth + gap);
        const y = baseY - barH;

        const grad = ctx.createLinearGradient(x, y, x, baseY);
        grad.addColorStop(0, viz.color1);
        grad.addColorStop(1, viz.color2);
        ctx.fillStyle = grad;

        if (viz.type === 'cyber_equalizer') {
          const segmentH = 6;
          const segGap = 3;
          const numSegs = Math.max(1, Math.floor(barH / (segmentH + segGap)));
          for (let s = 0; s < numSegs; s++) {
            const segY = baseY - (s + 1) * (segmentH + segGap);
            ctx.fillRect(x, segY, barWidth, segmentH);
          }
        } else {
          window.typographyEngine.roundRect(ctx, x, y, barWidth, barH, barWidth / 2);
          ctx.fill();
        }
      }

    } else if (viz.type === 'double_mirror_bars') {
      const count = viz.barCount || 54;
      const totalWidth = w * widthPct;
      const barWidth = Math.max(3, Math.floor(totalWidth / count * 0.65));
      const gap = Math.max(2, Math.floor(totalWidth / count * 0.35));
      const startX = (w - (count * (barWidth + gap))) / 2;
      const centerY = customY;

      for (let i = 0; i < count; i++) {
        let freqIndex;
        if (viz.layout === 'linear') {
          freqIndex = Math.floor((i / count) * (freq.length * 0.55));
        } else {
          const normDist = 1 - Math.abs((i - (count - 1) / 2) / ((count - 1) / 2));
          freqIndex = Math.floor((1 - normDist) * (freq.length * 0.45));
        }

        const val = (freq[freqIndex] / 255) * (viz.sensitivity || 1.2);
        const halfH = Math.max(2, (val * maxBarHeight) / 2);
        const x = startX + i * (barWidth + gap);

        const grad = ctx.createLinearGradient(x, centerY - halfH, x, centerY + halfH);
        grad.addColorStop(0, viz.color1);
        grad.addColorStop(1, viz.color2);
        ctx.fillStyle = grad;

        window.typographyEngine.roundRect(ctx, x, centerY - halfH, barWidth, halfH * 2, barWidth / 2);
        ctx.fill();
      }

    } else if (viz.type === 'circular' || viz.type === 'radial_pulse') {
      const centerX = w / 2;
      const centerY = h * (this.config.artwork.positionY !== undefined ? this.config.artwork.positionY : 0.50);
      const baseRadius = (this.config.artwork.size || 260) / 2 + 12;
      const count = viz.barCount || 64;

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const freqIndex = Math.floor((i < count / 2 ? i : count - i) / (count / 2) * (freq.length * 0.45));
        const val = (freq[freqIndex] / 255) * (viz.sensitivity || 1.2);
        const spikeLen = Math.max(4, val * (maxBarHeight * 0.65));

        const x1 = centerX + Math.cos(angle) * baseRadius;
        const y1 = centerY + Math.sin(angle) * baseRadius;
        const x2 = centerX + Math.cos(angle) * (baseRadius + spikeLen);
        const y2 = centerY + Math.sin(angle) * (baseRadius + spikeLen);

        ctx.strokeStyle = viz.color1;
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

    } else if (viz.type === 'waves') {
      const baseY = customY;
      ctx.beginPath();
      ctx.moveTo(0, baseY);

      const timeDomain = analysis.timeDomainData;
      const step = w / timeDomain.length;

      for (let i = 0; i < timeDomain.length; i++) {
        const v = (timeDomain[i] - 128) / 128 * (viz.sensitivity || 1.0);
        const y = baseY + v * (maxBarHeight * 0.6);
        ctx.lineTo(i * step, y);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();

      const waveGrad = ctx.createLinearGradient(0, baseY - 40, 0, h);
      waveGrad.addColorStop(0, viz.color1);
      waveGrad.addColorStop(1, 'rgba(0,0,0,0.85)');
      ctx.fillStyle = waveGrad;
      ctx.fill();
    }
    ctx.restore();
  }

  /**
   * Centerpiece Artwork Rendering (Uses Dynamic Y-Position & Custom Uploaded Images)
   */
  renderArtwork(ctx, w, h, analysis) {
    const art = this.config.artwork;
    const size = art.size || 260;
    const centerX = w / 2;
    const centerY = h * (art.positionY !== undefined ? art.positionY : 0.50);

    const spinSpeed = art.rotationSpeed !== undefined ? art.rotationSpeed : 0.5;
    if (window.audioEngine && window.audioEngine.isPlaying && spinSpeed > 0) {
      this.rotationAngle += spinSpeed * 0.02;
    }

    ctx.save();
    ctx.translate(centerX, centerY);

    if (art.type === 'vinyl') {
      if (spinSpeed > 0) ctx.rotate(this.rotationAngle);
      ctx.shadowColor = 'rgba(0,0,0,0.85)';
      ctx.shadowBlur = 30;
      ctx.fillStyle = '#0a0a0c';
      ctx.beginPath();
      ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
      ctx.fill();

      // Vinyl groove rings
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let r = size * 0.28; r < size * 0.48; r += 4) {
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Light sheen reflection
      const sheenGrad = ctx.createLinearGradient(-size / 2, -size / 2, size / 2, size / 2);
      sheenGrad.addColorStop(0, 'rgba(255,255,255,0.12)');
      sheenGrad.addColorStop(0.5, 'transparent');
      sheenGrad.addColorStop(1, 'rgba(255,255,255,0.12)');
      ctx.fillStyle = sheenGrad;
      ctx.beginPath();
      ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
      ctx.fill();

      // Center circular sticker with user cover
      const stickerRadius = size * 0.24;
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, stickerRadius, 0, Math.PI * 2);
      ctx.clip();

      if (!this.drawCoverImageFit(ctx, this.coverImageObj, -stickerRadius, -stickerRadius, stickerRadius * 2, stickerRadius * 2)) {
        ctx.fillStyle = '#4f46e5';
        ctx.fillRect(-stickerRadius, -stickerRadius, stickerRadius * 2, stickerRadius * 2);
      }
      ctx.restore();

      // Center spindle hole
      ctx.fillStyle = '#030712';
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();

    } else if (art.type === 'golden_mandala') {
      if (spinSpeed > 0) ctx.rotate(this.rotationAngle * 0.4);
      const r = size / 2;

      ctx.save();
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 25 + (this.smoothedBass * 20);

      // Ornate mandala petals
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2.5;
      for (let i = 0; i < 16; i++) {
        const a = (i * Math.PI) / 8;
        ctx.beginPath();
        ctx.ellipse(0, 0, r, r * 0.35, a, 0, Math.PI * 2);
        ctx.stroke();
      }

      const innerR = r * 0.72;
      ctx.beginPath();
      ctx.arc(0, 0, innerR, 0, Math.PI * 2);
      ctx.clip();
      if (!this.drawCoverImageFit(ctx, this.coverImageObj, -innerR, -innerR, innerR * 2, innerR * 2)) {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(-innerR, -innerR, innerR * 2, innerR * 2);
      }
      ctx.restore();

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.72, 0, Math.PI * 2);
      ctx.stroke();

    } else if (art.type === 'square_glass' || art.type === 'square_cover') {
      // 3D Glassmorphic / Modern Square Album Card
      const cardW = size;
      const cardH = size;
      
      if (spinSpeed > 0) {
        ctx.rotate(this.rotationAngle * 0.15); // gentle slow tilt if spin enabled
      }

      ctx.shadowColor = 'rgba(0,0,0,0.75)';
      ctx.shadowBlur = 35 + (this.smoothedBass * 15);

      ctx.save();
      window.typographyEngine.roundRect(ctx, -cardW / 2, -cardH / 2, cardW, cardH, 20);
      ctx.clip();
      if (!this.drawCoverImageFit(ctx, this.coverImageObj, -cardW / 2, -cardH / 2, cardW, cardH)) {
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(-cardW / 2, -cardH / 2, cardW, cardH);
      }
      ctx.restore();

      // Glowing Glass Border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = this.config.visualizer.color1 || '#6366f1';
      ctx.shadowBlur = 15;
      window.typographyEngine.roundRect(ctx, -cardW / 2, -cardH / 2, cardW, cardH, 20);
      ctx.stroke();

    } else if (art.type === 'cd_jewel_case') {
      const caseW = size * 1.1;
      const caseH = size * 1.05;

      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 25;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      window.typographyEngine.roundRect(ctx, -caseW / 2, -caseH / 2, caseW, caseH, 10);
      ctx.fill();
      ctx.stroke();

      ctx.save();
      ctx.translate(caseW * 0.08, 0);
      if (spinSpeed > 0) ctx.rotate(this.rotationAngle * 1.5);
      const cdR = size * 0.42;

      const cdGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, cdR);
      cdGrad.addColorStop(0, '#ffffff');
      cdGrad.addColorStop(0.3, '#cbd5e1');
      cdGrad.addColorStop(0.6, '#38bdf8');
      cdGrad.addColorStop(0.8, '#f472b6');
      cdGrad.addColorStop(1, '#94a3b8');
      ctx.fillStyle = cdGrad;
      ctx.beginPath();
      ctx.arc(0, 0, cdR, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(0,0,0,0.9)';
      ctx.beginPath();
      ctx.arc(0, 0, cdR * 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      const bW = caseW * 0.52;
      const bH = caseH * 0.9;
      ctx.save();
      window.typographyEngine.roundRect(ctx, -caseW / 2 + 10, -bH / 2, bW, bH, 6);
      ctx.clip();
      if (!this.drawCoverImageFit(ctx, this.coverImageObj, -caseW / 2 + 10, -bH / 2, bW, bH)) {
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(-caseW / 2 + 10, -bH / 2, bW, bH);
      }
      ctx.restore();

    } else if (art.type === 'retro_boombox') {
      const bW = size * 1.4;
      const bH = size * 0.85;

      ctx.shadowColor = 'rgba(0,0,0,0.85)';
      ctx.shadowBlur = 30;
      ctx.fillStyle = '#18181b';
      ctx.strokeStyle = '#52525b';
      ctx.lineWidth = 3;
      window.typographyEngine.roundRect(ctx, -bW / 2, -bH / 2, bW, bH, 12);
      ctx.fill();
      ctx.stroke();

      const spR = bH * 0.35 + (this.smoothedBass * 15);
      const spDist = bW * 0.28;

      [-spDist, spDist].forEach(sx => {
        ctx.fillStyle = '#09090b';
        ctx.beginPath();
        ctx.arc(sx, 0, spR, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = this.config.visualizer.color1;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(sx, 0, spR * 0.7, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = this.config.visualizer.color2;
        ctx.beginPath();
        ctx.arc(sx, 0, spR * 0.3, 0, Math.PI * 2);
        ctx.fill();
      });

      const cW = bW * 0.26;
      const cH = bH * 0.55;
      ctx.save();
      window.typographyEngine.roundRect(ctx, -cW / 2, -cH / 2, cW, cH, 6);
      ctx.clip();
      if (!this.drawCoverImageFit(ctx, this.coverImageObj, -cW / 2, -cH / 2, cW, cH)) {
        ctx.fillStyle = '#27272a';
        ctx.fillRect(-cW / 2, -cH / 2, cW, cH);
      }
      ctx.restore();

    } else if (art.type === 'cassette') {
      const cW = size * 1.3;
      const cH = size * 0.8;
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 25;
      ctx.fillStyle = '#1c1917';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 3;
      window.typographyEngine.roundRect(ctx, -cW / 2, -cH / 2, cW, cH, 14);
      ctx.fill();
      ctx.stroke();

      const labelW = cW * 0.85;
      const labelH = cH * 0.7;
      ctx.save();
      window.typographyEngine.roundRect(ctx, -labelW / 2, -labelH / 2, labelW, labelH, 8);
      ctx.clip();
      if (!this.drawCoverImageFit(ctx, this.coverImageObj, -labelW / 2, -labelH / 2, labelW, labelH)) {
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(-labelW / 2, -labelH / 2, labelW, labelH);
      }
      ctx.restore();

      const winW = labelW * 0.65;
      const winH = labelH * 0.45;
      ctx.fillStyle = 'rgba(12, 10, 9, 0.85)';
      window.typographyEngine.roundRect(ctx, -winW / 2, -winH / 2, winW, winH, 6);
      ctx.fill();

      const reelDist = winW * 0.26;
      [-reelDist, reelDist].forEach(rx => {
        ctx.save();
        ctx.translate(rx, 0);
        if (spinSpeed > 0) ctx.rotate(this.rotationAngle * 2);
        ctx.fillStyle = '#f5f5f4';
        ctx.beginPath();
        ctx.arc(0, 0, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0c0a09';
        for (let t = 0; t < 6; t++) {
          ctx.fillRect(-3, -15, 6, 8);
          ctx.rotate(Math.PI / 3);
        }
        ctx.restore();
      });

    } else {
      // circle_cover (Full Glowing Circular Disc)
      if (spinSpeed > 0) ctx.rotate(this.rotationAngle * 0.5);
      const r = size / 2;
      ctx.shadowColor = this.config.visualizer.color1 || '#fbbf24';
      ctx.shadowBlur = 25 + (this.smoothedBass * 25);

      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.clip();
      if (!this.drawCoverImageFit(ctx, this.coverImageObj, -r, -r, size, size)) {
        ctx.fillStyle = '#312e81';
        ctx.fillRect(-r, -r, size, size);
      }
      ctx.restore();

      // Outer Glowing Ring
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();

      // Concentric inner accent
      ctx.strokeStyle = this.config.visualizer.color2 || '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.88, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  /**
   * Main Titles & Lyrics Rendering
   */
  renderTypography(ctx, w, h, analysis) {
    const typo = this.config.typography;
    const track = this.currentTrack || {
      title: 'បទចម្រៀងគ្មានចំណងជើង',
      artist: 'សិល្បករខ្មែរ',
      album: 'Album Studio 2026',
      duration: 180,
      lyrics: []
    };

    const titleY = h * (typo.titleY || 0.22);
    const artistY = h * (typo.artistY || 0.30);
    const textX = typo.alignment === 'left' ? w * 0.1 : (typo.alignment === 'right' ? w * 0.9 : w / 2);

    window.typographyEngine.renderText(ctx, track.title, textX, titleY, {
      fontFamily: typo.titleFont || 'Outfit',
      fontSize: typo.titleSize || 52,
      fontWeight: 'bold',
      color: typo.titleColor || '#ffffff',
      style: typo.textStyle || 'neon',
      glowColor: typo.glowColor || '#ec4899',
      strokeWidth: typo.strokeWidth || 0,
      strokeColor: typo.strokeColor || '#000000',
      alignment: typo.alignment || 'center',
      maxWidth: w * 0.85
    });

    const artistSubtitle = track.album ? `${track.artist}  •  ${track.album}` : track.artist;
    window.typographyEngine.renderText(ctx, artistSubtitle, textX, artistY, {
      fontFamily: typo.artistFont || 'Kantumruy Pro',
      fontSize: typo.artistSize || 24,
      fontWeight: '600',
      color: typo.artistColor || '#94a3b8',
      style: 'soft_shadow',
      glowColor: typo.glowColor || '#6366f1',
      alignment: typo.alignment || 'center',
      maxWidth: w * 0.85
    });

    if (typo.showTrackNumber && window.audioEngine) {
      const idx = window.audioEngine.currentTrackIndex + 1;
      const total = Math.max(1, window.audioEngine.playlist.length);
      const trackBadge = `TRACK ${idx.toString().padStart(2, '0')} / ${total.toString().padStart(2, '0')}`;
      
      window.typographyEngine.renderText(ctx, trackBadge, w * 0.08, h * 0.08, {
        fontFamily: 'Outfit',
        fontSize: 18,
        fontWeight: '700',
        color: 'rgba(255, 255, 255, 0.75)',
        style: 'floating_glass',
        alignment: 'left'
      });
    }

    const currentTime = window.audioEngine ? window.audioEngine.audioElement.currentTime : 0;
    if (track.lyrics && track.lyrics.length > 0) {
      window.typographyEngine.renderLyrics(ctx, track.lyrics, currentTime, w, h, {
        fontFamily: typo.artistFont || 'Kantumruy Pro',
        fontSize: 26,
        color: '#ffffff',
        activeColor: typo.glowColor || '#38bdf8',
        yPercent: typo.lyricsY || 0.78
      });
    }
  }

  /**
   * ON-SCREEN TRACKLIST OVERLAY (AUTO-HIGHLIGHT & MULTI-LANGUAGE)
   */
  renderTracklistOverlay(ctx, w, h, analysis) {
    const playlist = window.audioEngine ? window.audioEngine.playlist : [];
    if (!playlist || playlist.length === 0) return;

    const overlay = this.config.tracklistOverlay || {};
    const pos = overlay.position || 'left';
    if (pos === 'none') return;

    const fontSize = overlay.fontSize || 18;
    const highlightColor = overlay.highlightColor || '#f59e0b';
    const activeGlow = overlay.activeGlow || '#fbbf24';
    const currentIdx = window.audioEngine ? window.audioEngine.currentTrackIndex : 0;

    ctx.save();

    if (pos === 'right' || pos === 'left') {
      const boxW = Math.min(440, Math.max(320, w * 0.28));
      const rowH = Math.max(38, fontSize + 18);
      const headerH = 46;
      const paddingBottom = 14;
      
      // Calculate total box height accurately so ALL songs fit smoothly
      const neededH = headerH + (playlist.length * rowH) + paddingBottom;
      const boxH = Math.min(h * 0.75, neededH);
      const boxX = pos === 'right' ? w - boxW - 36 : 36;
      const boxY = h * 0.16;

      // 1. Frosted Glass Backdrop Card
      ctx.fillStyle = `rgba(10, 15, 28, ${overlay.bgOpacity || 0.78})`;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.lineWidth = 1.5;
      window.typographyEngine.roundRect(ctx, boxX, boxY, boxW, boxH, 16);
      ctx.fill();
      ctx.stroke();

      // 2. Header Title: ALBUM TRACKLIST
      ctx.font = `bold 14px "Outfit", "Kantumruy Pro", sans-serif`;
      ctx.fillStyle = '#a5b4fc';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('🎼 ALBUM TRACKLIST', boxX + 18, boxY + 24);

      // Track count indicator
      ctx.font = `600 12px "Outfit", sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.textAlign = 'right';
      ctx.fillText(`${playlist.length} SONGS`, boxX + boxW - 18, boxY + 24);

      // Divider line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(boxX + 14, boxY + 40);
      ctx.lineTo(boxX + boxW - 14, boxY + 40);
      ctx.stroke();

      // 3. Render Song List Rows
      playlist.forEach((track, i) => {
        const itemCenterY = boxY + headerH + 8 + (i * rowH) + (rowH / 2);
        if (itemCenterY + (rowH / 2) > boxY + boxH + 8) return; // Boundary check

        const isActive = i === currentIdx;

        if (isActive) {
          // Active Track Highlight Pill (លូតមក / Glowing Badge)
          ctx.save();
          const pillX = boxX + 8;
          const pillY = itemCenterY - (rowH / 2) + 2;
          const pillW = boxW - 16;
          const pillH = rowH - 4;

          const activeGrad = ctx.createLinearGradient(pillX, pillY, pillX + pillW, pillY);
          activeGrad.addColorStop(0, 'rgba(245, 158, 11, 0.38)');
          activeGrad.addColorStop(1, 'rgba(236, 72, 153, 0.38)');
          ctx.fillStyle = activeGrad;
          ctx.strokeStyle = highlightColor;
          ctx.lineWidth = 1.5;
          ctx.shadowColor = activeGlow;
          ctx.shadowBlur = 12 + (this.smoothedBass * 12);
          window.typographyEngine.roundRect(ctx, pillX, pillY, pillW, pillH, 8);
          ctx.fill();
          ctx.stroke();
          ctx.restore();

          // Animated mini soundbar equalizer icon on the right
          const barX = boxX + boxW - 38;
          const barY = itemCenterY;
          ctx.fillStyle = highlightColor;
          for (let b = 0; b < 3; b++) {
            const bh = 5 + Math.sin(Date.now() * 0.012 + b * 2) * 7 + (this.smoothedBass * 8);
            ctx.fillRect(barX + b * 5, barY - bh / 2, 3, bh);
          }
        } else {
          // Format duration on the right for inactive tracks
          const sec = Math.floor(track.duration || 180);
          const min = Math.floor(sec / 60);
          const remSec = (sec % 60).toString().padStart(2, '0');
          const durStr = `${min}:${remSec}`;

          ctx.font = `500 ${fontSize - 4}px "Outfit", sans-serif`;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.textAlign = 'right';
          ctx.textBaseline = 'middle';
          ctx.fillText(durStr, boxX + boxW - 16, itemCenterY);
        }

        // Track Number (e.g. 01. or 02.)
        ctx.font = `${isActive ? 'bold' : '600'} ${fontSize - 2}px "Outfit", sans-serif`;
        ctx.fillStyle = isActive ? highlightColor : 'rgba(255, 255, 255, 0.5)';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        const numText = `${(i + 1).toString().padStart(2, '0')}.`;
        ctx.fillText(numText, boxX + 18, itemCenterY);

        // Song Title with comprehensive fallback fonts
        ctx.font = `${isActive ? 'bold' : '500'} ${fontSize}px "Kantumruy Pro", "Battambang", "Noto Sans Khmer", "Microsoft YaHei", "Segoe UI", sans-serif`;
        ctx.fillStyle = isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.8)';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        const maxTitleW = boxW - 95;
        ctx.fillText(track.title, boxX + 50, itemCenterY, maxTitleW);
      });

    } else if (pos === 'top_left') {
      const activeTrack = playlist[currentIdx];
      if (activeTrack) {
        const text = `▶ ${(currentIdx + 1).toString().padStart(2, '0')}. ${activeTrack.title}`;
        ctx.font = `bold ${fontSize + 2}px "Kantumruy Pro", "Noto Sans Khmer", "Microsoft YaHei", sans-serif`;
        const tw = ctx.measureText(text).width + 36;
        
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = highlightColor;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = activeGlow;
        ctx.shadowBlur = 12;
        window.typographyEngine.roundRect(ctx, 36, 36, tw, fontSize + 24, 12);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 52, 36 + (fontSize + 24) / 2);
      }
    }

    ctx.restore();
  }
}

window.VisualizerEngine = VisualizerEngine;
