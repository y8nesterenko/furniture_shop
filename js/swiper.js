// Инициализируем Swiper
new Swiper('.slider-main__body', {

   observer: true,
   observeParents: true,
   slidesPerView: 1,
   spaceBetween: 32,
   watchOverflow: true,
   speed: 800,
   loop: true,
   loopAdditionalSlides: 5,
   preloadImages: false,
   parallax: true,
   pagination: {
      el: '.controls-slider-main__dotts',
      clickable: true,
   },
   navigation: {
      nextEl: '.slider-main .slider-arrow_next',
      prevEl: '.slider-main .slider-arrow_prev',
   },
});