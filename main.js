import "./style.css";
import products from "./api/products.json";
import { showProductContainer } from "./homeProductCards";

// Store original products (never modified)
const allProducts = [...products];
let currentDisplayedProducts = [];

function initializeProductPage() {
  // First render - show all products
  currentDisplayedProducts = [...allProducts];
  renderProducts();
  
  setupEventListeners();
  initializeBrandFilters();
}

function setupEventListeners() {
  // Price range filter (real-time)
  const priceRange = document.getElementById('priceRange');
  const maxPriceDisplay = document.getElementById('maxPriceDisplay');
  
  priceRange?.addEventListener('input', () => {
    maxPriceDisplay.textContent = `$${priceRange.value}+`;
    applyFilters();
  });

  // Category/brand filters (real-time)
  document.querySelectorAll('.filters input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', applyFilters);
  });

  // Sorting
  document.getElementById('sort')?.addEventListener('change', function() {
    applyFilters();
  });

  // Reset button
  document.querySelector('.reset-filters')?.addEventListener('click', resetFilters);
}

function initializeBrandFilters() {
  const brandFiltersContainer = document.getElementById('brandFilters');
  if (!brandFiltersContainer) return;

  const brands = [...new Set(allProducts.map(p => p.brand))];
  brandFiltersContainer.innerHTML = brands.map(brand => `
    <label>
      <input type="checkbox" name="brand" value="${brand}" checked>
      ${brand}
    </label>
  `).join('');
}

function applyFilters() {
  // 1. Get current filter values
  const filters = {
    categories: getSelectedValues('category'),
    brands: getSelectedValues('brand'),
    maxPrice: document.getElementById('priceRange')?.value || 5000,
    sortBy: document.getElementById('sort')?.value || 'default'
  };

  // 2. Apply filters to original products
  let filtered = allProducts.filter(product => 
    filters.categories.includes(product.category) &&
    filters.brands.includes(product.brand) &&
    product.price <= filters.maxPrice
  );

  // 3. Apply sorting
  filtered = sortProducts(filtered, filters.sortBy);

  // 4. Update display
  currentDisplayedProducts = filtered;
  renderProducts();
}

function getSelectedValues(name) {
  return Array.from(
    document.querySelectorAll(`input[name="${name}"]:checked`)
  ).map(cb => cb.value);
}

function sortProducts(products, method) {
  const sorted = [...products];
  switch(method) {
    case 'price-asc': return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc': return sorted.sort((a, b) => b.price - a.price);
    case 'name-asc': return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc': return sorted.sort((a, b) => b.name.localeCompare(a.name));
    default: return sorted.sort((a, b) => a.id - b.id);
  }
}

function resetFilters() {
  // Reset UI elements
  document.querySelectorAll('.filters input[type="checkbox"]').forEach(cb => {
    cb.checked = true;
  });
  
  const priceRange = document.getElementById('priceRange');
  if (priceRange) {
    priceRange.value = priceRange.max;
    document.getElementById('maxPriceDisplay').textContent = `$${priceRange.max}+`;
  }
  
  const sortSelect = document.getElementById('sort');
  if (sortSelect) sortSelect.value = 'default';

  // Reset to all products
  currentDisplayedProducts = [...allProducts];
  renderProducts();
}

function renderProducts() {
  // This will COMPLETELY replace the product display
  showProductContainer(currentDisplayedProducts);
}

document.addEventListener('DOMContentLoaded', initializeProductPage);