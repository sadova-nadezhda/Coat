gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

let smoother = ScrollSmoother.create({
  smooth: 2,
  effects: true,
  normalizeScroll: true
});

smoother.effects(".about-production, .about-production *", { speed: 1, lag: 0 });

window.addEventListener("load", function () {
  let header = document.querySelector("header");
  let link = document.querySelector(".header__burger");
  let menu = document.querySelector(".header__nav");

  if (menu) {
    link.addEventListener("click", function () {
      link.classList.toggle("active");
      menu.classList.toggle("open");
    });

    window.addEventListener("scroll", () => {
      if (menu.classList.contains("open")) {
        link.classList.remove("active");
        menu.classList.remove("open");
      }
    });

    document.addEventListener("click", (e) => {
      let target = e.target;
      if (
        !target.closest(".header__nav") &&
        !target.closest(".header__burger") &&
        !target.closest(".button-dropdown")
      ) {
        link.classList.remove("active");
        menu.classList.remove("open");
        closeAllDropdowns();
      }
    });

    const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

    // Десктоп: hover
    if (window.innerWidth > 1024) {
      dropdownToggles.forEach(toggle => {
        const parent = toggle.closest(".button-dropdown");

        parent.addEventListener("mouseenter", () => {
          closeAllDropdowns();
          parent.classList.add("open");
          const dropdown = parent.querySelector(".dropdown-menu");
          dropdown.style.maxHeight = dropdown.scrollHeight + "px";
        });

        parent.addEventListener("mouseleave", () => {
          parent.classList.remove("open");
          const dropdown = parent.querySelector(".dropdown-menu");
          dropdown.style.maxHeight = null;
        });
      });
    }

    // Мобильный: click
    else {
      dropdownToggles.forEach(toggle => {
        toggle.addEventListener("click", function (e) {
          e.preventDefault();
          const parent = toggle.closest(".button-dropdown");
          const dropdown = parent.querySelector(".dropdown-menu");
          const height = dropdown.scrollHeight;

          if (parent.classList.contains("open")) {
            parent.classList.remove("open");
            dropdown.style.maxHeight = null;
          } else {
            closeAllDropdowns();
            dropdown.style.maxHeight = height + "px";
            parent.classList.add("open");
          }
        });
      });
    }

    function closeAllDropdowns() {
      document.querySelectorAll(".button-dropdown").forEach(item => {
        item.classList.remove("open");
        const menu = item.querySelector(".dropdown-menu");
        if (menu) {
          menu.style.maxHeight = null;
        }
      });
    }
  }

  // Grids

  const grids = document.querySelectorAll('.category__grid');
  const cards = document.querySelector('.category__cards');

  grids.forEach(grid => {
    grid.addEventListener('click', () => {
      grids.forEach(g => g.classList.remove('active'));
      grid.classList.add('active');

      const gridType = grid.dataset.grid;
      cards.classList.remove('grid-1', 'grid-2', 'grid-3');
      cards.classList.add(`grid-${gridType}`);
    });
  });

  // Swiper

  const heroSwiper = new Swiper(".heroSwiper", {
    pagination: {
      el: ".hero-pagination",
    },
  });

  const compareSwiper = new Swiper(".compareSwiper", {
    slidesPerView: 2,
    spaceBetween: 0,
    breakpoints: {
      768: {
        slidesPerView: 3,
      },
      1025: {
        slidesPerView: 4,
      },
    }
  });

  const swiperNavProd = new Swiper('.js-prod-nav-slider', {
    grabCursor: true,
    lazy: true,
    slidesPerView: 4,
    spaceBetween: 8,
    breakpoints: {
      1025: {
        direction: "vertical",
        slidesPerView: 6,
      }
    }
  });

  const swiperProd = new Swiper('.js-prod-slider', {
    grabCursor: true,
    lazy: true,
    spaceBetween: 8,
    navigation: {
      nextEl: ".prod-button-next",
      prevEl: ".prod-button-prev",
    },
    thumbs: {
      swiper: swiperNavProd,
    },
  });

  // Accordion

  const faqItems = document.querySelectorAll(".faq__item");

  faqItems.forEach((el) => {
    el.addEventListener("click", function () {
      this.classList.toggle("active");
      let accBody = this.querySelector(".faq__content");
      if (accBody.style.maxHeight) {
        accBody.style.maxHeight = null;
      } else {
        accBody.style.maxHeight = accBody.scrollHeight + "px";
      }
    });
  });

  // Tabs

  var tabs = new Tabby('[data-tabs]');

  // Sticky Box

  function setupAboutProduction() {
    const wrap = document.querySelector(".about-production__wrap");
    const slot = document.querySelector(".about-production__slot");
    const list = document.querySelector(".about-production__list");
    if (!wrap || !slot || !list) return;

    const slotH = slot.clientHeight;
    const listH = list.scrollHeight; 
    const distance = Math.max(0, listH - slotH);

    const peek = Math.round(Math.min(80, slotH * 0.18));

    const startY = slotH - peek;
    const endY   = -distance;

    ScrollTrigger.getById("about-pin")?.kill();
    ScrollTrigger.create({
      id: "about-pin",
      trigger: wrap,
      start: "top top",
      end: () => "+=" + (distance + window.innerHeight * 0.4),
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true
    });

    ScrollTrigger.getById("about-scroll")?.kill();
    gsap.fromTo(
      list,
      { y: startY, force3D: true },
      {
        y: endY,
        force3D: true,
        scrollTrigger: {
          id: "about-scroll",
          trigger: wrap,
          start: "top top",
          end: () => "+=" + distance,
          scrub: true,  
          invalidateOnRefresh: true
        }
      }
    );
  }

  // setupAboutProduction();
  window.addEventListener("resize", () => ScrollTrigger.refresh());

  // Modals

  (function () {
    const modalWrapper = document.querySelector('.modals');
    if (!modalWrapper) return;

    const modals = Array.from(modalWrapper.querySelectorAll('.modal'));
    const body = document.body;

    const getModalByType = (type) => modalWrapper.querySelector(`.modal[data-type="${type}"]`);

    const showWrapper = () => {
      body.style.overflow = 'hidden';
      modalWrapper.style.opacity = 1;
      modalWrapper.style.pointerEvents = 'all';
    };

    const hideWrapper = () => {
      body.style.overflow = '';
      modalWrapper.style.opacity = 0;
      modalWrapper.style.pointerEvents = 'none';
    };

    const openModal = (type) => {
      // Скрыть все
      modals.forEach(m => {
        m.style.display = 'none';
        m.style.removeProperty('transform');
      });

      const modal = getModalByType(type);
      if (!modal) return;

      modal.style.display = 'block';
      showWrapper();

      if (window.gsap) {
        gsap.fromTo(modal, { y: '-100%' }, { y: '0%', duration: 0.5, ease: 'power3.out' });
      }
    };

    const closeCurrentModal = () => {
      const current = modals.find(m => m.style.display !== 'none');
      const finishClose = () => {
        if (current) current.style.display = 'none';
        hideWrapper();
      };

      if (current && window.gsap) {
        const type = current.dataset.type;
        gsap.to(current, {
          y: '-100%',
          duration: 0.4,
          ease: 'power3.in',
          onComplete: () => {
            current.style.removeProperty('transform');
            finishClose();
          }
        });
      } else {
        finishClose();
      }
    };

    document.querySelectorAll('.modal-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const type = btn.dataset.type;
        if (type) openModal(type);
      });
    });

    modalWrapper.addEventListener('click', (e) => {
      if (e.target === modalWrapper || e.target.closest('.modal__close')) {
        closeCurrentModal();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalWrapper.style.pointerEvents === 'all') {
        closeCurrentModal();
      }
    });
  })();
});
