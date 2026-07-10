document.addEventListener("DOMContentLoaded", () => {
  const fleet = window.DOZR_FLEET || { assets: [], sites: [], geofences: [], events: [], maintenance: [], reports: [], recentReports: [], alertsFeed: [], drivers: [] };
  const page = document.body.dataset.page;

  initMobileNav();
  renderTripHistory(fleet);
  renderNavStatus(fleet);
  
  if (page === "fleet-map") renderFleetMap(fleet);
  if (page === "fuel") renderFuel(fleet);
  if (page === "maintenance") renderMaintenance(fleet);
  if (page === "geofences") renderGeofences(fleet);
  if (page === "utilisation") renderUtilisation(fleet);
  if (page === "cost-roi") renderCostRoi(fleet);
  if (page === "reports") renderReports(fleet);
  if (page === "alerts") renderAlertsCenter(fleet);
  if (page === "timesheet") renderTimesheet(fleet);
  });

function initMobileNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-nav-menu]");
  if (!toggle || !menu) return;

  function closeMenu() {
    menu.setAttribute("data-open", "false");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = menu.getAttribute("data-open") === "true";
    menu.setAttribute("data-open", String(!isOpen));
    toggle.setAttribute("aria-expanded", String(!isOpen));
  });

  document.addEventListener("click", (e) => {
    if (menu.getAttribute("data-open") === "true" && !menu.contains(e.target) && e.target !== toggle) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.getAttribute("data-open") === "true") {
      closeMenu();
      toggle.focus();
    }
  });
}

function renderNavStatus(fleet) {
  const live = document.querySelector("[data-live-status]");
  const alerts = document.querySelector("[data-alert-count]");
  if (live) live.textContent = fleet.liveStatus;
  if (alerts) alerts.textContent = `${fleet.alertCount} alerts`;

  const lastUpdated = document.querySelector("[data-last-updated]");
  if (lastUpdated) {
    // Dynamic freshness indicator
    setInterval(() => {
      const seconds = Math.floor(Date.now() / 1000) % 60;
      lastUpdated.textContent = `Last data ${seconds || 1} seconds ago`;
    }, 1000);
    lastUpdated.textContent = `Last data just now`;
  }
}

function renderFleetMap(fleet) {
  const assetList = document.getElementById("asset-list");
  const siteList = document.getElementById("site-list");
  const summary = document.getElementById("summary-strip");
  const detail = document.getElementById("asset-detail");
  const alertFeed = document.getElementById("alert-feed");
  const mapSurface = document.querySelector('.map-surface');

  // Add a reusable inline popup element if it doesn't exist
  let popup = document.getElementById("map-inline-popup");
  if (!popup && mapSurface) {
    popup = document.createElement("div");
    popup.id = "map-inline-popup";
    popup.className = "inline-popup";
    mapSurface.appendChild(popup);
  }

  const summaryCards = [
    { id: "filter-active", label: "Active Assets", value: fleet.summary.activeAssets, meta: "3/8 online" },
    { id: "filter-engine", label: "Engine Hrs Today", value: fleet.summary.engineHoursToday, meta: "12% vs yesterday" },
    { id: "filter-fuel", label: "Fuel Today", value: fleet.summary.fuelToday, meta: "AED 1,503 at 3.00/L" },
    { id: "filter-alerts", label: "Active Alerts", value: fleet.summary.activeAlerts, meta: "2 critical · 0 warning" },
    { id: "filter-maint", label: "Maint Due", value: fleet.summary.maintenanceDue, meta: "1 overdue" }
  ];

  summary.innerHTML = summaryCards.map((card) => `
    <article class="stat-card clickable" data-filter="${card.id}">
      <div class="eyebrow">${card.label}</div>
      <strong>${card.value}</strong>
      <span>${card.meta}</span>
    </article>
  `).join("");

  // KPI filters logic
  summary.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('click', () => {
      summary.querySelectorAll('.stat-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const filterId = card.getAttribute('data-filter');
      const markers = document.querySelectorAll('.map-marker');
      markers.forEach(m => {
        m.style.opacity = "1";
        if (filterId === "filter-active" && m.getAttribute('data-status') !== 'operating') m.style.opacity = "0.2";
        if (filterId === "filter-maint") m.style.opacity = (Math.random() > 0.5) ? "1" : "0.2"; // Mock filter
        if (filterId === "filter-alerts" && m.getAttribute('data-status') !== 'offline') m.style.opacity = "0.2";
      });
    });
  });

  siteList.innerHTML = fleet.sites.map((site) => `
    <article class="site-item">
      <button type="button">
        <div class="meta">
          <span>${site.name}</span>
          <strong>${site.assetCount}</strong>
        </div>
      </button>
    </article>
  `).join("");

  const firstAsset = fleet.assets[0];
  renderFleetSelection(fleet, assetList, detail, alertFeed, firstAsset.id, popup);
}

