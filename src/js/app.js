gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

// ---------- GSAP core ----------
const smoother = ScrollSmoother.create({
  wrapper: '#smooth-wrapper',
  content: '#smooth-content',
  smooth: 2,
  effects: true
});

const header   = document.querySelector('header');
const wrap     = document.querySelector('.service__wrap');
const aside    = document.querySelector('.my-sticky');
const links    = gsap.utils.toArray('.service__aside a');
const sections = gsap.utils.toArray('.service__group');

const getHeaderH = () => (header ? header.offsetHeight : 0);

if (wrap && aside) {
  ScrollTrigger.matchMedia({
    "(min-width: 1025px)": () => {
      ScrollTrigger.create({
        trigger: wrap,
        start: () => `top+=${getHeaderH()} top+=${getHeaderH()}`,
        end: () => {
          const total   = wrap.scrollHeight;
          const stickyH = aside.offsetHeight;
          return `+=${Math.max(0, total - stickyH - 1)}`;
        },
        pin: aside,
        pinSpacing: true,
        invalidateOnRefresh: true,
        anticipatePin: 1
      });
    },

    "(max-width: 1024px)": () => {
      // ничего не создаём
    }
  });
}

links.forEach(a => {
  a.addEventListener('click', (e) => {
    const hash = a.getAttribute('href');
    if (!hash || hash[0] !== '#') return;
    e.preventDefault();
    const y = smoother.offset(hash, 'top top') - getHeaderH();
    smoother.scrollTo(y, true);
    history.pushState(null, '', hash);
  });
});

let currentId = null;
const setActive = (id) => {
  if (currentId === id) return;
  currentId = id;
  links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
};

sections.forEach(sec => {
  ScrollTrigger.create({
    trigger: sec,
    start: () => `top+=${getHeaderH()} center`,
    end: 'bottom center',
    onEnter:     () => setActive(sec.id),
    onEnterBack: () => setActive(sec.id),
    fastScrollEnd: true,
    invalidateOnRefresh: true
  });
});

const delayedRefresh = gsap.delayedCall(0.12, () => ScrollTrigger.refresh());

window.addEventListener('load', () => {
  if (location.hash) {
    const y = smoother.offset(location.hash, 'top top') - getHeaderH();
    smoother.scrollTo(y, false);
    setActive(location.hash.slice(1));
  }
  delayedRefresh.restart(true);
});

document.addEventListener('tabby', () => delayedRefresh.restart(true), true);

document.querySelectorAll('.faq__header').forEach(btn => {
  btn.addEventListener('click', () => setTimeout(() => delayedRefresh.restart(true), 180));
});

document.querySelectorAll('.service__box img').forEach(img => {
  if (!img.complete) {
    img.addEventListener('load',  () => delayedRefresh.restart(true), { once:true });
    img.addEventListener('error', () => delayedRefresh.restart(true), { once:true });
  }
});

const serviceBox = document.querySelector('.service__box');
if (serviceBox && 'ResizeObserver' in window) {
  new ResizeObserver(() => delayedRefresh.restart(true)).observe(serviceBox);
}

window.addEventListener('resize', () => delayedRefresh.restart(true));

window.addEventListener("load", function () {
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
    } else {
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
        if (menu) menu.style.maxHeight = null;
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
  const heroSwiper = new Swiper(".heroSwiper", { pagination: { el: ".hero-pagination" } });
  const compareSwiper = new Swiper(".compareSwiper", {
    slidesPerView: 2, spaceBetween: 0,
    breakpoints: { 768:{slidesPerView:3}, 1025:{slidesPerView:4} }
  });
  const swiperNavProd = new Swiper('.js-prod-nav-slider', {
    grabCursor:true, lazy:true, slidesPerView:4, spaceBetween:8,
    breakpoints:{ 1025:{ direction:"vertical", slidesPerView:6 } }
  });
  const swiperProd = new Swiper('.js-prod-slider', {
    grabCursor:true, lazy:true, spaceBetween:8,
    navigation:{ nextEl:".prod-button-next", prevEl:".prod-button-prev" },
    thumbs:{ swiper: swiperNavProd }
  });

  // Accordion 
  const faqItems = document.querySelectorAll(".accordion__item");
  faqItems.forEach((el) => {
    el.addEventListener("click", function () {
      this.classList.toggle("active");
      let accBody = this.querySelector(".accordion__content");
      if (accBody.style.maxHeight) {
        accBody.style.maxHeight = null;
      } else {
        accBody.style.maxHeight = accBody.scrollHeight + "px";
      }
      setTimeout(() => delayedRefresh.restart(true), 180);
    });
  });

  const range = document.querySelector("#input-range");
  const field = document.querySelector(".field-range");
  const label = field?.querySelector(".label");
  const valueEl = label?.querySelector(".value");
  range?.addEventListener("input", () => {
    const min = parseFloat(range.min);
    const max = parseFloat(range.max);
    const val = parseFloat(range.value);
    valueEl.textContent = val;
    field.setAttribute("data-value", val);
    range.setAttribute("value", val);
    const percent = ((val - min) / (max - min)) * 100;
    label.style.left = `calc(${percent}%)`;
  });
  
  // modal
  (function () {
    const modalWrapper = document.querySelector('.modals');
    if (!modalWrapper) return;

    const modals = Array.from(modalWrapper.querySelectorAll('.modal'));
    const body = document.body;

    const getModalByType = (type) =>
      modalWrapper.querySelector(`.modal[data-type="${type}"]`);

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
      modals.forEach((m) => {
        m.style.display = 'none';
        m.style.removeProperty('transform');
        const c = m.querySelector('.modal__container');
        if (c) c.style.removeProperty('transform');
      });

      const modal = getModalByType(type);
      if (!modal) return;

      modal.style.display = 'flex';
      showWrapper();

      // Анимируем ИМЕННО контейнер
      const container = modal.querySelector('.modal__container') || modal;
      if (window.gsap) {
        gsap.fromTo(
          container,
          { y: '-100%' },
          { y: '0%', duration: 0.5, ease: 'power3.out' }
        );
      }
    };

    const closeCurrentModal = () => {
      const current = modals.find((m) => m.style.display !== 'none');
      const container =
        current?.querySelector('.modal__container') || current || null;

      const finishClose = () => {
        if (current) current.style.display = 'none';
        hideWrapper();
      };

      if (container && window.gsap) {
        gsap.to(container, {
          y: '-100%',
          duration: 0.4,
          ease: 'power3.in',
          onComplete: () => {
            container.style.removeProperty('transform');
            finishClose();
          },
        });
      } else {
        finishClose();
      }
    };

    // Кнопки открытия
    document.querySelectorAll('.modal-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const type = btn.dataset.type;
        if (type) openModal(type);
      });
    });

    // Закрытие по клику на задник (.modal), но НЕ внутри .modal__container
    modalWrapper.addEventListener('click', (e) => {
      // клик по крестику
      if (e.target.closest('.modal__close')) {
        closeCurrentModal();
        return;
      }

      const current = modals.find((m) => m.style.display !== 'none');
      if (!current) return;

      // если кликнут НЕ контейнер и не его дети — закрываем
      if (!e.target.closest('.modal__container')) {
        // Дополнительно убеждаемся, что клик внутри активной .modal или на .modals
        if (e.target === modalWrapper || e.target.closest('.modal') === current) {
          closeCurrentModal();
        }
      }
    });

    // ESC
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalWrapper.style.pointerEvents === 'all') {
        closeCurrentModal();
      }
    });
  })();

  // Tabs
  var tabs = new Tabby('[data-tabs]');
});
