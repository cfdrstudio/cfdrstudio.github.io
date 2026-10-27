/* Colour theme switch for cfdr.au. Loaded from <head> so the theme is set before the first paint.

   Dark is the default. The visitor's choice is remembered in this browser only (localStorage, under
   "cfdr-theme"); nothing is sent anywhere. If storage is blocked the switch still works for the visit. */
(function () {
  'use strict';

  var KEY = 'cfdr-theme';
  var root = document.documentElement;
  var BAR = { dark: '#060B12', light: '#FFFFFF' };   // the browser toolbar colour on phones

  function stored() {
    try { return window.localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function save(theme) {
    try { window.localStorage.setItem(KEY, theme); } catch (e) { /* private mode: fine */ }
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    var bar = document.querySelector('meta[name="theme-color"]');
    if (bar) bar.setAttribute('content', BAR[theme]);
    var buttons = document.querySelectorAll('[data-theme-set]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', String(buttons[i].getAttribute('data-theme-set') === theme));
    }
  }

  function normal(value) { return value === 'light' ? 'light' : 'dark'; }

  root.classList.add('js');            // reveals the switch, which is hidden without script
  apply(normal(stored()));             // dark unless the visitor chose light

  document.addEventListener('DOMContentLoaded', function () {
    apply(root.getAttribute('data-theme'));   // the buttons exist now: mark the active one

    document.addEventListener('click', function (event) {
      var button = event.target.closest && event.target.closest('[data-theme-set]');
      if (!button) return;
      var theme = normal(button.getAttribute('data-theme-set'));
      if (theme === root.getAttribute('data-theme')) return;
      root.classList.add('theme-anim');
      window.setTimeout(function () { root.classList.remove('theme-anim'); }, 350);
      apply(theme);
      save(theme);
    });
  });

  // A second tab open on the site follows a change made in this one.
  window.addEventListener('storage', function (event) {
    if (event.key === KEY) apply(normal(event.newValue));
  });
})();
