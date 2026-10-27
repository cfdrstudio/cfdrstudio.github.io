/* Shared behaviour for cfdr.au. Loaded with defer from every page, so no page needs an inline script
   (the Content-Security-Policy in .htaccess allows scripts from this site only).

   1. The footer year.
   2. The scroll reveal on the home page.
   3. The contact address, which is kept out of the page on purpose.

   THE ADDRESS. It is not in the HTML, in an attribute, or anywhere in the page as text, and it is not put
   together when the page loads. Each contact control holds the two halves of the address written
   backwards (data-mail-a, data-mail-b). They are joined only when a person clicks: a Contact link then
   opens their mail app, and a "Copy email address" button copies it straight to the clipboard — the
   address is never written into the page, even after the click, so a harvester that renders the page and
   scans its text still finds nothing. Only if the Clipboard API is unavailable does the button fall back
   to showing the address as a plain link, same as before. A harvester that reads the raw HTML finds
   nothing that looks like an address, and one that runs the page's scripts still finds nothing until
   something clicks. It cannot stop a determined person; it stops the automated collection that fills an
   inbox with spam. */
(function () {
  'use strict';

  // 1. Footer year
  var year = document.getElementById('yr');
  if (year) year.textContent = new Date().getFullYear();

  // 2. Scroll reveal (home page)
  var items = document.querySelectorAll('.reveal');
  if (items.length) {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!('IntersectionObserver' in window) || reduced.matches) {
      items.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
      items.forEach(function (el) { io.observe(el); });
    }
  }

  // 3. Contact address, assembled on click only
  function backwards(text) { return (text || '').split('').reverse().join(''); }

  document.addEventListener('click', function (event) {
    var control = event.target.closest && event.target.closest('[data-mail-a]');
    if (!control) return;
    event.preventDefault();

    var address = backwards(control.getAttribute('data-mail-a')) + '@' + backwards(control.getAttribute('data-mail-b'));
    var subject = control.getAttribute('data-mail-subject');
    var target = 'mailto:' + address + (subject ? '?subject=' + encodeURIComponent(subject) : '');

    if (control.getAttribute('data-mail-mode') === 'copy') {
      var status = control.nextElementSibling;
      if (!status || !status.classList.contains('mail-status')) status = null;
      var say = function (text) { if (status) status.textContent = text; };
      var showAsLink = function () {
        var link = document.createElement('a');
        link.className = (control.className.replace('reveal-mail', '').trim() + ' reveal-mail__address').trim();
        link.href = target;
        link.textContent = address;
        control.replaceWith(link);
        link.focus();
      };

      if (window.isSecureContext && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(address).then(function () {
          say('Copied — paste it into your mail app.');
          setTimeout(function () { say(''); }, 4000);
        }, showAsLink);
      } else {
        showAsLink();
      }
    } else {
      window.location.href = target;
    }
  });
})();
