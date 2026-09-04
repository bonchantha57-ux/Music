/**
 * ALBUM STUDIO PRO - AUDIO ENGINE & SEQUENTIAL PLAYER
 * Manages Web Audio API graph, analyser frequency data, audio nodes and continuous album sequencing.
 */

class AudioEngine {
  constructor() {
    this.audioCtx = null;
    this.analyser = null;
    this.masterGain = null;
    this.streamDest = null;
    this.sourceNode = null;
    this.audioElement = new Audio();
    this.audioElement.crossOrigin = 'anonymous';

    this.playlist = [];
    this.currentTrackIndex = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.playbackMode = 'sequence'; // 'sequence' (auto-next), 'repeat-all', 'repeat-one', 'shuffle'
    this.crossfadeDuration = 1.0; // 1s crossfade

    // Data arrays for visualizer
    this.frequencyData = null;
    this.timeDomainData = null;

    // Callbacks
    this.onTrackChange = null;
    this.onProgress = null;
    this.onStateChange = null;
    this.onPlaylistUpdate = null;

    this.initAudioElementEvents();
  }

  /**
   * Initializes Web Audio Context upon user interaction
   */
  initContext() {
    if (this.audioCtx) {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContextClass();

    // Setup Analyser
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 1024;
    this.analyser.smoothingTimeConstant = 0.82;
    this.analyser.minDecibels = -90;
    this.analyser.maxDecibels = -10;

    const bufferLength = this.analyser.frequencyBinCount;
    this.frequencyData = new Uint8Array(bufferLength);
    this.timeDomainData = new Uint8Array(bufferLength);

    // Setup Gain node
    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.setValueAtTime(0.9, this.audioCtx.currentTime);

    // Setup MediaStreamDestination for video recording
    this.streamDest = this.audioCtx.createMediaStreamDestination();

    // Connect nodes
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.audioCtx.destination);
    this.analyser.connect(this.streamDest);

    // Connect HTML5 Audio Element to Web Audio graph
    const elemSource = this.audioCtx.createMediaElementSource(this.audioElement);
    elemSource.connect(this.masterGain);
  }

  initAudioElementEvents() {
    this.audioElement.addEventListener('timeupdate', () => {
      if (this.onProgress) {
        this.onProgress({
          currentTime: this.audioElement.currentTime,
          duration: this.audioElement.duration || 0,
          progress: this.audioElement.duration ? (this.audioElement.currentTime / this.audioElement.duration) : 0
        });
      }
    });

    this.audioElement.addEventListener('ended', () => {
      this.handleTrackEnded();
    });

    this.audioElement.addEventListener('play', () => {
      this.isPlaying = true;
      this.isPaused = false;
      if (this.onStateChange) this.onStateChange(true);
    });

    this.audioElement.addEventListener('pause', () => {
      this.isPlaying = false;
      this.isPaused = true;
      if (this.onStateChange) this.onStateChange(false);
    });
  }

  /**
   * Sets playlist tracks
   */
  setPlaylist(tracks) {
    this.playlist = tracks;
    if (this.onPlaylistUpdate) {
      this.onPlaylistUpdate(this.playlist);
    }
  }

  getCurrentTrack() {
    if (this.playlist.length === 0) return null;
    return this.playlist[this.currentTrackIndex] || null;
  }

  /**
   * Loads a specific track index
   */
  async loadTrack(index, autoPlay = true) {
    if (index < 0 || index >= this.playlist.length) return;
    this.initContext();

    this.currentTrackIndex = index;
    const track = this.playlist[index];

    // Check if track has a synth buffer or blob url
    if (!track.audioUrl && track.audioBuffer) {
      // Audio buffer directly available
      track.audioUrl = this.audioBufferToWavUrl(track.audioBuffer);
    } else if (!track.audioUrl && !track.audioBuffer && window.demoDataManager) {
      // Synthesize demo track on the fly
      track.audioBuffer = window.demoDataManager.synthesizeAudio(this.audioCtx, track.style || 'chill', track.duration || 30);
      track.audioUrl = this.audioBufferToWavUrl(track.audioBuffer);
    }

    if (track.audioUrl) {
      this.audioElement.src = track.audioUrl;
      this.audioElement.load();
      if (autoPlay) {
        try {
          await this.audioElement.play();
        } catch (e) {
          console.warn('Playback autoplay prevented:', e);
        }
      }
    }

    if (this.onTrackChange) {
      this.onTrackChange(track, this.currentTrackIndex);
    }
  }

  async play() {
    this.initContext();
    if (this.playlist.length === 0) return;

    if (!this.audioElement.src || this.audioElement.src === '') {
      await this.loadTrack(this.currentTrackIndex, true);
    } else {
      await this.audioElement.play();
    }
  }