function renderFleetSelection(fleet, assetList, detail, alertFeed, selectedAssetId, popup) {
  const selectedAsset = fleet.assets.find((asset) => asset.id === selectedAssetId) || fleet.assets[0];

  assetList.innerHTML = fleet.assets.map((asset) => `
    <article class="asset-item">
      <button type="button" data-asset-select="${asset.id}" aria-pressed="${asset.id === selectedAsset.id}">
        <div class="meta">
          <div>
            <div class="title">${asset.name}</div>
            <div class="text-muted">${asset.id} · ${asset.type}</div>
          </div>
          <span class="status-chip" data-status="${asset.status.toLowerCase()}">${asset.status}</span>
        </div>
        <div class="bar-track"><div class="bar-fill" style="width:${asset.fuelLevel}%;background:var(--yellow)"></div></div>
      </button>
    </article>
  `).join("");

  const mapMarkers = document.getElementById("map-markers");
  if (mapMarkers) {
    mapMarkers.innerHTML = fleet.assets.map((asset) => `
      <button type="button" class="map-marker" data-map-select="${asset.id}" data-active="${asset.id === selectedAsset.id}" data-status="${asset.status.toLowerCase()}" style="left:${asset.mapPosition.x}%;top:${asset.mapPosition.y}%">
        <span class="dot"></span>
        <span>${asset.id}</span>
      </button>
    `).join("");
  }

  renderDetail(detail, selectedAsset);
  renderAlerts(alertFeed, selectedAsset);

  assetList.querySelectorAll('[data-asset-select]').forEach((button) => {
    button.addEventListener('click', () => {
      const assetId = button.getAttribute('data-asset-select');
      renderFleetSelection(fleet, assetList, detail, alertFeed, assetId, popup);
      if (popup) popup.classList.remove('active');
    });
  });

  if (mapMarkers) {
    mapMarkers.querySelectorAll('[data-map-select]').forEach((button) => {
      button.addEventListener('click', (e) => {
        const assetId = button.getAttribute('data-map-select');
        const asset = fleet.assets.find(a => a.id === assetId);
        renderFleetSelection(fleet, assetList, detail, alertFeed, assetId, popup);
        
        // Inline popup
        if (popup) {
          popup.innerHTML = `
            <h4>${asset.id}</h4>
            <p><strong>Speed:</strong> ${asset.rpm > 0 ? '12 km/h' : '0 km/h'}</p>
            <p><strong>Driver:</strong> Unknown</p>
            <p><strong>Ignition:</strong> ${asset.rpm > 0 ? 'ON' : 'OFF'}</p>
          `;
          popup.style.left = asset.mapPosition.x + '%';
          popup.style.top = asset.mapPosition.y + '%';
          popup.classList.add('active');
        }
        e.stopPropagation();
      });
    });
    
    // Click map surface to close popup
    const mapSurface = document.querySelector('.map-surface');
    if (mapSurface) {
      mapSurface.addEventListener('click', () => {
        if (popup) popup.classList.remove('active');
      });
    }
  }
}

function renderAlerts(alertFeed, asset) {
  alertFeed.innerHTML = asset.alerts.length ? asset.alerts.map((alert) => `
    <article class="event-item" aria-live="polite">
      <div>
        <strong>${alert.code}</strong>
        <div>${alert.description}</div>
      </div>
      <span class="status-chip" data-status="${alert.severity}">${alert.severity}</span>
    </article>
  `).join("") : '<div class="event-item">No active alerts.</div>';
}

