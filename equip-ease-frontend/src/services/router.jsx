import {
  renderHomePage,
  renderLoginPage,
  renderRegisterPage,
  renderDashboardPage,
  renderListingsPage,
  renderEquipmentDetailsPage,
  renderMyRentalsPage,
  renderMyEquipmentPage,
  renderPaymentsPage,
  renderReviewsPage,
  renderMaintenancePage,
  renderNotificationsPage,
  renderCommunityPage,
  renderAdminDashboardPage,
  renderNotFoundPage,
} from '../legacy-renderers';

let mainContentElement;
let currentUser = null;

const routes = {
  '#/': renderHomePage,
  '#/login': renderLoginPage,
  '#/register': renderRegisterPage,
  '#/dashboard': renderDashboardPage,
  '#/listings': renderListingsPage,
  '#/my-rentals': renderMyRentalsPage,
  '#/my-equipment': renderMyEquipmentPage,
  '#/my-equipment/new': renderMyEquipmentPage,
  '#/payments': renderPaymentsPage,
  '#/reviews': renderReviewsPage,
  '#/maintenance': renderMaintenancePage,
  '#/notifications': renderNotificationsPage,
  '#/community': renderCommunityPage,
  '#/admin': renderAdminDashboardPage,
};

// Dynamic matching
function matchRoute(hash) {
  if (hash.startsWith('#/listings/')) {
    const id = hash.split('/')[2];
    return {
      page: renderEquipmentDetailsPage,
      params: { id },
    };
  }
  return {
    page: routes[hash] || null,
    params: {},
  };
}

function handleRouteChange() {
  if (!mainContentElement) return;

  const path = location.hash || '#/';
  const { page, params } = matchRoute(path);

  mainContentElement.innerHTML = '';

  if (!page) {
    mainContentElement.innerHTML = renderNotFoundPage();
    return;
  }

  // Pass current user if needed
  const content = page(currentUser, params);

  if (typeof content === 'string') {
    mainContentElement.innerHTML = content;
  } else if (content instanceof Node) {
    mainContentElement.appendChild(content);
  }

  // Update nav highlighting
  document.querySelectorAll('#app-nav a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === path || (path.startsWith('#/listings/') && href === '#/listings')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

export function navigateTo(path) {
  if (location.hash !== path) {
    location.hash = path;
  } else {
    handleRouteChange();
  }
}

export function initRouter(mainElement, user = null) {
  mainContentElement = mainElement;
  currentUser = user; // store for route-level rendering
  window.addEventListener('hashchange', handleRouteChange);
  handleRouteChange(); // first render
}
