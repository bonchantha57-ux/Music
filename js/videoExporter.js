/**
 * ALBUM STUDIO PRO - VIDEO EXPORTER & DOWNLOAD ENGINE
 * Records high-bitrate Full HD / 4K videos from Canvas stream & Web Audio API destination with real-time progress.
 */

class VideoExporter {
  constructor(visualizerEngine, audioEngine) {
    this.visualizer = visualizerEngine;
    this.audioEngine = audioEngine;
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.isExporting = false;
    this.isCancelled = false;

    // Callbacks
    this.onProgress = null; // ({ percent, currentTrack, totalTracks, elapsed, remaining })
    this.onComplete = null; // ({ blob, url, filename })
    this.onError = null;
  }

  /**
   * Starts video export for single track or full album
   */
  async exportVideo(options = {}) {
    const {
      mode = 'current', // 'current' or 'full_album'
      resolution = '1080p', // '720p', '1080p', '4k'
      fps = 30,
      bitrate = 12000000 // 12 Mbps
    } = options;

    if (this.isExporting) return;
    this.isExporting = true;
    this.isCancelled = false;
    this.recordedChunks = [];

    const tracksToExport = mode === 'full_album' 
      ? [...this.audioEngine.playlist]
      : [this.audioEngine.getCurrentTrack() || this.audioEngine.playlist[0]];

    if (!tracksToExport.length || !tracksToExport[0]) {
      this.isExporting = false;
      throw new Error('No tracks available to export');
    }

    // Set resolution dimensions
    const originalWidth = this.visualizer.config.width;
    const originalHeight = this.visualizer.config.height;

    let targetW = originalWidth;
    let targetH = originalHeight;
    if (resolution === '720p') {
      targetW = Math.round(originalWidth * 0.666);
      targetH = Math.round(originalHeight * 0.666);
    } else if (resolution === '4k') {
      targetW = Math.round(originalWidth * 2);
      targetH = Math.round(originalHeight * 2);
    }

    this.visualizer.canvas.width = targetW;
    this.visualizer.canvas.height = targetH;

    // Capture Canvas Video Stream
    const canvasStream = this.visualizer.canvas.captureStream(fps);
    const audioStream = this.audioEngine.streamDest.stream;

    // Combine video & audio tracks
    const combinedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...audioStream.getAudioTracks()
    ]);

    // Choose supported MIME type
    let mimeType = 'video/webm;codecs=vp9,opus';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm;codecs=vp8,opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }
    }

    try {
      this.mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: mimeType,
        videoBitsPerSecond: bitrate
      });
    } catch (e) {
      console.warn('Fallback to default MediaRecorder options:', e);
      this.mediaRecorder = new MediaRecorder(combinedStream);
    }

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        this.recordedChunks.push(e.data);
      }
    };

    // Calculate total duration
    const totalDuration = tracksToExport.reduce((acc, t) => acc + (t.duration || 30), 0);
    let totalElapsedSeconds = 0;
    const startTime = Date.now();

    this.mediaRecorder.start(1000); // 1s slice

    // Sequentially play and record each track
    for (let trackIdx = 0; trackIdx < tracksToExport.length; trackIdx++) {
      if (this.isCancelled) break;

      const track = tracksToExport[trackIdx];
      const trackDuration = track.duration || 30;

      // Find original index in playlist
      const originalIdx = this.audioEngine.playlist.findIndex(p => p.id === track.id);
      await this.audioEngine.loadTrack(originalIdx >= 0 ? originalIdx : 0, true);

      // Track progress timer
      let trackElapsed = 0;
      while (trackElapsed < trackDuration && !this.isCancelled && this.audioEngine.isPlaying) {
        await new Promise(r => setTimeout(r, 250));
        trackElapsed += 0.25;
        totalElapsedSeconds += 0.25;

        const percent = Math.min(99, Math.round((totalElapsedSeconds / totalDuration) * 100));
        const realElapsed = (Date.now() - startTime) / 1000;
        const estTotal = (realElapsed / (percent / 100));
        const remaining = Math.max(0, estTotal - realElapsed);

        if (this.onProgress) {
          this.onProgress({
            percent,
            currentTrackIndex: trackIdx + 1,
            totalTracks: tracksToExport.length,
            currentTrackName: track.title,
            elapsed: Math.round(realElapsed),
            remaining: Math.round(remaining)
          });
        }
      }
    }

    this.audioEngine.pause();

    // Finish recording
    return new Promise((resolve, reject) => {
      this.mediaRecorder.onstop = () => {
        // Restore original canvas dimensions
        this.visualizer.canvas.width = originalWidth;
        this.visualizer.canvas.height = originalHeight;
        this.isExporting = false;

        if (this.isCancelled) {
          resolve(null);
          return;
        }

        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        const albumName = tracksToExport[0]?.album || 'Album';
        const filename = `${albumName.replace(/[^a-zA-Z0-9_\u1780-\u17FF]/g, '_')}_${resolution}_${Date.now()}.webm`;

        // Trigger instant download
        this.downloadFile(videoUrl, filename);

        if (this.onComplete) {
          this.onComplete({ blob, url: videoUrl, filename });
        }
        resolve({ blob, url: videoUrl, filename });
      };

      if (this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
      }
    });
  }

  cancelExport() {
    this.isCancelled = true;
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    this.audioEngine.pause();
    this.isExporting = false;
  }

  downloadFile(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
    }, 200);
  }
}

window.VideoExporter = VideoExporter;
