(function () {
  'use strict';

  const P = window.PILGRIMAGE;
  const C = window.PILGRIM_CONFIG || {};
  const WALK_KMH = 3; // średnie tempo grupy z wózkiem, do szacowania czasu dojazdu

  // ---------- storage (bezpieczne – działa też w trybie prywatnym) ----------
  const store = {
    get(k, def) {
      try { const v = localStorage.getItem(k); return v == null ? def : JSON.parse(v); } catch (e) { return def; }
    },
    set(k, v) {
      try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; }
    },
    keys() {
      try { return Object.keys(localStorage); } catch (e) { return []; }
    },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } }
  };

  const settings = {
    key: store.get('pilgrim:key', '') || C.MAPY_API_KEY || '',
    routeType: store.get('pilgrim:routeType', '') || C.ROUTE_TYPE || 'bike_road',
    year: Number(store.get('pilgrim:year', 0)) || C.YEAR || new Date().getFullYear()
  };
  const done = new Set(store.get('pilgrim:done', []));
  const checks = store.get('pilgrim:checks', {});
  const contacts = store.get('pilgrim:contacts', [
    { role: 'Kierowca auta technicznego', name: '', phone: '' },
    { role: 'Koordynator pielgrzymki', name: '', phone: '' },
    { role: 'Opiekun medyczny', name: '', phone: '' }
  ]);

  // ---------- helpers ----------
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const stageOf = (d) => P.stages.find((s) => s.id === d.stage);
  const dayDate = (d) => new Date(settings.year + '-' + d.date + 'T00:00:00');
  const fmtDate = (d) => dayDate(d).toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' });
  const lonlat = (p) => p[1].toFixed(6) + ',' + p[0].toFixed(6);
  const fmtKm = (m) => (m / 1000).toFixed(m < 10000 ? 1 : 0).replace('.', ',') + ' km';
  const fmtTime = (h) => { const m = Math.round(h * 60); return (m >= 60 ? Math.floor(m / 60) + ' h ' : '') + (m % 60) + ' min'; };
  const LEVELS = { 1: 'łatwy', 2: 'umiarkowany', 3: 'wymagający' };
  const SHRINES = [
    { name: 'Sanktuarium MB z Lourdes – Kochłowice', at: [50.2550, 18.8985] },
    { name: 'Jasna Góra – Częstochowa', at: [50.8123, 19.0972] },
    { name: 'Sanktuarium Bożego Miłosierdzia – Łagiewniki', at: [50.0197, 19.9330] }
  ];

  function todayIso() {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate());
  }
  // Dzień pielgrzymki na dziś: {phase:'before'|'during'|'after', day, daysLeft}
  function phaseNow() {
    const t = todayIso();
    const first = dayDate(P.days[0]);
    const last = dayDate(P.days[P.days.length - 1]);
    if (t < first) return { phase: 'before', day: P.days[0], daysLeft: Math.round((first - t) / 864e5) };
    if (t > last) return { phase: 'after', day: P.days[P.days.length - 1] };
    return { phase: 'during', day: P.days.find((d) => dayDate(d).getTime() === t.getTime()) || P.days[0] };
  }

  function haversine(a, b) {
    const R = 6371000, r = Math.PI / 180;
    const dLat = (b[0] - a[0]) * r, dLon = (b[1] - a[1]) * r;
    const x = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(x));
  }

  // Rzut punktu na linię: zwraca odległość od linii i pozycję wzdłuż niej (m).
  function projectOnLine(p, coords) {
    const kx = Math.cos(p[0] * Math.PI / 180) * 111320, ky = 110540;
    let best = { dist: Infinity, along: 0 }, acc = 0;
    for (let i = 0; i < coords.length - 1; i++) {
      const a = coords[i], b = coords[i + 1];
      const ax = (a[1] - p[1]) * kx, ay = (a[0] - p[0]) * ky;
      const bx = (b[1] - p[1]) * kx, by = (b[0] - p[0]) * ky;
      const dx = bx - ax, dy = by - ay, len2 = dx * dx + dy * dy;
      const t = len2 ? Math.max(0, Math.min(1, -(ax * dx + ay * dy) / len2)) : 0;
      const qx = ax + t * dx, qy = ay + t * dy;
      const dist = Math.hypot(qx, qy), seg = Math.sqrt(len2);
      if (dist < best.dist) best = { dist, along: acc + t * seg, i };
      acc += seg;
    }
    best.total = acc;
    return best;
  }

  // ---------- Mapy.com URL API (nawigacja – działa bez klucza) ----------
  // Współrzędne zostawiamy nieenkodowane (",", ";"), tak jak w przykładach dokumentacji Mapy.com.
  const qs = (params) => Object.entries(params).map(([k, v]) => k + '=' + encodeURIComponent(v).replace(/%2C/g, ',').replace(/%3B/g, ';')).join('&');
  const mapyUrl = {
    route(points, nav) {
      const params = { start: lonlat(points[0]), end: lonlat(points[points.length - 1]) };
      const mid = points.slice(1, -1);
      if (mid.length) params.waypoints = mid.map(lonlat).join(';');
      params.routeType = settings.routeType;
      if (nav) params.navigation = 'true';
      return 'https://mapy.com/fnc/v1/route?' + qs(params);
    },
    show(p, zoom) {
      return 'https://mapy.com/fnc/v1/showmap?' + qs({ center: lonlat(p), zoom: zoom || 16, marker: 'true' });
    },
    search(query, p) {
      return 'https://mapy.com/fnc/v1/search?' + qs({ query, center: lonlat(p), zoom: 13 });
    }
  };
  const weatherUrl = (p) => `https://www.windy.com/${p[0].toFixed(3)}/${p[1].toFixed(3)}?${p[0].toFixed(3)},${p[1].toFixed(3)},11`;

  // ---------- mapa ----------
  const map = L.map('map', { zoomControl: true, attributionControl: true });
  let tileErrorShown = false;

  function mapyLayer(mapset) {
    const layer = L.tileLayer(`https://api.mapy.com/v1/maptiles/${mapset}/256/{z}/{x}/{y}?apikey=${encodeURIComponent(settings.key)}`, {
      minZoom: 0, maxZoom: 19,
      attribution: '<a href="https://api.mapy.com/copyright" target="_blank" rel="noopener">&copy; Seznam.cz a.s. a další</a>'
    });
    layer.on('tileerror', () => {
      if (tileErrorShown) return;
      tileErrorShown = true;
      flash('Mapy.com nie zwróciły kafelków – sprawdź klucz API i ograniczenie domeny w Ustawieniach.');
    });
    return layer;
  }

  function setupBaseLayers() {
    if (settings.key) {
      const bases = {
        'Mapy.com – podstawowa': mapyLayer('basic'),
        'Mapy.com – turystyczna': mapyLayer('outdoor'),
        'Mapy.com – satelitarna': L.layerGroup([mapyLayer('aerial'), mapyLayer('names-overlay')])
      };
      bases['Mapy.com – podstawowa'].addTo(map);
      L.control.layers(bases, null, { position: 'topleft' }).addTo(map);
      const Logo = L.Control.extend({
        options: { position: 'bottomleft' },
        onAdd() {
          const c = L.DomUtil.create('div', 'mapy-logo');
          c.innerHTML = '<a href="https://mapy.com/" target="_blank" rel="noopener"><img src="https://api.mapy.com/img/api/logo.svg" alt="Mapy.com"></a>';
          L.DomEvent.disableClickPropagation(c);
          return c;
        }
      });
      new Logo().addTo(map);
    } else {
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
      }).addTo(map);
      $('#key-banner').hidden = false;
    }
  }

  const dayLayers = {}; // n -> {group, line, coords, routed, meta}
  let selected = null;
  let activeStages = new Set(P.stages.map((s) => s.id));

  function pinIcon(text, color, big) {
    return L.divIcon({
      className: '',
      html: `<div class="pin${big ? ' big' : ''}" style="${big ? '' : 'background:' + color}">${text}</div>`,
      iconSize: big ? [38, 38] : [30, 30],
      iconAnchor: big ? [19, 19] : [15, 15],
      popupAnchor: [0, -14]
    });
  }
  const poiIcon = L.divIcon({ className: '', html: '<div class="poi-dot"></div>', iconSize: [14, 14], iconAnchor: [7, 7] });

  function dayPopup(d) {
    const end = d.via[d.via.length - 1];
    return `<strong>Dzień ${d.n} · ${esc(fmtDate(d))}</strong><br>${esc(d.from)} → ${esc(d.to)}<br>
      <span class="muted">Nocleg: ${esc(d.sleep)}</span><div class="btn-row">
      <a class="btn" href="${mapyUrl.route(d.via.map((v) => v), true)}" target="_blank" rel="noopener">Nawiguj</a>
      <button class="btn" data-select="${d.n}">Szczegóły</button>
      <a class="btn" href="${mapyUrl.search('nocleg', end)}" target="_blank" rel="noopener">Noclegi</a></div>`;
  }

  function drawDays() {
    P.days.forEach((d) => {
      const color = stageOf(d).color;
      const coords = d.via.map((v) => [v[0], v[1]]);
      const group = L.featureGroup();
      const line = L.polyline(coords, { color, weight: 5, opacity: .85, dashArray: '8 8' }).addTo(group);
      line.on('click', () => selectDay(d.n));
      line.bindTooltip(`Dzień ${d.n}: ${d.from} → ${d.to}`, { sticky: true });
      const end = d.via[d.via.length - 1];
      L.marker([end[0], end[1]], { icon: pinIcon(d.n, color), title: `Dzień ${d.n} – nocleg` })
        .bindPopup(() => dayPopup(d)).addTo(group);
      d.pois.forEach((p) => {
        L.marker(p.at, { icon: poiIcon, title: p.name })
          .bindPopup(`<strong>${esc(p.name)}</strong>${p.note ? '<br>' + esc(p.note) : ''}<br><span class="muted">Dzień ${d.n}</span>
            <div class="btn-row"><a class="btn" href="${mapyUrl.show(p.at)}" target="_blank" rel="noopener">Otwórz w Mapy.com</a></div>`)
          .addTo(group);
      });
      group.addTo(map);
      dayLayers[d.n] = { group, line, coords, routed: false, meta: null };
    });
    SHRINES.forEach((s) => {
      L.marker(s.at, { icon: pinIcon('✝', '', true), title: s.name, zIndexOffset: 1000 })
        .bindPopup(`<strong>${esc(s.name)}</strong><div class="btn-row"><a class="btn" href="${mapyUrl.show(s.at, 17)}" target="_blank" rel="noopener">Otwórz w Mapy.com</a></div>`)
        .addTo(map);
    });
  }

  map.on('popupopen', (e) => {
    const b = e.popup.getElement().querySelector('[data-select]');
    if (b) b.addEventListener('click', () => { map.closePopup(); selectDay(Number(b.dataset.select)); });
  });

  function visibleBounds() {
    const b = L.latLngBounds([]);
    P.days.forEach((d) => { if (activeStages.has(d.stage)) b.extend(dayLayers[d.n].group.getBounds()); });
    return b;
  }
  function fitAll() {
    const b = visibleBounds();
    if (b.isValid()) map.fitBounds(b, { padding: [24, 24] });
  }

  function styleLines() {
    P.days.forEach((d) => {
      const l = dayLayers[d.n];
      const isSel = selected === d.n;
      l.line.setStyle({
        weight: isSel ? 8 : 5,
        opacity: selected && !isSel ? .35 : .85,
        dashArray: l.routed ? null : '8 8'
      });
      if (isSel) l.line.bringToFront();
    });
  }

  // ---------- wyznaczanie tras przez Mapy.com REST API ----------
  async function fetchSegment(a, b) {
    const u = new URL('https://api.mapy.com/v1/routing/route');
    u.searchParams.set('apikey', settings.key);
    u.searchParams.set('lang', 'pl');
    u.searchParams.set('start', lonlat(a));
    u.searchParams.set('end', lonlat(b));
    u.searchParams.set('routeType', settings.routeType);
    u.searchParams.set('format', 'geojson');
    const r = await fetch(u.toString(), { mode: 'cors' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const j = await r.json();
    let g = j.geometry;
    if (g && g.type === 'Feature') g = g.geometry;
    if (!g || !g.coordinates) throw new Error('Brak geometrii');
    const lines = g.type === 'MultiLineString' ? g.coordinates : [g.coordinates];
    const coords = [];
    lines.forEach((ln) => ln.forEach((c) => coords.push([+c[1].toFixed(5), +c[0].toFixed(5)])));
    return { coords, length: j.length || 0, duration: j.duration || 0 };
  }

  async function routeDay(d) {
    const sig = d.via.map((v) => v[0] + ',' + v[1]).join(';');
    const key = `pilgrim:route:v1:${settings.routeType}:${d.n}`;
    let cached = store.get(key, null);
    if (!cached || cached.sig !== sig) {
      const parts = [];
      for (let i = 0; i < d.via.length - 1; i++) parts.push(await fetchSegment(d.via[i], d.via[i + 1]));
      cached = {
        sig,
        coords: parts.flatMap((p, i) => (i ? p.coords.slice(1) : p.coords)),
        length: parts.reduce((s, p) => s + p.length, 0),
        duration: parts.reduce((s, p) => s + p.duration, 0)
      };
      store.set(key, cached);
    }
    const l = dayLayers[d.n];
    l.coords = cached.coords;
    l.routed = true;
    l.meta = { length: cached.length };
    l.line.setLatLngs(cached.coords);
    const el = document.querySelector(`#day-${d.n} .route-meta`);
    if (el) el.textContent = `Wg Mapy.com (${settings.routeType}): ${fmtKm(cached.length)} · ok. ${fmtTime(cached.length / 1000 / WALK_KMH)} marszu`;
  }

  async function routeAll() {
    if (!settings.key) return;
    let ok = 0, fail = 0;
    const queue = P.days.slice();
    const worker = async () => {
      while (queue.length) {
        const d = queue.shift();
        try { await routeDay(d); ok++; } catch (e) { fail++; console.warn('Trasa dnia', d.n, e); }
      }
    };
    await Promise.all([worker(), worker(), worker()]);
    styleLines();
    updateProgress();
    if (fail) flash(`Nie udało się wyznaczyć ${fail} z 15 odcinków przez Mapy.com – pokazano linie orientacyjne.`);
  }

  // ---------- panel: plan ----------
  function renderStageFilter() {
    const box = $('#stage-filter');
    box.innerHTML = P.stages.map((s) =>
      `<button class="chip" aria-pressed="true" data-stage="${s.id}"><span class="dot" style="background:${s.color}"></span>${esc(s.short)}</button>`
    ).join('');
    box.addEventListener('click', (e) => {
      const b = e.target.closest('[data-stage]');
      if (!b) return;
      const id = Number(b.dataset.stage);
      if (activeStages.has(id) && activeStages.size > 1) activeStages.delete(id); else activeStages.add(id);
      $$('[data-stage]', box).forEach((c) => c.setAttribute('aria-pressed', activeStages.has(Number(c.dataset.stage))));
      applyStageFilter();
    });
  }
  function applyStageFilter() {
    P.days.forEach((d) => {
      const on = activeStages.has(d.stage);
      const l = dayLayers[d.n].group;
      if (on && !map.hasLayer(l)) l.addTo(map);
      if (!on && map.hasLayer(l)) map.removeLayer(l);
    });
    $$('.stage-block').forEach((b) => { b.hidden = !activeStages.has(Number(b.dataset.stage)); });
    fitAll();
  }

  function dayCard(d) {
    const s = stageOf(d);
    const end = d.via[d.via.length - 1];
    return `
    <article class="day${done.has(d.n) ? ' completed' : ''}" id="day-${d.n}">
      <button class="day-head" aria-expanded="false" data-day="${d.n}">
        <span class="day-num" style="background:${s.color}">${d.n}</span>
        <span class="day-title"><strong>${esc(d.from)} → ${esc(d.to)}</strong><span>${esc(fmtDate(d))}</span></span>
        <span class="day-km">ok. ${d.km} km</span>
      </button>
      <div class="day-body" hidden>
        <p>${d.special ? `<span class="tag special">${esc(d.special)}</span>` : ''}<span class="tag l${d.level}">poziom: ${LEVELS[d.level]}</span></p>
        ${d.start ? `<p><b>Start:</b> ${esc(d.start)}</p>` : ''}
        <p><b>Przebieg:</b> ${esc(d.route)}</p>
        ${d.warn ? `<p class="warn">⚠ ${esc(d.warn)}</p>` : ''}
        <p><b>Punkty orientacyjne:</b></p>
        <ul>${d.pois.map((p) => `<li><button class="link" data-poi="${p.at[0]},${p.at[1]}">${esc(p.name)}</button>${p.note ? ' – ' + esc(p.note) : ''}</li>`).join('')}</ul>
        <p><b>Punkty trasy:</b> ${d.via.map((v) => esc(v[2])).join(' → ')}</p>
        <p><b>Nocleg:</b> ${esc(d.sleep)}</p>
        <p class="intention">Intencja dnia: ${esc(d.intention)}</p>
        <p class="route-meta">${settings.key ? 'Wyznaczanie trasy w Mapy.com…' : 'Linia orientacyjna (dodaj klucz Mapy.com, aby wyznaczyć dokładną trasę).'}</p>
        <div class="btn-row">
          <a class="btn primary" href="${mapyUrl.route(d.via, true)}" target="_blank" rel="noopener">🧭 Nawiguj w Mapy.com</a>
          <button class="btn" data-nav-here="${d.n}">📍 Z mojej pozycji</button>
          <button class="btn" data-show="${d.n}">🗺 Pokaż na mapie</button>
        </div>
        <div class="btn-row">
          <a class="btn" href="${mapyUrl.search('nocleg', end)}" target="_blank" rel="noopener">🛏 Noclegi w pobliżu</a>
          <a class="btn" href="${mapyUrl.search('apteka', end)}" target="_blank" rel="noopener">💊 Apteki</a>
          <a class="btn" href="${weatherUrl(end)}" target="_blank" rel="noopener">☁ Pogoda</a>
          <button class="btn" data-gpx="${d.n}">⬇ GPX</button>
        </div>
        <div class="btn-row">
          <button class="btn ${done.has(d.n) ? 'done' : ''}" data-done="${d.n}">${done.has(d.n) ? '✓ Dzień ukończony' : 'Oznacz jako ukończony'}</button>
        </div>
      </div>
    </article>`;
  }

  function renderDays() {
    $('#days').innerHTML = P.stages.map((s) => `
      <div class="stage-block" data-stage="${s.id}">
        <div class="stage-head" style="border-color:${s.color}">
          <h2>${esc(s.name)}</h2>
          <p>${esc(s.days)} · ${esc(s.about)}</p>
        </div>
        ${P.days.filter((d) => d.stage === s.id).map(dayCard).join('')}
      </div>`).join('');
  }

  function openCard(n, open) {
    const card = $('#day-' + n);
    if (!card) return;
    const head = $('.day-head', card), body = $('.day-body', card);
    body.hidden = !open;
    head.setAttribute('aria-expanded', open);
  }

  function selectDay(n, opts = {}) {
    if (selected && selected !== n) {
      openCard(selected, false);
      const prev = $('#day-' + selected); if (prev) prev.classList.remove('active');
    }
    selected = n;
    const d = P.days.find((x) => x.n === n);
    if (!activeStages.has(d.stage)) {
      activeStages.add(d.stage);
      $$('#stage-filter [data-stage]').forEach((c) => c.setAttribute('aria-pressed', activeStages.has(Number(c.dataset.stage))));
      applyStageFilter();
    }
    openCard(n, true);
    const card = $('#day-' + n);
    card.classList.add('active');
    styleLines();
    map.fitBounds(dayLayers[n].group.getBounds(), { padding: [30, 30] });
    if (!opts.noTab) showTab('plan');
    if (!opts.noScroll) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    try { history.replaceState(null, '', '#dzien-' + n); } catch (e) { /* ignore */ }
  }

  function deselect() {
    if (!selected) return;
    openCard(selected, false);
    $('#day-' + selected).classList.remove('active');
    selected = null;
    styleLines();
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* ignore */ }
  }

  $('#days').addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t) return;
    if (t.dataset.day) {
      const n = Number(t.dataset.day);
      if (selected === n) deselect(); else selectDay(n, { noScroll: true });
    } else if (t.dataset.show) {
      selectDay(Number(t.dataset.show), { noScroll: true });
      if (window.matchMedia('(max-width: 860px)').matches) $('.map-wrap').scrollIntoView({ behavior: 'smooth' });
    } else if (t.dataset.poi) {
      const [a, b] = t.dataset.poi.split(',').map(Number);
      map.setView([a, b], 15);
    } else if (t.dataset.gpx) {
      downloadGpx([P.days.find((d) => d.n === Number(t.dataset.gpx))]);
    } else if (t.dataset.done) {
      toggleDone(Number(t.dataset.done));
    } else if (t.dataset.navHere) {
      navigateFromHere(Number(t.dataset.navHere));
    }
  });

  function toggleDone(n) {
    if (done.has(n)) done.delete(n); else done.add(n);
    store.set('pilgrim:done', Array.from(done));
    const card = $('#day-' + n);
    card.classList.toggle('completed', done.has(n));
    const b = $(`[data-done="${n}"]`, card);
    b.classList.toggle('done', done.has(n));
    b.textContent = done.has(n) ? '✓ Dzień ukończony' : 'Oznacz jako ukończony';
    updateProgress();
    renderToday();
  }

  function dayLengthKm(d) {
    const l = dayLayers[d.n];
    return l && l.meta ? l.meta.length / 1000 : d.km;
  }
  function updateProgress() {
    const total = P.days.reduce((s, d) => s + dayLengthKm(d), 0);
    const km = P.days.filter((d) => done.has(d.n)).reduce((s, d) => s + dayLengthKm(d), 0);
    $('#progress-text').textContent = `${done.size} / ${P.days.length} dni`;
    $('#progress-km').textContent = `${Math.round(km)} z ok. ${Math.round(total)} km`;
    $('#progress-bar').style.width = (total ? (km / total) * 100 : 0) + '%';
  }

  // ---------- panel: dziś ----------
  function renderToday() {
    const ph = phaseNow();
    const status = $('#status');
    const box = $('#today');
    const d = ph.day;
    const end = d.via[d.via.length - 1];
    let head;
    if (ph.phase === 'before') {
      status.textContent = `Do wyjścia: ${ph.daysLeft} ${ph.daysLeft === 1 ? 'dzień' : 'dni'}`;
      head = `<h2>Do wyjścia zostało ${ph.daysLeft} ${ph.daysLeft === 1 ? 'dzień' : 'dni'}</h2><p class="muted">Start: ${esc(fmtDate(d))} ${settings.year}. Poniżej pierwszy dzień drogi.</p>`;
    } else if (ph.phase === 'after') {
      status.textContent = 'Pielgrzymka zakończona – Bogu niech będą dzięki!';
      head = `<h2>Pętla zamknięta 🙏</h2><p>Ukończone dni: ${done.size} z ${P.days.length}. Wróciliście do Kochłowic – przemienieni przez Drogę.</p>`;
    } else {
      status.textContent = `Dziś: dzień ${d.n} z ${P.days.length} – ${d.from} → ${d.to}`;
      head = `<h2>Dziś: dzień ${d.n} · ${esc(fmtDate(d))}</h2>`;
    }
    box.innerHTML = `${head}
      <div class="card">
        <h3>Dzień ${d.n}: ${esc(d.from)} → ${esc(d.to)} (ok. ${d.km} km)</h3>
        <p class="small">${esc(d.route)}</p>
        ${d.warn ? `<p class="warn small">⚠ ${esc(d.warn)}</p>` : ''}
        <p class="small"><b>Nocleg:</b> ${esc(d.sleep)}</p>
        <p class="intention small">Intencja: ${esc(d.intention)}</p>
        <div class="btn-row">
          <a class="btn primary" href="${mapyUrl.route(d.via, true)}" target="_blank" rel="noopener">🧭 Nawiguj cały dzień</a>
          <button class="btn" id="today-here">📍 Z mojej pozycji</button>
          <button class="btn" id="today-show">🗺 Szczegóły</button>
          <a class="btn" href="${weatherUrl(end)}" target="_blank" rel="noopener">☁ Pogoda</a>
        </div>
      </div>`;
    $('#today-here').onclick = () => navigateFromHere(d.n);
    $('#today-show').onclick = () => selectDay(d.n);
  }

  // ---------- GPS ----------
  let watchId = null, meMarker = null, meCircle = null, lastPos = null;

  function getPosition() {
    return new Promise((resolve, reject) => {
      if (lastPos && Date.now() - lastPos.t < 60000) return resolve(lastPos.p);
      if (!navigator.geolocation) return reject(new Error('Brak geolokalizacji w tej przeglądarce'));
      navigator.geolocation.getCurrentPosition(
        (pos) => { const p = [pos.coords.latitude, pos.coords.longitude]; lastPos = { p, t: Date.now() }; resolve(p); },
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
      );
    });
  }

  async function navigateFromHere(n) {
    const d = P.days.find((x) => x.n === n);
    // Otwieramy okno od razu (w obsłudze kliknięcia), żeby przeglądarka nie zablokowała wyskakującego okna.
    const win = window.open('about:blank', '_blank');
    try {
      const me = await getPosition();
      // pomijamy punkty, które są już za nami (wg najbliższego punktu trasy)
      let nearest = 0, best = Infinity;
      d.via.forEach((v, i) => { const dist = haversine(me, v); if (dist < best) { best = dist; nearest = i; } });
      const rest = d.via.slice(Math.min(nearest + 1, d.via.length - 1));
      const url = mapyUrl.route([me, ...rest], true);
      if (win) win.location.href = url; else location.href = url;
    } catch (e) {
      if (win) win.close();
      flash('Nie udało się ustalić pozycji: ' + (e.message || 'brak zgody na lokalizację') + '. Otwieram nawigację od początku dnia.');
      window.open(mapyUrl.route(d.via, true), '_blank', 'noopener');
    }
  }

  function currentDayForGps(p) {
    const ph = phaseNow();
    if (ph.phase === 'during') return ph.day;
    if (selected) return P.days.find((d) => d.n === selected);
    // najbliższy odcinek
    let best = null;
    P.days.forEach((d) => {
      const r = projectOnLine(p, dayLayers[d.n].coords);
      if (!best || r.dist < best.dist) best = { dist: r.dist, d };
    });
    return best.d;
  }

  function updateGps(p, acc) {
    lastPos = { p, t: Date.now() };
    if (!meMarker) {
      meMarker = L.marker(p, { icon: L.divIcon({ className: '', html: '<div class="me-dot"></div>', iconSize: [18, 18], iconAnchor: [9, 9] }), zIndexOffset: 2000 }).addTo(map);
      meCircle = L.circle(p, { radius: acc, color: '#2563eb', weight: 1, fillOpacity: .1 }).addTo(map);
      map.setView(p, 14);
    } else {
      meMarker.setLatLng(p);
      meCircle.setLatLng(p).setRadius(acc);
    }
    const d = currentDayForGps(p);
    const r = projectOnLine(p, dayLayers[d.n].coords);
    const left = Math.max(0, r.total - r.along);
    const off = r.dist > 300;
    $('#gps-info').innerHTML = `
      <p>Odcinek: <b>dzień ${d.n}</b> – ${esc(d.from)} → ${esc(d.to)}</p>
      <p>Do celu dnia (${esc(d.via[d.via.length - 1][2])}):<br><span class="big">${fmtKm(left)}</span>
         <span class="muted">· ok. ${fmtTime(left / 1000 / WALK_KMH)} przy ${WALK_KMH} km/h</span></p>
      <p class="${off ? 'warn' : 'muted'}">${off ? '⚠ Jesteście ' + fmtKm(r.dist) + ' od wyznaczonej trasy.' : 'Jesteście na trasie (±' + Math.round(r.dist) + ' m).'}</p>
      <p class="muted small">Dokładność GPS: ±${Math.round(acc)} m</p>`;
    $('#gps-share').disabled = false;
  }

  function toggleGps() {
    const btn = $('#gps-toggle'), mapBtn = $('#locate');
    if (watchId != null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
      btn.textContent = 'Włącz śledzenie';
      mapBtn.classList.remove('on');
      return;
    }
    if (!navigator.geolocation) { flash('Ta przeglądarka nie udostępnia lokalizacji.'); return; }
    btn.textContent = 'Wyłącz śledzenie';
    mapBtn.classList.add('on');
    $('#gps-info').innerHTML = '<p class="muted">Ustalanie pozycji…</p>';
    watchId = navigator.geolocation.watchPosition(
      (pos) => updateGps([pos.coords.latitude, pos.coords.longitude], pos.coords.accuracy),
      (err) => {
        $('#gps-info').innerHTML = `<p class="warn">Brak pozycji: ${esc(err.message || 'odmowa dostępu')}. Sprawdź zgodę na lokalizację (strona musi działać przez HTTPS).</p>`;
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 30000 }
    );
  }

  async function sharePosition() {
    try {
      const p = await getPosition();
      const url = mapyUrl.show(p, 17);
      const text = `Pielgrzymka – nasza pozycja (${new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })})`;
      if (navigator.share) { await navigator.share({ title: 'Nasza pozycja', text, url }); return; }
      try { await navigator.clipboard.writeText(text + ': ' + url); flash('Link do pozycji skopiowany do schowka.'); }
      catch (e) { location.href = 'sms:?body=' + encodeURIComponent(text + ': ' + url); }
    } catch (e) {
      if (e && e.name === 'AbortError') return;
      flash('Nie udało się udostępnić pozycji.');
    }
  }

  // ---------- logistyka ----------
  function renderLogistics() {
    $('#safety').innerHTML = P.safety.map((s) => `<div class="card"><h3>${esc(s.title)}</h3><p class="small">${esc(s.text)}</p></div>`).join('');
    $('#checklist').innerHTML = P.checklist.map((g) => `
      <div class="check-group"><h3>${esc(g.group)}</h3>
        ${g.items.map((it) => {
          const k = g.group + '|' + it;
          return `<label class="check"><input type="checkbox" data-check="${esc(k)}" ${checks[k] ? 'checked' : ''}><span>${esc(it)}</span></label>`;
        }).join('')}
      </div>`).join('');
    $('#checklist').addEventListener('change', (e) => {
      const k = e.target.dataset.check;
      if (!k) return;
      if (e.target.checked) checks[k] = true; else delete checks[k];
      store.set('pilgrim:checks', checks);
    });

    const form = $('#contacts');
    form.innerHTML = contacts.map((c, i) => `
      <p class="small"><b>${esc(c.role)}</b></p>
      <div class="row">
        <input aria-label="${esc(c.role)} – imię" placeholder="Imię i nazwisko" data-c="${i}" data-f="name" value="${esc(c.name)}">
        <input aria-label="${esc(c.role)} – telefon" placeholder="Telefon" type="tel" data-c="${i}" data-f="phone" value="${esc(c.phone)}">
      </div>`).join('');
    form.addEventListener('input', (e) => {
      const i = e.target.dataset.c, f = e.target.dataset.f;
      if (i == null) return;
      contacts[i][f] = e.target.value;
      store.set('pilgrim:contacts', contacts);
      renderContactLinks();
    });
    form.addEventListener('submit', (e) => e.preventDefault());
    renderContactLinks();
  }
  function renderContactLinks() {
    $('#contact-links').innerHTML = contacts.filter((c) => c.phone.trim()).map((c) =>
      `<a class="btn" href="tel:${esc(c.phone.replace(/[^\d+]/g, ''))}">📞 ${esc(c.name || c.role)}</a>`).join('') ||
      '<p class="muted small">Dodaj numery ekipy w zakładce Logistyka.</p>';
  }

  // ---------- duchowość ----------
  function renderReflection() {
    $('#reflection').innerHTML =
      '<blockquote><i>„Moc w słabości się doskonali”</i> (2 Kor 12,9)</blockquote>' +
      P.reflection.map((r) => `<div class="reflect"><h2>${esc(r.title)}</h2>${r.body.map((b) => `<p>${b}</p>`).join('')}</div>`).join('') +
      '<h2>Intencje na każdy dzień</h2><ol class="small">' +
      P.days.map((d) => `<li><b>${esc(d.from)} → ${esc(d.to)}:</b> ${esc(d.intention)}</li>`).join('') + '</ol>';
  }

  // ---------- GPX ----------
  function xml(s) { return String(s).replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c])); }
  function downloadGpx(days) {
    const wpts = [], trks = [];
    days.forEach((d) => {
      d.via.forEach((v) => wpts.push(`<wpt lat="${v[0]}" lon="${v[1]}"><name>${xml('D' + d.n + ': ' + v[2])}</name></wpt>`));
      d.pois.forEach((p) => wpts.push(`<wpt lat="${p.at[0]}" lon="${p.at[1]}"><name>${xml(p.name)}</name>${p.note ? `<desc>${xml(p.note)}</desc>` : ''}</wpt>`));
      const pts = dayLayers[d.n].coords.map((c) => `<trkpt lat="${c[0]}" lon="${c[1]}"/>`).join('');
      trks.push(`<trk><name>${xml(`Dzień ${d.n}: ${d.from} – ${d.to}`)}</name><trkseg>${pts}</trkseg></trk>`);
    });
    const gpx = `<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="Petla Trzech Sanktuariow" xmlns="http://www.topografix.com/GPX/1/1">` +
      `<metadata><name>${xml(P.title)}</name></metadata>${wpts.join('')}${trks.join('')}</gpx>`;
    const blob = new Blob([gpx], { type: 'application/gpx+xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = days.length === 1 ? `pielgrzymka-dzien-${days[0].n}.gpx` : 'pielgrzymka-petla.gpx';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  // ---------- ustawienia ----------
  function renderSettings() {
    $('#api-key').value = settings.key;
    $('#route-type').value = settings.routeType;
    $('#year').value = settings.year;
    $('#save-settings').onclick = () => {
      store.set('pilgrim:key', $('#api-key').value.trim());
      store.set('pilgrim:routeType', $('#route-type').value);
      store.set('pilgrim:year', Number($('#year').value) || settings.year);
      location.reload();
    };
    $('#clear-routes').onclick = () => {
      store.keys().filter((k) => k.startsWith('pilgrim:route:')).forEach(store.del);
      location.reload();
    };
    $('#reset-progress').onclick = () => {
      if (!confirm('Wyzerować postęp i listę kontrolną?')) return;
      store.del('pilgrim:done');
      store.del('pilgrim:checks');
      location.reload();
    };
  }

  // ---------- zakładki i drobiazgi ----------
  function showTab(name) {
    const cur = $('.tabs [aria-selected="true"]');
    if (cur && cur.dataset.tab !== name) $('#panel').scrollTop = 0;
    $$('.tabs [data-tab]').forEach((b) => b.setAttribute('aria-selected', b.dataset.tab === name));
    $$('.tab').forEach((t) => { t.hidden = t.id !== 'tab-' + name; });
  }
  $('.tabs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-tab]');
    if (b) showTab(b.dataset.tab);
  });
  document.addEventListener('click', (e) => {
    const g = e.target.closest('[data-goto]');
    if (g) showTab(g.dataset.goto);
  });

  let flashTimer;
  function flash(msg) {
    const s = $('#status');
    const prev = s.dataset.prev || s.textContent;
    s.dataset.prev = prev;
    s.textContent = msg;
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => { s.textContent = s.dataset.prev; delete s.dataset.prev; }, 7000);
  }

  // ---------- start ----------
  $('#title').textContent = P.title;
  $('#subtitle').textContent = P.subtitle;
  setupBaseLayers();
  drawDays();
  renderStageFilter();
  renderDays();
  renderToday();
  renderLogistics();
  renderReflection();
  renderSettings();
  updateProgress();
  fitAll();
  styleLines();

  $('#fit-all').onclick = () => { deselect(); fitAll(); };
  $('#locate').onclick = () => { if (watchId == null) toggleGps(); else if (lastPos) map.setView(lastPos.p, 15); };
  $('#gps-toggle').onclick = toggleGps;
  $('#gps-share').onclick = sharePosition;
  $('#gpx-all').onclick = () => downloadGpx(P.days);
  $('#print').onclick = () => window.print();

  const m = /^#dzien-(\d+)$/.exec(location.hash);
  if (m && P.days.some((d) => d.n === Number(m[1]))) selectDay(Number(m[1]));
  else if (phaseNow().phase === 'during') showTab('today');

  routeAll();

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(() => { /* offline niedostępny */ });
  }
})();
