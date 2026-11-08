/* JetDrop — shared UI: header, footer, flight card, formatters, form helpers. */
(function () {
  const JD = window.JD;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  JD.$ = $; JD.$$ = $$;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  JD.esc = esc;

  /* ---------- formatters ---------- */
  JD.money = (n) => '€' + Math.round(n).toLocaleString('en-GB');
  JD.fmtDate = (iso, long) => {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-GB', long
      ? { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
      : { weekday: 'short', day: 'numeric', month: 'short' });
  };
  JD.ago = (min) => (min < 60 ? min + ' min ago' : Math.round(min / 60) + ' h ago');
  JD.perPerson = (f) => Math.round(f.price / f.seats);
  JD.label = (code) => { const a = JD.airport(code); return a ? a.city + ' (' + code + ')' : code; };

  /* ---------- icons ---------- */
  const I = {
    jet: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15.5v-1.7l-8-5V3.5a1.5 1.5 0 0 0-3 0v5.3l-8 5v1.7l8-2.3v4.6l-2 1.5V22l3.5-1 3.5 1v-1.2l-2-1.5v-4.6z" fill="currentColor"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="m16 16 4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    bell: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 17V11a6 6 0 1 1 12 0v6l1.5 2h-15z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M10 21h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    seat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4v8h8l2 8M8 12 6 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7.5V12l3 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6m0-6-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="9.5" r="2.5" fill="currentColor"/></svg>',
    wallet: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3M4 7.5V17a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H6.5A2.5 2.5 0 0 1 4 7.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="16.5" cy="13.5" r="1.3" fill="currentColor"/></svg>',
    shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5.5c0 4.3 2.9 7.6 7 9.5 4.1-1.9 7-5.2 7-9.5V6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="m9 12 2.2 2.2L15.2 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    layers: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 4 8.5 4.5L12 13 3.5 8.5zM3.5 12.5 12 17l8.5-4.5M3.5 16.5 12 21l8.5-4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  };
  JD.icon = (n) => I[n] || '';

  /** Small brand mark + wordmark. */
  const logo = (light) => `<a class="logo" href="index.html" aria-label="JetDrop home"><svg class="logo-mark" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2.5C16 2.5 6 13.2 6 19.5a10 10 0 0 0 20 0C26 13.2 16 2.5 16 2.5z" fill="none" stroke="#C7A76B" stroke-width="2"/><path d="M11.5 20.5 20.5 14l-2.3 8.2-2.4-2.6z" fill="#C7A76B"/></svg><span class="logo-word">Jet<b>Drop</b></span></a>`;

  /* ---------- header / footer ---------- */
  const NAV = [
    ['explore', 'Explore Flights', 'explore.html'],
    ['how', 'How It Works', 'index.html#how-it-works'],
    ['alerts', 'Flight Alerts', 'alerts.html'],
    ['membership', 'Membership', 'membership.html'],
  ];

  JD.mountChrome = function () {
    const page = document.body.dataset.page || '';
    const strip = `<div class="demo-strip" role="note"><span>Demonstration site</span> Sample listings only — no live inventory, alerts or payments are connected yet.</div>`;
    const links = NAV.map(([k, t, h]) => `<a href="${h}"${k === page ? ' aria-current="page"' : ''}>${t}</a>`).join('');
    const header = `
      <div class="container nav-row">
        ${logo()}
        <nav id="primary-nav" class="nav" aria-label="Primary">
          ${links}
          <a href="login.html"${page === 'login' ? ' aria-current="page"' : ''} class="nav-login">Log In</a>
        </nav>
        <a class="btn btn-sm btn-gold nav-cta" href="alerts.html">Get Free Alerts</a>
        <button class="menu-btn" aria-expanded="false" aria-controls="primary-nav" aria-label="Open menu"><span></span><span></span><span></span></button>
      </div>`;
    const h = $('#site-header');
    if (h) h.innerHTML = header;
    if (h) h.insertAdjacentHTML('beforebegin', strip);

    const btn = $('.menu-btn'), nav = $('#primary-nav');
    if (btn) {
      const set = (open) => {
        btn.setAttribute('aria-expanded', open);
        btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        document.body.classList.toggle('menu-open', open);
      };
      btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
      nav.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
    }
    // Subtle scroll behaviour: shadow once scrolled, hide on fast scroll down, show on scroll up.
    if (h) {
      let last = window.scrollY;
      const onScroll = () => {
        const y = window.scrollY;
        h.classList.toggle('scrolled', y > 24);
        const hide = y > last + 6 && y > 400 && !document.body.classList.contains('menu-open');
        if (hide) h.classList.add('hidden'); else if (y < last - 6 || y < 400) h.classList.remove('hidden');
        last = y;
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    const f = $('#site-footer');
    if (f) f.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div>
            ${logo(true)}
            <p class="footer-blurb">Private jets. Unexpected prices. JetDrop is an independent flight discovery and alert service for European empty-leg flights.</p>
          </div>
          <div><h3>Discover</h3><ul>
            <li><a href="explore.html">Explore Flights</a></li><li><a href="alerts.html">Flight Alerts</a></li>
            <li><a href="empty-legs.html">What are empty legs?</a></li><li><a href="membership.html">Membership</a></li></ul></div>
          <div><h3>Company</h3><ul>
            <li><a href="about.html">About JetDrop</a></li><li><a href="faq.html">FAQ</a></li>
            <li><a href="contact.html">Contact</a></li><li><a href="login.html">Log In</a></li></ul></div>
          <div><h3>Legal</h3><ul>
            <li><a href="privacy.html">Privacy Policy</a></li><li><a href="terms.html">Terms and Conditions</a></li>
            <li><a href="subscription-policy.html">Subscription &amp; Cancellation</a></li></ul></div>
        </div>
        <p class="footer-legal">JetDrop does not operate aircraft, act as a charter broker or issue flight tickets. Empty-leg flights are subject to operational change, cancellation and operator confirmation; prices and availability may change without notice. Listings currently shown are demonstration data.</p>
        <p class="footer-copy">© ${new Date().getFullYear()} JetDrop. All rights reserved.</p>
      </div>`;
  };

  /* ---------- flight card (reusable) ---------- */
  const SKY = ['sky-a', 'sky-b', 'sky-c', 'sky-d'];
  JD.flightCard = function (f, opts) {
    opts = opts || {};
    const a = JD.airport(f.from), b = JD.airport(f.to), st = JD.STATUS[f.status];
    return `
    <article class="flight-card" aria-labelledby="fc-${f.id}">
      <a class="fc-media ${SKY[f.order % SKY.length]}" href="flight.html?id=${f.id}" tabindex="-1" aria-hidden="true">
        <span class="fc-demo">Sample listing</span>
        <span class="fc-jet">${I.jet}</span>
      </a>
      <div class="fc-body">
        <span class="status status-${st.tone}" title="${esc(st.hint)}"><i></i>${st.label}</span>
        <h3 class="fc-route" id="fc-${f.id}">
          <span class="fc-city"><b>${f.from}</b><small>${esc(a.city)}</small></span>
          <span class="fc-to">${I.arrow}</span>
          <span class="fc-city"><b>${f.to}</b><small>${esc(b.city)}</small></span>
        </h3>
        <p class="fc-when">${I.clock}${JD.fmtDate(f.date)} · ${f.time} <span class="muted">local</span></p>
        <p class="fc-craft">${I.jet}${esc(f.aircraft)} <span class="muted">· up to ${f.seats} passengers</span></p>
        <div class="fc-price">
          <div><span class="price-label">Whole aircraft</span><strong class="price">${JD.money(f.price)}</strong></div>
          <p class="illustration">Illustration only: ≈ ${JD.money(JD.perPerson(f))} each if ${f.seats} people split the whole aircraft. Individual seats are not sold.</p>
        </div>
        <p class="fc-meta"><span>Source: ${esc(f.source)}</span><span>Last checked ${JD.ago(f.checkedMinutesAgo)} <em>(sample)</em></span></p>
        <a class="btn btn-primary btn-block" href="flight.html?id=${f.id}">View Flight<span class="sr-only"> ${f.from} to ${f.to}</span></a>
      </div>
    </article>`;
  };

  JD.skeletonCards = (n) => Array.from({ length: n }, () => '<div class="flight-card skeleton" aria-hidden="true"><div class="fc-media"></div><div class="fc-body"><i></i><i></i><i></i><i class="w60"></i></div></div>').join('');

  /* ---------- airport helpers ---------- */
  /** Accepts "London — Luton (LTN)", "LTN" or "luton"; returns an airport code or ''. */
  JD.parseAirport = function (txt) {
    const t = String(txt || '').trim();
    if (!t) return '';
    const m = t.match(/\(([A-Za-z]{3})\)\s*$/);
    const code = (m ? m[1] : t).toUpperCase();
    if (JD.airport(code)) return code;
    const q = t.toLowerCase();
    const hit = JD.AIRPORTS.find((a) => a.city.toLowerCase() === q || a.name.toLowerCase() === q || (a.city + ' ' + a.name).toLowerCase() === q);
    return hit ? hit.code : '';
  };
  JD.airportInputValue = (code) => { const a = JD.airport(code); return a ? `${a.city} — ${a.name} (${a.code})` : ''; };

  /* ---------- forms ---------- */
  JD.isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim());
  JD.setError = function (input, msg) {
    const wrap = input.closest('.field, .group') || input.parentElement;
    let e = wrap.querySelector('.error');
    if (msg) {
      if (!e) { e = document.createElement('p'); e.className = 'error'; e.id = (input.id || 'f' + Math.random().toString(36).slice(2)) + '-err'; wrap.appendChild(e); }
      e.textContent = msg; input.setAttribute('aria-invalid', 'true'); input.setAttribute('aria-describedby', e.id);
    } else {
      if (e) e.remove(); input.removeAttribute('aria-invalid'); input.removeAttribute('aria-describedby');
    }
    return !msg;
  };
  JD.demoNotice = (what) => `<div class="demo-result" role="status"><strong>Demonstration mode — nothing was saved.</strong><p>${what} The alert system isn’t connected yet, so no email address or preferences were stored and no emails will be sent.</p><p class="small">Needed to go live: <b>Supabase</b> (accounts &amp; saved alerts), a <b>Resend or Brevo</b> sender, and an <b>n8n</b> workflow matching new listings to saved alerts.</p></div>`;

  /** Wire the compact signup form (home page / reusable). */
  JD.wireQuickSignup = function (form) {
    if (!form) return;
    const out = $('.signup-out', form.parentElement) || $('.signup-out');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = $('[name=email]', form), airports = $('[name=airports]', form), budget = $('[name=budget]', form), consent = $('[name=consent]', form);
      let ok = true;
      ok = JD.setError(email, JD.isEmail(email.value) ? '' : 'Enter a valid email address, like name@example.com.') && ok;
      ok = JD.setError(airports, JD.parseAirport(airports.value) ? '' : 'Choose a departure airport from the list.') && ok;
      ok = JD.setError(consent, consent.checked ? '' : 'Please tick the box to receive alerts.') && ok;
      if (!ok) { const bad = $('[aria-invalid=true]', form); if (bad) bad.focus(); return; }
      const code = JD.parseAirport(airports.value);
      out.innerHTML = JD.demoNotice(`You asked for alerts from <b>${esc(JD.label(code))}</b>${budget.value ? ' up to <b>' + JD.money(budget.value) + '</b>' : ''}.`);
      out.hidden = false; out.focus && out.scrollIntoView({ block: 'nearest' });
    });
  };

  /** Reveal-on-scroll (kept minimal; respects reduced motion via CSS). */
  JD.reveal = function () {
    if (!('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('reveal-ready');
    const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { threshold: 0.12 });
    $$('.reveal').forEach((el) => io.observe(el));
  };

  document.addEventListener('DOMContentLoaded', () => {
    JD.mountChrome(); JD.reveal();
    const dl = $('#airports');
    if (dl) dl.innerHTML = JD.AIRPORTS.map((a) => `<option value="${esc(a.city)} — ${esc(a.name)} (${a.code})"></option>`).join('');
  });
})();
