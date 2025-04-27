/**
 * Nino Platform - Script du lecteur vidéo
 */

(function() {
  'use strict';

  class NinoVideoPlayer {
    constructor(containerId, videoId, options = {}) {
      this.container = document.getElementById(containerId);
      this.videoId = videoId;
      this.options = {
        autoplay: options.autoplay || false,
        quality: options.quality || 'auto',
        volume: options.volume || 1.0,
        ...options
      };
      
      this.instanceId = null;
      this.videoInfo = null;
      this.playerState = 'initializing';
      
      this.initialize();
    }

    async initialize() {
      try {
        // Récupérer les informations de la vidéo
        const response = await fetch(`/api/video/${this.videoId}/info`);
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error);
        }
        
        this.videoInfo = data.video;
        this.createPlayerUI();
        await this.createVideoInstance();
        this.setupEventListeners();
      } catch (error) {
        console.error('Erreur lors de l\'initialisation du lecteur:', error);
        this.showError('Impossible de charger la vidéo');
      }
    }

    createPlayerUI() {
      this.container.innerHTML = `
        <div class="nino-video-player">
          <video id="video-${this.videoId}" class="nino-video">
            <source src="${this.videoInfo.url}" type="video/mp4">
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
          
          <div class="nino-video-controls">
            <div class="nino-progress-bar">
              <div class="nino-progress-fill"></div>
              <div class="nino-progress-handle"></div>
            </div>
            
            <div class="nino-control-buttons">
              <div class="nino-control-left">
                <button class="nino-control-button nino-play-pause">
                  <i class="fas fa-play"></i>
                </button>
                
                <div class="nino-volume-container">
                  <button class="nino-control-button nino-volume">
                    <i class="fas fa-volume-up"></i>
                  </button>
                  <div class="nino-volume-slider">
                    <div class="nino-volume-fill"></div>
                  </div>
                </div>
                
                <span class="nino-time-display">
                  <span class="nino-current-time">0:00</span>
                  /
                  <span class="nino-duration">0:00</span>
                </span>
              </div>
              
              <div class="nino-control-right">
                <button class="nino-control-button nino-quality">
                  <i class="fas fa-cog"></i>
                </button>
                
                <button class="nino-control-button nino-fullscreen">
                  <i class="fas fa-expand"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      // Récupérer les éléments du lecteur
      this.video = this.container.querySelector(`#video-${this.videoId}`);
      this.playPauseBtn = this.container.querySelector('.nino-play-pause');
      this.volumeBtn = this.container.querySelector('.nino-volume');
      this.volumeSlider = this.container.querySelector('.nino-volume-slider');
      this.volumeFill = this.container.querySelector('.nino-volume-fill');
      this.progressBar = this.container.querySelector('.nino-progress-bar');
      this.progressFill = this.container.querySelector('.nino-progress-fill');
      this.progressHandle = this.container.querySelector('.nino-progress-handle');
      this.currentTime = this.container.querySelector('.nino-current-time');
      this.duration = this.container.querySelector('.nino-duration');
      this.qualityBtn = this.container.querySelector('.nino-quality');
      this.fullscreenBtn = this.container.querySelector('.nino-fullscreen');
    }

    async createVideoInstance() {
      try {
        const response = await fetch(`/api/video/${this.videoId}/instance`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.options)
        });
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error);
        }
        
        this.instanceId = data.instanceId;
        this.playerState = 'ready';
        
        if (this.options.autoplay) {
          this.play();
        }
      } catch (error) {
        console.error('Erreur lors de la création de l\'instance:', error);
        this.showError('Impossible de démarrer la lecture');
      }
    }

    setupEventListeners() {
      // Lecture/Pause
      this.playPauseBtn.addEventListener('click', () => {
        if (this.video.paused) {
          this.play();
        } else {
          this.pause();
        }
      });

      // Volume
      this.volumeBtn.addEventListener('click', () => {
        this.video.muted = !this.video.muted;
        this.updateVolumeUI();
      });

      this.volumeSlider.addEventListener('click', (e) => {
        const rect = this.volumeSlider.getBoundingClientRect();
        const volume = (e.clientX - rect.left) / rect.width;
        this.setVolume(volume);
      });

      // Progression
      this.progressBar.addEventListener('click', (e) => {
        const rect = this.progressBar.getBoundingClientRect();
        const progress = (e.clientX - rect.left) / rect.width;
        this.seek(progress * this.video.duration);
      });

      // Plein écran
      this.fullscreenBtn.addEventListener('click', () => {
        this.toggleFullscreen();
      });

      // Mise à jour de l'interface
      this.video.addEventListener('timeupdate', () => {
        this.updateProgressUI();
        this.updateTimeDisplay();
      });

      this.video.addEventListener('play', () => {
        this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        this.playerState = 'playing';
      });

      this.video.addEventListener('pause', () => {
        this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        this.playerState = 'paused';
      });

      this.video.addEventListener('ended', () => {
        this.playerState = 'ended';
        this.playPauseBtn.innerHTML = '<i class="fas fa-redo"></i>';
      });

      // Nettoyage lors de la fermeture
      window.addEventListener('beforeunload', () => {
        this.cleanup();
      });
    }

    async play() {
      try {
        await this.video.play();
        await this.controlPlayback('play');
      } catch (error) {
        console.error('Erreur lors de la lecture:', error);
      }
    }

    async pause() {
      try {
        this.video.pause();
        await this.controlPlayback('pause');
      } catch (error) {
        console.error('Erreur lors de la mise en pause:', error);
      }
    }

    async seek(time) {
      try {
        this.video.currentTime = time;
        await this.controlPlayback('seek', { time });
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
      }
    }

    setVolume(volume) {
      this.video.volume = Math.max(0, Math.min(1, volume));
      this.video.muted = volume === 0;
      this.updateVolumeUI();
    }

    async controlPlayback(action, params = {}) {
      try {
        const response = await fetch(`/api/video/instance/${this.instanceId}/control`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ action, params })
        });
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error);
        }
      } catch (error) {
        console.error('Erreur lors du contrôle de la lecture:', error);
      }
    }

    updateProgressUI() {
      const progress = (this.video.currentTime / this.video.duration) * 100;
      this.progressFill.style.width = `${progress}%`;
      this.progressHandle.style.left = `${progress}%`;
    }

    updateVolumeUI() {
      const volume = this.video.muted ? 0 : this.video.volume;
      this.volumeFill.style.width = `${volume * 100}%`;
      
      const icon = this.volumeBtn.querySelector('i');
      if (volume === 0 || this.video.muted) {
        icon.className = 'fas fa-volume-mute';
      } else if (volume < 0.5) {
        icon.className = 'fas fa-volume-down';
      } else {
        icon.className = 'fas fa-volume-up';
      }
    }

    updateTimeDisplay() {
      this.currentTime.textContent = this.formatTime(this.video.currentTime);
      this.duration.textContent = this.formatTime(this.video.duration);
    }

    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      seconds = Math.floor(seconds % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    toggleFullscreen() {
      if (!document.fullscreenElement) {
        this.container.requestFullscreen();
        this.fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
      } else {
        document.exitFullscreen();
        this.fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
      }
    }

    showError(message) {
      this.container.innerHTML = `
        <div class="nino-video-error">
          <i class="fas fa-exclamation-circle"></i>
          <p>${message}</p>
        </div>
      `;
    }

    async cleanup() {
      if (this.instanceId) {
        try {
          await fetch(`/api/video/instance/${this.instanceId}`, {
            method: 'DELETE'
          });
        } catch (error) {
          console.error('Erreur lors du nettoyage de l\'instance:', error);
        }
      }
    }
  }

  // Export du lecteur
  window.NinoVideoPlayer = NinoVideoPlayer;
})(); 