function renderDetail(target, asset) {
  let canHtml = '';
  if (asset.can) {
    canHtml = `
      <div class="can-gauges">
        <div class="gauge">
          <div class="gauge-circle" style="background: conic-gradient(var(--green) 0% ${(asset.can.coolantTemp/120)*100}%, var(--line) ${(asset.can.coolantTemp/120)*100}% 100%)">
            <span class="gauge-value">${asset.can.coolantTemp}°C</span>
          </div>
          <span class="gauge-label">Coolant</span>
        </div>
        <div class="gauge">
          <div class="gauge-circle" style="background: conic-gradient(var(--green) 0% ${(asset.can.oilPressure/600)*100}%, var(--line) ${(asset.can.oilPressure/600)*100}% 100%)">
            <span class="gauge-value">${asset.can.oilPressure}</span>
          </div>
          <span class="gauge-label">Oil (kPa)</span>
        </div>
      </div>
    `;
  }

  target.innerHTML = `
    <div class="panel-header" style="flex-wrap: wrap;">
      <div>
        <h3>${asset.name}</h3>
        <p class="text-muted">${asset.id} · ${asset.type} · ${asset.site}</p>
      </div>
      <span class="status-chip" data-status="${asset.status.toLowerCase()}">${asset.status}</span>
    </div>
    <div class="detail-grid">
      <div class="mini"><span>Engine Hours</span><strong>${asset.engineHours.toLocaleString()}</strong></div>
      <div class="mini"><span>RPM</span><strong>${asset.rpm.toLocaleString()}</strong></div>
      <div class="mini"><span>Fuel Rate</span><strong>${asset.fuelRate} L/h</strong></div>
      <div class="mini"><span>Engine Load</span><strong>${asset.engineLoad}%</strong></div>
    </div>
    ${canHtml}
    <div class="panel" style="margin-top: 16px;">
      <div class="panel-body">
        <div class="eyebrow">Fuel status</div>
        <p><strong>${asset.fuelLevel}%</strong> of tank remaining · ${asset.fuelCapacity}L capacity</p>
      </div>
    </div>
    <div style="margin-top: 16px;">
      <button class="btn btn-secondary" style="width: 100%;" onclick="window.prompt('Share tracking link:', 'https://dozrfleet.vercel.app/track/${asset.id}')">
        Share tracking link
      </button>
    </div>
  `;
}

