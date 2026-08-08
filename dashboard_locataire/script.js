document.addEventListener('DOMContentLoaded', () => {
    /* ================= SIDEBAR TOGGLE ================= */
    const sidebar = document.querySelector('.sidebar');
    const toggleButtons = document.querySelectorAll('.sidebar-toggle');
    const logoPlaceholder = document.querySelector('.header-logo-placeholder');

    if (sidebar && toggleButtons.length > 0) {
        toggleButtons.forEach((button) => {
            button.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
                const isCollapsed = sidebar.classList.contains('collapsed');
                
                toggleButtons.forEach((btn) => {
                    btn.setAttribute('aria-expanded', String(!isCollapsed));
                });
            });
        });
    }

    /* Action de clic sur le logo pour déplier/replier la sidebar */
    if (logoPlaceholder && sidebar) {
        logoPlaceholder.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            const isCollapsed = sidebar.classList.contains('collapsed');
            
            toggleButtons.forEach((btn) => {
                btn.setAttribute('aria-expanded', String(!isCollapsed));
            });
        });
    }

    /* ================= TOOLTIP DES LIENS ================= */
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach((link) => {
        const label = link.querySelector('.menu-label');
        const text = label ? label.textContent.trim() : link.textContent.trim();
        if (text) {
            link.setAttribute('title', text);
            link.setAttribute('data-tooltip', text);
        }
    });

    /* ================= MARQUER COMME LUE ================= */
    const readButtons = document.querySelectorAll(".mark-read-btn");
    readButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const card = e.target.closest(".notification-card");
            if (card) {
                card.classList.remove("unread");
                card.setAttribute("data-status", "read");
                btn.remove();
            }
        });
    });

    /* ================= SYSTÈME DE FILTRAGE UNIFIÉ ================= */
    const filterChips = document.querySelectorAll('.filter-chip');

    filterChips.forEach((chip) => {
        chip.addEventListener('click', () => {
            filterChips.forEach((c) => c.classList.remove('active'));
            chip.classList.add('active');

            const filterValue = chip.getAttribute('data-filter');

            // 1. Filtrage des cartes de notifications
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

            // 2. Filtrage des sections (Paiements / Documents)
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

            // 3. Filtrage des cartes de réglages (Page Paramètres)
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

            // 4. Filtrage des lignes de tableaux
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