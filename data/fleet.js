window.DOZR_FLEET = {
  fleetName: "Dozr Fleet",
  lastUpdated: "09 Jul 2026 14:30",
  liveStatus: "Live sync",
  alertCount: 2,
  summary: {
    activeAssets: 3,
    engineHoursToday: "18.6h",
    fuelToday: "501L",
    activeAlerts: 2,
    maintenanceDue: 6
  },
  sites: [
    { name: "Al Quoz Industrial Area", assetCount: 2 },
    { name: "Jebel Ali Port", assetCount: 3 },
    { name: "Dubai Creek Harbour", assetCount: 2 },
    { name: "Abu Dhabi KIZAD", assetCount: 1 }
  ],
  assets: [
    {
      id: "KSP-001",
      name: "CAT 320 Excavator",
      type: "Excavator",
      category: "Excavator",
      site: "Al Quoz Industrial Area",
      mapPosition: { x: 22, y: 24 },
      status: "Operating",
      health: "Good",
      fuelLevel: 62,
      fuelCapacity: 600,
      fuelRate: 18.2,
      fuelToday: 112,
      lifetimeFuel: 17320,
      engineHours: 3102,
      rpm: 1380,
      engineLoad: 55,
      maintenanceDue: 1,
      maintenanceStatus: "Due soon",
      can: { coolantTemp: 88, oilPressure: 380 },
      utilisation: { working: 6.2, idle: 1.4, off: 0.4, trend: [62, 68, 71, 74, 78, 76, 81] },
      cost: { total: 14280, fuelSaved: 3120, idleReduction: 640, breakdownsAvoided: 980 },
      alerts: [
        { severity: "warning", code: "P20E0", description: "Diesel particulate filter pressure high" }
      ],
      trips: [
        {
          date: "09 Jul 2026",
          distance: "14.2 km",
          startTime: "06:30",
          endTime: "14:15",
          stops: [
            { time: "09:00", duration: "15m", location: "Site Office" },
            { time: "12:30", duration: "45m", location: "Refueling Station" }
          ],
          events: [
            { time: "07:15", type: "Idling", detail: "Exceeded 10m idle limit" },
            { time: "11:45", type: "Geofence", detail: "Entered restricted zone" }
          ],
          route: [{ x: 20, y: 20 }, { x: 21, y: 22 }, { x: 22, y: 24 }]
        }
      ]
    },
    {
      id: "KSP-002",
      name: "JCB 3CX Backhoe",
      type: "Backhoe",
      category: "Backhoe",
      site: "Jebel Ali Port",
      mapPosition: { x: 38, y: 42 },
      status: "Idle",
      health: "Watch",
      fuelLevel: 17,
      fuelCapacity: 250,
      fuelRate: 8.4,
      fuelToday: 44,
      lifetimeFuel: 6340,
      engineHours: 2188,
      rpm: 960,
      engineLoad: 24,
      maintenanceDue: 2,
      maintenanceStatus: "Overdue",
      can: { coolantTemp: 92, oilPressure: 320 },
      utilisation: { working: 4.1, idle: 2.3, off: 1.6, trend: [48, 45, 42, 38, 41, 44, 39] },
      cost: { total: 9860, fuelSaved: 1840, idleReduction: 420, breakdownsAvoided: 540 },
      alerts: [
        { severity: "critical", code: "P018C", description: "Fuel pressure low" }
      ],
      trips: [
        {
          date: "09 Jul 2026",
          distance: "8.5 km",
          startTime: "07:00",
          endTime: "11:30",
          stops: [
            { time: "10:15", duration: "20m", location: "Material Depot" }
          ],
          events: [
            { time: "08:30", type: "Harsh Braking", detail: "Deceleration > 12km/h/s" }
          ],
          route: [{ x: 35, y: 40 }, { x: 37, y: 41 }, { x: 38, y: 42 }]
        }
      ]
    },
    {
      id: "KSP-003",
      name: "Komatsu WA320 Loader",
      type: "Loader",
      category: "Loader",
      site: "Jebel Ali Port",
      status: "Operating",
      health: "Good",
      fuelLevel: 78,
      fuelCapacity: 420,
      fuelRate: 16.7,
      mapPosition: { x: 58, y: 26 },
      fuelToday: 94,
      lifetimeFuel: 21810,
      engineHours: 4128,
      rpm: 1640,
      engineLoad: 71,
      maintenanceDue: 0,
      maintenanceStatus: "On schedule",
      can: { coolantTemp: 84, oilPressure: 410 },
      utilisation: { working: 7.1, idle: 0.9, off: 0.2, trend: [72, 74, 79, 82, 83, 81, 84] },
      cost: { total: 17520, fuelSaved: 4210, idleReduction: 910, breakdownsAvoided: 1280 },
      alerts: [],
      trips: []
    },
    {
      id: "KSP-004",
      name: "MAN TGX 18.500 Truck",
      type: "Truck",
      category: "Truck",
      site: "Jebel Ali Port",
      status: "Operating",
      health: "Good",
      fuelLevel: 55,
      fuelCapacity: 500,
      fuelRate: 22.8,
      mapPosition: { x: 74, y: 44 },
      fuelToday: 126,
      lifetimeFuel: 11120,
      engineHours: 2644,
      rpm: 1220,
      engineLoad: 48,
      maintenanceDue: 1,
      maintenanceStatus: "Due soon",
      can: { coolantTemp: 89, oilPressure: 440 },
      utilisation: { working: 5.4, idle: 1.8, off: 1.0, trend: [54, 58, 61, 57, 60, 63, 59] },
      cost: { total: 11820, fuelSaved: 2460, idleReduction: 520, breakdownsAvoided: 760 },
      alerts: [],
      trips: [
        {
          date: "09 Jul 2026",
          distance: "142.3 km",
          startTime: "05:00",
          endTime: "13:45",
          stops: [
            { time: "08:45", duration: "30m", location: "Rest Area" }
          ],
          events: [
            { time: "06:20", type: "Overspeed", detail: "Speed > 90km/h" }
          ],
          route: [{ x: 70, y: 40 }, { x: 72, y: 42 }, { x: 74, y: 44 }]
        }
      ]
    },
    {
      id: "KSP-005",
      name: "Liebherr LTM 1060 Crane",
      type: "Crane",
      category: "Crane",
      site: "Dubai Creek Harbour",
      mapPosition: { x: 70, y: 70 },
      status: "Offline",
      health: "Watch",
      fuelLevel: 31,
      fuelCapacity: 360,
      fuelRate: 11.6,
      fuelToday: 68,
      lifetimeFuel: 9410,
      engineHours: 2730,
      rpm: 0,
      engineLoad: 0,
      maintenanceDue: 3,
      maintenanceStatus: "Overdue",
      can: { coolantTemp: 60, oilPressure: 0 },
      utilisation: { working: 2.6, idle: 0.8, off: 4.4, trend: [31, 34, 29, 28, 26, 24, 22] },
      cost: { total: 15460, fuelSaved: 1920, idleReduction: 360, breakdownsAvoided: 640 },
      alerts: [
        { severity: "critical", code: "U0101", description: "Lost communication with transmission control module" }
      ],
      trips: []
    },
    {
      id: "KSP-006",
      name: "Volvo EC220E Excavator",
      type: "Excavator",
      category: "Excavator",
      site: "Dubai Creek Harbour",
      mapPosition: { x: 44, y: 70 },
      status: "Operating",
      health: "Good",
      fuelLevel: 70,
      fuelCapacity: 420,
      fuelRate: 17.1,
      fuelToday: 102,
      lifetimeFuel: 14220,
      engineHours: 3320,
      rpm: 1480,
      engineLoad: 62,
      maintenanceDue: 0,
      maintenanceStatus: "On schedule",
      can: { coolantTemp: 86, oilPressure: 390 },
      utilisation: { working: 6.7, idle: 1.1, off: 0.3, trend: [64, 67, 69, 71, 72, 74, 77] },
      cost: { total: 16880, fuelSaved: 3860, idleReduction: 780, breakdownsAvoided: 1120 },
      alerts: [],
      trips: []
    },
    {
      id: "KSP-007",
      name: "CAT 950GC Loader",
      type: "Loader",
      category: "Loader",
      site: "Abu Dhabi KIZAD",
      mapPosition: { x: 82, y: 20 },
      status: "Operating",
      health: "Good",
      fuelLevel: 90,
      fuelCapacity: 360,
      fuelRate: 14.4,
      fuelToday: 74,
      lifetimeFuel: 15870,
      engineHours: 2940,
      rpm: 1320,
      engineLoad: 51,
      maintenanceDue: 1,
      maintenanceStatus: "Due soon",
      can: { coolantTemp: 85, oilPressure: 395 },
      utilisation: { working: 5.8, idle: 1.1, off: 0.6, trend: [76, 80, 82, 81, 79, 74, 78] },
      cost: { total: 12190, fuelSaved: 2760, idleReduction: 460, breakdownsAvoided: 920 },
      alerts: [],
      trips: []
    },
    {
      id: "KSP-008",
      name: "XCMG XE215C Excavator",
      type: "Excavator",
      category: "Excavator",
      site: "Al Quoz Industrial Area",
      mapPosition: { x: 28, y: 58 },
      status: "Idle",
      health: "Watch",
      fuelLevel: 44,
      fuelCapacity: 420,
      fuelRate: 12.6,
      fuelToday: 58,
      lifetimeFuel: 10320,
      engineHours: 2470,
      rpm: 980,
      engineLoad: 28,
      maintenanceDue: 2,
      maintenanceStatus: "Overdue",
      can: { coolantTemp: 88, oilPressure: 330 },
      utilisation: { working: 3.4, idle: 2.8, off: 1.2, trend: [44, 46, 48, 47, 43, 38, 41] },
      cost: { total: 10240, fuelSaved: 1640, idleReduction: 340, breakdownsAvoided: 580 },
      alerts: [
        { severity: "warning", code: "P0642", description: "Sensor reference voltage low" }
      ],
      trips: []
    }
  ],
  geofences: [
    { name: "Al Quoz Industrial", shape: "Polygon", area: "0.8 km²", hours: "07:00–18:00", assets: 3, color: "var(--yellow)" },
    { name: "Jebel Ali Port", shape: "Polygon", area: "1.2 km²", hours: "24h", assets: 2, color: "var(--green)" },
    { name: "Dubai Creek Harbour", shape: "Rectangle", area: "0.5 km²", hours: "06:00–20:00", assets: 2, color: "var(--slate)" },
    { name: "Abu Dhabi KIZAD", shape: "Circle", area: "7.1 km²", hours: "24h", assets: 1, color: "var(--error)" }
  ],
  events: [
    { time: "14:32", asset: "KSP-001", action: "Entered", zone: "Al Quoz Industrial" },
    { time: "13:55", asset: "KSP-004", action: "Exited", zone: "Jebel Ali Port" },
    { time: "13:10", asset: "KSP-003", action: "Entered", zone: "Jebel Ali Port" },
    { time: "11:22", asset: "KSP-005", action: "Exited", zone: "Dubai Creek Harbour" }
  ],
  maintenance: [
    {
      assetId: "KSP-001",
      assetName: "CAT 320 Excavator",
      type: "Excavator",
      serviceItem: "Hydraulic oil service",
      lastHours: 2800,
      dueHours: 3300,
      currentHours: 3102,
      remainingHours: 198,
      status: "Due soon"
    },
    {
      assetId: "KSP-002",
      assetName: "JCB 3CX Backhoe",
      type: "Backhoe",
      serviceItem: "Grease & filter change",
      lastHours: 1800,
      dueHours: 2200,
      currentHours: 2188,
      remainingHours: 12,
      status: "Overdue"
    },
    {
      assetId: "KSP-003",
      assetName: "Komatsu WA320 Loader",
      type: "Loader",
      serviceItem: "Brake inspection",
      lastHours: 3600,
      dueHours: 4200,
      currentHours: 4128,
      remainingHours: 72,
      status: "On schedule"
    },
    {
      assetId: "KSP-004",
      assetName: "MAN TGX 18.500 Truck",
      type: "Truck",
      serviceItem: "Oil sampling",
      lastHours: 2200,
      dueHours: 2800,
      currentHours: 2644,
      remainingHours: 156,
      lastKm: 120000,
      dueKm: 150000,
      currentKm: 146500,
      remainingKm: 3500,
      status: "Due soon"
    }
  ],
  reports: [
    { name: "Daily Utilisation", description: "Working vs idle hours by shift", cadence: "DAILY · AUTO" },
    { name: "Fuel Consumption", description: "Consumption, theft, and refuel exceptions", cadence: "WEEKLY · AUTO" },
    { name: "Maintenance Schedule", description: "Upcoming service windows and overdue work", cadence: "WEEKLY · AUTO" },
    { name: "Operator Performance", description: "iButton auth, idle behaviour, and scorecards", cadence: "ON DEMAND" },
    { name: "ESG Emissions", description: "Fuel burn and operational footprint summary", cadence: "MONTHLY · AUTO" },
    { name: "Client Site Report", description: "End-of-day activity and site utilisation", cadence: "DAILY · AUTO" }
  ],
  recentReports: [
    { report: "Fuel Consumption", period: "09 Jul 2026", assets: 8, generated: "14:30", delivery: ["Email", "WhatsApp"] },
    { report: "Maintenance Schedule", period: "08 Jul 2026", assets: 6, generated: "09:10", delivery: ["Email"] },
    { report: "Client Site Report", period: "08 Jul 2026", assets: 4, generated: "07:45", delivery: ["Email", "WhatsApp"] }
  ],
  alertsFeed: [
    { time: "14:15", assetId: "KSP-002", assetName: "JCB 3CX Backhoe", severity: "critical", code: "P018C", description: "Fuel pressure low" },
    { time: "13:42", assetId: "KSP-005", assetName: "Liebherr LTM 1060 Crane", severity: "critical", code: "U0101", description: "Lost communication with transmission control module" },
    { time: "12:30", assetId: "KSP-001", assetName: "CAT 320 Excavator", severity: "warning", code: "P20E0", description: "Diesel particulate filter pressure high" },
    { time: "11:15", assetId: "KSP-008", assetName: "XCMG XE215C Excavator", severity: "warning", code: "P0642", description: "Sensor reference voltage low" },
    { time: "09:45", assetId: "KSP-004", assetName: "MAN TGX 18.500 Truck", severity: "info", code: "SYS-01", description: "Device reconnected to cellular network" },
    { time: "08:10", assetId: "KSP-003", assetName: "Komatsu WA320 Loader", severity: "ok", code: "SYS-00", description: "Firmware update successfully applied" }
  ],
  drivers: [
    { driverName: "Ahmed Al Mansoori", assetId: "KSP-001", shiftStart: "06:00", shiftEnd: "15:00", movingHours: 6.2, idleHours: 1.4, stoppedHours: 1.4 },
    { driverName: "Rajat Sharma", assetId: "KSP-004", shiftStart: "05:00", shiftEnd: "17:00", movingHours: 8.4, idleHours: 1.8, stoppedHours: 1.8 },
    { driverName: "Tariq Mahmood", assetId: "KSP-007", shiftStart: "07:00", shiftEnd: "16:00", movingHours: 5.8, idleHours: 1.1, stoppedHours: 2.1 },
    { driverName: "Kevin O'Connor", assetId: "KSP-006", shiftStart: "06:30", shiftEnd: "16:30", movingHours: 6.7, idleHours: 1.1, stoppedHours: 2.2 },
    { driverName: "Saifullah Khan", assetId: "KSP-002", shiftStart: "07:00", shiftEnd: "14:00", movingHours: 4.1, idleHours: 2.3, stoppedHours: 0.6 }
  ]
};