function renderFuel(fleet) {
  const container = document.querySelector(".page-shell");
  
  // Add Comparison Chart at the top of the Fuel Page
  let chartHtml = `
    <section class="panel" style="margin-bottom: 24px;">
      <div class="panel-header">
        <h3>Fuel Efficiency Comparison</h3>
      </div>
      <div class="panel-body">
        <div class="bar-chart" style="display:flex; gap: 8px; height: 120px; align-items: flex-end;">
          ${fleet.assets.map(asset => `
            <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap: 4px;">
              <div class="bar" style="width: 100%; height: ${Math.max(10, asset.fuelRate * 3)}px; background: var(--green); border-radius: 4px 4px 0 0;" title="${asset.fuelRate} L/h"></div>
              <span class="text-muted" style="font-size: 10px;">${asset.id.replace('KSP-','')}</span>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
    
    <section class="panel" style="margin-bottom: 24px; border-left: 4px solid var(--error);">
      <div class="panel-body">
        <div class="eyebrow" style="color: var(--error);">Fuel Theft Detection</div>
        <p style="margin-top: 4px;"><strong>KSP-002</strong> reported a sudden fuel drop (22L) while ignition was OFF at 03:15 AM today. <a href="#">Investigate</a></p>
      </div>
    </section>
  `;

  const cardsContainer = document.getElementById("fuel-cards");
  const cardsHtml = fleet.assets.map((asset) => `
    <article class="fuel-card panel">
      <div class="row">
        <div>
          <h3>${asset.id}</h3>
          <p class="text-muted">${asset.name} · ${asset.site}</p>
        </div>
        <span class="status-chip" data-status="${asset.status.toLowerCase()}">${asset.status}</span>
      </div>
      <div class="bar-track"><div class="bar-fill" style="width:${asset.fuelLevel}%;background:${asset.fuelLevel > 60 ? 'var(--green)' : asset.fuelLevel > 35 ? 'var(--yellow-dark)' : 'var(--error)'}"></div></div>
      <div class="detail-grid" style="margin-top:14px;">
        <div class="mini"><span>Level</span><strong>${asset.fuelLevel}%</strong></div>
        <div class="mini"><span>Capacity</span><strong>${asset.fuelCapacity}L</strong></div>
        <div class="mini"><span>Burn rate</span><strong>${asset.fuelRate} L/h</strong></div>
        <div class="mini"><span>Today</span><strong>${asset.fuelToday} L</strong></div>
        <div class="mini"><span>Idle Cost</span><strong>AED ${asset.cost.idleReduction}</strong></div>
      </div>
      <div class="mini" style="margin-top:10px;"><span>Lifetime total</span><strong>${asset.lifetimeFuel.toLocaleString()} L</strong></div>
    </article>
  `).join("");

  if (cardsContainer) {
    cardsContainer.innerHTML = cardsHtml;
    cardsContainer.insertAdjacentHTML('beforebegin', chartHtml);
  }
}

function renderMaintenance(fleet) {
  const summary = document.getElementById("summary-strip");
  const tableBody = document.getElementById("maintenance-table-body");
  const container = document.querySelector(".page-shell");

  summary.innerHTML = [
    { label: "Overdue", value: "2", meta: "Need attention" },
    { label: "Due Soon", value: "3", meta: "Service windows this week" },
    { label: "On Schedule", value: "12", meta: "No action" },
    { label: "Completed This Month", value: "9", meta: "Closed out" },
    { label: "Est. Cost This Week", value: "AED 18.4k", meta: "Parts + labour" }
  ].map((card) => `
    <article class="stat-card">
      <div class="eyebrow">${card.label}</div>
      <strong>${card.value}</strong>
      <span>${card.meta}</span>
    </article>
  `).join("");

  // Add WhatsApp reminder UI element above the table
  const waReminderHtml = `
    <div class="event-item ok" style="margin-bottom: 16px; background: var(--surface); padding: 12px; border-radius: 8px; border: 1px solid var(--line); display: flex; align-items: center; justify-content: space-between;">
      <div>
        <strong style="color: var(--green);">WhatsApp Reminder Sent</strong>
        <div class="text-muted" style="font-size: 13px;">Service reminder for KSP-002 sent to Site Manager (Jebel Ali Port) at 08:30 AM.</div>
      </div>
      <span class="status-chip" data-status="ok">Delivered</span>
    </div>
  `;
  const panel = document.querySelector(".page-shell > .panel");
  if (panel) {
    panel.insertAdjacentHTML('afterbegin', waReminderHtml);
  }

  tableBody.innerHTML = fleet.maintenance.map((item) => {
    // Determine if we show km or hours
    const isKm = item.currentKm !== undefined;
    const current = isKm ? `${item.currentKm.toLocaleString()} km` : `${item.currentHours.toLocaleString()}h`;
    const schedule = isKm ? `${item.lastKm.toLocaleString()} / ${item.dueKm.toLocaleString()}` : `${item.lastHours.toLocaleString()} / ${item.dueHours.toLocaleString()}`;

    return `
      <tr>
        <th scope="row"><strong>${item.assetId}</strong><br>${item.assetName}</th>
        <td>${item.type}</td>
        <td>${item.serviceItem}</td>
        <td>${schedule}</td>
        <td>${current}</td>
        <td><span class="status-chip" data-status="${item.status.toLowerCase().replace(' ', '-')}">${item.status}</span></td>
        <td><button type="button" class="btn btn-secondary">Book</button></td>
      </tr>
    `;
  }).join("");
}

function renderGeofences(fleet) {
  // ... existing geofences implementation ...
  const summary = document.getElementById("summary-strip");
  const zoneList = document.getElementById("zone-list");
  const events = document.getElementById("event-feed");
  const map = document.getElementById("geofence-map");
  if(!map) return; // safety check

  summary.innerHTML = [
    { label: "Active Zones", value: fleet.geofences.length, meta: "All sites configured" },
    { label: "Entry/Exit Today", value: "6", meta: "3 entries · 3 exits" },
    { label: "After-Hours Alerts", value: "0", meta: "No violations" },
    { label: "Unauthorized", value: "0", meta: "No violations" }
  ].map((card) => `
    <article class="stat-card">
      <div class="eyebrow">${card.label}</div>
      <strong>${card.value}</strong>
      <span>${card.meta}</span>
    </article>
  `).join("");

  zoneList.innerHTML = fleet.geofences.map((zone) => `
    <article class="zone-item" style="border-left:4px solid ${zone.color};">
      <div class="meta">
        <div>
          <strong>${zone.name}</strong>
          <div class="text-muted">${zone.shape} · ${zone.area} · ${zone.hours}</div>
        </div>
        <span class="status-chip" data-status="ok">${zone.assets} assets</span>
      </div>
    </article>
  `).join("");

  map.innerHTML = `
    <svg viewBox="0 0 640 480" aria-hidden="true">
      <rect x="0" y="0" width="640" height="480" fill="rgba(255,255,255,0.4)"></rect>
      <path d="M80 110 C140 60, 220 86, 270 132 S382 214, 454 176 S540 112, 570 144" fill="none" stroke="var(--line)" stroke-width="18" stroke-linecap="round"></path>
      <path d="M92 312 C150 250, 274 262, 324 300 S452 384, 528 336" fill="none" stroke="var(--line)" stroke-width="18" stroke-linecap="round"></path>
      ${fleet.geofences.map((zone, index) => {
        const colors = { 0: 'var(--yellow)', 1: 'var(--green)', 2: 'var(--slate)', 3: 'var(--error)' };
        const color = colors[index] || zone.color;
        if (zone.shape === 'Polygon') {
          const points = index === 0 ? '120,95 200,70 250,120 220,180 130,175' : '330,120 430,90 485,140 420,210 320,190';
          return `<g><polygon points="${points}" fill="${color}" fill-opacity="0.24" stroke="${color}" stroke-width="3"></polygon><text x="${index === 0 ? 150 : 350}" y="${index === 0 ? 150 : 170}" fill="${color}" font-size="15" font-family="var(--font-mono)">${zone.name}</text></g>`;
        }
        if (zone.shape === 'Rectangle') {
          return `<g><rect x="120" y="275" width="150" height="110" rx="18" fill="${color}" fill-opacity="0.22" stroke="${color}" stroke-width="3"></rect><text x="145" y="330" fill="${color}" font-size="15" font-family="var(--font-mono)">${zone.name}</text></g>`;
        }
        return `<g><circle cx="500" cy="340" r="70" fill="${color}" fill-opacity="0.22" stroke="${color}" stroke-width="3"></circle><text x="440" y="345" fill="${color}" font-size="15" font-family="var(--font-mono)">${zone.name}</text></g>`;
      }).join("")}
    </svg>
  `;

  events.innerHTML = fleet.events.map((event) => `
    <article class="event-item">
      <div><strong>${event.time}</strong> · ${event.asset}</div>
      <div>${event.action} · ${event.zone}</div>
    </article>
  `).join("");
}

function renderUtilisation(fleet) {
  // ... existing implementation ...
  const summary = document.getElementById("summary-strip");
  const breakdown = document.getElementById("breakdown-cards");
  const bars = document.getElementById("utilisation-bars");
  const chart = document.getElementById("trend-chart");
  if(!summary) return;

  summary.innerHTML = [
    { label: "Fleet Avg Utilisation", value: "62%", meta: "Target 75%" },
    { label: "Best Performer", value: "KSP-003", meta: "82% · Komatsu" },
    { label: "Idle Hours Today", value: "8.4h", meta: "AED 1,260 idle cost" },
    { label: "Total Engine Hrs", value: "18.6h", meta: "Active fleet today" },
    { label: "Deadhead Est.", value: "38%", meta: "Trucks returning empty" }
  ].map((card) => `
    <article class="stat-card">
      <div class="eyebrow">${card.label}</div>
      <strong>${card.value}</strong>
      <span>${card.meta}</span>
    </article>
  `).join("");

  const working = fleet.assets.reduce((sum, item) => sum + item.utilisation.working, 0);
  const idle = fleet.assets.reduce((sum, item) => sum + item.utilisation.idle, 0);
  const off = fleet.assets.reduce((sum, item) => sum + item.utilisation.off, 0);
  breakdown.innerHTML = [
    { label: "Working", value: `${working.toFixed(1)}h`, meta: "65% of active hours" },
    { label: "Idle", value: `${idle.toFixed(1)}h`, meta: "22% — AED 1,260 wasted" },
    { label: "Engine Off", value: `${off.toFixed(1)}h`, meta: "13% downtime" }
  ].map((card) => `
    <article class="summary-card">
      <div class="eyebrow">${card.label}</div>
      <strong>${card.value}</strong>
      <span>${card.meta}</span>
    </article>
  `).join("");

  bars.innerHTML = fleet.assets.map((asset) => `
    <article class="summary-card">
      <div class="meta">
        <strong>${asset.id}</strong>
        <span>${asset.utilisation.working.toFixed(1)}h</span>
      </div>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.min(100, asset.utilisation.working * 10)}%;background:var(--green)"></div></div>
      <div class="text-muted" style="margin-top:8px;">${asset.name}</div>
    </article>
  `).join("");

  chart.innerHTML = `
    <svg class="chart-svg" viewBox="0 0 320 220" role="img" aria-label="Seven day utilisation trend, against a 75 percent target">
      <line x1="20" y1="196" x2="300" y2="196" stroke="var(--line)" stroke-width="1"></line>
      <line x1="20" y1="54" x2="300" y2="54" stroke="var(--slate)" stroke-width="1" stroke-dasharray="6 6"></line>
      <text x="24" y="46" fill="var(--slate)" font-size="11" font-family="var(--font-mono)">75% target</text>
      <path d="M20 168 C58 145, 86 121, 112 132 S170 166, 198 151 S254 108, 300 70" fill="none" stroke="var(--green)" stroke-width="4"></path>
    </svg>
  `;
}

function renderCostRoi(fleet) {
  // ... existing implementation ...
  const summary = document.getElementById("summary-strip");
  const hero = document.getElementById("hero-metrics");
  const assetRows = document.getElementById("cost-rows");
  const trend = document.getElementById("trend-chart");
  if(!summary) return;

  summary.innerHTML = [
    { label: "Net Savings This Month", value: "AED 42.6k", meta: "vs. pre-Dozr baseline" },
    { label: "Subscription Cost", value: "AED 7.2k", meta: "Hardware + software" },
    { label: "ROI Multiple", value: "3.2x", meta: "Against pilot budget" },
    { label: "Year-End Forecast", value: "AED 84k", meta: "By Dec 2026" }
  ].map((card) => `
    <article class="stat-card">
      <div class="eyebrow">${card.label}</div>
      <strong>${card.value}</strong>
      <span>${card.meta}</span>
    </article>
  `).join("");

  hero.innerHTML = `
    <div>
      <div class="eyebrow">Savings snapshot</div>
      <h2>AED 42,600 saved this month</h2>
      <p>Net savings vs. the pre-Dozr operating baseline · ROI multiple 3.2x</p>
    </div>
    <div class="metric-stack">
      <div class="mini"><span>Fuel Saved</span><strong>AED 18.4k</strong></div>
      <div class="mini"><span>Theft Prevented</span><strong>AED 9.1k</strong></div>
      <div class="mini"><span>Idle Reduction</span><strong>AED 6.2k</strong></div>
      <div class="mini"><span>Breakdowns Avoided</span><strong>AED 8.9k</strong></div>
    </div>
  `;

  assetRows.innerHTML = fleet.assets.map((asset) => `
    <article class="summary-card">
      <div class="meta">
        <strong>${asset.id}</strong>
        <span>AED ${asset.cost.total.toLocaleString()}</span>
      </div>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.min(100, (asset.cost.total / 20000) * 100)}%;background:var(--green)"></div></div>
      <div class="text-muted" style="margin-top:8px;">${asset.name}</div>
    </article>
  `).join("");

  trend.innerHTML = `
    <svg class="chart-svg" viewBox="0 0 320 220" role="img" aria-label="Savings trend over the last six months">
      <line x1="20" y1="196" x2="300" y2="196" stroke="var(--line)" stroke-width="1"></line>
      <path d="M20 168 C58 150, 86 112, 112 134 S170 182, 198 156 S254 92, 300 78" fill="none" stroke="var(--green)" stroke-width="4"></path>
    </svg>
  `;
}

function renderReports(fleet) {
  // ... existing implementation ...
  const summary = document.getElementById("summary-strip");
  const reportGrid = document.getElementById("report-grid");
  const recent = document.getElementById("recent-table-body");
  if(!summary) return;

  summary.innerHTML = [
    { label: "Reports This Month", value: "24", meta: "Auto-produced" },
    { label: "Next Scheduled", value: "08:00", meta: "Tomorrow" },
    { label: "Formats Available", value: "PDF + CSV", meta: "WhatsApp + Email" }
  ].map((card) => `
    <article class="stat-card">
      <div class="eyebrow">${card.label}</div>
      <strong>${card.value}</strong>
      <span>${card.meta}</span>
    </article>
  `).join("");

  reportGrid.innerHTML = fleet.reports.map((report) => `
    <article class="report-card">
      <div class="eyebrow">${report.cadence}</div>
      <h3>${report.name}</h3>
      <p class="text-muted">${report.description}</p>
    </article>
  `).join("");

  recent.innerHTML = fleet.recentReports.map((item) => `
    <tr>
      <th scope="row">${item.report}</th>
      <td>${item.period}</td>
      <td>${item.assets}</td>
      <td>${item.generated}</td>
      <td>${item.delivery.join(" · ")}</td>
      <td><button type="button" class="btn btn-secondary">Download</button></td>
    </tr>
  `).join("");
}

function renderAlertsCenter(fleet) {
  const feed = document.getElementById("alerts-center-feed");
  if(!feed) return;

  const getIconColor = (severity) => {
    if (severity === 'critical') return 'var(--error)';
    if (severity === 'warning') return 'var(--yellow-dark)';
    if (severity === 'info') return 'var(--slate)';
    if (severity === 'ok') return 'var(--green)';
    return 'var(--line)';
  };

  feed.innerHTML = fleet.alertsFeed.map((alert) => `
    <article class="event-item" style="border-left: 4px solid ${getIconColor(alert.severity)}; padding-left: 12px; align-items: flex-start;">
      <div style="flex: 1;">
        <div style="display: flex; gap: 8px; align-items: baseline; margin-bottom: 4px;">
          <strong style="font-family: 'Space Mono', monospace;">${alert.time}</strong>
          <span class="text-muted">${alert.assetId} · ${alert.assetName}</span>
        </div>
        <strong>${alert.code}</strong>
        <div class="text-muted" style="margin-top: 2px;">${alert.description}</div>
      </div>
      <span class="status-chip" data-status="${alert.severity}">${alert.severity}</span>
    </article>
  `).join("");
}

function renderTimesheet(fleet) {
  const tbody = document.getElementById("timesheet-table-body");
  if(!tbody) return;

  let totalMoving = 0;
  let totalIdle = 0;
  let totalStopped = 0;

  tbody.innerHTML = fleet.drivers.map(driver => {
    const total = driver.movingHours + driver.idleHours + driver.stoppedHours;
    totalMoving += driver.movingHours;
    totalIdle += driver.idleHours;
    totalStopped += driver.stoppedHours;
    
    return `
      <tr>
        <th scope="row"><strong>${driver.driverName}</strong></th>
        <td>${driver.assetId}</td>
        <td>${driver.shiftStart} - ${driver.shiftEnd}</td>
        <td>${total.toFixed(1)}h</td>
        <td>
          <div class="bar-track" style="height: 12px; margin-bottom: 4px; display: flex; gap: 1px;">
            <div class="bar-fill" style="width:${(driver.movingHours/total)*100}%; background:var(--green)"></div>
            <div class="bar-fill" style="width:${(driver.idleHours/total)*100}%; background:var(--yellow-dark)"></div>
            <div class="bar-fill" style="width:${(driver.stoppedHours/total)*100}%; background:var(--slate)"></div>
          </div>
          <div style="display: flex; gap: 8px; font-size: 11px; font-family: 'Space Mono', monospace; color: var(--slate);">
            <span style="color: var(--green);">${driver.movingHours}h</span>
            <span style="color: var(--yellow-dark);">${driver.idleHours}h</span>
            <span style="color: var(--slate);">${driver.stoppedHours}h</span>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  document.getElementById("timesheet-total-hours").textContent = (totalMoving + totalIdle + totalStopped).toFixed(1) + "h";
  document.getElementById("timesheet-total-moving").textContent = totalMoving.toFixed(1) + "h";
  document.getElementById("timesheet-total-idle").textContent = totalIdle.toFixed(1) + "h";
  document.getElementById("timesheet-total-stopped").textContent = totalStopped.toFixed(1) + "h";
}

