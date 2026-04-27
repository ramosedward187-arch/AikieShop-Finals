/* ═══════════════════════════════════════════
   AIKIE SHOP — APP LOGIC
═══════════════════════════════════════════ */

/* ── PRODUCT DATA ── */
const PRODUCTS = [
  { id:1, name:'Wireless Noise-Cancelling Headphones', cat:'Electronics', price:4299, oldPrice:6500, emoji:'🎧', rating:4.8, reviews:312, badge:'SALE', isNew:false },
  { id:2, name:'Smart LED Desk Lamp', cat:'Electronics', price:1850, oldPrice:null, emoji:'💡', rating:4.5, reviews:87, badge:'NEW', isNew:true },
  { id:3, name:'Ultra Slim Laptop Stand', cat:'Electronics', price:1200, oldPrice:1699, emoji:'💻', rating:4.7, reviews:215, badge:'SALE', isNew:false },
  { id:4, name:'Mechanical Keyboard', cat:'Electronics', price:3500, oldPrice:null, emoji:'⌨️', rating:4.9, reviews:498, badge:null, isNew:false },
  { id:5, name:'Street Graphic Tee', cat:'Fashion', price:750, oldPrice:1100, emoji:'👕', rating:4.3, reviews:132, badge:'SALE', isNew:false },
  { id:6, name:'Cargo Wide Pants', cat:'Fashion', price:1499, oldPrice:null, emoji:'👖', rating:4.6, reviews:74, badge:'NEW', isNew:true },
  { id:7, name:'Chunky Sneakers', cat:'Fashion', price:3200, oldPrice:4200, emoji:'👟', rating:4.8, reviews:356, badge:'SALE', isNew:false },
  { id:8, name:'Minimal Leather Wallet', cat:'Fashion', price:899, oldPrice:null, emoji:'👜', rating:4.4, reviews:91, badge:null, isNew:false },
  { id:9, name:'Ceramic Pour-Over Set', cat:'Home', price:1680, oldPrice:2200, emoji:'☕', rating:4.7, reviews:203, badge:'SALE', isNew:false },
  { id:10, name:'Linen Throw Blanket', cat:'Home', price:1250, oldPrice:null, emoji:'🛋️', rating:4.5, reviews:118, badge:'NEW', isNew:true },
  { id:11, name:'Minimalist Wall Clock', cat:'Home', price:980, oldPrice:1300, emoji:'🕐', rating:4.2, reviews:67, badge:'SALE', isNew:false },
  { id:12, name:'Vitamin C Serum Set', cat:'Beauty', price:1199, oldPrice:1600, emoji:'✨', rating:4.9, reviews:541, badge:'SALE', isNew:false },
  { id:13, name:'Jade Facial Roller', cat:'Beauty', price:650, oldPrice:null, emoji:'💚', rating:4.6, reviews:289, badge:'NEW', isNew:true },
  { id:14, name:'Premium Yoga Mat', cat:'Sports', price:2100, oldPrice:2800, emoji:'🧘', rating:4.8, reviews:174, badge:'SALE', isNew:false },
  { id:15, name:'Resistance Band Set', cat:'Sports', price:899, oldPrice:null, emoji:'🏋️', rating:4.5, reviews:99, badge:null, isNew:false },
  { id:16, name:'Smart Water Bottle', cat:'Sports', price:1450, oldPrice:1900, emoji:'💧', rating:4.4, reviews:142, badge:'SALE', isNew:false },
];

let cart = [];
let currentFilter = 'All';
let currentSort = 'default';
let currentSearch = '';

/* ══════════════════════════════════
   RENDER PRODUCTS
══════════════════════════════════ */
function renderProducts() {
  let items = [...PRODUCTS];

  // Search filter
  if (currentSearch) {
    items = items.filter(p =>
      p.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
      p.cat.toLowerCase().includes(currentSearch.toLowerCase())
    );
  }

  // Category filter
  if (currentFilter !== 'All') {
    items = items.filter(p => p.cat === currentFilter);
  }

  // Sort
  if (currentSort === 'price-asc') items.sort((a,b) => a.price - b.price);
  else if (currentSort === 'price-desc') items.sort((a,b) => b.price - a.price);
  else if (currentSort === 'rating') items.sort((a,b) => b.rating - a.rating);

  const grid = document.getElementById('productGrid');
  const noResults = document.getElementById('noResults');

  if (items.length === 0) {
    grid.innerHTML = '';
    noResults.classList.remove('hidden');
    return;
  }
  noResults.classList.add('hidden');

  grid.innerHTML = items.map((p, i) => `
    <div class="product-card" style="animation-delay:${i * 0.05}s">
      <div class="product-img">
        ${p.badge ? `<div class="product-badge ${p.isNew ? 'new' : ''}">${p.badge}</div>` : ''}
        <button class="product-wishlist" onclick="wishlist(${p.id}, event)" title="Add to wishlist">♡</button>
        ${p.emoji}
      </div>
      <div class="product-body">
        <p class="product-cat">${p.cat}</p>
        <h3 class="product-name">${p.name}</h3>
        <div class="product-rating">
          <span class="stars">${starsHtml(p.rating)}</span>
          <span class="rating-count">(${p.reviews})</span>
        </div>
        <div class="product-price">
          <span class="price">₱${p.price.toLocaleString()}</span>
          ${p.oldPrice ? `<span class="price-old">₱${p.oldPrice.toLocaleString()}</span>` : ''}
        </div>
        <button class="btn-add" onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    </div>
  `).join('');
}

