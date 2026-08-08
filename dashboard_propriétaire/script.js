/**
 * ==========================================================================
 * FICHIER SCRIPT.JS — APPLICATION CITÉPAY
 * --------------------------------------------------------------------------
 * Fonctionnalités principales gérées :
 *   1. Gestion de la barre latérale (Sidebar) : Réduction, expansion et accessibilité.
 *   2. Gestion des infobulles (Tooltips) dynamiques pour la navigation.
 *   3. Marquage des notifications comme lues.
 *   4. Système de filtrage unifié pour les tableaux, sections, et listes.
 * ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    /* ================= 1. SIDEBAR TOGGLE & RESPONSIVE ================= */
    /* Pages rattachées : index.html, biens.html, locataires.html, finances.html, notifications.html, parametres.html */
    
    // Sélection des éléments clés de la barre latérale et des boutons associés
    const sidebar = document.querySelector('.sidebar');
    const toggleButtons = document.querySelectorAll('.sidebar-toggle');
    const logoPlaceholder = document.querySelector('.header-logo-placeholder');

    // Gestion du clic sur les boutons de bascule de la sidebar
    if (sidebar && toggleButtons.length > 0) {
        toggleButtons.forEach((button) => {
            button.addEventListener('click', () => {
                // Bascule de la classe 'collapsed' pour réduire ou étendre la barre
                sidebar.classList.toggle('collapsed');
                const isCollapsed = sidebar.classList.contains('collapsed');
                
                // Mise à jour de l'attribut d'accessibilité aria-expanded sur tous les boutons
                toggleButtons.forEach((btn) => {
                    btn.setAttribute('aria-expanded', String(!isCollapsed));
                });
            });
        });
    }

    /* Action de clic alternative sur le logo pour déplier/replier la sidebar */
    if (logoPlaceholder && sidebar) {
        logoPlaceholder.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            const isCollapsed = sidebar.classList.contains('collapsed');
            
            toggleButtons.forEach((btn) => {
                btn.setAttribute('aria-expanded', String(!isCollapsed));
            });
        });
    }

    /* ================= 2. TOOLTIP DES LIENS ================= */
    /* Pages rattachées : index.html, biens.html, locataires.html, finances.html, notifications.html, parametres.html */
    
    // Génération automatique des info-bulles (titres et data-tooltip) pour les liens de navigation
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach((link) => {
        const label = link.querySelector('.menu-label');
        const text = label ? label.textContent.trim() : link.textContent.trim();
        if (text) {
            link.setAttribute('title', text);
            link.setAttribute('data-tooltip', text);
        }
    });

    /* ================= 3. MARQUER COMME LUE ================= */
    /* Page rattachée : notifications.html */
    
    // Gestion du clic sur le bouton pour marquer une notification spécifique comme lue
    const readButtons = document.querySelectorAll(".mark-read-btn");
    readButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const card = e.target.closest(".notification-card");
            if (card) {
                // Suppression du style non-lu et mise à jour du statut de la carte
                card.classList.remove("unread");
                card.setAttribute("data-status", "read");
                // Suppression du bouton d'action une fois lue
                btn.remove();
            }
        });
    });

    /* ================= 4. SYSTÈMES DE FILTRAGE UNIFIÉ ================= */
    /* Pages rattachées : paiements.html, documents.html, notifications.html, parametres.html */
    
    const filterChips = document.querySelectorAll('.filter-chip');

    // Écouteur d'événement sur chaque puce de filtre pour trier dynamiquement le contenu affiché
    filterChips.forEach((chip) => {
        chip.addEventListener('click', () => {
            // Réinitialisation de la classe active sur l'ensemble des puces de filtre
            filterChips.forEach((c) => c.classList.remove('active'));
            // Activation de la puce sélectionnée
            chip.classList.add('active');

            const filterValue = chip.getAttribute('data-filter');

            // 1. Filtrage des cartes de notifications (notifications.html)
            const notifCards = document.querySelectorAll('.notification-card');
            if (notifCards.length > 0) {
                notifCards.forEach((card) => {
                    const category = card.getAttribute('data-category');
                    const status = card.getAttribute('data-status');

                    if (filterValue === 'all') {
                        card.style.display = '';
                    } else if (filterValue === 'unread' && status === 'unread') {
                        card.style.display = '';
                    } else if (filterValue === category) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }

            // 2. Filtrage des sections (paiements.html / documents.html)
            const sections = document.querySelectorAll('.payment-section, .document-section');
            if (sections.length > 0) {
                sections.forEach((sec) => {
                    const secType = sec.getAttribute('data-section-type');
                    if (filterValue === 'all' || secType === filterValue) {
                        sec.style.display = '';
                    } else {
                        sec.style.display = 'none';
                    }
                });
            }

            // 3. Filtrage des cartes de réglages (parametres.html)
            const settingsCards = document.querySelectorAll('.settings-card');
            if (settingsCards.length > 0) {
                settingsCards.forEach((card) => {
                    const category = card.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }

            // 4. Filtrage des lignes de tableaux (finances.html / paiements.html)
            const tableRows = document.querySelectorAll('.data-table tbody tr');
            if (tableRows.length > 0) {
                tableRows.forEach((row) => {
                    const statusBadge = row.querySelector('.status-badge');
                    const category = row.getAttribute('data-category') || row.getAttribute('data-status');

                    if (filterValue === 'all') {
                        row.style.display = '';
                    } else if (statusBadge) {
                        if (filterValue === 'pending' && statusBadge.classList.contains('pending')) {
                            row.style.display = '';
                        } else if (filterValue === 'paid' && statusBadge.classList.contains('paid')) {
                            row.style.display = '';
                        } else {
                            row.style.display = 'none';
                        }
                    } else if (category && category === filterValue) {
                        row.style.display = '';
                    } else if (category) {
                        row.style.display = 'none';
                    }
                });
            }
        });
    });
});