/**
 * interactions.js
 * Gestion dynamique des interactions utilisateur (paiements, formulaires, notifications toast)
 */

document.addEventListener('DOMContentLoaded', () => {
    initSidebarMobileParDefaut();
    initBoutonsPaiement();
    initBoutonsTelechargement();
    initFormulaires();
});

/* ================= TOASTS ================= */

function getConteneurToasts() {
    let conteneur = document.querySelector('.toast-container');
    if (!conteneur) {
        conteneur = document.createElement('div');
        conteneur.className = 'toast-container';
        document.body.appendChild(conteneur);
    }
    return conteneur;
}

function afficherToast(message, type = 'succes') {
    const conteneur = getConteneurToasts();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icone = type === 'succes' ? 'check_circle' : 'error';
    toast.innerHTML = `<span class="material-symbols-rounded">${icone}</span><span>${message}</span>`;

    conteneur.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

/* ================= PAIEMENT DYNAMIQUE ================= */

function initBoutonsPaiement() {
    document.querySelectorAll('[data-action="pay"], .btn-primary').forEach(bouton => {
        if (!/payer/i.test(bouton.textContent)) return;
        bouton.addEventListener('click', (e) => gererClicPaiement(e, bouton));
    });
}

function gererClicPaiement(event, bouton) {
    // Récupération dynamique des valeurs depuis les attributs HTML ou le DOM
    const conteneur = bouton.closest('tr, .payment-hero-card, .card');
    const montant = bouton.dataset.amount || conteneur?.dataset.amount || '0';
    const libelle = bouton.dataset.description || conteneur?.querySelector('h2, td')?.textContent.trim() || 'Loyer';
    const moyenPaiement = bouton.dataset.provider || 'moyen de paiement sélectionné';

    ouvrirModal({
        titre: `Paiement — ${libelle}`,
        contenu: `Vous êtes sur le point de régler <strong>${montant}</strong>. Confirmez-vous cette opération ?`,
        boutons: [
            { texte: 'Annuler', classe: 'btn-secondary' },
            {
                texte: 'Confirmer le paiement',
                classe: 'btn-primary',
                surClic: () => executerPaiement(bouton, montant, moyenPaiement)
            }
        ]
    });
}

async function executerPaiement(bouton, montant, moyenPaiement) {
    fermerModal();

    const contenuOriginal = bouton.innerHTML;
    bouton.disabled = true;
    bouton.style.opacity = '0.7';
    bouton.innerHTML = 'Traitement...';

    try {
        // Appels d'API dynamiques
        if (typeof apiInitierPaiement === 'function') {
            await apiInitierPaiement({ montant, moyenPaiement });
        }

        afficherToast('Paiement effectué avec succès');

        const banniere = document.getElementById('hero-banniere');
        if (banniere) banniere.style.display = 'none';

        const statutEl = document.getElementById('stat-statut');
        if (statutEl) {
            statutEl.textContent = 'À jour';
            statutEl.classList.add('text-success');
        }

        const ligne = bouton.closest('tr');
        if (ligne) {
            const badge = ligne.querySelector('.status-badge');
            if (badge) {
                badge.textContent = 'Payé';
                badge.className = 'status-badge paid';
            }
            const celluleAction = bouton.closest('td');
            if (celluleAction) celluleAction.innerHTML = '<span class="status-badge paid">Réglé</span>';
        }
    } catch (erreur) {
        afficherToast(erreur.message || 'Le paiement a échoué', 'erreur');
        bouton.disabled = false;
        bouton.style.opacity = '1';
        bouton.innerHTML = contenuOriginal;
    }
}

/* ================= TÉLÉCHARGEMENTS ================= */

function initBoutonsTelechargement() {
    document.querySelectorAll('.btn-icon, [data-action="download"]').forEach(bouton => {
        const icone = bouton.querySelector('.material-symbols-rounded');
        if (!icone || icone.textContent.trim() !== 'download') return;

        bouton.addEventListener('click', () => {
            const conteneur = bouton.closest('.doc-item, tr');
            const titre = conteneur?.querySelector('.doc-title')?.textContent.trim()
                || conteneur?.querySelector('td')?.textContent.trim()
                || 'document';

            afficherToast(`Téléchargement de "${titre}" démarré`);
        });
    });
}

/* ================= FORMULAIRES ================= */

function initFormulaires() {
    document.querySelectorAll('form:not(#loginForm)').forEach(form => {
        form.addEventListener('submit', (evenement) => {
            evenement.preventDefault();

            if (typeof formulaireEstValide === 'function' && !formulaireEstValide(form)) {
                afficherToast('Merci de corriger les champs requis', 'erreur');
                return;
            }

            afficherToast('Modifications enregistrées');
        });
    });
}

/* ================= NAVIGATION MOBILE ================= */

function initSidebarMobileParDefaut() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    if (window.innerWidth <= 768) {
        sidebar.classList.add('collapsed');
        document.querySelectorAll('.sidebar-toggle').forEach(bouton => {
            bouton.setAttribute('aria-expanded', 'false');
        });
    }
}


/* ================= REDIRECTION ET PAIEMENT ================= */

const REDIRECTIONS_MOYENS_PAIEMENT = {
    'Wave': 'https://pay.wave.com/',
    'MTN Mobile Money': 'https://checkout.mtn.ci/',
    'Orange Money': 'https://om.orange.ci/'
};

async function executerPaiement(bouton, montant, moyenPaiement) {
    fermerModal();

    const contenuOriginal = bouton.innerHTML;
    bouton.disabled = true;
    bouton.style.opacity = '0.7';
    bouton.innerHTML = 'Redirection en cours...';

    afficherToast(`Redirection vers ${moyenPaiement}...`);

    // Récupération de l'URL du portail de paiement
    const urlRedirection = REDIRECTIONS_MOYENS_PAIEMENT[moyenPaiement] || REDIRECTIONS_MOYENS_PAIEMENT['Wave'];

    setTimeout(() => {
        // Redirection vers la passerelle de paiement de l'opérateur choisi
        window.location.href = urlRedirection;
    }, 1200);
}