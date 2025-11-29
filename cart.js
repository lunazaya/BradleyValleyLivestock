function addToCart(name, price) {
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// If an item exists, increment the quantity; else push the new item
const idx = cart.findIndex(i => i.name === name && i.price === price);
if (idx !== -1) {
cart[idx].quantity += 1;
} else {
cart.push({ name, price, quantity: 1 });
}

localStorage.setItem('cart', JSON.stringify(cart));
alert(`${name} added to cart`);
renderAll(); // Unified render
}

// Unified render flow: updates both main cart and summary in one pass
function renderAll() {
displayCart();
renderCartList();
}

// Display cart items and totals
function displayCart() {
// helper to update quantity
function changeQty(index, amount) {
let cart = JSON.parse(localStorage.getItem('cart')) || [];

if (!cart[index]) return;

cart[index].quantity += amount;

if (cart[index].quantity <= 0) {
cart.splice(index, 1);
}

localStorage.setItem('cart', JSON.stringify(cart));
renderAll();
}

const cartContainer = document.getElementById('cart-items');
const totalContainer = document.getElementById('cart-total');
let cart = JSON.parse(localStorage.getItem('cart')) || [];

if (!cart.length) {
cartContainer.innerHTML = '<p>Your cart is empty</p>';
totalContainer.innerHTML = '';
renderCartList();
return;
}

let total = 0;
const listItems = cart.map((item, index) => {
const itemTotal = item.price * item.quantity;
total += itemTotal;

return `
<div class="cart-item" data-index="${index}">
<span>${item.name} - $${Number(item.price).toFixed(2)}</span>
<div class="qty-controls">
<button onclick="changeQty(${index}, -1)">-</button>
<span>${item.quantity}</span>
<button onclick="changeQty(${index}, 1)">+</button>
</div>
<span class="item-total">$${itemTotal.toFixed(2)}</span>
</div>
`;
}).join('');

cartContainer.innerHTML = listItems;
totalContainer.innerHTML = `<p class="cart-total-label">Total: $${total.toFixed(2)}</p>`;

// Expose changeQty on window so inline onclick works
window.changeQty = function(index, amount) {
changeQty(index, amount);
};

// ensure the summary is updated
renderCartList();
}

// Render the summary list of items in the cart
function renderCartList() {
const listContainer = document.getElementById('cart-items-summary');
if (!listContainer) return;

let cart = JSON.parse(localStorage.getItem('cart')) || [];
if (cart.length === 0) {
listContainer.innerHTML = '<li>Your cart is empty</li>';
return;
}

const itemsText = cart.map(item => {
const total = (Number(item.price) * item.quantity).toFixed(2);
return `<li>${item.name} - x${item.quantity} @ $${Number(item.price).toFixed(2)} = $${total}</li>`;
}).join('');

listContainer.innerHTML = itemsText;
}

// Clear the cart
function clearCart() {
localStorage.removeItem('cart');
renderAll();
}

// Send cart as email using mailto
function sendCartEmail() {
 let cart = JSON.parse(localStorage.getItem('cart')) || [];
 if (cart.length === 0) {
 alert("Your cart is empty");
 return;
 }

// customer details
 const name = document.getElementById('customer-name')?.value.trim() || '';
 const email = document.getElementById('customer-email')?.value.trim() || '';

 const lines = cart.map(i => `${i.name} - x${i.quantity} @ $${Number(i.price).toFixed(2)}`);
 const bodyParts = [];
 if (name) bodyParts.push(`Customer: ${name}`);
 if (email) bodyParts.push(`Email: ${email}`);
 bodyParts.push('Cart items:');
 bodyParts.push(...lines);

 const body = bodyParts.join('\n\n');
 const subject = 'My Pantry Items';
 const recipient = 'bradleyvalleylivestock@gmail.com';
 const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;


// Open mail client
window.location.href = mailto;
}