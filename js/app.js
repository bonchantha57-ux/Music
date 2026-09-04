/**
 * ALBUM STUDIO PRO - MAIN APPLICATION CONTROLLER
 * Glues together UI events, drag & drop, 110+ presets, custom cover uploads, background image uploads, and tracklist overlay.
 */

const I18N = {
  kh: {
    appTitle: 'Album Studio Pro',
    appSubtitle: 'កម្មវិធីបង្កើត Album & Video ចាក់តៗគ្នា',
    tabPresets: '🎨 Presets (110+)',
    tabTracks: '🎵 បញ្ជីបទចម្រៀង',
    tabTypography: '✍️ អក្សរ & Typography',
    tabVisualizer: '⚡ Visualizer & ថាស',
    tabBackground: '🌌 ផ្ទៃខាងក្រោយ',
    btnExport: '🎬 ទាញយក Video',
    btnPlayAll: '▶️ ចាក់ចម្រៀងទាំងអស់',
    dropzoneTitle: 'ទម្លាក់ File ចម្រៀង (MP3, WAV, OGG) នៅទីនេះ',
    dropzoneDesc: 'ឬចុចដើម្បីជ្រើសរើស File ពីកុំព្យូទ័ររបស់អ្នក',
    modalExportTitle: '🎬 ជម្រើស Render & ទាញយក Video',
    exportModeLabel: 'ជម្រើសបទដែលត្រូវ Render',
    exportModeCurrent: 'តែបទកំពុងចាក់ (Current Song)',
    exportModeAlbum: 'បទទាំងអស់ក្នុង Album (Full Continuous Album)',
    resolutionLabel: 'កម្រិតច្បាស់ Video (Resolution)',
    fpsLabel: 'ល្បឿន Frame (FPS)',
    btnStartExport: '🚀 ចាប់ផ្តើម Render & ទាញយក',
    btnCancelExport: 'បោះបង់',
    tracklistEmpty: 'មិនទាន់មានបទចម្រៀងនៅឡើយទេ'
  },
  en: {
    appTitle: 'Album Studio Pro',
    appSubtitle: 'Album Player & Sequential Video Generator',
    tabPresets: '🎨 Presets (110+)',
    tabTracks: '🎵 Tracklist Manager',
    tabTypography: '✍️ Text & Typography',
    tabVisualizer: '⚡ Visualizer & Disc',
    tabBackground: '🌌 Background & FX',
    btnExport: '🎬 Export Video',
    btnPlayAll: '▶️ Play Full Album',
    dropzoneTitle: 'Drag & Drop Audio Files (MP3, WAV, OGG) Here',
    dropzoneDesc: 'Or click to browse from your device',
    modalExportTitle: '🎬 Video Render & Download Studio',
    exportModeLabel: 'Export Scope',
    exportModeCurrent: 'Current Playing Song Only',
    exportModeAlbum: 'Entire Album in Sequence (Continuous)',
    resolutionLabel: 'Video Resolution',
    fpsLabel: 'Frame Rate (FPS)',
    btnStartExport: '🚀 Start Render & Download',
    btnCancelExport: 'Cancel',
    tracklistEmpty: 'No tracks in album yet'
  }
};