function starsHtml(r) {
  const full = Math.floor(r);
  const half = r % 1 >= 0.5;
  let s = '★'.repeat(full);
  if (half) s += '½';
  return s;
}

/* ── FILTERS / SORT ── */
function filterByCategory(cat) {
  currentFilter = cat;
  // Update filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.trim() === cat || (cat === 'All' && btn.textContent.trim() === 'All'));
  });
  renderProducts();
  if (cat !== 'All') document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

function sortProducts(val) {
  currentSort = val;
  renderProducts();
}

function filterProducts() {
  currentSearch = document.getElementById('searchInput').value;
  renderProducts();
}

/* ══════════════════════════════════
   CART
══════════════════════════════════ */
function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCart();
  showToast(`🛍️ ${product.name} added to cart`);
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCart();
}

function updateCart() {
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const count = cart.reduce((s, c) => s + c.qty, 0);

  document.getElementById('cartCount').textContent = count;
  document.getElementById('cartItemCount').textContent = `(${count})`;
  document.getElementById('cartTotal').textContent = `₱${total.toLocaleString()}`;

  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <div class="empty-icon">🛍️</div>
        <p>Your cart is empty</p>
        <button class="btn-ghost" onclick="toggleCart()">Continue Shopping</button>
      </div>`;
    footerEl.style.display = 'none';
  } else {
    itemsEl.innerHTML = cart.map(c => `
      <div class="cart-item">
        <div class="cart-item-img">${c.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${c.name}</div>
          <div class="cart-item-price">₱${(c.price * c.qty).toLocaleString()} × ${c.qty}</div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${c.id})" title="Remove">✕</button>
      </div>
    `).join('');
    footerEl.style.display = 'block';
  }
}

function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('open');
}

/* ── WISHLIST ── */
function wishlist(id, e) {
  e.stopPropagation();
  const btn = e.currentTarget;
  btn.textContent = btn.textContent === '♡' ? '♥' : '♡';
  btn.style.color = btn.textContent === '♥' ? 'var(--accent2)' : '';
  showToast(btn.textContent === '♥' ? '❤️ Added to wishlist' : '💔 Removed from wishlist');
}

/* ══════════════════════════════════
   MODAL
══════════════════════════════════ */
function openModal(type) {
  document.getElementById('modalBackdrop').classList.add('open');
  document.getElementById('loginModal').classList.add('hidden');
  document.getElementById('signupModal').classList.add('hidden');
  document.getElementById('successModal').classList.add('hidden');
  document.getElementById(type === 'login' ? 'loginModal' : 'signupModal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modalBackdrop').classList.remove('open');
}

function switchModal(type) {
  document.getElementById('loginModal').classList.add('hidden');
  document.getElementById('signupModal').classList.add('hidden');
  document.getElementById(type === 'login' ? 'loginModal' : 'signupModal').classList.remove('hidden');
}

function handleLogin() {
  document.getElementById('loginModal').classList.add('hidden');
  document.getElementById('successModal').classList.remove('hidden');
}

function handleSignup() {
  document.getElementById('signupModal').classList.add('hidden');
  document.getElementById('successModal').classList.remove('hidden');
}

// Close modal on backdrop click
document.getElementById('modalBackdrop').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

/* ══════════════════════════════════
   TOAST
══════════════════════════════════ */
let toastTimeout;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => t.classList.remove('show'), 2800);
}

/* ══════════════════════════════════
   SEARCH
══════════════════════════════════ */
document.getElementById('searchBtn').addEventListener('click', () => {
  const bar = document.getElementById('searchBar');
  bar.classList.toggle('open');
  if (bar.classList.contains('open')) {
    document.getElementById('searchInput').focus();
  }
});

function closeSearch() {
  document.getElementById('searchBar').classList.remove('open');
  document.getElementById('searchInput').value = '';
  currentSearch = '';
  renderProducts();
}

/* ══════════════════════════════════
   NAVBAR SCROLL
══════════════════════════════════ */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
});

/* ══════════════════════════════════
   HAMBURGER MENU
══════════════════════════════════ */
function toggleMenu() {
  const burger = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  burger.classList.toggle('open');
  links.classList.toggle('open');
}

/* ══════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════ */
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursorTrail');
if (cursor && trail) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    setTimeout(() => {
      trail.style.left = e.clientX + 'px';
      trail.style.top = e.clientY + 'px';
    }, 60);
  });
  document.addEventListener('mousedown', () => cursor.style.transform = 'translate(-50%,-50%) scale(0.6)');
  document.addEventListener('mouseup', () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');
}

/* ══════════════════════════════════
   COUNTDOWN TIMER
══════════════════════════════════ */
let cdEnd = Date.now() + (8 * 3600 + 34 * 60 + 12) * 1000;

function updateCountdown() {
  const diff = Math.max(0, cdEnd - Date.now());
  const h = Math.floor(diff / 3600000).toString().padStart(2,'0');
  const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2,'0');
  const s = Math.floor((diff % 60000) / 1000).toString().padStart(2,'0');
  document.getElementById('cdH').textContent = h;
  document.getElementById('cdM').textContent = m;
  document.getElementById('cdS').textContent = s;
}
setInterval(updateCountdown, 1000);
updateCountdown();

/* ══════════════════════════════════
   INIT
══════════════════════════════════ */
renderProducts();
