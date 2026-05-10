export const summaryStats = [
  { label: 'Checks Running', value: '24' },
  { label: 'Healthy Services', value: '18' },
  { label: 'Avg. Response', value: '182 ms' },
];

export const monitoredSystems = [
  {
    id: 'payments-api',
    name: 'Payments API',
    uptime: '99.98%',
    latency: '124 ms',
    status: 'Healthy',
  },
  {
    id: 'auth-service',
    name: 'Auth Service',
    uptime: '99.91%',
    latency: '201 ms',
    status: 'Stable',
  },
  {
    id: 'status-page',
    name: 'Status Page',
    uptime: '100%',
    latency: '88 ms',
    status: 'Healthy',
  },
];

export const quickActions = [
  { id: 'add-monitor', label: 'Add Monitor' },
  { id: 'view-incidents', label: 'View Incidents' },
];