function cleanTrackTitle(rawTitle) {
  if (!rawTitle) return 'Untitled Track';
  let title = rawTitle
    .replace(/\.[^/.]+$/, '') // remove extension if any
    .replace(/\(online-audio-converter\.com\)/gi, '')
    .replace(/\(audio-joiner\.com\)/gi, '')
    .replace(/\(320kbps\)/gi, '')
    .replace(/\(128kbps\)/gi, '')
    .replace(/\(256kbps\)/gi, '')
    .replace(/\(mp3\)/gi, '')
    .replace(/\(wav\)/gi, '')
    .replace(/\[\s*(official\s*(audio|video|music\s*video|lyric\s*video|mv)?)\s*\]/gi, '')
    .replace(/\(\s*(official\s*(audio|video|music\s*video|lyric\s*video|mv)?)\s*\)/gi, '')
    .replace(/\[\s*(audio|video|lyrics|hd|4k|hq|remix|full\s*album)\s*\]/gi, '')
    .replace(/\(\s*(audio|video|lyrics|hd|4k|hq|remix|full\s*album)\s*\)/gi, '')
    .replace(/_{1,}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return title || 'Untitled Track';
}

class AppController {
  constructor() {
    this.currentLang = 'kh';
    this.currentCategory = 'all';
    this.searchQuery = '';
    this.audioEngine = window.audioEngine;
    this.canvas = document.getElementById('previewCanvas');
    this.visualizer = new window.VisualizerEngine(this.canvas);
    this.exporter = new window.VideoExporter(this.visualizer, this.audioEngine);

    this.init();
  }

  async init() {
    const demoTracks = window.demoDataManager.getInitialDemoTracks();
    this.audioEngine.setPlaylist(demoTracks);
    this.visualizer.setTrack(demoTracks[0]);

    this.renderCategoryPills();
    this.renderPresetsGrid();

    // Default preset
    if (window.STUDIO_PRESETS.length > 0) {
      this.visualizer.applyPreset(window.STUDIO_PRESETS[0]);
    }

    this.renderTracklist();
    this.setupEventListeners();
    this.setupAudioCallbacks();
    this.setupTypographyControls();
    this.setupVisualizerControls();
    this.setupBackgroundControls();
    this.setupCustomImageUploads();
    this.setupLogoOverlayControls();

    this.visualizer.start();
    this.updateLanguageUI();
    this.syncControlsWithConfig();
  }

  renderCategoryPills() {
    const nav = document.getElementById('presetCategoryNav');
    if (!nav || !window.PRESET_CATEGORIES) return;

    nav.innerHTML = '';
    window.PRESET_CATEGORIES.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `category-pill ${cat.id === this.currentCategory ? 'active' : ''}`;
      btn.innerText = this.currentLang === 'kh' ? cat.name : cat.nameEn;
      btn.dataset.category = cat.id;

      btn.addEventListener('click', () => {
        document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        this.currentCategory = cat.id;
        this.renderPresetsGrid();
      });

      nav.appendChild(btn);
    });
  }

  renderPresetsGrid() {
    const grid = document.getElementById('presetsGrid');
    const badge = document.getElementById('presetsCountBadge');
    if (!grid) return;

    grid.innerHTML = '';

    let filtered = window.STUDIO_PRESETS.filter(p => {
      const matchCat = this.currentCategory === 'all' || p.category === this.currentCategory;
      const query = this.searchQuery.toLowerCase().trim();
      const matchQuery = !query || 
        p.name.toLowerCase().includes(query) || 
        (p.nameKh && p.nameKh.toLowerCase().includes(query)) ||
        (p.tag && p.tag.toLowerCase().includes(query));
      return matchCat && matchQuery;
    });

    if (badge) {
      badge.innerText = `${filtered.length} / ${window.STUDIO_PRESETS.length} Styles`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 30px; color: var(--text-muted); font-size: 0.85rem;">
        🔍 មិនមាន Style ត្រូវនឹងពាក្យស្វែងរក "${this.searchQuery}" ទេ
      </div>`;
      return;
    }

    filtered.forEach((preset) => {
      const isActive = this.visualizer.config.presetId === preset.id;
      const card = document.createElement('div');
      card.className = `preset-card ${isActive ? 'active' : ''}`;
      card.dataset.presetId = preset.id;
      
      card.style.background = `linear-gradient(135deg, ${preset.background.primaryColor || '#111'}, ${preset.background.secondaryColor || '#4338ca'})`;

      card.innerHTML = `
        <span class="preset-card-title">${this.currentLang === 'kh' ? (preset.nameKh || preset.name) : preset.name}</span>
        <span class="preset-card-tag">${preset.tag || ''}</span>
      `;

      card.addEventListener('click', () => {
        document.querySelectorAll('.preset-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        this.visualizer.applyPreset(preset);
        this.syncControlsWithConfig();
      });

      grid.appendChild(card);
    });
  }

  renderTracklist() {
    const container = document.getElementById('tracklistContainer');
    if (!container) return;

    container.innerHTML = '';
    const tracks = this.audioEngine.playlist;

    tracks.forEach((track, index) => {
      const isPlaying = this.audioEngine.currentTrackIndex === index;
      const item = document.createElement('div');
      item.className = `track-item ${isPlaying ? 'playing' : ''}`;
      item.draggable = true;
      item.dataset.index = index;

      const durMins = Math.floor((track.duration || 30) / 60);
      const durSecs = Math.floor((track.duration || 30) % 60).toString().padStart(2, '0');

      item.innerHTML = `
        <div class="track-index-drag">
          <span class="track-drag-handle">⠿</span>
          <span>${(index + 1).toString().padStart(2, '0')}</span>
        </div>
        <img class="track-cover-thumb" src="${track.coverUrl || ''}" alt="Cover" />
        <div class="track-info-col">
          <span class="track-title">${track.title}</span>
          <span class="track-artist">${track.artist}</span>
        </div>
        <span class="track-duration">${durMins}:${durSecs}</span>
        <div class="track-actions">
          <button class="track-btn-icon play-track" title="Play Track">
            ${isPlaying && this.audioEngine.isPlaying ? '⏸' : '▶'}
          </button>
          <button class="track-btn-icon edit-track" title="Edit Metadata">✏️</button>
          <button class="track-btn-icon delete delete-track" title="Remove Track">✕</button>
        </div>
      `;

      item.querySelector('.play-track').addEventListener('click', (e) => {
        e.stopPropagation();
        if (isPlaying && this.audioEngine.isPlaying) {
          this.audioEngine.pause();
        } else {
          this.audioEngine.loadTrack(index, true);
        }
      });

      item.querySelector('.edit-track').addEventListener('click', (e) => {
        e.stopPropagation();
        this.openEditTrackModal(track, index);
      });

      item.querySelector('.delete-track').addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteTrack(index);
      });

      item.addEventListener('click', () => {
        this.audioEngine.loadTrack(index, true);
      });

      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', index);
        item.classList.add('dragging');
      });

      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
      });

      item.addEventListener('dragover', (e) => {
        e.preventDefault();
      });

      item.addEventListener('drop', (e) => {
        e.preventDefault();
        const fromIdx = parseInt(e.dataTransfer.getData('text/plain'), 10);
        const toIdx = index;
        if (fromIdx !== toIdx) {
          const movedTrack = this.audioEngine.playlist.splice(fromIdx, 1)[0];
          this.audioEngine.playlist.splice(toIdx, 0, movedTrack);
          if (this.audioEngine.currentTrackIndex === fromIdx) {
            this.audioEngine.currentTrackIndex = toIdx;
          }
          this.renderTracklist();
        }
      });

      container.appendChild(item);
    });
  }

  deleteTrack(index) {
    if (this.audioEngine.playlist.length <= 1) {
      alert('Album ត្រូវតែមានយ៉ាងហោចណាស់ ១ បទ!');
      return;
    }
    this.audioEngine.playlist.splice(index, 1);
    if (this.audioEngine.currentTrackIndex >= this.audioEngine.playlist.length) {
      this.audioEngine.currentTrackIndex = 0;
    }
    this.renderTracklist();
  }

  openEditTrackModal(track, index) {
    const modal = document.getElementById('editTrackModal');
    if (!modal) return;

    const titleInput = document.getElementById('editTrackTitle');
    const artistInput = document.getElementById('editTrackArtist');
    const albumInput = document.getElementById('editTrackAlbum');
    const lyricsInput = document.getElementById('editTrackLyrics');
    const coverPreview = document.getElementById('editTrackCoverPreview');
    const coverInput = document.getElementById('editTrackCoverInput');
    const applyAllCoverCheckbox = document.getElementById('editApplyCoverToAllCheckbox');

    if (titleInput) titleInput.value = track.title || '';
    if (artistInput) artistInput.value = track.artist || '';
    if (albumInput) albumInput.value = track.album || '';
    if (coverPreview) coverPreview.src = track.coverUrl || 'assets/bct_music_logo.jpg';
    if (applyAllCoverCheckbox) applyAllCoverCheckbox.checked = false;
    
    const lyricsText = track.lyrics ? track.lyrics.map(l => `[${l.time}] ${l.text}`).join('\n') : '';
    if (lyricsInput) lyricsInput.value = lyricsText;

    modal.classList.add('open');

    // Clean tags button
    const cleanBtn = document.getElementById('cleanTitleTagBtn');
    if (cleanBtn) {
      cleanBtn.onclick = () => {
        if (titleInput) {
          titleInput.value = cleanTrackTitle(titleInput.value);
        }
      };
    }

    let uploadedCoverUrl = null;
    if (coverInput) {
      coverInput.value = '';
      coverInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            uploadedCoverUrl = ev.target.result;
            if (coverPreview) coverPreview.src = uploadedCoverUrl;
          };
          reader.readAsDataURL(file);
        }
      };
    }

    const saveBtn = document.getElementById('saveTrackEditBtn');
    if (saveBtn) {
      saveBtn.onclick = () => {
        const newTitle = titleInput ? titleInput.value.trim() : track.title;
        const newArtist = artistInput ? artistInput.value.trim() : track.artist;
        const newAlbum = albumInput ? albumInput.value.trim() : track.album;

        track.title = newTitle || 'Untitled Track';
        track.artist = newArtist || 'Unknown Artist';
        track.album = newAlbum || '';
        
        if (uploadedCoverUrl) {
          track.coverUrl = uploadedCoverUrl;
          if (applyAllCoverCheckbox && applyAllCoverCheckbox.checked) {
            this.audioEngine.playlist.forEach(t => t.coverUrl = uploadedCoverUrl);
            this.visualizer.setCustomCoverImage(uploadedCoverUrl);
          }
        }

        if (lyricsInput) {
          const rawLyrics = lyricsInput.value.split('\n');
          track.lyrics = [];
          rawLyrics.forEach(line => {
            const match = line.match(/\[(\d+)\]\s*(.*)/);
            if (match) {
              track.lyrics.push({ time: parseInt(match[1], 10), text: match[2] });
            } else if (line.trim().length > 0) {
              track.lyrics.push({ time: 0, text: line.trim() });
            }
          });
        }

        // Update in playlist
        this.audioEngine.playlist[index] = track;

        // If this is currently active track, update visualizer & bottom bar immediately
        if (this.audioEngine.currentTrackIndex === index) {
          this.visualizer.setTrack(track);
          this.updateNowPlayingUI(track);
        }

        this.renderTracklist();
        modal.classList.remove('open');
      };
    }

    // Close handlers
    const cancelBtn = document.getElementById('cancelEditModalBtn');
    if (cancelBtn) cancelBtn.onclick = () => modal.classList.remove('open');
    const closeBtn = document.getElementById('closeEditModalBtn');
    if (closeBtn) closeBtn.onclick = () => modal.classList.remove('open');

    // Close on backdrop click
    modal.onclick = (e) => {
      if (e.target === modal) modal.classList.remove('open');
    };
  }

  setupAudioCallbacks() {
    this.audioEngine.onTrackChange = (track, index) => {
      this.visualizer.setTrack(track);
      this.updateNowPlayingUI(track);
      this.renderTracklist();
    };

    this.audioEngine.onProgress = ({ currentTime, duration, progress }) => {
      const curStamp = document.getElementById('currentTimeStamp');
      const durStamp = document.getElementById('durationTimeStamp');
      const progressBar = document.getElementById('playerProgressBar');

      if (curStamp) {
        const m = Math.floor(currentTime / 60);
        const s = Math.floor(currentTime % 60).toString().padStart(2, '0');
        curStamp.innerText = `${m}:${s}`;
      }
      if (durStamp && duration) {
        const m = Math.floor(duration / 60);
        const s = Math.floor(duration % 60).toString().padStart(2, '0');
        durStamp.innerText = `${m}:${s}`;
      }
      if (progressBar) {
        const pct = Math.min(100, Math.max(0, (progress * 100) || 0));
        progressBar.value = pct;
        progressBar.style.background = `linear-gradient(to right, #6366f1 0%, #ec4899 ${pct}%, rgba(255,255,255,0.12) ${pct}%, rgba(255,255,255,0.12) 100%)`;
      }
    };

    this.audioEngine.onStateChange = (isPlaying) => {
      const playIcon = document.getElementById('playPauseIcon');
      const eqBars = document.getElementById('miniEqBars');
      if (playIcon) {
        playIcon.innerHTML = isPlaying 
          ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>'
          : '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>';
      }
      if (eqBars) {
        if (isPlaying) {
          eqBars.classList.remove('paused');
        } else {
          eqBars.classList.add('paused');
        }
      }
      this.renderTracklist();
    };
  }

  updateNowPlayingUI(track) {
    if (!track) return;
    const titleElem = document.getElementById('nowPlayingTitle');
    const artistElem = document.getElementById('nowPlayingArtist');
    const artElem = document.getElementById('nowPlayingArt');

    if (titleElem) titleElem.innerText = track.title;
    if (artistElem) artistElem.innerText = track.artist;
    if (artElem && track.coverUrl) artElem.src = track.coverUrl;
  }

  setupEventListeners() {
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPanel = document.getElementById(btn.dataset.tab);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });

    const ratioLabels = {
      '16:9': '16:9 YouTube',
      '9:16': '9:16 TikTok / Reels',
      '1:1': '1:1 Instagram',
      '4:5': '4:5 Portrait Feed'
    };

    document.querySelectorAll('.ratio-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.ratio-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const ratioKey = btn.dataset.ratio;
        this.visualizer.setAspectRatio(ratioKey);
        const ratioBadge = document.getElementById('bottomRatioBadge');
        if (ratioBadge) {
          ratioBadge.innerText = ratioLabels[ratioKey] || ratioKey;
        }
        this.syncControlsWithConfig();
      });
    });

    document.getElementById('presetSearchInput')?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.renderPresetsGrid();
    });

    document.getElementById('randomStyleBtn')?.addEventListener('click', () => {
      const randomPreset = window.generateRandomPreset();
      this.visualizer.applyPreset(randomPreset);
      this.syncControlsWithConfig();
      alert(`🎉 បានបង្កើត ${randomPreset.name} (Font: ${randomPreset.typography.titleFont}, Visualizer: ${randomPreset.visualizer.type}, Artwork: ${randomPreset.artwork.type})!`);
    });

    document.getElementById('playPauseBtn')?.addEventListener('click', () => {
      this.audioEngine.togglePlay();
    });

    document.getElementById('nextTrackBtn')?.addEventListener('click', () => {
      this.audioEngine.nextTrack();
    });

    document.getElementById('prevTrackBtn')?.addEventListener('click', () => {
      this.audioEngine.prevTrack();
    });

    document.getElementById('playerProgressBar')?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      this.audioEngine.seekPercentage(val);
      e.target.style.background = `linear-gradient(to right, #6366f1 0%, #ec4899 ${val}%, rgba(255,255,255,0.12) ${val}%, rgba(255,255,255,0.12) 100%)`;
    });

    const volumeSlider = document.getElementById('volumeSlider');
    const volumeIcon = document.getElementById('volumeIcon');
    let lastVolume = 90;

    const updateVolumeIcon = (vol) => {
      if (!volumeIcon) return;
      if (vol === 0) {
        volumeIcon.innerHTML = `
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        `;
      } else if (vol < 50) {
        volumeIcon.innerHTML = `
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        `;
      } else {
        volumeIcon.innerHTML = `
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        `;
      }
    };

    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (val > 0) lastVolume = val;
        this.audioEngine.setVolume(val / 100);
        updateVolumeIcon(val);
      });
    }

    document.getElementById('volumeMuteBtn')?.addEventListener('click', () => {
      if (!volumeSlider) return;
      const currentVal = parseFloat(volumeSlider.value);
      if (currentVal > 0) {
        lastVolume = currentVal;
        volumeSlider.value = 0;
        this.audioEngine.setVolume(0);
        updateVolumeIcon(0);
      } else {
        const restoreVal = lastVolume > 0 ? lastVolume : 80;
        volumeSlider.value = restoreVal;
        this.audioEngine.setVolume(restoreVal / 100);
        updateVolumeIcon(restoreVal);
      }
    });

    document.getElementById('fullscreenStageBtn')?.addEventListener('click', () => {
      const stage = document.querySelector('.stage-container') || document.getElementById('previewCanvas');
      if (!document.fullscreenElement) {
        if (stage?.requestFullscreen) {
          stage.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });

    const repeatBtn = document.getElementById('repeatModeBtn');
    if (repeatBtn) {
      const modes = ['sequence', 'repeat-all', 'repeat-one', 'shuffle'];
      let modeIdx = 0;
      repeatBtn.addEventListener('click', () => {
        modeIdx = (modeIdx + 1) % modes.length;
        const currentMode = modes[modeIdx];
        this.audioEngine.setPlaybackMode(currentMode);
        repeatBtn.classList.toggle('active', currentMode !== 'sequence');
        repeatBtn.title = `Mode: ${currentMode}`;
      });
    }

    const dropzone = document.getElementById('audioDropzone');
    const audioFileInput = document.getElementById('audioFileInput');

    if (dropzone && audioFileInput) {
      dropzone.addEventListener('click', () => audioFileInput.click());

      audioFileInput.addEventListener('change', (e) => {
        this.handleUploadedFiles(e.target.files);
      });

      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });

      dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
      });

      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        this.handleUploadedFiles(e.dataTransfer.files);
      });
    }

    document.getElementById('langToggleBtn')?.addEventListener('click', () => {
      this.currentLang = this.currentLang === 'kh' ? 'en' : 'kh';
      this.updateLanguageUI();
      this.renderCategoryPills();
      this.renderPresetsGrid();
    });

    document.getElementById('openExportModalBtn')?.addEventListener('click', () => {
      document.getElementById('exportModal')?.classList.add('open');
    });

    document.getElementById('closeExportModalBtn')?.addEventListener('click', () => {
      document.getElementById('exportModal')?.classList.remove('open');
    });

    document.getElementById('startExportBtn')?.addEventListener('click', () => {
      this.startVideoExport();
    });

    document.getElementById('cancelExportBtn')?.addEventListener('click', () => {
      this.exporter.cancelExport();
      document.getElementById('exportProgressBox')?.classList.remove('active');
    });

    document.getElementById('closeEditModalBtn')?.addEventListener('click', () => {
      document.getElementById('editTrackModal')?.classList.remove('open');
    });
  }

  handleUploadedFiles(files) {
    if (!files || files.length === 0) return;

    const hadZeroTracks = this.audioEngine.playlist.length === 0;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('audio/') || file.name.match(/\.(mp3|wav|ogg|m4a|flac)$/i)) {
        const audioUrl = URL.createObjectURL(file);
        const trackTitle = cleanTrackTitle(file.name);
        
        const coverArt = this.visualizer.customCoverSrc || window.demoDataManager.generateCoverArt(trackTitle, 'My Artist', '#1e1b4b', '#4338ca', 'circle');

        const newTrack = {
          id: `track_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          title: trackTitle,
          artist: 'My Artist',
          album: 'My Custom Album',
          duration: 180,
          audioUrl: audioUrl,
          coverUrl: coverArt,
          lyrics: []
        };

        const tempAudio = new Audio(audioUrl);
        tempAudio.addEventListener('loadedmetadata', () => {
          newTrack.duration = tempAudio.duration || 180;
          this.renderTracklist();
        });

        this.audioEngine.playlist.push(newTrack);
      }
    });

    if (hadZeroTracks && this.audioEngine.playlist.length > 0) {
      this.audioEngine.loadTrack(0);
    }

    this.renderTracklist();
  }

  setupCustomImageUploads() {
    // 1. Center Cover Image Upload (Tab 4)
    const centerCoverInput = document.getElementById('centerCoverUploadInput');
    const resetCenterCoverBtn = document.getElementById('resetCenterCoverBtn');
    const centerCoverPreviewBox = document.getElementById('centerCoverPreviewBox');
    const centerCoverThumbnail = document.getElementById('centerCoverThumbnail');
    const centerCoverFileName = document.getElementById('centerCoverFileName');
    const applyToAllCheckbox = document.getElementById('applyCoverToAllTracksCheckbox');

    if (centerCoverInput) {
      centerCoverInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const imageSrc = ev.target.result;
            this.visualizer.setCustomCoverImage(imageSrc);

            if (applyToAllCheckbox && applyToAllCheckbox.checked) {
              this.audioEngine.playlist.forEach(t => t.coverUrl = imageSrc);
            }

            if (centerCoverPreviewBox) centerCoverPreviewBox.style.display = 'flex';
            if (centerCoverThumbnail) centerCoverThumbnail.src = imageSrc;
            if (centerCoverFileName) centerCoverFileName.innerText = file.name;
            if (resetCenterCoverBtn) resetCenterCoverBtn.style.display = 'inline-flex';

            const nowArt = document.getElementById('nowPlayingArt');
            if (nowArt) nowArt.src = imageSrc;

            this.renderTracklist();
          };
          reader.readAsDataURL(file);
        }
      });
    }

    if (resetCenterCoverBtn) {
      resetCenterCoverBtn.addEventListener('click', () => {
        this.visualizer.customCoverSrc = null;
        if (centerCoverInput) centerCoverInput.value = '';
        if (centerCoverPreviewBox) centerCoverPreviewBox.style.display = 'none';
        if (resetCenterCoverBtn) resetCenterCoverBtn.style.display = 'none';

        const curTrack = this.audioEngine.currentTrack;
        if (curTrack) {
          const defaultArt = window.demoDataManager.generateCoverArt(curTrack.title, curTrack.artist, '#1e1b4b', '#4338ca', 'circle');
          this.visualizer.setCustomCoverImage(defaultArt);
        }
        this.renderTracklist();
      });
    }

    // 2. Custom Background Image Upload (Tab 5)
    const customBgInput = document.getElementById('customBgInput');
    const removeCustomBgBtn = document.getElementById('removeCustomBgBtn');
    const customBgPreviewBox = document.getElementById('customBgPreviewBox');
    const customBgThumbnail = document.getElementById('customBgThumbnail');
    const customBgFileName = document.getElementById('customBgFileName');
    const bgTypeSelect = document.getElementById('bgType');

    if (customBgInput) {
      customBgInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const imageSrc = ev.target.result;
            this.visualizer.setCustomBackgroundImage(imageSrc);

            if (bgTypeSelect) bgTypeSelect.value = 'custom_image';
            if (customBgPreviewBox) customBgPreviewBox.style.display = 'flex';
            if (customBgThumbnail) customBgThumbnail.src = imageSrc;
            if (customBgFileName) customBgFileName.innerText = file.name;
            if (removeCustomBgBtn) removeCustomBgBtn.style.display = 'inline-flex';
          };
          reader.readAsDataURL(file);
        }
      });
    }

    if (removeCustomBgBtn) {
      removeCustomBgBtn.addEventListener('click', () => {
        this.visualizer.removeCustomBackgroundImage();
        if (customBgInput) customBgInput.value = '';
        if (customBgPreviewBox) customBgPreviewBox.style.display = 'none';
        if (removeCustomBgBtn) removeCustomBgBtn.style.display = 'none';
        if (bgTypeSelect) bgTypeSelect.value = 'radial_glow';
      });
    }
  }

  setupTypographyControls() {
    const bindInput = (id, callback) => {
      const elem = document.getElementById(id);
      if (elem) elem.addEventListener('input', (e) => callback(e.target.value));
    };

    bindInput('typoTitleFont', val => this.visualizer.config.typography.titleFont = val);
    bindInput('typoArtistFont', val => this.visualizer.config.typography.artistFont = val);
    bindInput('typoTitleSize', val => this.visualizer.config.typography.titleSize = parseInt(val, 10));
    bindInput('typoArtistSize', val => this.visualizer.config.typography.artistSize = parseInt(val, 10));
    bindInput('typoTextStyle', val => this.visualizer.config.typography.textStyle = val);
    bindInput('typoTitleColor', val => this.visualizer.config.typography.titleColor = val);
    bindInput('typoGlowColor', val => this.visualizer.config.typography.glowColor = val);
    bindInput('typoAlignment', val => this.visualizer.config.typography.alignment = val);
    bindInput('typoTitleY', val => this.visualizer.config.typography.titleY = parseFloat(val) / 100);
    bindInput('typoArtistY', val => this.visualizer.config.typography.artistY = parseFloat(val) / 100);

    bindInput('overlayPosition', val => {
      this.visualizer.config.tracklistOverlay.enabled = val !== 'none';
      this.visualizer.config.tracklistOverlay.position = val;
    });
    bindInput('overlayFontSize', val => this.visualizer.config.tracklistOverlay.fontSize = parseInt(val, 10));
    bindInput('overlayHighlightColor', val => {
      this.visualizer.config.tracklistOverlay.highlightColor = val;
      this.visualizer.config.tracklistOverlay.activeGlow = val;
    });
  }

  setupVisualizerControls() {
    const bindInput = (id, callback) => {
      const elem = document.getElementById(id);
      if (elem) elem.addEventListener('input', (e) => callback(e.target.value));
    };

    bindInput('vizType', val => this.visualizer.config.visualizer.type = val);
    
    bindInput('vizPositionY', val => {
      this.visualizer.config.visualizer.positionY = parseFloat(val) / 100;
      const badge = document.getElementById('vizYBadge');
      if (badge) badge.innerText = `${val}%`;
    });

    bindInput('vizHeightScale', val => {
      this.visualizer.config.visualizer.heightScale = parseFloat(val) / 100;
      const badge = document.getElementById('vizHeightBadge');
      if (badge) badge.innerText = `${val}%`;
    });

    bindInput('vizWidthScale', val => {
      this.visualizer.config.visualizer.widthPercent = parseFloat(val) / 100;
      const badge = document.getElementById('vizWidthBadge');
      if (badge) badge.innerText = `${val}%`;
    });

    bindInput('vizLayout', val => {
      this.visualizer.config.visualizer.layout = val;
    });

    bindInput('artPositionY', val => {
      this.visualizer.config.artwork.positionY = parseFloat(val) / 100;
      const badge = document.getElementById('artYBadge');
      if (badge) badge.innerText = `${val}%`;
    });

    bindInput('vizBarCount', val => this.visualizer.config.visualizer.barCount = parseInt(val, 10));
    bindInput('vizSensitivity', val => this.visualizer.config.visualizer.sensitivity = parseFloat(val));
    bindInput('vizColor1', val => this.visualizer.config.visualizer.color1 = val);
    bindInput('vizColor2', val => this.visualizer.config.visualizer.color2 = val);
    bindInput('vizArtworkType', val => this.visualizer.config.artwork.type = val);
    bindInput('vizArtworkSize', val => this.visualizer.config.artwork.size = parseInt(val, 10));
    bindInput('vizRotationSpeed', val => this.visualizer.config.artwork.rotationSpeed = parseFloat(val));
  }

  setupBackgroundControls() {
    const bindInput = (id, callback) => {
      const elem = document.getElementById(id);
      if (elem) elem.addEventListener('input', (e) => callback(e.target.value));
    };

    bindInput('bgType', val => {
      this.visualizer.config.background.type = val;
      this.visualizer.initParticles();
    });
    bindInput('bgPrimaryColor', val => this.visualizer.config.background.primaryColor = val);
    bindInput('bgSecondaryColor', val => this.visualizer.config.background.secondaryColor = val);
    bindInput('bgBlur', val => this.visualizer.config.background.blur = parseInt(val, 10));
    bindInput('bgDimSlider', val => this.visualizer.config.background.dim = parseInt(val, 10));
  }

  setupLogoOverlayControls() {
    const bindInput = (id, callback) => {
      const elem = document.getElementById(id);
      if (elem) elem.addEventListener('input', (e) => callback(e.target.value));
    };

    // Toggle switch
    const logoToggle = document.getElementById('logoOverlayToggle');
    const logoBody = document.getElementById('logoControlsBody');
    if (logoToggle) {
      logoToggle.addEventListener('change', (e) => {
        this.visualizer.config.logoOverlay.enabled = e.target.checked;
        if (logoBody) {
          logoBody.style.opacity = e.target.checked ? '1' : '0.4';
          logoBody.style.pointerEvents = e.target.checked ? 'auto' : 'none';
        }
      });
    }

    // Custom Logo File Upload
    const logoFileInput = document.getElementById('customLogoUploadInput');
    const logoThumb = document.getElementById('logoPreviewThumb');
    if (logoFileInput) {
      logoFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const src = ev.target.result;
            this.visualizer.setLogoImage(src);
            if (logoThumb) logoThumb.src = src;
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Use default BCT logo button
    document.getElementById('useDefaultBctLogoBtn')?.addEventListener('click', () => {
      const defaultBctSrc = 'assets/bct_music_logo.jpg';
      this.visualizer.setLogoImage(defaultBctSrc);
      if (logoThumb) logoThumb.src = defaultBctSrc;
    });

    // Preset positions
    document.querySelectorAll('.btn-preset-pos').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-preset-pos').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const posKey = btn.dataset.pos;
        let posX = 0.88, posY = 0.12;
        switch (posKey) {
          case 'top_left': posX = 0.12; posY = 0.12; break;
          case 'top_right': posX = 0.88; posY = 0.12; break;
          case 'center': posX = 0.50; posY = 0.50; break;
          case 'bottom_left': posX = 0.12; posY = 0.88; break;
          case 'bottom_right': posX = 0.88; posY = 0.88; break;
        }
        this.visualizer.config.logoOverlay.posX = posX;
        this.visualizer.config.logoOverlay.posY = posY;

        const xSlider = document.getElementById('logoPosXSlider');
        const ySlider = document.getElementById('logoPosYSlider');
        const xBadge = document.getElementById('logoPosXBadge');
        const yBadge = document.getElementById('logoPosYBadge');
        if (xSlider) xSlider.value = Math.round(posX * 100);
        if (ySlider) ySlider.value = Math.round(posY * 100);
        if (xBadge) xBadge.innerText = `${Math.round(posX * 100)}%`;
        if (yBadge) yBadge.innerText = `${Math.round(posY * 100)}%`;
      });
    });

    // Sliders
    bindInput('logoPosXSlider', val => {
      const pct = parseFloat(val);
      this.visualizer.config.logoOverlay.posX = pct / 100;
      const b = document.getElementById('logoPosXBadge');
      if (b) b.innerText = `${val}%`;
    });

    bindInput('logoPosYSlider', val => {
      const pct = parseFloat(val);
      this.visualizer.config.logoOverlay.posY = pct / 100;
      const b = document.getElementById('logoPosYBadge');
      if (b) b.innerText = `${val}%`;
    });

    bindInput('logoSizeSlider', val => {
      const num = parseInt(val, 10);
      this.visualizer.config.logoOverlay.size = num;
      const b = document.getElementById('logoSizeBadge');
      if (b) b.innerText = `${num}px`;
    });

    bindInput('logoOpacitySlider', val => {
      const num = parseInt(val, 10);
      this.visualizer.config.logoOverlay.opacity = num / 100;
      const b = document.getElementById('logoOpacityBadge');
      if (b) b.innerText = `${num}%`;
    });

    bindInput('logoShapeSelect', val => {
      this.visualizer.config.logoOverlay.shape = val;
    });

    bindInput('logoGlowColor', val => {
      this.visualizer.config.logoOverlay.glowColor = val;
    });

    // Real-time canvas drag sync callback
    this.visualizer.onLogoPositionChange = (posX, posY) => {
      const xPct = Math.round(posX * 100);
      const yPct = Math.round(posY * 100);
      const xSlider = document.getElementById('logoPosXSlider');
      const ySlider = document.getElementById('logoPosYSlider');
      const xBadge = document.getElementById('logoPosXBadge');
      const yBadge = document.getElementById('logoPosYBadge');

      if (xSlider) xSlider.value = xPct;
      if (ySlider) ySlider.value = yPct;
      if (xBadge) xBadge.innerText = `${xPct}%`;
      if (yBadge) yBadge.innerText = `${yPct}%`;
    };
  }

  syncControlsWithConfig() {
    const cfg = this.visualizer.config;
    const setVal = (id, val) => {
      const elem = document.getElementById(id);
      if (elem && val !== undefined) elem.value = val;
    };

    setVal('typoTitleFont', cfg.typography.titleFont);
    setVal('typoArtistFont', cfg.typography.artistFont);
    setVal('typoTitleSize', cfg.typography.titleSize);
    setVal('typoArtistSize', cfg.typography.artistSize);
    setVal('typoTextStyle', cfg.typography.textStyle);
    setVal('typoTitleColor', cfg.typography.titleColor);
    setVal('typoGlowColor', cfg.typography.glowColor);
    setVal('typoAlignment', cfg.typography.alignment);
    setVal('typoTitleY', Math.round((cfg.typography.titleY || 0.22) * 100));
    setVal('typoArtistY', Math.round((cfg.typography.artistY || 0.30) * 100));

    setVal('vizType', cfg.visualizer.type);
    
    const vizY = Math.round((cfg.visualizer.positionY !== undefined ? cfg.visualizer.positionY : 0.85) * 100);
    setVal('vizPositionY', vizY);
    const vizBadge = document.getElementById('vizYBadge');
    if (vizBadge) vizBadge.innerText = `${vizY}%`;

    const vizH = Math.round((cfg.visualizer.heightScale !== undefined ? cfg.visualizer.heightScale : 0.40) * 100);
    setVal('vizHeightScale', vizH);
    const vizHBadge = document.getElementById('vizHeightBadge');
    if (vizHBadge) vizHBadge.innerText = `${vizH}%`;

    const vizW = Math.round((cfg.visualizer.widthPercent !== undefined ? cfg.visualizer.widthPercent : 0.60) * 100);
    setVal('vizWidthScale', vizW);
    const vizWBadge = document.getElementById('vizWidthBadge');
    if (vizWBadge) vizWBadge.innerText = `${vizW}%`;

    setVal('vizLayout', cfg.visualizer.layout || 'symmetric');

    const artY = Math.round((cfg.artwork.positionY !== undefined ? cfg.artwork.positionY : 0.50) * 100);
    setVal('artPositionY', artY);
    const artBadge = document.getElementById('artYBadge');
    if (artBadge) artBadge.innerText = `${artY}%`;

    setVal('vizBarCount', cfg.visualizer.barCount);
    setVal('vizSensitivity', cfg.visualizer.sensitivity);
    setVal('vizColor1', cfg.visualizer.color1);
    setVal('vizColor2', cfg.visualizer.color2);
    setVal('vizArtworkType', cfg.artwork.type);
    setVal('vizArtworkSize', cfg.artwork.size);
    setVal('vizRotationSpeed', cfg.artwork.rotationSpeed !== undefined ? cfg.artwork.rotationSpeed : 0.5);

    setVal('bgType', cfg.background.type);
    setVal('bgPrimaryColor', cfg.background.primaryColor);
    setVal('bgSecondaryColor', cfg.background.secondaryColor);
    setVal('bgBlur', cfg.background.blur || 0);
    setVal('bgDimSlider', cfg.background.dim !== undefined ? cfg.background.dim : 30);

    if (cfg.tracklistOverlay) {
      setVal('overlayPosition', cfg.tracklistOverlay.enabled ? cfg.tracklistOverlay.position : 'none');
      setVal('overlayFontSize', cfg.tracklistOverlay.fontSize);
      setVal('overlayHighlightColor', cfg.tracklistOverlay.highlightColor);
    }

    if (cfg.logoOverlay) {
      const logoToggle = document.getElementById('logoOverlayToggle');
      if (logoToggle) logoToggle.checked = cfg.logoOverlay.enabled;
      
      const logoBody = document.getElementById('logoControlsBody');
      if (logoBody) {
        logoBody.style.opacity = cfg.logoOverlay.enabled ? '1' : '0.4';
        logoBody.style.pointerEvents = cfg.logoOverlay.enabled ? 'auto' : 'none';
      }

      const xVal = Math.round((cfg.logoOverlay.posX !== undefined ? cfg.logoOverlay.posX : 0.88) * 100);
      setVal('logoPosXSlider', xVal);
      const xB = document.getElementById('logoPosXBadge');
      if (xB) xB.innerText = `${xVal}%`;

      const yVal = Math.round((cfg.logoOverlay.posY !== undefined ? cfg.logoOverlay.posY : 0.12) * 100);
      setVal('logoPosYSlider', yVal);
      const yB = document.getElementById('logoPosYBadge');
      if (yB) yB.innerText = `${yVal}%`;

      const sizeVal = cfg.logoOverlay.size || 110;
      setVal('logoSizeSlider', sizeVal);
      const sB = document.getElementById('logoSizeBadge');
      if (sB) sB.innerText = `${sizeVal}px`;

      const opVal = Math.round((cfg.logoOverlay.opacity !== undefined ? cfg.logoOverlay.opacity : 0.9) * 100);
      setVal('logoOpacitySlider', opVal);
      const opB = document.getElementById('logoOpacityBadge');
      if (opB) opB.innerText = `${opVal}%`;

      setVal('logoShapeSelect', cfg.logoOverlay.shape || 'rounded_glow');
      setVal('logoGlowColor', cfg.logoOverlay.glowColor || '#f59e0b');
    }
  }

  async startVideoExport() {
    const mode = document.getElementById('exportScopeSelect')?.value || 'current';
    const resolution = document.getElementById('exportResolutionSelect')?.value || '1080p';
    const fps = parseInt(document.getElementById('exportFpsSelect')?.value || '30', 10);

    const progressBox = document.getElementById('exportProgressBox');
    const progressBar = document.getElementById('exportProgressFill');
    const progressText = document.getElementById('exportProgressText');
    const statsText = document.getElementById('exportStatsText');

    if (progressBox) progressBox.classList.add('active');

    this.exporter.onProgress = ({ percent, currentTrackIndex, totalTracks, currentTrackName, elapsed, remaining }) => {
      if (progressBar) progressBar.style.width = `${percent}%`;
      if (progressText) progressText.innerText = `${percent}% (${currentTrackIndex}/${totalTracks}: ${currentTrackName})`;
      if (statsText) statsText.innerText = `Elapsed: ${elapsed}s | Remaining: ${remaining}s`;
    };

    this.exporter.onComplete = ({ filename }) => {
      if (progressBox) progressBox.classList.remove('active');
      alert(`🎉 ការ Render Video បានជោគជ័យ! File: ${filename} ត្រូវបានទាញយកស្វ័យប្រវត្ត។`);
      document.getElementById('exportModal')?.classList.remove('open');
    };

    try {
      await this.exporter.exportVideo({ mode, resolution, fps });
    } catch (e) {
      console.error('Export failed:', e);
      alert('មានបញ្ហាក្នុងការ Render Video: ' + e.message);
      if (progressBox) progressBox.classList.remove('active');
    }
  }

  updateLanguageUI() {
    const dict = I18N[this.currentLang] || I18N.kh;
    document.querySelectorAll('[data-i18n]').forEach(elem => {
      const key = elem.dataset.i18n;
      if (dict[key]) {
        elem.innerText = dict[key];
      }
    });

    const langBtn = document.getElementById('langToggleBtn');
    if (langBtn) {
      langBtn.innerText = this.currentLang === 'kh' ? '🇰🇭 ខ្មែរ' : '🇺🇸 EN';
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.appController = new AppController();
});