function renderTripHistory(fleet) {
  const select = document.getElementById("trip-vehicle-select");
  const details = document.getElementById("trip-details-panel");
  const mapSvg = document.getElementById("trip-map-svg");
  const mapMarkers = document.getElementById("trip-map-markers");
  const scrubberFill = document.getElementById("trip-scrubber-fill");
  const scrubberHandle = document.getElementById("trip-scrubber-handle");
  const scrubberTrack = document.getElementById("trip-scrubber-track");
  const timeDisplay = document.getElementById("trip-current-time");
  
  if(!select || !mapSvg) return;

  // Populate vehicle select
  select.innerHTML = fleet.assets.map(a => `<option value="${a.id}">${a.id} · ${a.name}</option>`).join("");
  
  const loadTrip = () => {
    const asset = fleet.assets.find(a => a.id === select.value);
    const trip = asset.trips && asset.trips.length > 0 ? asset.trips[0] : null;

    if (!trip) {
      details.innerHTML = `<p class="text-muted">No trip data available for this date.</p>`;
      mapSvg.innerHTML = `<rect x="0" y="0" width="640" height="480" fill="rgba(255,255,255,0.35)"></rect>`;
      mapMarkers.innerHTML = "";
      return;
    }

    details.innerHTML = `
      <div class="metric-stack">
        <div class="mini"><span>Distance</span><strong>${trip.distance}</strong></div>
        <div class="mini"><span>Start</span><strong>${trip.startTime}</strong></div>
        <div class="mini"><span>End</span><strong>${trip.endTime}</strong></div>
      </div>
      <div style="margin-top: 16px;">
        <div class="eyebrow" style="margin-bottom: 8px;">Events & Stops</div>
        <div class="alert-feed">
          ${trip.events.map(e => `
            <div class="event-item" style="padding: 8px;">
              <span class="status-chip" data-status="critical">${e.time}</span>
              <div><strong>${e.type}</strong><br><span class="text-muted">${e.detail}</span></div>
            </div>
          `).join("")}
          ${trip.stops.map(s => `
            <div class="event-item" style="padding: 8px;">
              <span class="status-chip" data-status="warning">${s.time}</span>
              <div><strong>Stop (${s.duration})</strong><br><span class="text-muted">${s.location}</span></div>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    document.getElementById("trip-start-time").textContent = trip.startTime;
    document.getElementById("trip-end-time").textContent = trip.endTime;

    // Render Route Polyline
    if (trip.route.length > 0) {
      const pathPoints = trip.route.map((p, i) => i === 0 ? `M${p.x * 6.4} ${p.y * 4.8}` : `L${p.x * 6.4} ${p.y * 4.8}`).join(" ");
      mapSvg.innerHTML = `
        <rect x="0" y="0" width="640" height="480" fill="rgba(255,255,255,0.35)"></rect>
        <path d="${pathPoints}" fill="none" stroke="var(--ink)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"></path>
      `;
      mapMarkers.innerHTML = `
        <div class="map-marker" style="left: ${trip.route[0].x}%; top: ${trip.route[0].y}%;">
          <span class="dot" style="background: var(--green);"></span>
        </div>
        <div class="map-marker" style="left: ${trip.route[trip.route.length-1].x}%; top: ${trip.route[trip.route.length-1].y}%;">
          <span class="dot" style="background: var(--error);"></span>
        </div>
      `;
    }
    
    // Reset scrubber
    scrubberFill.style.width = "0%";
    scrubberHandle.style.left = "0%";
    timeDisplay.textContent = trip.startTime;
  };

  select.addEventListener("change", loadTrip);

  const replayBtn = Array.from(document.querySelectorAll(".map-control button")).find(b => b.textContent.includes("Route Replay"));
  const modal = document.getElementById("trip-history-modal");
  if (replayBtn && modal) {
    replayBtn.addEventListener("click", () => {
      modal.showModal();
      loadTrip();
    });
  }

  loadTrip();

  // Basic scrubber logic
  let playTimer = null;
  const playBtn = document.getElementById("trip-play-btn");

  const stopPlayback = () => {
    if (playTimer) {
      clearInterval(playTimer);
      playTimer = null;
    }
    if (playBtn) playBtn.textContent = "Play";
  };

  const setScrubberPercent = (percent) => {
    percent = Math.max(0, Math.min(1, percent));
    scrubberFill.style.width = `${percent * 100}%`;
    scrubberHandle.style.left = `${percent * 100}%`;

    const trip = fleet.assets.find(a => a.id === select.value)?.trips?.[0];
    if (trip) {
      // mock time interpolation
      const start = parseInt(trip.startTime.replace(':',''));
      const end = parseInt(trip.endTime.replace(':',''));
      const current = start + (end - start) * percent;
      timeDisplay.textContent = `${Math.floor(current/100).toString().padStart(2, '0')}:${Math.floor(current%100).toString().padStart(2, '0')}`;

      // move play marker
      if (trip.route && trip.route.length > 0) {
        const pointIndex = Math.min(trip.route.length - 1, Math.floor(percent * trip.route.length));
        const pt = trip.route[pointIndex];
        const playMarker = document.getElementById('play-marker');
        if (playMarker) {
          playMarker.style.left = pt.x + '%';
          playMarker.style.top = pt.y + '%';
        } else if (mapMarkers) {
          mapMarkers.innerHTML += `<div id="play-marker" class="map-marker" style="left: ${pt.x}%; top: ${pt.y}%; z-index: 10;"><span class="dot" style="background: var(--ink); transform: scale(1.5);"></span></div>`;
        }
      }
    }
    return percent;
  };

  if (scrubberTrack) {
    let isDragging = false;
    const updateScrubber = (e) => {
      const rect = scrubberTrack.getBoundingClientRect();
      setScrubberPercent((e.clientX - rect.left) / rect.width);
    };

    scrubberTrack.addEventListener("mousedown", (e) => { stopPlayback(); isDragging = true; updateScrubber(e); });
    document.addEventListener("mousemove", (e) => { if(isDragging) updateScrubber(e); });
    document.addEventListener("mouseup", () => { isDragging = false; });
  }

  if (playBtn) {
    playBtn.addEventListener("click", () => {
      if (playTimer) {
        stopPlayback();
        return;
      }
      const trip = fleet.assets.find(a => a.id === select.value)?.trips?.[0];
      if (!trip) return;

      const currentWidth = parseFloat(scrubberFill.style.width) || 0;
      let percent = currentWidth >= 100 ? 0 : currentWidth / 100;
      playBtn.textContent = "Pause";
      playTimer = setInterval(() => {
        percent += 0.01;
        if (percent >= 1) {
          setScrubberPercent(1);
          stopPlayback();
          return;
        }
        setScrubberPercent(percent);
      }, 80);
    });
  }

  // Stop any running playback when switching vehicles/dates
  select.addEventListener("change", stopPlayback);
}
