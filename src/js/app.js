gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

const smoother = ScrollSmoother.create({
  wrapper: '#smooth-wrapper',
  content: '#smooth-content',
  smooth: 2,
  effects: true
});

const header   = document.querySelector('header');
const aside    = document.querySelector('.my-sticky');
const links    = gsap.utils.toArray('.service__aside a');
const sections = gsap.utils.toArray('.service__group');

ScrollTrigger.create({
  trigger: '.service__wrap',
  start: 'top 2%',
  pin: '.my-sticky',
  pinSpacing: false
});

links.forEach(a => {
  a.addEventListener('click', (e) => {
    const hash = a.getAttribute('href');
    if (!hash || hash[0] !== '#') return;
    e.preventDefault();
    const y = smoother.offset(hash, 'top 2%');
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
    start: 'top center',
    end: 'bottom center',
    onEnter:     () => setActive(sec.id),
    onEnterBack: () => setActive(sec.id),
    fastScrollEnd: true,
    invalidateOnRefresh: true
  });
});

const delayedRefresh = gsap.delayedCall(0.12, () => ScrollTrigger.refresh());

document.addEventListener('tabby', () => delayedRefresh.restart(true), true);

document.querySelectorAll('.faq__header').forEach(btn => {
  btn.addEventListener('click', () => setTimeout(() => delayedRefresh.restart(true), 180));
});

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

  // GSAP
  if (location.hash) {
    const y = smoother.offset(location.hash, 'top top');
    smoother.scrollTo(y, false);
    setActive(location.hash.slice(1));
  }
  delayedRefresh.restart(true);

  function initAboutProduction() {
    const section = document.querySelector('.about-production');
    if (!section) return;

    const wrap = section.querySelector('.about-production__wrap');
    const slot = section.querySelector('.about-production__slot');

    const computeShift = () => {
      const delta = Math.max(0, slot.scrollHeight - wrap.clientHeight + 24);
      return -delta;
    };

    function setup() {
      const yEnd = computeShift();

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      tl.to(slot, { y: yEnd, duration: 1});
    }

    setup();
    ScrollTrigger.addEventListener('refreshInit', () => gsap.set(slot, { clearProps: 'y' }));
    window.addEventListener('resize', () => ScrollTrigger.refresh());
  }

  initAboutProduction();

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

  // Order

  const box = document.querySelector('.order__box');
  const cardsWrap = box.querySelector('.order__cards');
  const cardsList = box.querySelector('.profile__cards');
  const fieldsWrap = box.querySelector('.order__group');

  const addCardBtn = box.querySelector('#addCardBtn');
  const continueBtn = box.querySelector('#continueBtn');

  const $fName  = box.querySelector('#fName');
  const $lName  = box.querySelector('#lName');
  const $phone  = box.querySelector('#phone');
  const $email  = box.querySelector('#email');
  const $height = box.querySelector('#height');

  let editingUid = null;

  const hasCards = () => cardsList.querySelectorAll('.profile__card').length > 0;

  const showCards = () => {
    cardsWrap.classList.remove('is-hidden');
    fieldsWrap.classList.add('is-hidden');
    editingUid = null;
  };

  const showForm = () => {
    cardsWrap.classList.add('is-hidden');
    fieldsWrap.classList.remove('is-hidden');
  };

  const clearForm = () => {
    $fName.value = '';
    $lName.value = '';
    $phone.value = '';
    $email.value = '';
    $height.value = '';
  };

  const fillForm = (data) => {
    $fName.value  = data.firstName || '';
    $lName.value  = data.lastName  || '';
    $phone.value  = data.phone     || '';
    $email.value  = data.email     || '';
    $height.value = data.height    || '';
  };

  const readForm = () => ({
    firstName: $fName.value.trim(),
    lastName:  $lName.value.trim(),
    phone:     $phone.value.trim(),
    email:     $email.value.trim(),
    height:    $height.value.trim()
  });

  const uid = () => 'c' + Math.random().toString(36).slice(2, 9);

  const readCard = (cardEl) => {
    const fullName = (cardEl.querySelector('.profile-card__name')?.textContent || '').trim();
    const [firstName, ...rest] = fullName.split(/\s+/);
    const lastName = rest.join(' ');
    const email = (cardEl.querySelector('.profile-card__email')?.textContent || '').trim();
    const height = (cardEl.querySelector('.profile-card__height')?.textContent || '').trim();
    const phone = (cardEl.querySelector('.profile-card__tel')?.textContent || '').trim();
    return { firstName, lastName, email, phone, height };
  };

  const renderCard = (data, existingUid = null) => {
    const nameLine = [data.firstName, data.lastName].filter(Boolean).join(' ');
    const html = `
      <label class="profile__card profile-card" data-uid="${existingUid || uid()}">
        <input type="radio" name="card" ${existingUid ? '' : 'checked'}>
        <div class="profile-card__name text-up">${nameLine}</div>
        <div class="profile-card__group">
          <div class="profile-card__email">${data.email || ''}</div>
          <div class="profile-card__height">${data.height || ''}</div>
        </div>
        <div class="profile-card__group">
          <div class="profile-card__tel">${data.phone || ''}</div>
          <a href="#" class="profile-card__link js-edit">Изменить</a>
        </div>
      </label>
    `;

    if (existingUid) {
      const el = cardsList.querySelector(`.profile__card[data-uid="${existingUid}"]`);
      if (el) el.outerHTML = html;
    } else {
      cardsList.insertAdjacentHTML('beforeend', html);
      const radios = cardsList.querySelectorAll('input[type="radio"][name="card"]');
      radios.forEach(r => r.checked = false);
      radios[radios.length - 1].checked = true;
    }
  };

  if (hasCards()) { showCards(); } else { showForm(); }

  addCardBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    editingUid = null;
    clearForm();


    cardsWrap.classList.remove('is-hidden');
    fieldsWrap.classList.remove('is-hidden');
    addCardBtn.classList.add('is-hidden');
  });

  cardsWrap.addEventListener('click', (e) => {
    const link = e.target.closest('.js-edit');
    if (!link) return;
    e.preventDefault();
    const card = e.target.closest('.profile__card');
    if (!card) return;

    editingUid = card.dataset.uid || null;
    const data = readCard(card);
    fillForm(data);
    showForm();
  });

  continueBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const data = readForm();

    if (!data.firstName || !data.lastName || !data.phone || !data.email || !data.height) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }

    if (editingUid) {
      renderCard(data, editingUid);
    } else {
      renderCard(data, null);
    }

    clearForm();
    showCards();
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
  const accItems = document.querySelectorAll(".accordion__item");
  accItems.forEach((el) => {
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

  // Range
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

  // Modal
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

    document.querySelectorAll('.modal-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const type = btn.dataset.type;
        if (type) openModal(type);
      });
    });

    modalWrapper.addEventListener('click', (e) => {
      if (e.target.closest('.modal__close')) {
        closeCurrentModal();
        return;
      }

      const current = modals.find((m) => m.style.display !== 'none');
      if (!current) return;

      if (!e.target.closest('.modal__container')) {
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
