/**
 * scroll-reveal.js
 * Fait apparaître en fondu les cartes/sections quand elles entrent dans le
 * viewport. Utilise IntersectionObserver (performant, pas de listener de scroll).
 */

document.addEventListener('DOMContentLoaded', () => {
    const selecteurs = '.card, .notification-card, .doc-item, .quick-item';
    const elements = document.querySelectorAll(selecteurs);

    if (elements.length === 0) return;

    // Si le navigateur ne supporte pas IntersectionObserver, on affiche tout direct
    if (!('IntersectionObserver' in window)) {
        elements.forEach((el) => el.classList.add('reveal-visible'));
        return;
    }

    elements.forEach((el) => el.classList.add('reveal'));

    const observateur = new IntersectionObserver((entrees, obs) => {
        entrees.forEach((entree, index) => {
            if (!entree.isIntersecting) return;

            // Léger décalage entre chaque élément pour un effet de cascade
            setTimeout(() => {
                entree.target.classList.add('reveal-visible');
            }, index * 40);

            obs.unobserve(entree.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    elements.forEach((el) => observateur.observe(el));
});
