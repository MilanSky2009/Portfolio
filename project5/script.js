let allProducts = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function displayProducts(products) {
  const container = document.getElementById('product-list');
  container.innerHTML = '';

  products.forEach(product => {
    const item = document.createElement('div');
    item.innerHTML = `
      <img src="images/${product.image}" alt="${product.name}">
      <div>
        <h3>${product.name}</h3>
        <p>Price: $${product.price.toFixed(2)}</p>
        <p>Category: ${product.category}</p>
        <button>Add to Cart</button>
      </div>
    `;
    item.querySelector('button').addEventListener('click', () => addToCart(product));
    container.appendChild(item);
  });
}

function displayCart() {
  const cartContainer = document.getElementById('cart');
  cartContainer.innerHTML = '';
  cart.forEach(item => {
    const div = document.createElement('div');
    div.innerHTML = `
      <h4>${item.name}</h4>
      <p>$${item.price.toFixed(2)}</p>
      <button>Remove</button>
    `;
    div.querySelector('button').addEventListener('click', () => removeFromCart(item.id));
    cartContainer.appendChild(div);
  });
  updateTotal();
}

function addToCart(product) {
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCart();
}

function updateTotal() {
  const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
  document.getElementById('cart-total').textContent = total;
}

function clearCart() {
  cart = [];
  localStorage.removeItem('cart');
  displayCart();
}

function applyFilters() {
  const searchTerm = document.getElementById('search-box').value.toLowerCase();
  const category = document.getElementById('category-filter').value;
  const sort = document.getElementById('sort').value;

  let filtered = allProducts.filter(p => {
    return (
      p.name.toLowerCase().includes(searchTerm) &&
      (category === '' || p.category === category)
    );
  });

  if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  else if (sort === 'name-asc') filtered.sort((a, b) => a.name.localeCompare(b.name));

  displayProducts(filtered);
}

// Populate category filter dynamically
function populateCategories() {
  const categorySet = new Set(allProducts.map(p => p.category));
  const categoryFilter = document.getElementById('category-filter');
  categorySet.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

document.getElementById('search-box').addEventListener('input', applyFilters);
document.getElementById('category-filter').addEventListener('change', applyFilters);
document.getElementById('sort').addEventListener('change', applyFilters);
document.getElementById('clear-cart').addEventListener('click', clearCart);

fetch('products.json')
  .then(res => res.json())
  .then(data => {
    allProducts = data;
    populateCategories();
    applyFilters();
    displayCart();
  })
  .catch(console.error);
