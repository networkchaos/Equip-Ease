import { initRouter, navigateTo } from 'services/router.js';
import { getCurrentUser, addAuthChangeListener, logout } from 'services/auth.js';
import { renderHeader } from 'components/header.js';
import { renderNav } from 'components/nav.js';
import { renderFooter } from 'components/footer.js';

const mainElement = document.getElementById('app-main');
const headerElement = document.getElementById('app-header');
const navElement = document.getElementById('app-nav');
const footerElement = document.getElementById('app-footer');

function updateUI(user) {
    renderHeader(headerElement, user, handleLogout);
    renderNav(navElement, user);
    renderFooter(footerElement); // Safe to render again, handles idempotently
}

async function handleLogout() {
    await logout();
    updateUI(null);
    navigateTo('#/login');
}

function init() {
    const currentUser = getCurrentUser();
    updateUI(currentUser);

    // Set up router
    initRouter(mainElement, currentUser);

    // Handle auth state changes (e.g. login, logout)
    addAuthChangeListener((user) => {
        updateUI(user);

        if (!user && !['#/login', '#/register'].includes(location.hash)) {
            navigateTo('#/login');
        } else if (user && ['#/login', '#/register'].includes(location.hash)) {
            navigateTo('#/dashboard');
        }

        // Re-init router with new user (for role-based or auth-guarded pages)
        initRouter(mainElement, user);
        window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    // Trigger route handler initially
    window.dispatchEvent(new HashChangeEvent('hashchange'));

    console.log('Equip Ease App Initialized');
}

init();
