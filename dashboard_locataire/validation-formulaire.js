/**
 * validation-formulaire.js
 * Validation en temps réel : bordure verte/rouge + message d'erreur sous le
 * champ, dès que l'utilisateur quitte un champ requis ou de type email.
 * N'intercepte PAS la soumission : chaque page garde son propre gestionnaire
 * de submit (login.js, interactions.js...). Ce module ajoute juste le retour
 * visuel, et expose formulaireEstValide() pour que ces gestionnaires puissent
 * bloquer l'envoi si besoin.
 */

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validerChamp(champ) {
    const conteneur = champ.closest('.form-group, .input-wrapper')?.parentElement || champ.parentElement;
    let messageErreur = conteneur.querySelector('.validation-message');

    const definirEtat = (valide, message) => {
        champ.classList.toggle('champ-invalide', !valide);
        champ.classList.toggle('champ-valide', valide && champ.value.trim() !== '');

        if (!valide) {
            if (!messageErreur) {
                messageErreur = document.createElement('span');
                messageErreur.className = 'validation-message';
                conteneur.appendChild(messageErreur);
            }
            messageErreur.textContent = message;
        } else if (messageErreur) {
            messageErreur.remove();
            messageErreur = null;
        }
    };

    const valeur = champ.value.trim();

    if (champ.hasAttribute('required') && valeur === '') {
        definirEtat(false, 'Ce champ est requis.');
        return false;
    }

    if (champ.type === 'email' && valeur !== '' && !REGEX_EMAIL.test(valeur)) {
        definirEtat(false, 'Adresse e-mail invalide.');
        return false;
    }

    if (champ.type === 'password' && champ.hasAttribute('required') && valeur.length > 0 && valeur.length < 4) {
        definirEtat(false, 'Mot de passe trop court (4 caractères min.).');
        return false;
    }

    definirEtat(true, '');
    return true;
}

function formulaireEstValide(form) {
    const champs = form.querySelectorAll('input[required], input[type="email"]');
    let toutValide = true;

    champs.forEach((champ) => {
        if (!validerChamp(champ)) toutValide = false;
    });

    return toutValide;
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[required], input[type="email"]').forEach((champ) => {
        champ.addEventListener('blur', () => validerChamp(champ));

        // Une fois qu'une erreur est affichée, on revalide au fur et à mesure
        // de la frappe pour que le message disparaisse dès que c'est corrigé
        champ.addEventListener('input', () => {
            if (champ.classList.contains('champ-invalide')) validerChamp(champ);
        });
    });
});
