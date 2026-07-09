document.addEventListener("DOMContentLoaded", () => {
  const fleet = window.DOZR_FLEET || { assets: [], sites: [], geofences: [], events: [], maintenance: [], reports: [], recentReports: [] };
  const page = document.body.dataset.page;

  initMobileNav();
  renderNavStatus(fleet);
  if (page === "fleet-map") renderFleetMap(fleet);
  if (page === "fuel") renderFuel(fleet);
  if (page === "maintenance") renderMaintenance(fleet);
  if (page === "geofences") renderGeofences(fleet);
  if (page === "utilisation") renderUtilisation(fleet);
  if (page === "cost-roi") renderCostRoi(fleet);
  if (page === "reports") renderReports(fleet);
});

/**
 * Collapses the primary nav links behind a hamburger toggle below 1150px.
 * Mirrors marketplace/js/main.js's initMobileNav so both products share the
 * same interaction pattern. Search/status/Add Asset stay visible outside
 * the collapsed menu, same as marketplace keeps its sign-in button outside.
 */
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
  if (lastUpdated) lastUpdated.textContent = fleet.lastUpdated;
}

function renderFleetMap(fleet) {
  const assetList = document.getElementById("asset-list");
  const siteList = document.getElementById("site-list");
  const summary = document.getElementById("summary-strip");
  const detail = document.getElementById("asset-detail");
  const alertFeed = document.getElementById("alert-feed");

  const summaryCards = [
    { label: "Active Assets", value: fleet.summary.activeAssets, meta: "3/8 online" },
    { label: "Engine Hrs Today", value: fleet.summary.engineHoursToday, meta: "12% vs yesterday" },
    { label: "Fuel Today", value: fleet.summary.fuelToday, meta: "AED 1,503 at 3.00/L" },
    { label: "Active Alerts", value: fleet.summary.activeAlerts, meta: "2 critical · 0 warning" },
    { label: "Maint Due", value: fleet.summary.maintenanceDue, meta: "1 overdue" }
  ];

  summary.innerHTML = summaryCards.map((card) => `
    <article class="stat-card">
      <div class="eyebrow">${card.label}</div>
      <strong>${card.value}</strong>
      <span>${card.meta}</span>
    </article>
  `).join("");

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
  renderFleetSelection(fleet, assetList, detail, alertFeed, firstAsset.id);
}

function renderFleetSelection(fleet, assetList, detail, alertFeed, selectedAssetId) {
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
      renderFleetSelection(fleet, assetList, detail, alertFeed, assetId);
    });
  });

  if (mapMarkers) {
    mapMarkers.querySelectorAll('[data-map-select]').forEach((button) => {
      button.addEventListener('click', () => {
        const assetId = button.getAttribute('data-map-select');
        renderFleetSelection(fleet, assetList, detail, alertFeed, assetId);
      });
    });
  }
}

function renderAlerts(alertFeed, asset) {
  alertFeed.innerHTML = asset.alerts.length ? asset.alerts.map((alert) => `
    <article class="event-item" aria-live="polite">
      <div>
        <strong>${alert.code}</strong>
        <div>${alert.description}</div>
      </div>
      <span class="status-chip" data-status="critical">Critical</span>
    </article>
  `).join("") : '<div class="event-item">No active alerts.</div>';
}

function renderDetail(target, asset) {
  target.innerHTML = `
    <div class="panel-header">
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
    <div class="panel">
      <div class="panel-body">
        <div class="eyebrow">Fuel status</div>
        <p><strong>${asset.fuelLevel}%</strong> of tank remaining · ${asset.fuelCapacity}L capacity</p>
      </div>
    </div>
  `;
}

function renderFuel(fleet) {
  const cards = document.getElementById("fuel-cards");
  cards.innerHTML = fleet.assets.map((asset) => `
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
      </div>
      <div class="mini" style="margin-top:10px;"><span>Lifetime total</span><strong>${asset.lifetimeFuel.toLocaleString()} L</strong></div>
    </article>
  `).join("");
}

function renderMaintenance(fleet) {
  const summary = document.getElementById("summary-strip");
  const statusCards = document.getElementById("status-cards");
  const tableBody = document.getElementById("maintenance-table-body");

  summary.innerHTML = [
    { label: "Overdue", value: "2", meta: "Need attention" },
    { label: "Due This Week", value: "4", meta: "Service windows" },
    { label: "On Schedule", value: "12", meta: "No action" },
    { label: "Est. Cost This Week", value: "AED 18.4k", meta: "Parts + labour" },
    { label: "Breakdowns Prevented", value: "3", meta: "Ahead of failures" }
  ].map((card) => `
    <article class="stat-card">
      <div class="eyebrow">${card.label}</div>
      <strong>${card.value}</strong>
      <span>${card.meta}</span>
    </article>
  `).join("");

  statusCards.innerHTML = [
    { title: "Overdue", value: 2, tone: "error" },
    { title: "Due Soon", value: 3, tone: "warn" },
    { title: "On Schedule", value: 12, tone: "ok" },
    { title: "Completed This Month", value: 9, tone: "ok" }
  ].map((card) => `
    <article class="summary-card">
      <div class="eyebrow">${card.title}</div>
      <strong>${card.value}</strong>
      <span class="status-chip" data-status="${card.tone}">${card.title}</span>
    </article>
  `).join("");

  tableBody.innerHTML = fleet.maintenance.map((item) => `
    <tr>
      <th scope="row"><strong>${item.assetId}</strong><br>${item.assetName}</th>
      <td>${item.type}</td>
      <td>${item.serviceItem}</td>
      <td>${item.lastHours.toLocaleString()} / ${item.dueHours.toLocaleString()}</td>
      <td>${item.currentHours.toLocaleString()}h</td>
      <td><span class="status-chip" data-status="${item.status.toLowerCase()}">${item.status}</span></td>
      <td><button type="button" class="btn btn-secondary">Book</button></td>
    </tr>
  `).join("");
}

function renderGeofences(fleet) {
  const summary = document.getElementById("summary-strip");
  const zoneList = document.getElementById("zone-list");
  const events = document.getElementById("event-feed");
  const map = document.getElementById("geofence-map");

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
  const summary = document.getElementById("summary-strip");
  const breakdown = document.getElementById("breakdown-cards");
  const bars = document.getElementById("utilisation-bars");
  const chart = document.getElementById("trend-chart");

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
  const summary = document.getElementById("summary-strip");
  const hero = document.getElementById("hero-metrics");
  const assetRows = document.getElementById("cost-rows");
  const trend = document.getElementById("trend-chart");

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
        <div><strong>${asset.id}</strong><div class="text-muted">${asset.name}</div></div>
        <span>AED ${asset.cost.total.toLocaleString()}</span>
      </div>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.min(100, (asset.cost.total / 20000) * 100)}%;background:var(--green)"></div></div>
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
  const summary = document.getElementById("summary-strip");
  const reportGrid = document.getElementById("report-grid");
  const recent = document.getElementById("recent-table-body");

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
