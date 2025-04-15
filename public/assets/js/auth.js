console.log("Script OK");
console.log(API_URL);


function togglePasswordVisibility(button) {
  const passwordInput = button.parentElement.querySelector('input');
  const icon = button.querySelector('i');

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    passwordInput.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');
  const errorText = document.getElementById('error-text');
  const loginButton = document.getElementById('login-button');
  const buttonText = loginButton.querySelector('.button-text');
  const loadingSpinner = loginButton.querySelector('.loading-spinner');

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Afficher le spinner et désactiver le bouton
    buttonText.classList.add('hidden');
    loadingSpinner.classList.remove('hidden');
    loginButton.disabled = true;

    // Récupérer les données du formulaire
    const formData = {
      username: document.getElementById('username').value,
      password: document.getElementById('password').value,
      remember_me: document.getElementById('remember_me').checked
    };

    
    // ÉTAPE 1: Authentification directe avec l'API
    axios.post(`${API_URL}/auth/login`, formData)
      .then(function (apiResponse) {
        // Stocker le token dans le localStorage pour les apps qui en ont besoin
        if (apiResponse.data.token || apiResponse.data.data?.token) {
          const token = apiResponse.data.token || apiResponse.data.data.token;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(apiResponse.data.user || apiResponse.data.data.user));
        }

        // ÉTAPE 2: Créer la session Express
        if (apiResponse.data.success || apiResponse.data.token || apiResponse.data.data?.token) {
          const userData = apiResponse.data.user || apiResponse.data.data?.user;
          const token = apiResponse.data.token || apiResponse.data.data?.token;

          // Crée la session côté Express
          return axios.post('/auth/create-session', {
            user: userData,
            token: token,
            remember_me: formData.remember_me
          });
        } else {
          throw new Error(apiResponse.data.message || 'Erreur lors de la connexion');
        }
      })
      .catch(function (apiError) {
        // Si l'erreur est due à un problème SSL ou réseau avec l'API externe,
        // tentons une connexion directe via le service backend
        if (apiError.code === 'EPROTO' || apiError.code === 'ECONNREFUSED' || !apiError.response) {
          console.warn('Erreur de connexion directe à l\'API:', apiError.message);
          console.log('Tentative de connexion via le backend...');

          // On passe par le backend pour éviter l'erreur SSL
          return axios.post('/auth/login', formData);
        } else {
          // Si c'est une autre erreur, la propager
          throw apiError;
        }
      })
      .then(function (sessionResponse) {
        // ÉTAPE 3: Si la session a été créée, rediriger l'utilisateur
        if (sessionResponse.data.success) {
          // Afficher un popup de succès avec la fonction window.showPopup
          if (window.showPopup) {
            window.showPopup('success', 'Connexion réussie', 'Vous allez être redirigé...', 2000);
          } else {
            // Fallback si la fonction n'existe pas
            const successMessage = document.createElement('div');
            successMessage.className = 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4';
            successMessage.innerHTML = '<span>Connexion réussie. Redirection...</span>';
            loginForm.prepend(successMessage);
          }

          // Redirection après un court délai
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
        } else {
          throw new Error(sessionResponse.data.message || 'Erreur lors de la création de session');
        }
      })
      .catch(function (error) {
        // Gérer les différents types d'erreurs
        let errorMsg = 'Erreur de connexion au serveur';

        if (error.response) {
          // La requête a été faite et le serveur a répondu avec un code d'erreur
          switch (error.response.status) {
            case 401:
              errorMsg = 'Identifiants invalides';
              break;
            case 422:
              errorMsg = 'Veuillez remplir tous les champs requis';
              break;
            case 500:
              errorMsg = 'Une erreur est survenue sur le serveur';
              break;
            default:
              errorMsg = error.response.data?.message || error.message || errorMsg;
          }
        } else if (error.request) {
          // La requête a été faite mais aucune réponse n'a été reçue
          errorMsg = 'Le serveur est inaccessible';
        } else {
          errorMsg = error.message || errorMsg;
        }

        console.error('Erreur:', error);

        // Afficher l'erreur avec le popup si disponible
        if (window.showPopup) {
          window.showPopup('error', 'Erreur de connexion', errorMsg, 3000);
        } else {
          // Fallback avec affichage d'erreur classique
          errorText.textContent = errorMsg;
          errorMessage.classList.remove('hidden');
        }

        // Réinitialiser le bouton
        buttonText.classList.remove('hidden');
        loadingSpinner.classList.add('hidden');
        loginButton.disabled = false;
      });
  });
}); 