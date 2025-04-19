/**
 * Nino Platform - Script du lecteur vidéo
 */

(function() {
  'use strict';

  // Gestionnaire du lecteur vidéo
  const ninoPlayer = {
    // Éléments du DOM
    elements: {
      player: null,
      video: null,
      playButton: null,
      volumeButton: null,
      volumeSlider: null,
      volumeFill: null,
      progressContainer: null,
      progressBar: null,
      timeDisplay: null,
      fullscreenButton: null,
      controls: null
    },

    // État du lecteur
    state: {
      isPlaying: false,
      isMuted: false,
      volume: 0.7, // 0 à 1
      duration: 0,
      currentTime: 0,
      isUserSeeking: false
    },

    // Initialisation
    init: function() {
      // Récupérer les éléments
      this.findElements();
      
      // Si le lecteur n'est pas sur la page, sortir
      if (!this.elements.player) return;
      
      // Définir les événements
      this.setupEventListeners();
      
      // Pour la démo, simuler une vidéo
      this.simulateVideo();
    },

    // Trouver tous les éléments nécessaires
    findElements: function() {
      this.elements.player = document.querySelector('.nino-player-wrapper');
      
      if (!this.elements.player) return;
      
      this.elements.video = this.elements.player.querySelector('video');
      this.elements.playButton = this.elements.player.querySelector('.nino-play');
      this.elements.volumeButton = this.elements.player.querySelector('.nino-volume-container .nino-control-button');
      this.elements.volumeSlider = this.elements.player.querySelector('.nino-volume-slider');
      this.elements.volumeFill = this.elements.player.querySelector('.nino-volume-fill');
      this.elements.progressContainer = this.elements.player.querySelector('.nino-progress-container');
      this.elements.progressBar = this.elements.player.querySelector('.nino-progress-bar');
      this.elements.timeDisplay = this.elements.player.querySelector('.nino-time-display');
      this.elements.fullscreenButton = this.elements.player.querySelector('.nino-control-right .nino-control-button:last-child');
      this.elements.controls = this.elements.player.querySelector('.nino-video-controls-container');
    },

    // Configurer les écouteurs d'événements
    setupEventListeners: function() {
      const self = this;
      
      // Événements de la vidéo
      if (this.elements.video) {
        this.elements.video.addEventListener('loadedmetadata', function() {
          self.state.duration = this.duration;
          self.updateTimeDisplay();
        });
        
        this.elements.video.addEventListener('timeupdate', function() {
          if (!self.state.isUserSeeking) {
            self.state.currentTime = this.currentTime;
            self.updateProgressBar();
            self.updateTimeDisplay();
          }
        });
        
        this.elements.video.addEventListener('play', function() {
          self.state.isPlaying = true;
          self.updatePlayButton();
        });
        
        this.elements.video.addEventListener('pause', function() {
          self.state.isPlaying = false;
          self.updatePlayButton();
        });
        
        this.elements.video.addEventListener('volumechange', function() {
          self.state.volume = this.volume;
          self.state.isMuted = this.muted;
          self.updateVolumeUI();
        });
        
        this.elements.video.addEventListener('ended', function() {
          self.state.isPlaying = false;
          self.updatePlayButton();
        });
      }
      
      // Bouton Play/Pause
      if (this.elements.playButton) {
        this.elements.playButton.addEventListener('click', function() {
          self.togglePlay();
        });
      }
      
      // Clic sur la vidéo pour play/pause
      if (this.elements.video) {
        this.elements.video.addEventListener('click', function(e) {
          // Ne déclencher que si on ne clique pas sur les contrôles
          if (!e.target.closest('.nino-video-controls-container')) {
            self.togglePlay();
          }
        });
      }
      
      // Bouton Volume
      if (this.elements.volumeButton) {
        this.elements.volumeButton.addEventListener('click', function() {
          self.toggleMute();
        });
      }
      
      // Slider de volume
      if (this.elements.volumeSlider) {
        this.elements.volumeSlider.addEventListener('click', function(e) {
          self.handleVolumeChange(e);
        });
        
        this.elements.volumeSlider.addEventListener('mousedown', function(e) {
          self.startVolumeDrag(e);
        });
      }
      
      // Barre de progression
      if (this.elements.progressContainer) {
        this.elements.progressContainer.addEventListener('click', function(e) {
          self.seek(e);
        });
        
        this.elements.progressContainer.addEventListener('mousedown', function(e) {
          self.startProgressDrag(e);
        });
      }
      
      // Bouton Plein écran
      if (this.elements.fullscreenButton) {
        this.elements.fullscreenButton.addEventListener('click', function() {
          self.toggleFullscreen();
        });
      }
      
      // Gestion des événements clavier
      document.addEventListener('keydown', function(e) {
        if (!self.elements.player) return;
        
        // Vérifier si le focus est sur le lecteur ou un de ses enfants
        const isPlayerFocused = document.activeElement === self.elements.player || 
                               self.elements.player.contains(document.activeElement) ||
                               document.activeElement === document.body;
        
        if (!isPlayerFocused) return;
        
        switch (e.key.toLowerCase()) {
          case ' ':
          case 'k':
            e.preventDefault();
            self.togglePlay();
            break;
          case 'f':
            e.preventDefault();
            self.toggleFullscreen();
            break;
          case 'm':
            e.preventDefault();
            self.toggleMute();
            break;
          case 'arrowleft':
            e.preventDefault();
            self.skip(-10); // reculer de 10 secondes
            break;
          case 'arrowright':
            e.preventDefault();
            self.skip(10); // avancer de 10 secondes
            break;
          case 'arrowup':
            e.preventDefault();
            self.changeVolume(0.1); // +10% volume
            break;
          case 'arrowdown':
            e.preventDefault();
            self.changeVolume(-0.1); // -10% volume
            break;
        }
      });
      
      // Gestion des événements du document pour le drag
      document.addEventListener('mousemove', function(e) {
        if (self.state.isDraggingVolume) {
          self.handleVolumeDrag(e);
        }
        
        if (self.state.isDraggingProgress) {
          self.handleProgressDrag(e);
        }
      });
      
      document.addEventListener('mouseup', function() {
        if (self.state.isDraggingVolume) {
          self.stopVolumeDrag();
        }
        
        if (self.state.isDraggingProgress) {
          self.stopProgressDrag();
        }
      });
    },

    // Mettre à jour l'affichage du temps
    updateTimeDisplay: function() {
      if (!this.elements.timeDisplay) return;
      
      const currentTime = this.formatTime(this.state.currentTime);
      const duration = this.formatTime(this.state.duration);
      
      this.elements.timeDisplay.textContent = `${currentTime} / ${duration}`;
    },

    // Formater le temps en minutes:secondes
    formatTime: function(timeInSeconds) {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = Math.floor(timeInSeconds % 60);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    },

    // Mettre à jour la barre de progression
    updateProgressBar: function() {
      if (!this.elements.progressBar) return;
      
      const progress = (this.state.currentTime / this.state.duration) * 100;
      this.elements.progressBar.style.width = `${progress}%`;
    },

    // Mettre à jour l'interface du bouton play/pause
    updatePlayButton: function() {
      if (!this.elements.playButton) return;
      
      const icon = this.elements.playButton.querySelector('i');
      
      if (this.state.isPlaying) {
        icon.className = 'fas fa-pause';
      } else {
        icon.className = 'fas fa-play';
      }
    },

    // Mettre à jour l'interface du volume
    updateVolumeUI: function() {
      if (!this.elements.volumeButton || !this.elements.volumeFill) return;
      
      const icon = this.elements.volumeButton.querySelector('i');
      
      if (this.state.isMuted || this.state.volume === 0) {
        icon.className = 'fas fa-volume-mute';
        this.elements.volumeFill.style.width = '0%';
      } else if (this.state.volume < 0.5) {
        icon.className = 'fas fa-volume-down';
        this.elements.volumeFill.style.width = `${this.state.volume * 100}%`;
      } else {
        icon.className = 'fas fa-volume-up';
        this.elements.volumeFill.style.width = `${this.state.volume * 100}%`;
      }
    },

    // Basculer entre play et pause
    togglePlay: function() {
      if (!this.elements.video) return;
      
      if (this.state.isPlaying) {
        this.elements.video.pause();
      } else {
        this.elements.video.play().catch(error => {
          console.log("La lecture automatique a été bloquée");
        });
      }
      
      this.state.isPlaying = !this.state.isPlaying;
      this.updatePlayButton();
    },

    // Basculer entre muet et son
    toggleMute: function() {
      if (!this.elements.video) return;
      
      this.elements.video.muted = !this.elements.video.muted;
      this.state.isMuted = this.elements.video.muted;
      this.updateVolumeUI();
    },

    // Changer le volume
    changeVolume: function(delta) {
      if (!this.elements.video) return;
      
      let newVolume = this.state.volume + delta;
      newVolume = Math.max(0, Math.min(1, newVolume));
      
      this.elements.video.volume = newVolume;
      this.state.volume = newVolume;
      this.updateVolumeUI();
    },

    // Gérer le changement de volume par clic
    handleVolumeChange: function(e) {
      if (!this.elements.volumeSlider || !this.elements.video) return;
      
      const rect = this.elements.volumeSlider.getBoundingClientRect();
      const position = (e.clientX - rect.left) / rect.width;
      const newVolume = Math.max(0, Math.min(1, position));
      
      this.elements.video.volume = newVolume;
      this.state.volume = newVolume;
      this.state.isMuted = (newVolume === 0);
      this.elements.video.muted = this.state.isMuted;
      this.updateVolumeUI();
    },

    // Démarrer le drag du volume
    startVolumeDrag: function(e) {
      this.state.isDraggingVolume = true;
      this.handleVolumeChange(e);
    },

    // Gérer le drag du volume
    handleVolumeDrag: function(e) {
      if (this.state.isDraggingVolume) {
        this.handleVolumeChange(e);
      }
    },

    // Arrêter le drag du volume
    stopVolumeDrag: function() {
      this.state.isDraggingVolume = false;
    },

    // Chercher dans la vidéo
    seek: function(e) {
      if (!this.elements.progressContainer || !this.elements.video) return;
      
      const rect = this.elements.progressContainer.getBoundingClientRect();
      const position = (e.clientX - rect.left) / rect.width;
      const seekTime = this.state.duration * position;
      
      this.elements.video.currentTime = seekTime;
      this.state.currentTime = seekTime;
      this.updateProgressBar();
      this.updateTimeDisplay();
    },

    // Démarrer le drag de la barre de progression
    startProgressDrag: function(e) {
      this.state.isDraggingProgress = true;
      this.state.isUserSeeking = true;
      this.handleProgressDrag(e);
    },

    // Gérer le drag de la barre de progression
    handleProgressDrag: function(e) {
      if (this.state.isDraggingProgress) {
        this.seek(e);
      }
    },

    // Arrêter le drag de la barre de progression
    stopProgressDrag: function() {
      this.state.isDraggingProgress = false;
      this.state.isUserSeeking = false;
    },

    // Sauter dans la vidéo (en secondes)
    skip: function(seconds) {
      if (!this.elements.video) return;
      
      let newTime = this.elements.video.currentTime + seconds;
      newTime = Math.max(0, Math.min(this.state.duration, newTime));
      
      this.elements.video.currentTime = newTime;
      this.state.currentTime = newTime;
      this.updateProgressBar();
      this.updateTimeDisplay();
    },

    // Passer en plein écran
    toggleFullscreen: function() {
      if (!this.elements.player) return;
      
      if (!document.fullscreenElement) {
        this.elements.player.requestFullscreen().catch(err => {
          console.log(`Erreur lors du passage en plein écran: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    },

    // Pour la démo uniquement - simuler une vidéo
    simulateVideo: function() {
      // Initialiser avec une durée fictive
      this.state.duration = 3572; // 59:32
      this.state.currentTime = 1054; // 17:34
      
      this.updateProgressBar();
      this.updateTimeDisplay();
      this.updateVolumeUI();
      
      // Gérer le clic sur les boutons même sans vidéo réelle
      const fakeBtns = document.querySelectorAll('.nino-control-button:not(.nino-play):not(:has(.fa-volume-up)):not(:has(.fa-expand))');
      fakeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
          // Afficher une notification
          const notif = document.createElement('div');
          notif.className = 'nino-notification nino-notification-info nino-fade-in';
          notif.innerHTML = `
            <div class="nino-notification-content">
              <div class="nino-notification-title">Fonctionnalité non disponible</div>
              <div class="nino-notification-message">Cette fonctionnalité est désactivée en mode démonstration.</div>
            </div>
            <button class="nino-notification-close"><i class="fas fa-times"></i></button>
          `;
          
          // Ajouter au DOM
          if (!document.querySelector('.nino-notification-container')) {
            const container = document.createElement('div');
            container.className = 'nino-notification-container';
            document.body.appendChild(container);
          }
          
          document.querySelector('.nino-notification-container').appendChild(notif);
          
          // Supprimer après 3 secondes
          setTimeout(() => {
            notif.style.opacity = '0';
            setTimeout(() => {
              notif.remove();
            }, 300);
          }, 3000);
        });
      });
    },

    // Gérer les interactions du chat
    initChatInteractions: function() {
      const chatInput = document.querySelector('.nino-message-input');
      const sendButton = document.querySelector('.nino-send-button');
      const messagesContainer = document.querySelector('.nino-chat-messages');
      
      if (!chatInput || !sendButton || !messagesContainer) return;
      
      // Envoyer un message
      const sendMessage = () => {
        const message = chatInput.value.trim();
        if (message === '') return;
        
        // Créer un nouveau message
        const newMessage = document.createElement('div');
        newMessage.className = 'nino-chat-message';
        newMessage.innerHTML = `
          <img class="nino-chat-avatar" src="/assets/images/avatar.jpg" alt="Avatar">
          <div class="nino-chat-content">
            <div class="nino-chat-user">
              Thomas
              <span class="nino-chat-dot"></span>
            </div>
            <div class="nino-chat-text">${message}</div>
          </div>
        `;
        
        // Ajouter au conteneur de messages
        messagesContainer.appendChild(newMessage);
        
        // Scroller en bas
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Vider l'input
        chatInput.value = '';
      };
      
      // Événement pour le bouton d'envoi
      sendButton.addEventListener('click', sendMessage);
      
      // Événement pour la touche Entrée
      chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          sendMessage();
        }
      });
    }
  };

  // Initialiser le lecteur vidéo quand le DOM est chargé
  document.addEventListener('DOMContentLoaded', function() {
    ninoPlayer.init();
    ninoPlayer.initChatInteractions();
  });

  // Exposer ninoPlayer globalement si nécessaire
  window.ninoPlayer = ninoPlayer;
})(); 