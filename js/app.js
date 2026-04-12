(() => {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');
  const backdrop = document.querySelector('[data-nav-backdrop]');
  if (!navToggle || !mobileNav || !backdrop) return;

  const setOpen = (open) => {
    mobileNav.classList.toggle('header__mobile-nav--open', open);
    backdrop.classList.toggle('header__nav-backdrop--open', open);
    document.body.classList.toggle('nav-open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    mobileNav.setAttribute('aria-hidden', open ? 'false' : 'true');
    backdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (open) mobileNav.removeAttribute('inert');
    else mobileNav.setAttribute('inert', '');
  };

  navToggle.addEventListener('click', () => {
    setOpen(!mobileNav.classList.contains('header__mobile-nav--open'));
  });

  backdrop.addEventListener('click', () => setOpen(false));

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });
})();

const tabs = document.querySelectorAll('.tab-item');
const blocks = document.querySelectorAll('.tab-block');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.dataset.tab;

    // убрать active у всех табов
    tabs.forEach(t => t.classList.remove('active'));
    // убрать active у всех блоков
    blocks.forEach(b => b.classList.remove('active'));

    // добавить active текущему табу
    tab.classList.add('active');

    // найти и показать нужный блок
    const currentBlock = document.querySelector(
      `.tab-block[data-tab="${tabName}"]`
    );

    if (currentBlock) {
      currentBlock.classList.add('active');
    }
  });
});
