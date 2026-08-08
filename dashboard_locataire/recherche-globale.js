/**
 * recherche-globale.js
 * Branche la barre de recherche présente dans la sidebar sur chaque page :
 * filtre en temps réel les lignes de tableau, documents ou notifications
 * visibles à l'écran, sans rien recharger.
 */

document.addEventListener('DOMContentLoaded', () => {
    const champRecherche = document.querySelector('.search-form input[type="search"]');
    if (!champRecherche) return;

    // Éléments "recherchables" sur la page courante (certains n'existeront pas
    // selon la page, querySelectorAll renvoie juste une liste vide dans ce cas)
    const cibles = [
        ...document.querySelectorAll('.data-table tbody tr'),
        ...document.querySelectorAll('.doc-item'),
        ...document.querySelectorAll('.notification-card'),
        ...document.querySelectorAll('.quick-item'),
    ];

    if (cibles.length === 0) return;

    let messageAucunResultat = null;

    const afficherMessageVide = (visible) => {
        if (!messageAucunResultat) {
            messageAucunResultat = document.createElement('p');
            messageAucunResultat.className = 'recherche-vide';
            messageAucunResultat.textContent = 'Aucun résultat pour cette recherche.';
            champRecherche.closest('.main-content')?.querySelector('section, .notification-list, .document-section')
                ?.insertAdjacentElement('beforebegin', messageAucunResultat);
        }
        messageAucunResultat.style.display = visible ? 'block' : 'none';
    };

    champRecherche.addEventListener('input', () => {
        const terme = champRecherche.value.trim().toLowerCase();
        let resultatsTrouves = 0;

        cibles.forEach((element) => {
            const texte = element.textContent.toLowerCase();
            const correspond = terme === '' || texte.includes(terme);
            element.style.display = correspond ? '' : 'none';
            if (correspond) resultatsTrouves += 1;
        });

        afficherMessageVide(terme !== '' && resultatsTrouves === 0);
    });
});
