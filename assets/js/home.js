(function () {
  const { $, $$, esc } = JD;
  document.addEventListener('DOMContentLoaded', () => {
    // Featured: the six lowest-priced sample listings so prices lead.
    const featured = [...JD.FLIGHTS].sort((a, b) => a.price - b.price).slice(0, 6);
    $('#featured').innerHTML = featured.map((f) => JD.flightCard(f)).join('');

    const dests = [['NCE', 'd1'], ['OLB', 'd4'], ['JMK', 'd2'], ['IBZ', 'd5'], ['DBV', 'd3'], ['PMI', 'd6']];
    $('#dests').innerHTML = dests.map(([c, cls]) => {
      const a = JD.airport(c), n = JD.FLIGHTS.filter((f) => f.to === c).length;
      return `<a class="dest ${cls}" href="explore.html?to=${c}"><b>${esc(a.city)}</b><small>${esc(a.country)} · ${n} sample ${n === 1 ? 'route' : 'routes'}</small></a>`;
    }).join('');

    // Hero search -> explore page with query params (codes resolved from the text fields).
    const form = $('#hero-search');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const p = new URLSearchParams();
      const from = JD.parseAirport($('#s-from').value), to = JD.parseAirport($('#s-to').value);
      if ($('#s-from').value && !from) return JD.setError($('#s-from'), 'Choose an airport from the list.');
      JD.setError($('#s-from'), '');
      if ($('#s-to').value && !to) return JD.setError($('#s-to'), 'Choose an airport from the list, or leave blank for Anywhere.');
      JD.setError($('#s-to'), '');
      if (from) p.set('from', from);
      if (to) p.set('to', to);
      if ($('#s-date').value) p.set('date', $('#s-date').value);
      if ($('#s-max').value) p.set('max', $('#s-max').value);
      if (form.nearby.checked) p.set('nearby', '1');
      if (form.flex.checked) p.set('flex', '1');
      location.href = 'explore.html' + (p.toString() ? '?' + p : '');
    });

    JD.wireQuickSignup($('#quick-signup'));
  });
})();
