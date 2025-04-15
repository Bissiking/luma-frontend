window.authPrompts = {
    login: {
        title: "Connexion à LUMA",
        messages: {
            success: "Connexion réussie, redirection en cours...",
            error: {
                invalidCredentials: "Identifiant ou mot de passe incorrect",
                accountInactive: "Votre compte est inactif, veuillez contacter un administrateur",
                serverError: "Une erreur est survenue lors de la connexion",
                networkError: "Impossible de se connecter au serveur"
            },
            loading: "Vérification de vos identifiants..."
        },
        fields: {
            username: "Nom d'utilisateur",
            password: "Mot de passe"
        },
        buttons: {
            submit: "Se connecter",
            cancel: "Annuler"
        }
    },
    tokenManagement: {
        errors: {
            expired: "Votre session a expiré, veuillez vous reconnecter",
            invalid: "Token d'authentification invalide",
            revoked: "Votre session a été révoquée",
            missing: "Authentification requise"
        },
        actions: {
            refresh: "Actualiser la session",
            logout: "Se déconnecter"
        }
    },
    notifications: {
        sessionExpired: "Votre session va expirer dans 5 minutes",
        autoLogout: "Vous serez déconnecté automatiquement dans 1 minute",
        connectionLost: "Connexion au serveur perdue, tentative de reconnexion..."
    }
}; 