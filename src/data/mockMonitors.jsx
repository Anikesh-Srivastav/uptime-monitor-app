function seededRand(seed) {
  let s = seed;
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generateResponseHistory() {
  const rand = seededRand(42);
  const base = new Date('2026-04-26T00:00:00');
  return Array.from({ length: 15 }, (_, i) => {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    const spike = rand() > 0.85 ? rand() * 220 : 0;
    const noise = (rand() - 0.5) * 100;
    return {
      time: d.toISOString(),
      value: Math.max(60, Math.round(280 + noise + spike)),
    };
  });
}

function generateUptimeHistory(days, seed) {
  const rand = seededRand(seed);
  const noDataDays = Math.floor(days * 0.15);
  return Array.from({ length: days }, (_, i) => {
    if (i < noDataDays) return { status: 'no-data', downtimeMins: null };
    const r = rand();
    if (i === Math.floor(days * 0.4)) {
      return { status: 'down', downtimeMins: Math.round(30 + rand() * 150) };
    }
    if (r > 0.93) {
      return { status: 'degraded', downtimeMins: Math.round(5 + rand() * 25) };
    }
    return { status: 'up', downtimeMins: 0 };
  });
}

function generateLogs(seed) {
  const rand = seededRand(seed);
  const base = new Date('2026-05-03T22:15:00');
  const statuses = [200, 200, 200, 200, 200, 200, 200, 200, 200, 503, 500];
  return Array.from({ length: 100 }, (_, i) => {
    const t = new Date(base.getTime() - i * 60 * 1000);
    const code = statuses[Math.floor(rand() * statuses.length)];
    const isHealthy = code === 200;
    const latency = isHealthy ? Math.round(180 + rand() * 350) : null;
    const hh = String(t.getHours()).padStart(2, '0');
    const mm = String(t.getMinutes()).padStart(2, '0');
    const ss = String(t.getSeconds()).padStart(2, '0');
    return {
      id: String(i),
      time: `${hh}:${mm}:${ss}`,
      status: isHealthy ? 'healthy' : code === 503 ? 'degraded' : 'down',
      code,
      latency: latency ? `${latency}ms` : '—',
      details: isHealthy ? `200 OK` : `Error ${code}`,
    };
  });
}

function buildEndpoint(baseUrl, path, status, seed, responseTime, interval) {
  const normalizedPath = path === '/' ? '/' : `/${path.replace(/^\/+/, '')}`;
  const cleanBase = baseUrl.replace(/\/$/, '');
  return {
    id: `${seed}-${normalizedPath}`,
    path: normalizedPath,
    url: normalizedPath === '/' ? cleanBase : `${cleanBase}${normalizedPath}`,
    label: normalizedPath === '/' ? 'Homepage' : normalizedPath.replace('/', ''),
    status,
    lastCheck: `${Math.max(10, seed)}s ago`,
    interval,
    responseTime,
    uptime24h: status === 'down' ? 92.1 : status === 'degraded' ? 98.4 : 100,
    incidents: status === 'down' ? 1 : status === 'degraded' ? 1 : 0,
    logs: generateLogs(seed),
  };
}

export const responseHistory = generateResponseHistory();

export const monitors = [
  {
    id: '1',
    name: 'drupalfit.com',
    url: 'https://drupalfit.com',
    status: 'healthy',
    lastCheck: '25s ago',
    interval: '1 min',
    responseTime: 323,
    uptime24h: 100,
    incidents: 0,
    sparkline: [280, 310, 295, 340, 315, 305, 323, 308, 325, 318, 323, 312],
    uptimeHistory: generateUptimeHistory(15, 10),
    responseHistory,
    ssl: {
      issuer: "Let's Encrypt",
      issuedOn: 'Oct 12, 2023',
      expiresOn: 'Jan 10, 2024',
      daysLeft: 58,
      totalDays: 90,
    },
    domain: {
      daysRemaining: 245,
      registrar: 'NameCheap, Inc.',
      registered: 'Jun 15, 2020',
      autoRenew: true,
    },
    alerts: {
      configured: true,
      description: 'Email and Slack alerts are active for downtime > 2 mins.',
    },
    endpoints: [
      buildEndpoint('https://drupalfit.com', '/', 'healthy', 25, 323, '1 min'),
      buildEndpoint('https://drupalfit.com', '/pricing', 'healthy', 31, 287, '1 min'),
      buildEndpoint('https://drupalfit.com', '/login', 'degraded', 45, 611, '1 min'),
    ],
    notes: [
      {
        id: '1',
        author: 'Jane Doe',
        initials: 'JD',
        timeAgo: '2 mins ago',
        message:
          'Investigating the load balancer configuration. It seems like the 501 is coming from the upstream.',
      },
    ],
    logs: generateLogs(7),
  },
  {
    id: '2',
    name: 'example-shop.com',
    url: 'https://example-shop.com',
    status: 'degraded',
    lastCheck: '1m ago',
    interval: '5 min',
    responseTime: 890,
    uptime24h: 97.3,
    incidents: 2,
    sparkline: [350, 420, 510, 780, 890, 760, 820, 950, 870, 890, 910, 880],
    uptimeHistory: generateUptimeHistory(15, 30),
    responseHistory: generateResponseHistory(),
    ssl: {
      issuer: "Let's Encrypt",
      issuedOn: 'Mar 1, 2024',
      expiresOn: 'Jun 1, 2024',
      daysLeft: 12,
      totalDays: 90,
    },
    domain: {
      daysRemaining: 40,
      registrar: 'GoDaddy',
      registered: 'Jan 10, 2018',
      autoRenew: false,
    },
    alerts: {
      configured: true,
      description: 'Email alerts configured for downtime > 5 mins.',
    },
    endpoints: [
      buildEndpoint('https://example-shop.com', '/', 'degraded', 60, 890, '5 min'),
      buildEndpoint('https://example-shop.com', '/pricing', 'healthy', 50, 302, '5 min'),
      buildEndpoint('https://example-shop.com', '/checkout', 'down', 70, null, '5 min'),
    ],
    notes: [],
    logs: generateLogs(50),
  },
  {
    id: '3',
    name: 'api.myservice.io',
    url: 'https://api.myservice.io',
    status: 'healthy',
    lastCheck: '10s ago',
    interval: '1 min',
    responseTime: 145,
    uptime24h: 100,
    incidents: 0,
    sparkline: [130, 145, 138, 142, 148, 140, 145, 143, 146, 145, 142, 145],
    uptimeHistory: generateUptimeHistory(15, 60),
    responseHistory: generateResponseHistory(),
    ssl: {
      issuer: 'DigiCert Inc',
      issuedOn: 'Jan 1, 2024',
      expiresOn: 'Jan 1, 2025',
      daysLeft: 240,
      totalDays: 365,
    },
    domain: {
      daysRemaining: 310,
      registrar: 'Namecheap',
      registered: 'Feb 5, 2019',
      autoRenew: true,
    },
    alerts: {
      configured: false,
      description: 'No alerts configured.',
    },
    endpoints: [
      buildEndpoint('https://api.myservice.io', '/', 'healthy', 12, 145, '1 min'),
      buildEndpoint('https://api.myservice.io', '/auth/login', 'healthy', 15, 158, '1 min'),
      buildEndpoint('https://api.myservice.io', '/billing/pricing', 'healthy', 18, 177, '1 min'),
    ],
    notes: [],
    logs: generateLogs(90),
  },
  {
    id: '4',
    name: 'dashboard.techco.com',
    url: 'https://dashboard.techco.com',
    status: 'down',
    lastCheck: '2m ago',
    interval: '2 min',
    responseTime: null,
    uptime24h: 88.5,
    incidents: 1,
    sparkline: [300, 280, 350, 400, 0, 0, 0, 0, 0, 0, 0, 0],
    uptimeHistory: generateUptimeHistory(15, 80),
    responseHistory: generateResponseHistory(),
    ssl: {
      issuer: 'Comodo CA',
      issuedOn: 'Apr 1, 2023',
      expiresOn: 'Apr 1, 2024',
      daysLeft: 5,
      totalDays: 365,
    },
    domain: {
      daysRemaining: 120,
      registrar: 'Google Domains',
      registered: 'Sep 12, 2020',
      autoRenew: true,
    },
    alerts: {
      configured: true,
      description: 'PagerDuty escalation configured for immediate downtime.',
    },
    endpoints: [
      buildEndpoint('https://dashboard.techco.com', '/', 'down', 120, null, '2 min'),
      buildEndpoint('https://dashboard.techco.com', '/login', 'down', 118, null, '2 min'),
      buildEndpoint('https://dashboard.techco.com', '/status', 'degraded', 100, 944, '2 min'),
    ],
    notes: [],
    logs: generateLogs(12),
  },
];

export const summaryStats = {
  totalUptime: 100,
  avgResponseTime: 323,
  activeIncidents: 0,
};
