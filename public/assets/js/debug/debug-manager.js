// Simple fonction pour initialiser le fonctionnement du formulaire de débogage
function initDebugModal() {
    // Vérifier si l'utilisateur est connecté
    if (!document.getElementById('debug-button')) {
        console.log('Debug button not found - user not logged in');
        return;
    }

    const debugButton = document.getElementById('debug-button');
    const debugModal = document.querySelector('.debug-modal');
    const closeButton = document.querySelector('.debug-modal-close');
    const debugForm = document.querySelector('.debug-form');
    const imageUpload = document.getElementById('image-upload');
    const descriptionTextarea = debugForm.querySelector('textarea[name="description"]');
    
    // Zone de pasted pour les événements de paste
    const pasteZone = document.createElement('div');
    pasteZone.className = 'paste-zone';
    pasteZone.innerHTML = '<p>Collez une image ici (Ctrl+V)</p>';
    pasteZone.style.border = '2px dashed var(--border-color)';
    pasteZone.style.padding = '20px';
    pasteZone.style.marginTop = '10px';
    pasteZone.style.borderRadius = 'var(--rounded)';
    pasteZone.style.textAlign = 'center';
    pasteZone.style.cursor = 'pointer';
    
    // Insérer la zone de paste après le champ de description
    descriptionTextarea.parentNode.insertBefore(pasteZone, descriptionTextarea.nextSibling);
    
    // Images stockées
    let imageData = [];

    // Fonction pour afficher le modal
    function showModal() {
        console.log('Ouverture du modal de débogage');
        debugModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Fonction pour cacher le modal
    function hideModal() {
        debugModal.style.display = 'none';
        document.body.style.overflow = '';
    }

    // Ajouter les événements
    debugButton.addEventListener('click', showModal);
    closeButton.addEventListener('click', hideModal);

    // Gérer l'upload d'images via input file
    imageUpload.addEventListener('change', function(e) {
        const files = e.target.files;
        handleFiles(files);
    });
    
    // Fonction pour gérer les fichiers (utilisée par drag&drop et input file)
    function handleFiles(files) {
        const preview = document.getElementById('image-preview');
        
        for (let file of files) {
            if (!file.type.match('image.*')) continue;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                addImageToPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }
    
    // Fonction pour ajouter une image à la prévisualisation
    function addImageToPreview(dataUrl) {
        const preview = document.getElementById('image-preview');
        
        // Créer le conteneur pour l'image avec bouton de suppression
        const container = document.createElement('div');
        container.className = 'image-preview-container';
        container.style.position = 'relative';
        container.style.display = 'inline-block';
        container.style.margin = '5px';
        
        // Créer l'image
        const img = document.createElement('img');
        img.src = dataUrl;
        img.className = 'debug-image-preview';
        
        // Créer le bouton de suppression
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '&times;';
        deleteBtn.className = 'image-delete-btn';
        deleteBtn.style.position = 'absolute';
        deleteBtn.style.top = '5px';
        deleteBtn.style.right = '5px';
        deleteBtn.style.backgroundColor = 'rgba(0,0,0,0.6)';
        deleteBtn.style.color = 'white';
        deleteBtn.style.border = 'none';
        deleteBtn.style.borderRadius = '50%';
        deleteBtn.style.width = '25px';
        deleteBtn.style.height = '25px';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.display = 'flex';
        deleteBtn.style.alignItems = 'center';
        deleteBtn.style.justifyContent = 'center';
        
        // Événement pour supprimer l'image
        deleteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const index = imageData.indexOf(dataUrl);
            if (index > -1) {
                imageData.splice(index, 1);
            }
            container.remove();
        });
        
        // Ajouter les éléments
        container.appendChild(img);
        container.appendChild(deleteBtn);
        preview.appendChild(container);
        
        // Stocker l'image
        imageData.push(dataUrl);
    }
    
    // Gérer le collage (paste) d'images
    document.addEventListener('paste', function(e) {
        // Vérifier si le modal est visible
        if (debugModal.style.display !== 'block') return;
        
        console.log('Paste détecté dans le modal');
        
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        let hasImage = false;
        
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') === 0) {
                hasImage = true;
                const blob = items[i].getAsFile();
                const reader = new FileReader();
                reader.onload = function(event) {
                    addImageToPreview(event.target.result);
                };
                reader.readAsDataURL(blob);
            }
        }
        
        // Empêcher le collage par défaut si c'est une image
        if (hasImage) {
            e.preventDefault();
        }
    });
    
    // Permettre le drag & drop d'images
    pasteZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        pasteZone.style.backgroundColor = 'var(--bg-hover)';
    });
    
    pasteZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        pasteZone.style.backgroundColor = '';
    });
    
    pasteZone.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        pasteZone.style.backgroundColor = '';
        
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    });
    
    // Permettre de cliquer sur la zone pour ouvrir le sélecteur de fichier
    pasteZone.addEventListener('click', function() {
        imageUpload.click();
    });

    // Gérer la soumission du formulaire
    debugForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(debugForm);

        // Faire disparaitre le bouton d'envoie
        debugForm.querySelector('button[type="submit"]').disabled = true;
        debugForm.querySelector('button[type="submit"]').innerHTML = 'Envoie en cours...';

        try {
            // Utiliser axios directement avec la configuration par défaut
            const response = await axios.post(`${window.API_URL}/debug/reports`, {
                title: formData.get('title'),
                description: formData.get('description'),
                priority: formData.get('priority'),
                images: imageData
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            showPopup('success', 'Succès', 'Le rapport de bug a été envoyé avec succès.', 4000);
            hideModal();
            debugForm.reset();
            document.getElementById('image-preview').innerHTML = '';
            imageData = [];

            // Réactiver le bouton d'envoie
            debugForm.querySelector('button[type="submit"]').disabled = false;
            debugForm.querySelector('button[type="submit"]').innerHTML = 'Envoyer';
        } catch (error) {
            console.error('Erreur lors de l\'envoi du rapport:', error);
            showPopup('error', 'Erreur', 'Une erreur est survenue lors de l\'envoi du rapport.', 4000);
            // Réactiver le bouton d'envoie
            debugForm.querySelector('button[type="submit"]').disabled = false;
            debugForm.querySelector('button[type="submit"]').innerHTML = 'Envoyer';
        }
    });
}

// Initialiser quand le DOM est chargé
document.addEventListener('DOMContentLoaded', initDebugModal);

// Fallback au cas où le DOMContentLoaded a déjà été déclenché
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initDebugModal, 1);
} 