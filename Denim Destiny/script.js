const body = document.body;
const themeToggle = document.querySelector('.theme-toggle');
const progressBar = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');
const cookieBanner = document.getElementById('cookieBanner');
const acceptCookies = document.getElementById('acceptCookies');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const searchInput = document.getElementById('siteSearch');
const productCards = document.querySelectorAll('.product-card');
const yearEl = document.getElementById('year');
const whatsappNumber = '8801805742178';

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const applyTheme = () => {
  const darkMode = body.classList.contains('dark-mode');
  if (themeToggle) {
    themeToggle.textContent = darkMode ? '🌙' : '☀️';
    themeToggle.setAttribute('aria-label', darkMode ? 'Switch to light mode' : 'Switch to dark mode');
  }
};

const savedTheme = localStorage.getItem('denim-theme');
if (savedTheme === 'dark') {
  body.classList.add('dark-mode');
}
applyTheme();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    localStorage.setItem('denim-theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    applyTheme();
  });
}

let scrollUpdateScheduled = false;
window.addEventListener('scroll', () => {
  if (scrollUpdateScheduled) {
    return;
  }

  scrollUpdateScheduled = true;
  window.requestAnimationFrame(() => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${Math.min(progress, 100)}%`;
    }

    if (backToTop) {
      backToTop.classList.toggle('show', scrollTop > 420);
    }

    scrollUpdateScheduled = false;
  });
}, { passive: true });

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open menu');
    });
  });
}

if (searchInput && productCards.length) {
  searchInput.addEventListener('input', (event) => {
    const query = event.target.value.trim().toLowerCase();

    productCards.forEach((card) => {
      const name = card.dataset.name.toLowerCase();
      const category = card.dataset.category.toLowerCase();
      const matches = name.includes(query) || category.includes(query);
      card.classList.toggle('hidden', !matches && query.length > 0);
    });
  });
}

productCards.forEach((card) => {
  const orderButton = card.querySelector('.product-meta button');
  if (!orderButton) {
    return;
  }

  const productName = card.querySelector('h3')?.textContent.trim();
  orderButton.setAttribute('aria-label', `Order ${productName || 'this product'} on WhatsApp`);
  orderButton.addEventListener('click', () => {
    const name = card.querySelector('h3')?.textContent.trim();
    const price = card.querySelector('.product-meta strong')?.textContent.trim();
    const image = card.querySelector('.product-image img');

    if (!name || !price || !image?.getAttribute('src')) {
      console.error('Unable to open WhatsApp order: product name, price, or image is missing.');
      return;
    }

    const productPage = new URL(window.location.href);
    productPage.hash = 'products';
    const imageUrl = new URL(image.getAttribute('src'), document.baseURI);
    const message = [
      `Hi Denim Destiny, I'm interested in ${name}.`,
      `Price: ${price}`,
      `Product page: ${productPage.href}`,
      `Product image: ${imageUrl.href}`
    ].join('\n');
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  });
});

const cookieConsent = localStorage.getItem('cookie-consent');
if (cookieBanner && !cookieConsent) {
  setTimeout(() => cookieBanner.classList.add('visible'), 700);
}

if (acceptCookies) {
  acceptCookies.addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'accepted');
    cookieBanner.classList.remove('visible');
  });
}
