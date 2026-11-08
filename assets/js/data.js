/* JetDrop — SAMPLE DATA ONLY.
 * Every listing below is a clearly labelled demonstration record. None of it is real inventory.
 * FUTURE INTEGRATION: replace JD.FLIGHTS with a Supabase query (table `empty_legs`) that is fed by a
 * separate, authorised data-ingestion service. The shape of each record is documented in README.md.
 */
(function () {
  const JD = (window.JD = window.JD || {});

  JD.AIRPORTS = [
    { code: 'LHR', city: 'London', name: 'Heathrow', country: 'UK', lat: 51.47, lon: -0.454 },
    { code: 'LTN', city: 'London', name: 'Luton', country: 'UK', lat: 51.875, lon: -0.368 },
    { code: 'BQH', city: 'London', name: 'Biggin Hill', country: 'UK', lat: 51.331, lon: 0.033 },
    { code: 'FAB', city: 'London', name: 'Farnborough', country: 'UK', lat: 51.276, lon: -0.776 },
    { code: 'DUB', city: 'Dublin', name: 'Dublin', country: 'Ireland', lat: 53.421, lon: -6.27 },
    { code: 'AMS', city: 'Amsterdam', name: 'Schiphol', country: 'Netherlands', lat: 52.31, lon: 4.768 },
    { code: 'BRU', city: 'Brussels', name: 'Brussels', country: 'Belgium', lat: 50.901, lon: 4.484 },
    { code: 'CDG', city: 'Paris', name: 'Charles de Gaulle', country: 'France', lat: 49.009, lon: 2.548 },
    { code: 'LBG', city: 'Paris', name: 'Le Bourget', country: 'France', lat: 48.969, lon: 2.441 },
    { code: 'NCE', city: 'Nice', name: 'Côte d’Azur', country: 'France', lat: 43.665, lon: 7.215 },
    { code: 'GVA', city: 'Geneva', name: 'Geneva', country: 'Switzerland', lat: 46.238, lon: 6.109 },
    { code: 'ZRH', city: 'Zurich', name: 'Zurich', country: 'Switzerland', lat: 47.458, lon: 8.548 },
    { code: 'MUC', city: 'Munich', name: 'Munich', country: 'Germany', lat: 48.354, lon: 11.786 },
    { code: 'FRA', city: 'Frankfurt', name: 'Frankfurt', country: 'Germany', lat: 50.033, lon: 8.571 },
    { code: 'CPH', city: 'Copenhagen', name: 'Copenhagen', country: 'Denmark', lat: 55.618, lon: 12.656 },
    { code: 'MXP', city: 'Milan', name: 'Malpensa', country: 'Italy', lat: 45.63, lon: 8.723 },
    { code: 'LIN', city: 'Milan', name: 'Linate', country: 'Italy', lat: 45.445, lon: 9.277 },
    { code: 'VCE', city: 'Venice', name: 'Marco Polo', country: 'Italy', lat: 45.505, lon: 12.352 },
    { code: 'FCO', city: 'Rome', name: 'Fiumicino', country: 'Italy', lat: 41.8, lon: 12.239 },
    { code: 'CIA', city: 'Rome', name: 'Ciampino', country: 'Italy', lat: 41.799, lon: 12.595 },
    { code: 'OLB', city: 'Olbia (Sardinia)', name: 'Costa Smeralda', country: 'Italy', lat: 40.899, lon: 9.518 },
    { code: 'BCN', city: 'Barcelona', name: 'El Prat', country: 'Spain', lat: 41.297, lon: 2.078 },
    { code: 'MAD', city: 'Madrid', name: 'Barajas', country: 'Spain', lat: 40.472, lon: -3.563 },
    { code: 'PMI', city: 'Palma de Mallorca', name: 'Palma', country: 'Spain', lat: 39.551, lon: 2.739 },
    { code: 'IBZ', city: 'Ibiza', name: 'Ibiza', country: 'Spain', lat: 38.873, lon: 1.373 },
    { code: 'LIS', city: 'Lisbon', name: 'Humberto Delgado', country: 'Portugal', lat: 38.774, lon: -9.134 },
    { code: 'ATH', city: 'Athens', name: 'Eleftherios Venizelos', country: 'Greece', lat: 37.936, lon: 23.947 },
    { code: 'JMK', city: 'Mykonos', name: 'Mykonos', country: 'Greece', lat: 37.435, lon: 25.348 },
    { code: 'DBV', city: 'Dubrovnik', name: 'Dubrovnik', country: 'Croatia', lat: 42.561, lon: 18.268 },
  ];

  JD.AIRCRAFT = {
    'Cessna Citation Mustang': { category: 'Very light jet', seats: 4 },
    'Embraer Phenom 100': { category: 'Very light jet', seats: 4 },
    'Embraer Phenom 300': { category: 'Light jet', seats: 6 },
    'Cessna Citation CJ3': { category: 'Light jet', seats: 6 },
    'Cessna Citation CJ2+': { category: 'Light jet', seats: 6 },
    'Learjet 45': { category: 'Light jet', seats: 7 },
    'Cessna Citation XLS': { category: 'Midsize jet', seats: 8 },
    'Hawker 800XP': { category: 'Midsize jet', seats: 8 },
    'Embraer Praetor 500': { category: 'Midsize jet', seats: 8 },
    'Embraer Praetor 600': { category: 'Super-midsize jet', seats: 9 },
    'Cessna Citation Latitude': { category: 'Midsize jet', seats: 8 },
    'Bombardier Challenger 350': { category: 'Super-midsize jet', seats: 9 },
    'Pilatus PC-12 NG': { category: 'Turboprop', seats: 8 },
  };
  JD.CATEGORIES = ['Very light jet', 'Light jet', 'Midsize jet', 'Super-midsize jet', 'Turboprop'];

  JD.STATUS = {
    listed: { label: 'Listed by provider', tone: 'ok', hint: 'Shown as available on the provider’s site when last checked. Not confirmed by JetDrop.' },
    unconfirmed: { label: 'Unconfirmed — check with provider', tone: 'warn', hint: 'We could not verify current availability. Ask the provider.' },
    changed: { label: 'Recently updated', tone: 'info', hint: 'The listing changed since we first saw it. Re-check details with the provider.' },
  };

  // [id, from, to, daysFromToday, localDeparture, aircraft, wholeAircraftPriceEUR, source, minutesSinceChecked, status, listedDaysAgo]
  const RAW = [
    ['jd-001', 'LTN', 'NCE', 3, '10:30', 'Cessna Citation CJ2+', 6900, 'Sample Operator A', 42, 'listed', 1],
    ['jd-002', 'FAB', 'GVA', 4, '14:15', 'Embraer Phenom 300', 5400, 'Sample Marketplace B', 95, 'unconfirmed', 0],
    ['jd-003', 'BQH', 'LBG', 5, '09:20', 'Cessna Citation Mustang', 2900, 'Sample Operator A', 18, 'listed', 2],
    ['jd-004', 'LBG', 'OLB', 6, '09:00', 'Cessna Citation XLS', 9800, 'Sample Operator C', 130, 'changed', 3],
    ['jd-005', 'MXP', 'IBZ', 7, '16:40', 'Embraer Praetor 500', 11200, 'Sample Marketplace B', 61, 'listed', 1],
    ['jd-006', 'ZRH', 'LIS', 9, '11:20', 'Bombardier Challenger 350', 14900, 'Sample Operator D', 210, 'unconfirmed', 4],
    ['jd-007', 'BCN', 'FCO', 10, '18:05', 'Learjet 45', 6100, 'Sample Operator C', 27, 'listed', 0],
    ['jd-008', 'NCE', 'JMK', 12, '12:30', 'Cessna Citation Latitude', 15800, 'Sample Operator D', 75, 'listed', 2],
    ['jd-009', 'AMS', 'LBG', 13, '08:10', 'Embraer Phenom 100', 3200, 'Sample Marketplace B', 33, 'listed', 1],
    ['jd-010', 'MUC', 'VCE', 15, '15:30', 'Cessna Citation CJ3', 4700, 'Sample Operator A', 150, 'unconfirmed', 5],
    ['jd-011', 'LIS', 'PMI', 16, '10:00', 'Hawker 800XP', 8300, 'Sample Operator C', 54, 'listed', 3],
    ['jd-012', 'DUB', 'LTN', 18, '13:45', 'Embraer Phenom 300', 5900, 'Sample Marketplace B', 12, 'changed', 0],
    ['jd-013', 'ATH', 'DBV', 20, '17:20', 'Pilatus PC-12 NG', 3900, 'Sample Operator D', 88, 'listed', 2],
    ['jd-014', 'GVA', 'OLB', 22, '09:40', 'Cessna Citation XLS', 9100, 'Sample Operator A', 46, 'listed', 1],
    ['jd-015', 'FCO', 'PMI', 25, '12:10', 'Embraer Praetor 600', 12900, 'Sample Operator D', 301, 'unconfirmed', 6],
  ];

  function isoDate(offset) {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + offset);
    const p = (n) => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }

  JD.FLIGHTS = RAW.map((r, i) => {
    const ac = JD.AIRCRAFT[r[5]];
    return {
      id: r[0], from: r[1], to: r[2], date: isoDate(r[3]), time: r[4], aircraft: r[5],
      category: ac.category, seats: ac.seats, price: r[6], currency: 'EUR', source: r[7],
      checkedMinutesAgo: r[8], status: r[9], listedDaysAgo: r[10], order: i, demo: true,
    };
  });

  JD.airport = (code) => JD.AIRPORTS.find((a) => a.code === code);

  JD.distanceKm = function (a, b) {
    const R = 6371, rad = Math.PI / 180;
    const dLat = (b.lat - a.lat) * rad, dLon = (b.lon - a.lon) * rad;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  };

  /** Airport codes within radiusKm of `code` (always includes `code`). */
  JD.nearbyCodes = function (code, radiusKm) {
    const a = JD.airport(code);
    if (!a) return [code];
    return JD.AIRPORTS.filter((b) => b.code === code || (radiusKm > 0 && JD.distanceKm(a, b) <= radiusKm)).map((b) => b.code);
  };
})();