  pause() {
    this.audioElement.pause();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  nextTrack() {
    if (this.playlist.length === 0) return;
    let nextIndex;
    if (this.playbackMode === 'shuffle') {
      nextIndex = Math.floor(Math.random() * this.playlist.length);
    } else {
      nextIndex = (this.currentTrackIndex + 1) % this.playlist.length;
    }
    this.loadTrack(nextIndex, true);
  }

  prevTrack() {
    if (this.playlist.length === 0) return;
    if (this.audioElement.currentTime > 3) {
      this.seek(0);
      return;
    }
    const prevIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
    this.loadTrack(prevIndex, true);
  }

  seek(seconds) {
    if (this.audioElement.duration) {
      this.audioElement.currentTime = Math.max(0, Math.min(seconds, this.audioElement.duration));
    }
  }

  seekPercentage(percent) {
    if (this.audioElement.duration) {
      this.audioElement.currentTime = (percent / 100) * this.audioElement.duration;
    }
  }

  setVolume(level) {
    this.initContext();
    const clamped = Math.max(0, Math.min(1, level));
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(clamped, this.audioCtx.currentTime);
    }
    this.audioElement.volume = clamped;
  }

  setPlaybackMode(mode) {
    this.playbackMode = mode;
  }

  handleTrackEnded() {
    if (this.playbackMode === 'repeat-one') {
      this.seek(0);
      this.play();
    } else if (this.playbackMode === 'repeat-all') {
      this.nextTrack();
    } else if (this.playbackMode === 'shuffle') {
      this.nextTrack();
    } else {
      // Sequence mode: Play next if not last track
      if (this.currentTrackIndex < this.playlist.length - 1) {
        this.nextTrack();
      } else {
        this.isPlaying = false;
        if (this.onStateChange) this.onStateChange(false);
      }
    }
  }

  /**
   * Extracts real-time frequency and waveform analysis metrics
   */
  getAudioAnalysis() {
    if (!this.analyser) {
      return {
        frequencyData: new Uint8Array(64),
        timeDomainData: new Uint8Array(64),
        bass: 0,
        mid: 0,
        treble: 0,
        averageVolume: 0
      };
    }

    this.analyser.getByteFrequencyData(this.frequencyData);
    this.analyser.getByteTimeDomainData(this.timeDomainData);

    const length = this.frequencyData.length;
    let bassSum = 0, midSum = 0, trebleSum = 0, totalSum = 0;

    const bassEnd = Math.floor(length * 0.12);
    const midEnd = Math.floor(length * 0.5);

    for (let i = 0; i < length; i++) {
      const val = this.frequencyData[i];
      totalSum += val;
      if (i < bassEnd) bassSum += val;
      else if (i < midEnd) midSum += val;
      else trebleSum += val;
    }

    return {
      frequencyData: this.frequencyData,
      timeDomainData: this.timeDomainData,
      bass: bassEnd > 0 ? (bassSum / bassEnd) / 255 : 0,
      mid: (midEnd - bassEnd) > 0 ? (midSum / (midEnd - bassEnd)) / 255 : 0,
      treble: (length - midEnd) > 0 ? (trebleSum / (length - midEnd)) / 255 : 0,
      averageVolume: (totalSum / length) / 255
    };
  }

  /**
   * Helper to convert an AudioBuffer to an in-memory WAV Blob URL
   */
  audioBufferToWavUrl(buffer) {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const out = new DataView(new ArrayBuffer(length));
    const channels = [];
    let sample = 0;
    let offset = 0;
    let pos = 0;

    // WAV Header
    function writeString(str) {
      for (let i = 0; i < str.length; i++) {
        out.setUint8(pos++, str.charCodeAt(i));
      }
    }

    writeString('RIFF');
    out.setUint32(pos, length - 8, true); pos += 4;
    writeString('WAVE');
    writeString('fmt ');
    out.setUint32(pos, 16, true); pos += 4; // SubChunk1Size (16 for PCM)
    out.setUint16(pos, 1, true); pos += 2;  // AudioFormat (1 for PCM)
    out.setUint16(pos, numOfChan, true); pos += 2;
    out.setUint32(pos, buffer.sampleRate, true); pos += 4;
    out.setUint32(pos, buffer.sampleRate * 2 * numOfChan, true); pos += 4; // ByteRate
    out.setUint16(pos, numOfChan * 2, true); pos += 2; // BlockAlign
    out.setUint16(pos, 16, true); pos += 2; // BitsPerSample
    writeString('data');
    out.setUint32(pos, length - pos - 4, true); pos += 4;

    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    while (offset < buffer.length) {
      for (let i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
        out.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    const blob = new Blob([out.buffer], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  }
}

// Global instance
window.audioEngine = new AudioEngine();
