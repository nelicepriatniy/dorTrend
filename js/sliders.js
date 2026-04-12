const heroSlider = new Swiper('.hero-slider', {
  speed: 400,
  loop: true,
  navigation: {
    nextEl: '.hero-slider-next',
    prevEl: '.hero-slider-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
  },
});

const popular_m_slider = new Swiper('.popuplar-m-slider', {
  speed: 400,
  loop: true,
  spaceBetween: 10,
  navigation: {
    nextEl: '.popupar-m-slider-next',
    prevEl: '.popupar-m-slider-prev',
  },
  pagination: {
    el: '.popular-m.swiper-pagination',
    type: 'bullets',
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    1024: {

      slidesPerView: 4,
    }
  }
});

const popular_w_slider = new Swiper('.popuplar-w-slider', {
  speed: 400,
  loop: true,
  spaceBetween: 10,
  slidesPerView: 4,
  navigation: {
    nextEl: '.popupar-w-slider-next',
    prevEl: '.popupar-w-slider-prev',
  },
  pagination: {
    el: '.popular-w.swiper-pagination',
    type: 'bullets',
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    1024: {

      slidesPerView: 4,
    }
  }
});

const manufact_m_slider = new Swiper('.manufac-slider', {
  speed: 400,
  loop: true,
  spaceBetween: 10,
  navigation: {
    nextEl: '.manufac-slider-next',
    prevEl: '.manufac-slider-prev',
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    1024: {

      slidesPerView: 5,
    }
  }
});

const models_slider = new Swiper('.card-slider', {
  speed: 400,
  spaceBetween: 10,
  navigation: {
    nextEl: '.card-img-section .hero-slider-next',
    prevEl: '.card-img-section .hero-slider-prev',
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    1024: {

      slidesPerView: 3,
    }
  }
});
