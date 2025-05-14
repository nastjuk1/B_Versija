function showToast(message = "Prece pievienota grozam!") {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("visible");

  setTimeout(() => {
    toast.classList.remove("visible");
  }, 3000);
}

function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product) {
  let cart = getCart();
  const existing = cart.find(item => item.name === product.name);
  if (existing) {
    existing.quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }
  saveCart(cart);
  updateCartDisplay();


  const cartDropdown = document.querySelector(".cart-dropdown");
if (cartDropdown) {
  cartDropdown.classList.remove("hidden");
  cartDropdown.style.display = "block"; 
const cartIcon = document.querySelector('.cart-icon');
if (cartIcon) {
  cartIcon.classList.add('pulsing');
  setTimeout(() => cartIcon.classList.remove('pulsing'), 400);
}

  setTimeout(() => {
    cartDropdown.classList.add("hidden");
    cartDropdown.style.display = "none";
  }, 4000);
}
}

function updateCartDisplay() {
  const cart = getCart();
  const cartCountEl = document.querySelector('.cart-count');
  const cartItemsList = document.querySelector('.cart-items');
  const totalPriceEl = document.getElementById('total-price');

  if (cartCountEl) {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalCount;
    cartCountEl.classList.toggle("hidden", totalCount === 0);
  }

  if (cartItemsList) {
    cartItemsList.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
      const li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML = `
        <img src="${item.img}" class="cart-item-img" alt="${item.name}">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-type">${item.type || ''}</div>
        </div>
        <div class="cart-item-meta">
          <div class="cart-item-price">€${(item.price * item.quantity).toFixed(2)} (${item.quantity} gab.)</div>
          <div class="quantity-buttons">
            <button class="quantity-btn" onclick="changeQuantity('${item.name}', -1)">−</button>
            <button class="quantity-btn" onclick="changeQuantity('${item.name}', 1)">+</button>
          </div>
        </div>
      `;
      cartItemsList.appendChild(li);
      total += item.price * item.quantity;
    });

    if (totalPriceEl) {
      animatePriceChange(totalPriceEl, parseFloat(totalPriceEl.textContent), total);

    }
  }
if (cart.length === 0) {
  const emptyMessage = document.createElement('li');
  emptyMessage.className = 'empty-cart-message';
  emptyMessage.innerHTML = `<p style="text-align:center; padding: 20px; color:#888;">Jūsu grozs ir tukšs.</p>`;
  cartItemsList.appendChild(emptyMessage);
}

}
function animatePriceChange(element, from, to) {
  const duration = 400;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = from + (to - from) * progress;
    element.textContent = value.toFixed(2);
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function changeQuantity(productName, amount) {
  let cart = getCart();
  const itemIndex = cart.findIndex(p => p.name === productName);
  if (itemIndex === -1) return;

  cart[itemIndex].quantity += amount;

  if (cart[itemIndex].quantity <= 0) {

    cart.splice(itemIndex, 1);
  }
  
  saveCart(cart);
  updateCartDisplay();
  
  showAddedMessage();
}


function removeItem(productName) {
  let cart = getCart();
  cart = cart.filter(item => item.name !== productName);
  saveCart(cart);
  location.reload();
}

function animateAndAddToCart(productElement) {
  const productImage = productElement.querySelector('.product-img');
  const productImageSrc = productImage?.src;
  const cartIcon = document.querySelector('.cart-icon img');

  const imgClone = productImage.cloneNode();
  imgClone.classList.add('cart-image');
  document.body.appendChild(imgClone);

  const productRect = productImage.getBoundingClientRect();
  const cartRect = cartIcon.getBoundingClientRect();

  imgClone.style.left = `${productRect.left + window.scrollX}px`;
  imgClone.style.top = `${productRect.top + window.scrollY}px`;

  setTimeout(() => {
    imgClone.style.transform = `translate(${cartRect.left - productRect.left}px, ${cartRect.top - productRect.top}px)`;
    imgClone.style.opacity = 1;
  }, 10);

  setTimeout(() => imgClone.remove(), 600);

  const productName = productElement.querySelector('.product-name, .product-title')?.textContent.trim();
  const productType = productElement.querySelector('.product-type, .product-subtitle')?.textContent.trim() || '';
  const productPrice = parseFloat(productElement.querySelector('.product-price')?.textContent.replace(/[^\d.]/g, ''));

  addToCart({ name: productName, type: productType, price: productPrice, img: productImageSrc });


  const cartDropdown = document.querySelector(".cart-dropdown");
  if (cartDropdown) cartDropdown.classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartDisplay();

  const addToCartButtons = document.querySelectorAll(".cart-icon, .add-to-cart-btn");
  addToCartButtons.forEach(button => {
    button.addEventListener("click", () => {
      const productElement = button.closest(".product, .product-detail-info");
      if (!productElement) return;
      animateAndAddToCart(productElement);
    });
  });

  const cartPage = document.querySelector('.cart-page');
  if (cartPage) {
    const cart = getCart();
    const cartItemsList = document.querySelector('.cart-items-list');
    let total = 0;

    cartItemsList.innerHTML = '';
    cart.forEach(item => {
      const html = `
        <div class="cart-page-item">
          <img src="${item.img}" class="cart-item-img" alt="Product">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-type">${item.type || ''}</div>
            <div class="cart-item-price">€${(item.price * item.quantity).toFixed(2)}</div>
          </div>
          <div class="cart-quantity">
            <button class="quantity-btn" onclick="changeQuantity('${item.name}', -1)">−</button>
            <input type="number" value="${item.quantity}" readonly>
            <button class="quantity-btn" onclick="changeQuantity('${item.name}', 1)">+</button>
          </div>
                  </div>
      `;
      cartItemsList.insertAdjacentHTML('beforeend', html);
      total += item.price * item.quantity;
    });

    const summarySubtotal = document.querySelector(".summary-line span:last-child");
    const summaryTotal = document.querySelector(".summary-line.total span:last-child");

    if (summarySubtotal) summarySubtotal.textContent = '€' + total.toFixed(2);
    if (summaryTotal) summaryTotal.textContent = '€' + (total + 2.50).toFixed(2);
  }
});

