
document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carousel-track');
  const images = Array.from(track.children);
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxClose = document.querySelector('.lightbox .close');

  let currentIndex = 0;

  // Set images width based on container width
  function updateCarousel() {
    const carouselWidth = document.querySelector('.carousel-container').offsetWidth;
    images.forEach(img => img.style.width = carouselWidth + 'px');
    moveToSlide(currentIndex);
  }

  function moveToSlide(index) {
    const carouselWidth = images[0].offsetWidth;
    track.style.transform = `translateX(-${carouselWidth * index}px)`;
  }

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
    moveToSlide(currentIndex);
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
    moveToSlide(currentIndex);
  });

  // Autoplay every 4 seconds
  let autoplay = setInterval(() => {
    currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
    moveToSlide(currentIndex);
  }, 4000);

  // Pause autoplay on hover
  document.querySelector('.carousel-container').addEventListener('mouseenter', () => {
    clearInterval(autoplay);
  });
  document.querySelector('.carousel-container').addEventListener('mouseleave', () => {
    autoplay = setInterval(() => {
      currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
      moveToSlide(currentIndex);
    }, 4000);
  });

  // Responsive on resize
  window.addEventListener('resize', updateCarousel);
  updateCarousel();

  // Lightbox functionality (only for carousel images)
  images.forEach(img => {
    img.addEventListener('click', () => {
      lightbox.style.display = 'block';
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
    });
  });

  lightboxClose.addEventListener('click', () => {
    lightbox.style.display = 'none';
  });

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) {
      lightbox.style.display = 'none';
    }
  });
});