/*
  citepay.js
  Ce fichier contient le JavaScript extrait du HTML original.
  Il gère la navigation entre les pages (onglets du bas) et
  peut être étendu pour d'autres interactions (filtres, toggles, etc.).

  Commentaires rapides :
  - `navItems` : boutons de la navigation en bas
  - `pages` : sections principales de l'UI identifiées par `id` (page-home, page-payments...)
  - au clic sur un `nav-item` : on change la classe active, on masque les pages et on affiche la bonne page
*/

document.addEventListener('DOMContentLoaded', () => {
  // Sélection des éléments
  const navItems = document.querySelectorAll('.nav-item');
  const pages = document.querySelectorAll('.page');
  const screen = document.querySelector('.screen');

  // Ajoute le comportement de navigation pour chaque bouton
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // Retire l'état actif de tous les boutons
      navItems.forEach(n => n.classList.remove('active'));
      // Marque le bouton cliqué comme actif
      item.classList.add('active');

      // Cache toutes les pages, puis affiche celle liée au bouton
      pages.forEach(p => p.style.display = 'none');
      const target = document.getElementById(item.dataset.page);
      if (target) target.style.display = 'block';

      // Remonte le scroll du conteneur vers le haut
      if (screen) screen.scrollTop = 0;
    });
  });
});

/* Extensions possibles :
   - gestion des `filter-chip` (ajouter / retirer la classe active)
   - animations pour l'ouverture des overlays
   - interactions des toggles et cartes de paiement
*/