function changeQuantity(productName, delta) {
  let cart = getCart();
  const itemIndex = cart.findIndex(p => p.name === productName);
  if (itemIndex === -1) return;

  cart[itemIndex].quantity += delta;

  if (cart[itemIndex].quantity < 1) {
    cart.splice(itemIndex, 1);
  }

  saveCart(cart);
  updateCartDisplay();

  if (document.querySelector('.cart-page')) {
    const cartItemsList = document.querySelector('.cart-items-list');
    cartItemsList.innerHTML = '';

    let total = 0;
    cart.forEach(item => {
      const html = `
        <div class="cart-page-item">
          <img src="${item.img}" class="cart-item-img" alt="Product">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-type">${item.type || ''}</div>
            <div class="cart-item-price">€${(item.price * item.quantity).toFixed(2)}</div>
          </div>
          <div class="cart-quantity">
            <button class="quantity-btn" onclick="changeQuantity('${item.name}', -1)">−</button>
            <input type="number" value="${item.quantity}" readonly>
            <button class="quantity-btn" onclick="changeQuantity('${item.name}', 1)">+</button>
          </div>
        </div>
      `;
      cartItemsList.insertAdjacentHTML('beforeend', html);
      total += item.price * item.quantity;
    });

    const summarySubtotal = document.querySelector(".summary-line span:last-child");
    const summaryTotal = document.querySelector(".summary-line.total span:last-child");

    if (summarySubtotal) summarySubtotal.textContent = '€' + total.toFixed(2);
    if (summaryTotal) summaryTotal.textContent = '€' + (total + 2.50).toFixed(2);
  }
}const startCheckout = document.getElementById('startCheckout');
  const checkoutProcess = document.getElementById('checkoutProcess');
  const steps = document.querySelectorAll('.step');
  const dots = document.querySelectorAll('.dot');
  const nextBtns = document.querySelectorAll('.next-btn');
  const checkoutForm = document.getElementById('checkoutForm');
  const loading = document.getElementById('loading');
  const thankYou = document.getElementById('thankYou');
  let currentStep = 0;

  startCheckout.addEventListener('click', () => {
    checkoutProcess.classList.remove('hidden');
setTimeout(() => checkoutProcess.classList.add('show'), 10);

    startCheckout.classList.add('hidden');
    showStep(currentStep);
  });

  nextBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      if (!validateStep(currentStep)) return;
      steps[currentStep].classList.remove('active');
      currentStep++;
      showStep(currentStep);
      updateDots();
    });
  });

 checkoutForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const cart = getCart();
  if (cart.length === 0) {
    showToast("Jūsu grozs ir tukšs. Lūdzu, pievienojiet preces pirms pasūtījuma noformēšanas.");
    return;
  }

  if (!validateStep(2)) return;

  checkoutForm.classList.add('hidden');
  loading.classList.remove('hidden');

  setTimeout(() => {
    loading.classList.add('hidden');
    thankYou.classList.remove('hidden');

    localStorage.removeItem('cart');

    document.querySelector('.cart-items-list').innerHTML = '';
    document.querySelector('.cart-count').textContent = '0';
    document.getElementById('total-price').textContent = '0.00';
  }, 2000);
});

  function showStep(step) {
    steps.forEach((el, idx) => {
      el.classList.toggle('active', idx === step);
    });
  }

  function updateDots() {
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentStep);
    });
  }
  function shakeInput(input) {
    input.classList.add('shake');
    setTimeout(() => {
      input.classList.remove('shake');
    }, 400); 
  }
function validateStep(step) {
  let valid = true;
  if (step === 0) {
    const nameInput = document.getElementById('userName');
    const errorName = document.getElementById('errorName');
    const name = nameInput.value.trim();
    const nameRegex = /^[A-Z][a-zA-Z]{2,}$/;
    if (!nameRegex.test(name)) {
      errorName.textContent = 'Vārdam jāsākas ar lielo burtu, tikai latīņu burti un vismaz 3 burti.';
      nameInput.classList.add('invalid');
      shakeInput(nameInput);
      valid = false;
    } else {
      errorName.textContent = '';
      nameInput.classList.remove('invalid');
    }
  }
  if (step === 1) {
    const emailInput = document.getElementById('userEmail');
    const errorEmail = document.getElementById('errorEmail');
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errorEmail.textContent = 'Lūdzu ievadi derīgu e-pastu.';
      emailInput.classList.add('invalid');
      shakeInput(emailInput);
      valid = false;
    } else {
      errorEmail.textContent = '';
      emailInput.classList.remove('invalid');
    }
  }
  if (step === 2) {
    const addrInput = document.getElementById('userAddress');
    const errorAddr = document.getElementById('errorAddress');
    const addr = addrInput.value.trim();
    if (addr.length < 5) {
      errorAddr.textContent = 'Adresei jābūt vismaz 5 rakstzīmēm.';
      addrInput.classList.add('invalid');
      shakeInput(addrInput);
      valid = false;
    } else {
      errorAddr.textContent = '';
      addrInput.classList.remove('invalid');
    }
  }
  return valid;
}