(function () {
  const { $, $$, esc } = JD;
  document.addEventListener('DOMContentLoaded', () => {
    const MAX = 20000;
    const st = { airports: [], dests: [] };
    const el = { air: $('#a-air'), chips: $('#a-chips'), dchips: $('#a-dchips'), dest: $('#a-dest'), any: $('#a-any'), wrap: $('#a-dest-wrap'),
      radius: $('#a-radius'), budget: $('#a-budget'), budgetv: $('#a-budgetv'), range: $('#a-range'), d1: $('#a-d1'), d2: $('#a-d2'),
      email: $('#a-email'), consent: $('#a-consent'), out: $('#a-out'), sum: $('#a-sum'), form: $('#alert-form') };

    const radio = (n) => (document.querySelector(`input[name=${n}]:checked`) || {}).value;
    const chipHTML = (arr, kind) => arr.map((c) => `<span class="chip">${esc(JD.label(c))}<button type="button" data-kind="${kind}" data-code="${c}" aria-label="Remove ${esc(JD.label(c))}">×</button></span>`).join('');

    function add(kind, input) {
      const code = JD.parseAirport(input.value);
      const errBox = kind === 'airports' ? JD.setError(input, code ? '' : 'Choose an airport from the list.') : JD.setError(input, code ? '' : 'Choose a destination from the list.');
      if (!code) return;
      if (!st[kind].includes(code)) st[kind].push(code);
      input.value = ''; input.focus(); render();
    }

    function render() {
      el.chips.innerHTML = chipHTML(st.airports, 'airports') || '<span class="hint">No airports added yet.</span>';
      el.dchips.innerHTML = chipHTML(st.dests, 'dests');
      el.wrap.hidden = el.any.checked;
      el.range.hidden = radio('dates') !== 'range';
      const budget = +el.budget.value >= MAX ? 0 : +el.budget.value;
      el.budgetv.textContent = budget ? JD.money(budget) : 'Any';
      const r = +el.radius.value;
      const dates = { any: 'Flexible — any upcoming date', 30: 'Next 30 days', range: (el.d1.value || el.d2.value) ? `${el.d1.value || 'any'} to ${el.d2.value || 'any'}` : 'Specific range (not set)' }[radio('dates')];
      const freq = { weekly: 'Weekly digest (free)', daily: 'Daily summary — requires JetDrop Plus', instant: 'Instant alerts — requires JetDrop Plus' }[radio('freq')];
      const row = (t, v) => `<div><dt>${t}</dt><dd>${v}</dd></div>`;
      el.sum.innerHTML =
        row('Departing from', st.airports.length ? st.airports.map((c) => esc(JD.label(c))).join(', ') : '<span class="muted" style="color:#9fb0c0">Add at least one airport</span>') +
        row('Nearby airports', r ? `Within ${r} km` : 'Exact airports only') +
        row('Destinations', el.any.checked || !st.dests.length ? 'Anywhere' : st.dests.map((c) => esc(JD.label(c))).join(', ')) +
        row('Max whole-aircraft price', budget ? JD.money(budget) : 'No maximum') +
        row('Dates', dates) + row('Frequency', freq) + row('Email', el.email.value ? esc(el.email.value) : '—');
    }

    $('#a-add').addEventListener('click', () => add('airports', el.air));
    $('#a-dadd').addEventListener('click', () => add('dests', el.dest));
    [el.air, el.dest].forEach((i) => i.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); $(i === el.air ? '#a-add' : '#a-dadd').click(); } }));
    // Selecting from the datalist fills a full label — add straight away.
    el.air.addEventListener('change', () => { if (JD.parseAirport(el.air.value) && /\(/.test(el.air.value)) add('airports', el.air); });
    el.dest.addEventListener('change', () => { if (JD.parseAirport(el.dest.value) && /\(/.test(el.dest.value)) add('dests', el.dest); });
    el.form.addEventListener('click', (e) => {
      const b = e.target.closest('.chip button'); if (!b) return;
      st[b.dataset.kind] = st[b.dataset.kind].filter((c) => c !== b.dataset.code); render();
    });
    el.form.addEventListener('input', render);
    el.form.addEventListener('change', render);

    // Prefill from explore / flight pages.
    const q = new URLSearchParams(location.search);
    if (q.get('from') && JD.airport(q.get('from'))) st.airports.push(q.get('from'));
    if (q.get('to') && JD.airport(q.get('to'))) { st.dests.push(q.get('to')); el.any.checked = false; }
    if (q.get('radius') && ['0', '50', '100', '250', '500'].includes(q.get('radius'))) el.radius.value = q.get('radius');
    if (q.get('max') && +q.get('max') < MAX) el.budget.value = q.get('max');

    el.form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      if (!st.airports.length) { JD.setError(el.air, 'Add at least one departure airport.'); ok = false; } else JD.setError(el.air, '');
      ok = JD.setError(el.email, JD.isEmail(el.email.value) ? '' : 'Enter a valid email address, like name@example.com.') && ok;
      ok = JD.setError(el.consent, el.consent.checked ? '' : 'Please tick the box to receive alerts.') && ok;
      if (radio('dates') === 'range' && el.d1.value && el.d2.value && el.d2.value < el.d1.value) ok = JD.setError(el.d2, 'End date must be after the start date.') && ok;
      else JD.setError(el.d2, '');
      if (!ok) { const bad = el.form.querySelector('[aria-invalid=true]'); if (bad) bad.focus(); return; }
      el.out.innerHTML = JD.demoNotice('Here is the alert you described — see the summary alongside.');
      el.out.hidden = false; el.out.focus();
    });

    render();
  });
})();
