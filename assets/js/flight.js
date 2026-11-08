(function () {
  const { $, esc } = JD;
  document.addEventListener('DOMContentLoaded', () => {
    const root = $('#fd-root');
    const id = new URLSearchParams(location.search).get('id');
    const f = JD.FLIGHTS.find((x) => x.id === id);
    if (!f) {
      document.title = 'Flight not found — JetDrop';
      root.innerHTML = `<div class="page-head"><h1>We couldn’t find that flight.</h1><p class="lead">Listings change often. Browse what’s available or create an alert and we’ll let you know when something matches.</p><div style="display:flex;gap:12px;flex-wrap:wrap"><a class="btn btn-primary" href="explore.html">Explore Flights</a><a class="btn btn-gold" href="alerts.html">Create Alert</a></div></div>`;
      return;
    }
    const a = JD.airport(f.from), b = JD.airport(f.to), st = JD.STATUS[f.status];
    document.title = `${a.city} (${f.from}) to ${b.city} (${f.to}) empty leg — JetDrop`;
    const sky = ['sky-a', 'sky-b', 'sky-c', 'sky-d'][f.order % 4];
    const similar = JD.FLIGHTS.filter((x) => x.id !== f.id && (x.from === f.from || x.to === f.to || x.category === f.category)).slice(0, 3);

    root.innerHTML = `
      <nav class="crumbs" aria-label="Breadcrumb"><a href="explore.html">Explore Flights</a> / ${f.from} → ${f.to}</nav>
      <div class="fd">
        <div class="grid" style="gap:28px">
          <div>
            <div class="fd-hero ${sky}" role="img" aria-label="Illustrative aircraft artwork (placeholder for provider photography)">
              <span class="fc-demo">Sample listing</span>
              <svg class="plane" viewBox="0 0 24 24" aria-hidden="true" style="transform:rotate(45deg)"><path d="M21 15.5v-1.7l-8-5V3.5a1.5 1.5 0 0 0-3 0v5.3l-8 5v1.7l8-2.3v4.6l-2 1.5V22l3.5-1 3.5 1v-1.2l-2-1.5v-4.6z" fill="currentColor"/></svg>
              <div><p>${esc(a.city)} to ${esc(b.city)}</p><h1>${f.from} → ${f.to}</h1></div>
            </div>
            <p class="photo-note">Illustration. Real aircraft photographs will appear here only where the listing provider permits their use.</p>
          </div>
          <dl class="facts">
            <div><dt>Departure</dt><dd>${esc(a.city)} — ${esc(a.name)} (${f.from})</dd></div>
            <div><dt>Destination</dt><dd>${esc(b.city)} — ${esc(b.name)} (${f.to})</dd></div>
            <div><dt>Date</dt><dd>${JD.fmtDate(f.date, true)}</dd></div>
            <div><dt>Departure (local time)</dt><dd>${f.time}</dd></div>
            <div><dt>Aircraft</dt><dd>${esc(f.aircraft)}</dd></div>
            <div><dt>Category</dt><dd>${esc(f.category)}</dd></div>
            <div><dt>Passenger capacity</dt><dd>Up to ${f.seats}</dd></div>
            <div><dt>Listing source</dt><dd>${esc(f.source)} <span class="muted">(sample)</span></dd></div>
            <div><dt>Last checked</dt><dd>${JD.ago(f.checkedMinutesAgo)} <span class="muted">(sample timestamp)</span></dd></div>
            <div><dt>Availability</dt><dd><span class="status status-${st.tone}"><i></i>${st.label}</span></dd></div>
            <div><dt>Currency</dt><dd>${f.currency}</dd></div>
            <div><dt>Known fees</dt><dd>Not provided by source. Ask the provider about taxes, handling and landing fees.</dd></div>
          </dl>
          <div class="panel">
            <h2>Booking conditions</h2>
            <p class="muted" style="margin:0">Not available for this sample listing. When supplied by a provider, cancellation terms, luggage allowances and payment conditions will appear here, copied from the original listing. Always confirm conditions with the provider before paying anything.</p>
            <h2>About this status</h2>
            <p class="muted" style="margin:0"><b>${st.label}.</b> ${st.hint} JetDrop never presents a listing as operator-confirmed unless confirmation has actually been obtained.</p>
          </div>
        </div>

        <aside class="book" aria-label="Price and booking">
          <span class="price-label">Whole-aircraft price</span>
          <strong class="price">${JD.money(f.price)}</strong>
          <p class="illustration">Illustration only: splitting the entire aircraft cost between ${f.seats} people would be ≈ ${JD.money(JD.perPerson(f))} each. Individual seats are not bookable.</p>
          <button class="btn btn-gold btn-lg btn-block" id="check-btn" type="button">Check Availability with Provider ${JD.icon('link')}</button>
          <a class="btn btn-ghost btn-block" href="alerts.html?from=${f.from}&to=${f.to}&max=${f.price}">Alert me about similar flights</a>
          <p class="disclaimer">Empty-leg flights are subject to operational changes, cancellation and operator confirmation. Prices and availability may change without notice. JetDrop is an independent flight discovery service and does not operate aircraft or issue flight tickets.</p>
        </aside>
      </div>
      ${similar.length ? `<section style="padding-bottom:80px"><h2>Other sample flights</h2><div class="grid cards">${similar.map((x) => JD.flightCard(x)).join('')}</div></section>` : ''}`;

    const dlg = $('#redirect-dialog');
    $('#check-btn').addEventListener('click', () => (dlg.showModal ? dlg.showModal() : alert('Demonstration listing: no provider page is connected yet.')));
    $('#rd-close').addEventListener('click', () => dlg.close());
  });
})();
