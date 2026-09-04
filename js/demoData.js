/**
 * ALBUM STUDIO PRO - DEMO DATA & PROCEDURAL AUDIO SYNTHESIZER
 * Generates sample demo tracks with high-fidelity canvas artworks and synth audio buffers.
 */

class DemoDataManager {
  constructor() {
    this.demoTracks = [];
  }

  /**
   * Generates a rich SVG data URL album cover
   */
  generateCoverArt(title, artist, primaryColor, secondaryColor, patternType = 'circle') {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    // Background Gradient
    const grad = ctx.createLinearGradient(0, 0, 600, 600);
    grad.addColorStop(0, primaryColor);
    grad.addColorStop(1, secondaryColor);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 600);

    // Decorative geometric patterns
    ctx.save();
    if (patternType === 'circle') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 4;
      for (let r = 50; r <= 280; r += 40) {
        ctx.beginPath();
        ctx.arc(300, 300, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      // Glowing center disc
      const radial = ctx.createRadialGradient(300, 300, 10, 300, 300, 180);
      radial.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
      radial.addColorStop(1, 'transparent');
      ctx.fillStyle = radial;
      ctx.beginPath();
      ctx.arc(300, 300, 180, 0, Math.PI * 2);
      ctx.fill();
    } else if (patternType === 'waves') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 3;
      for (let y = 100; y <= 500; y += 30) {
        ctx.beginPath();
        for (let x = 0; x <= 600; x += 10) {
          const wave = Math.sin(x * 0.02 + y * 0.05) * 25;
          if (x === 0) ctx.moveTo(x, y + wave);
          else ctx.lineTo(x, y + wave);
        }
        ctx.stroke();
      }
    } else if (patternType === 'cyber') {
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.lineWidth = 2;
      for (let i = 0; i <= 600; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0); ctx.lineTo(i, 600);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i); ctx.lineTo(600, i);
        ctx.stroke();
      }
    } else {
      // Golden luxury mandala
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI) / 6;
        ctx.beginPath();
        ctx.ellipse(300, 300, 200, 60, angle, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.restore();

    // Subtle Glass overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, 600, 600);

    // Title & Artist Badge on cover
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Kantumruy Pro", sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 15;
    ctx.fillText(title, 300, 480);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '500 22px "Outfit", sans-serif';
    ctx.fillText(artist, 300, 520);

    return canvas.toDataURL('image/jpeg', 0.9);
  }

  /**
   * Synthesizes an AudioBuffer with soothing harmonic chords, rhythm and lead melody
   */
  synthesizeAudio(audioCtx, style = 'chill', durationSeconds = 30) {
    const sampleRate = audioCtx.sampleRate;
    const numFrames = sampleRate * durationSeconds;
    const buffer = audioCtx.createBuffer(2, numFrames, sampleRate);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    // Chord progressions frequencies (Root notes)
    let chordProg = [220, 261.63, 329.63, 196]; // Am - C - Em - G
    let bpm = 110;
    if (style === 'synthwave') {
      chordProg = [146.83, 174.61, 220.00, 130.81]; // Dm - F - A - C
      bpm = 120;
    } else if (style === 'khmer') {
      chordProg = [261.63, 293.66, 329.63, 392.00]; // Pentatonic scales
      bpm = 95;
    } else if (style === 'edm') {
      chordProg = [110, 130.81, 146.83, 164.81]; // A - C - D - E
      bpm = 128;
    }

    const beatInterval = 60 / bpm;
    const barDuration = beatInterval * 4;

    for (let i = 0; i < numFrames; i++) {
      const t = i / sampleRate;
      const currentBar = Math.floor(t / barDuration) % chordProg.length;
      const baseFreq = chordProg[currentBar];

      // Bass sub oscillator
      const bassFreq = baseFreq / 2;
      const bassEnv = Math.exp(-((t % beatInterval) * 4));
      const bass = Math.sin(2 * Math.PI * bassFreq * t) * 0.25 * (0.4 + 0.6 * bassEnv);

      // Chords pad (Polyphonic harmonic lush sound)
      const pad = (
        Math.sin(2 * Math.PI * baseFreq * t) +
        Math.sin(2 * Math.PI * (baseFreq * 1.25) * t) * 0.7 +
        Math.sin(2 * Math.PI * (baseFreq * 1.5) * t) * 0.8 +
        Math.sin(2 * Math.PI * (baseFreq * 2.0) * t) * 0.4
      ) * 0.12;

      // Arpeggio Melody
      const arpStep = Math.floor((t % barDuration) / (beatInterval / 2)) % 8;
      const arpFreqs = [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 1.8, baseFreq * 2.0, baseFreq * 1.5, baseFreq * 1.25, baseFreq * 2.2];
      const arpFreq = arpFreqs[arpStep];
      const arpEnv = Math.exp(-((t % (beatInterval / 2)) * 8));
      const melody = Math.sin(2 * Math.PI * arpFreq * t) * 0.18 * arpEnv;

      // Rhythm / Percussion (Kick & Hi-hat noise burst)
      const kickT = t % beatInterval;
      const kickFreq = 120 * Math.exp(-kickT * 30) + 40;
      const kick = Math.sin(2 * Math.PI * kickFreq * kickT) * Math.exp(-kickT * 10) * 0.35;

      const hatT = t % (beatInterval / 2);
      const noise = (Math.random() * 2 - 1) * Math.exp(-hatT * 40) * 0.08;

      // Stereo mix
      const sample = (bass + pad + melody + kick + noise) * 0.85;
      left[i] = sample * (1 + 0.1 * Math.sin(t * 2));
      right[i] = sample * (1 - 0.1 * Math.sin(t * 2));
    }

    return buffer;
  }

  /**
   * Prepares initial sample album tracklist
   */
  getInitialDemoTracks() {
    return [
      {
        id: 'track_1',
        title: 'រាត្រីផ្កាយរះ (Starry Night)',
        artist: 'Sinn Sisamouth & Ros Sereysothea',
        album: 'Khmer Golden Classics Album Vol. 1',
        duration: 32,
        coverUrl: this.generateCoverArt('រាត្រីផ្កាយរះ', 'Sinn Sisamouth', '#1e1b4b', '#4338ca', 'circle'),
        style: 'khmer',
        audioBuffer: null,
        audioUrl: null,
        lyrics: [
          { time: 0, text: '🎵 ភ្លេងចង្វាក់រាត្រីផ្កាយរះ...' },
          { time: 4, text: 'រាត្រីស្ងប់ស្ងាត់ ផ្កាយរះពេញមេឃ...' },
          { time: 10, text: 'ខ្យល់បក់រំភើយ បបោសអង្អែលដួងចិត្ត...' },
          { time: 18, text: 'ចងចាំគ្រាដែលយើងជួបគ្នា...' },
          { time: 25, text: 'សម្លេងតន្ត្រីបំពេរដួងចិត្តជានិច្ច 💖' }
        ]
      },
      {
        id: 'track_2',
        title: 'Cyberpunk Neon Dream',
        artist: 'Antigravity Synthwave Lab',
        album: 'Future City Album 2026',
        duration: 30,
        coverUrl: this.generateCoverArt('Cyberpunk Neon', 'Synthwave Lab', '#0f172a', '#ec4899', 'cyber'),
        style: 'synthwave',
        audioBuffer: null,
        audioUrl: null,
        lyrics: [
          { time: 0, text: '⚡ Synthwave Bassline Initializing...' },
          { time: 6, text: 'Driving down the glowing neon highway' },
          { time: 14, text: 'Cyberpunk retro waves in 4K resolution' },
          { time: 22, text: 'Feel the electronic pulse in your soul' }
        ]
      },
      {
        id: 'track_3',
        title: 'ស្រមោលស្នេហ៍ (Lo-Fi Acoustic)',
        artist: 'Acoustic Vibes Cambodia',
        album: 'Acoustic Chillout Vibes',
        duration: 28,
        coverUrl: this.generateCoverArt('ស្រមោលស្នេហ៍', 'Acoustic Vibes', '#78350f', '#d97706', 'waves'),
        style: 'chill',
        audioBuffer: null,
        audioUrl: null,
        lyrics: [
          { time: 0, text: '🎸 បន្លឺសំឡេងហ្គីតាកម្សាន្ត...' },
          { time: 5, text: 'ស្រមោលស្នេហ៍ដែលមិនអាចបំភ្លេចបាន' },
          { time: 12, text: 'អង្គុយក្បែរបង្អួចមើលដំណក់ទឹកភ្លៀង' },
          { time: 20, text: 'បេះដូងនៅតែនឹកដល់អនុស្សាវរីយ៍ចាស់' }
        ]
      },
      {
        id: 'track_4',
        title: 'Bass Explosion Festival (EDM)',
        artist: 'DJ Skyline & Royal Beats',
        album: 'Bass Nation Live 2026',
        duration: 30,
        coverUrl: this.generateCoverArt('Bass Explosion', 'DJ Skyline', '#064e3b', '#06b6d4', 'gold'),
        style: 'edm',
        audioBuffer: null,
        audioUrl: null,
        lyrics: [
          { time: 0, text: '🔥 Are you ready for the ultimate drop?!' },
          { time: 7, text: '3... 2... 1... LET THE BASS KICK!' },
          { time: 15, text: 'Feel the subwoofer vibration shaking the ground!' },
          { time: 24, text: 'Non-stop EDM Album Experience' }
        ]
      }
    ];
  }
}

// Export singleton instance
window.demoDataManager = new DemoDataManager();
