document.addEventListener('DOMContentLoaded', () => {
  
  // Lightbox
  const mainImage = document.getElementById('main-image');
  const thumbnails = document.querySelectorAll('.thumbnail');
  const leftArrow = document.querySelector('.left-arrow');
  const rightArrow = document.querySelector('.right-arrow');

  const images = Array.from(thumbnails).map(img => img.dataset.src);
  let currentIndex = 0;

function updateMainImage(index) {
  if (!mainImage) return;
  currentIndex = index;
  mainImage.classList.add('fade-out');
  setTimeout(() => {
    mainImage.src = images[currentIndex];
    thumbnails.forEach(t => t.classList.remove('active-thumb'));
    thumbnails[currentIndex].classList.add('active-thumb');
    mainImage.classList.remove('fade-out');
    mainImage.classList.add('fade-in');
    setTimeout(() => mainImage.classList.remove('fade-in'), 400);
  }, 200);
}
  thumbnails.forEach((thumb, index) => thumb.addEventListener('click', () => updateMainImage(index)));

  leftArrow?.addEventListener('click', () => updateMainImage((currentIndex - 1 + images.length) % images.length));
  rightArrow?.addEventListener('click', () => updateMainImage((currentIndex + 1) % images.length));

  document.addEventListener("click", (event) => {
    const modal = document.getElementById("lightbox-modal");
    const image = document.getElementById("lightbox-image");
    if (event.target === modal && !image.contains(event.target)) {
      modal.classList.add("hidden");
    }
  });
});

// ---------------------------
// ГАЛЕРЕЯ + LIGHTBOX
// ---------------------------

const mainImage = document.getElementById('main-image');
const thumbnails = document.querySelectorAll('.thumbnail');
const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');

let currentIndex = 0;
const images = Array.from(thumbnails).map(img => img.dataset.src); // Сохраняем пути изображений из data-src

function updateMainImage(index) {
  if (!mainImage) return;
  currentIndex = index;
  mainImage.style.opacity = 0;
  setTimeout(() => {
    mainImage.src = images[currentIndex];  // Обновляем изображение
    thumbnails.forEach(thumb => thumb.classList.remove('active-thumb'));
    thumbnails[currentIndex].classList.add('active-thumb');  // Подсвечиваем активную миниатюру
    mainImage.style.opacity = 1;
  }, 200);
}

// Клик по миниатюре
thumbnails.forEach((thumb, index) => {
  thumb.addEventListener('click', () => updateMainImage(index));
});

// Листание влево
if (leftArrow) {
  leftArrow.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateMainImage(currentIndex);
  });
}

// Листание вправо
if (rightArrow) {
  rightArrow.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateMainImage(currentIndex);
  });
}

// Функция для открытия lightbox
function openLightbox() {
  const src = document.getElementById("main-image")?.src;
  document.getElementById("lightbox-image").src = src;
  document.getElementById("lightbox-modal").classList.remove("hidden");
}

// Функция для закрытия lightbox
function closeLightbox() {
  document.getElementById("lightbox-modal").classList.add("hidden");
}

// Закрытие lightbox при клике вне изображения
document.addEventListener("click", function(event) {
  const modal = document.getElementById("lightbox-modal");
  const image = document.getElementById("lightbox-image");
  if (event.target === modal && !image.contains(event.target)) {
    closeLightbox();
  }
});


