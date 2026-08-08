/**
 * modal.js
 * Composant modal générique : construit le HTML dynamiquement, gère
 * l'overlay, la fermeture (croix, clic dehors, touche Échap) et les boutons
 * d'action personnalisés.
 *
 * Utilisation :
 *   ouvrirModal({
 *       titre: "Confirmer le paiement",
 *       contenu: "Vous allez régler 295 000 FCFA. Continuer ?",
 *       boutons: [
 *           { texte: "Annuler", classe: "btn-secondary" },
 *           { texte: "Confirmer", classe: "btn-primary", surClic: () => { ... } }
 *       ]
 *   });
 */

function ouvrirModal({ titre, contenu, boutons = [] }) {
    fermerModal(); // sécurité : jamais deux modales en même temps

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'modal-actif';

    const boutonsHtml = boutons
        .map((b, i) => `<button type="button" class="${b.classe || 'btn-secondary'}" data-index-bouton="${i}">${b.texte}</button>`)
        .join('');

    overlay.innerHTML = `
        <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="modal-titre">
            <div class="modal-header">
                <h3 id="modal-titre">${titre}</h3>
                <button type="button" class="modal-fermer" aria-label="Fermer">
                    <span class="material-symbols-rounded">close</span>
                </button>
            </div>
            <div class="modal-body">${contenu}</div>
            <div class="modal-footer">${boutonsHtml}</div>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden'; // empêche le scroll en fond

    // Affichage avec transition (classe ajoutée au prochain frame)
    requestAnimationFrame(() => overlay.classList.add('show'));

    // Fermeture : croix, clic sur l'overlay, touche Échap
    overlay.querySelector('.modal-fermer').addEventListener('click', fermerModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) fermerModal();
    });
    document.addEventListener('keydown', gererEchap);

    // Branche les actions personnalisées de chaque bouton
    overlay.querySelectorAll('.modal-footer button').forEach((btn, i) => {
        btn.addEventListener('click', () => {
            const action = boutons[i]?.surClic;
            if (action) action();
            else fermerModal();
        });
    });
}

function gererEchap(e) {
    if (e.key === 'Escape') fermerModal();
}

function fermerModal() {
    const overlay = document.getElementById('modal-actif');
    if (!overlay) return;

    overlay.classList.remove('show');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', gererEchap);

    setTimeout(() => overlay.remove(), 200);
}
