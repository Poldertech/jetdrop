import './data.js';
import './ui.js';

(function () {
  const { $, $$ } = JD;
  const MAX = 20000;
  document.addEventListener('DOMContentLoaded', () => {
    const el = {
      from: $('#f-from'), radius: $('#f-radius'), to: $('#f-to'), d1: $('#f-d1'), d2: $('#f-d2'),
      max: $('#f-max'), maxv: $('#f-maxv'), cat: $('#f-cat'), seats: $('#f-seats'), sort: $('#sort'),
      count: $('#count'), results: $('#results'), filters: $('#filters'),
    };
    el.cat.insertAdjacentHTML('beforeend', JD.CATEGORIES.map((c) => `<option>${c}</option>`).join(''));

    // Initial state from the query string (hero search, destination tiles, shared links).
    const q = new URLSearchParams(location.search);
    if (q.get('from')) el.from.value = JD.airportInputValue(q.get('from'));
    if (q.get('to')) el.to.value = JD.airportInputValue(q.get('to'));
    if (q.get('nearby')) el.radius.value = '100';
    if (q.get('max') && +q.get('max') < MAX) el.max.value = q.get('max');
    if (q.get('date')) {
      const d = new Date(q.get('date') + 'T12:00:00'), span = q.get('flex') ? 3 : 0, iso = (x) => x.toISOString().slice(0, 10);
      const a = new Date(d), b = new Date(d); a.setDate(a.getDate() - span); b.setDate(b.getDate() + span);
      el.d1.value = iso(a); el.d2.value = iso(b);
    }

    function state() {
      const from = JD.parseAirport(el.from.value), to = JD.parseAirport(el.to.value);
      return {
        from, to, radius: +el.radius.value, d1: el.d1.value, d2: el.d2.value,
        max: +el.max.value >= MAX ? 0 : +el.max.value, cat: el.cat.value, seats: +el.seats.value,
      };
    }

    function filter(s) {
      const origins = s.from ? JD.nearbyCodes(s.from, s.radius) : null;
      return JD.FLIGHTS.filter((f) =>
        (!origins || origins.includes(f.from)) && (!s.to || f.to === s.to) &&
        (!s.d1 || f.date >= s.d1) && (!s.d2 || f.date <= s.d2) &&
        (!s.max || f.price <= s.max) && (!s.cat || f.category === s.cat) && (!s.seats || f.seats >= s.seats));
    }

    const sorters = {
      price: (a, b) => a.price - b.price,
      date: (a, b) => (a.date + a.time).localeCompare(b.date + b.time),
      recent: (a, b) => a.listedDaysAgo - b.listedDaysAgo || a.checkedMinutesAgo - b.checkedMinutesAgo,
    };

    function render() {
      const s = state();
      el.maxv.textContent = s.max ? JD.money(s.max) : 'Any';
      // Flag airport fields that have text but no match.
      JD.setError(el.from, el.from.value && !s.from ? 'Pick an airport from the list.' : '');
      JD.setError(el.to, el.to.value && !s.to ? 'Pick an airport from the list, or clear for Anywhere.' : '');

      const list = filter(s).sort(sorters[el.sort.value]);
      el.results.setAttribute('aria-busy', 'false');
      el.count.textContent = list.length === 1 ? '1 sample empty leg' : list.length + ' sample empty legs';
      if (!list.length) {
        const ap = new URLSearchParams();
        if (s.from) ap.set('from', s.from);
        if (s.to) ap.set('to', s.to);
        if (s.max) ap.set('max', s.max);
        ap.set('radius', s.radius);
        el.results.innerHTML = `<div class="empty" style="grid-column:1/-1">${JD.icon('bell')}<p>No matching empty legs right now. Create an alert and we’ll let you know when something appears.</p><a class="btn btn-gold btn-lg" href="alerts.html?${ap}">Create Alert</a></div>`;
      } else {
        el.results.innerHTML = list.map((f) => JD.flightCard(f)).join('');
      }
      const ap = new URLSearchParams();
      if (s.from) ap.set('from', s.from);
      if (s.to) ap.set('to', s.to);
      if (s.max) ap.set('max', s.max);
      ap.set('radius', s.radius);
      $('#alert-link').href = 'alerts.html?' + ap;
    }

    // Brief skeleton on first paint so loading state is real UI, not just a flash of content.
    el.results.innerHTML = JD.skeletonCards(6);
    setTimeout(render, 350);

    el.filters.addEventListener('input', render);
    el.filters.addEventListener('change', render);
    el.sort.addEventListener('change', render);
    el.filters.addEventListener('submit', (e) => e.preventDefault());
    $('#reset').addEventListener('click', () => { el.filters.reset(); el.max.value = MAX; render(); });
    $('#ftoggle').addEventListener('click', (e) => {
      const open = el.filters.classList.toggle('collapsed') === false;
      e.currentTarget.setAttribute('aria-expanded', open);
      e.currentTarget.textContent = open ? 'Hide filters' : 'Show filters';
    });
  });
})();
