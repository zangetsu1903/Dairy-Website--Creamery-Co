// ===== CART LOGIC =====
const CART_KEY = "creamery_cart";

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getCartCount(cart) {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function updateCartBadge() {
  const badge = document.getElementById("cart-count");
  if (!badge) return;
  const cart = loadCart();
  badge.textContent = getCartCount(cart);
}

// Add product
function addToCart(id, name, price) {
  let cart = loadCart();
  const found = cart.find((item) => item.id === id);
  if (found) {
    found.qty += 1;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }
  saveCart(cart);
  updateCartBadge();
  renderCartPanel();
}

// change quantity from cart panel
function changeQty(id, delta) {
  let cart = loadCart();
  const idx = cart.findIndex((item) => item.id === id);
  if (idx === -1) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  saveCart(cart);
  updateCartBadge();
  renderCartPanel();
}

// Render side cart on shop page
function renderCartPanel() {
  const listEl = document.querySelector(".cart-items");
  const totalEl = document.getElementById("cart-total");
  if (!listEl || !totalEl) return;

  const cart = loadCart();
  listEl.innerHTML = "";

  if (!cart.length) {
    listEl.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
  } else {
    cart.forEach((item) => {
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <div>
          <div>${item.name}</div>
          <div class="qty">
            <button class="qty-btn" onclick="changeQty('${item.id}', -1)">-</button>
            <span class="qty"> ${item.qty} </span>
            <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
          </div>
        </div>
        <div>₹${item.price * item.qty}</div>
      `;
      listEl.appendChild(row);
    });
  }

  totalEl.textContent = "₹" + getCartTotal(cart);
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  renderCartPanel();
});
