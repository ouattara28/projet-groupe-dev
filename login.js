/**
 * login.js
 * Gère le formulaire de la page connexion.html :
 * - affiche/masque le mot de passe
 * - envoie les identifiants à mockLogin (à remplacer par la vraie API plus tard)
 * - affiche une erreur en cas d'échec, redirige vers index.html en cas de succès
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const submitBtn = document.getElementById('submitBtn');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');

    // Si déjà connecté, inutile de repasser par la connexion
    if (localStorage.getItem('token')) {
        window.location.href = "index.html";
        return;
    }

    // Afficher / masquer le mot de passe
    if (togglePasswordBtn && passwordInput && eyeIcon) {
        togglePasswordBtn.addEventListener('click', () => {
            const estMasque = passwordInput.type === 'password';
            passwordInput.type = estMasque ? 'text' : 'password';
            eyeIcon.textContent = estMasque ? 'visibility_off' : 'visibility';
        });
    }

    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Validation en temps réel (fournie par validation-formulaire.js)
        if (typeof formulaireEstValide === 'function' && !formulaireEstValide(form)) {
            return;
        }

        const email = document.getElementById('email').value.trim();
        const motDePasse = document.getElementById('password').value;

        afficherErreur(""); // on efface une éventuelle erreur précédente
        definirChargement(true);

        try {
            await mockLogin(email, motDePasse);
            window.location.href = "index.html";
        } catch (erreur) {
            afficherErreur(erreur.message || "Une erreur est survenue, réessayez.");
            definirChargement(false);
        }
    });

    function definirChargement(enCours) {
        submitBtn.disabled = enCours;
        submitBtn.style.opacity = enCours ? "0.7" : "1";
        submitBtn.querySelector('span').textContent = enCours ? "Connexion..." : "Se connecter";
    }

    function afficherErreur(message) {
        let erreurEl = document.getElementById('login-erreur');

        if (!erreurEl) {
            erreurEl = document.createElement('p');
            erreurEl.id = 'login-erreur';
            erreurEl.style.color = '#e53e3e';
            erreurEl.style.fontSize = '0.85rem';
            erreurEl.style.textAlign = 'center';
            erreurEl.style.marginTop = '-8px';
            form.insertBefore(erreurEl, submitBtn);
        }

        erreurEl.textContent = message;
    }
});
