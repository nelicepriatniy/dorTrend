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

/**
 * Отладка оформления заказа: логирует полезную нагрузку и не даёт уйти на оплату.
 * Отключить: <script>window.DORTREND_ORDER_DEBUG = false;</script> до подключения app.js
 */
(() => {
  if (window.DORTREND_ORDER_DEBUG === false) return;

  const LOG_TITLE = 'логирование';

  const ORDER_URL_RE =
    /order|checkout|payment|oplata|корзин|cart|invoice|pay-url|create-payment/i;

  const PAYMENT_NAV_RE =
    /yookassa|robokassa|cloudpayments|tinkoff|sberbank|alfabank|pay\.|payment|checkout\.|secure\.|acquiring/i;

  const isMutatingMethod = (m) => {
    const u = (m || 'GET').toUpperCase();
    return u === 'POST' || u === 'PUT' || u === 'PATCH';
  };

  const headersToObject = (h) => {
    if (!h) return undefined;
    try {
      return Object.fromEntries(new Headers(h).entries());
    } catch {
      return h;
    }
  };

  const bodyForLog = (body) => {
    if (body == null || body === '') return body;
    if (typeof body === 'string') {
      try {
        return JSON.parse(body);
      } catch {
        return body;
      }
    }
    if (typeof FormData !== 'undefined' && body instanceof FormData) {
      return Object.fromEntries(body.entries());
    }
    if (body instanceof URLSearchParams) {
      return Object.fromEntries(body.entries());
    }
    return body;
  };

  const nativeFetch = window.fetch.bind(window);

  window.fetch = async function (input, init) {
    let url = '';
    let method = 'GET';
    let headers;
    let rawBody;

    if (typeof Request !== 'undefined' && input instanceof Request) {
      url = input.url;
      method = input.method || 'GET';
      headers = init?.headers ?? input.headers;
      if (init && Object.prototype.hasOwnProperty.call(init, 'body')) {
        rawBody = init.body;
      } else if (input.body != null) {
        try {
          rawBody = await input.clone().text();
        } catch {
          rawBody = null;
        }
      }
    } else {
      url = String(input);
      method = (init && init.method) || 'GET';
      headers = init && init.headers;
      rawBody = init && init.body;
    }

    const shouldLogOrder =
      isMutatingMethod(method) && ORDER_URL_RE.test(url);

    if (shouldLogOrder) {
      const loggedBody = bodyForLog(rawBody);

      console.group(LOG_TITLE);
      console.log('Отправка на сервер (запрос не выполнен):', {
        url,
        method: method.toUpperCase(),
        headers: headersToObject(headers),
        body: loggedBody,
      });
      console.info(
        'Реальный fetch и переход на оплату отключены. Чтобы включить обратно: window.DORTREND_ORDER_DEBUG = false и перезагрузка.'
      );
      console.groupEnd();
      return Promise.reject(
        new Error('[DorTrend order debug] отправка заказа приостановлена')
      );
    }

    return nativeFetch(input, init);
  };

  const origOpen = window.open;
  window.open = function (url, ...rest) {
    if (url != null && PAYMENT_NAV_RE.test(String(url))) {
      console.warn(LOG_TITLE, 'window.open на страницу оплаты заблокирован:', url);
      return null;
    }
    return origOpen.call(window, url, ...rest);
  };

  const patchLocationMethod = (name) => {
    const orig = window.location[name];
    if (typeof orig !== 'function') return;
    try {
      window.location[name] = function (url) {
        if (url != null && PAYMENT_NAV_RE.test(String(url))) {
          console.warn(
            LOG_TITLE,
            `location.${name} на оплату заблокирован:`,
            url
          );
          return;
        }
        return orig.call(window.location, url);
      };
    } catch {
      /* некоторые браузеры не дают переопределять location */
    }
  };
  patchLocationMethod('assign');
  patchLocationMethod('replace');

  document.addEventListener(
    'submit',
    (e) => {
      if (window.DORTREND_ORDER_DEBUG === false) return;
      const form = e.target;
      if (!(form instanceof HTMLFormElement)) return;
      const action = form.getAttribute('action') || '';
      if (!action || (!ORDER_URL_RE.test(action) && !PAYMENT_NAV_RE.test(action))) {
        return;
      }
      e.preventDefault();
      const fd = new FormData(form);
      console.group(LOG_TITLE);
      console.log('Отправка формы на сервер (отменена):', {
        action,
        method: (form.getAttribute('method') || 'get').toUpperCase(),
        body: Object.fromEntries(fd.entries()),
      });
      console.info('Навигация на оплату / отправка формы приостановлены.');
      console.groupEnd();
    },
    true
  );
})();
