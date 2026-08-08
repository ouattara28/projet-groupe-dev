const CLE_THEME = 'citepay-theme';

const appliquerThemeInitial = () => {
    const themeSauvegarde = localStorage.getItem(CLE_THEME);
    const preferSysteme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = themeSauvegarde || (preferSysteme ? 'dark' : 'clair');

    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
};

appliquerThemeInitial();

document.addEventListener('DOMContentLoaded', () => {
    const boutons = document.querySelectorAll('.theme-toggle');
    if (boutons.length === 0) return;

    const estSombre = () => document.documentElement.getAttribute('data-theme') === 'dark';

    const mettreAJourIcones = () => {
        boutons.forEach((bouton) => {
            const icone = bouton.querySelector('.material-symbols-rounded');
            if (icone) icone.textContent = estSombre() ? 'light_mode' : 'dark_mode';
            bouton.setAttribute('aria-label', estSombre() ? 'Activer le mode clair' : 'Activer le mode sombre');
        });
    };

    mettreAJourIcones();

    boutons.forEach((bouton) => {
        bouton.addEventListener('click', () => {
            const nouveauTheme = estSombre() ? 'clair' : 'dark';

            if (nouveauTheme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.removeAttribute('data-theme');
            }

            localStorage.setItem(CLE_THEME, nouveauTheme);
            mettreAJourIcones();
        });
    });
});