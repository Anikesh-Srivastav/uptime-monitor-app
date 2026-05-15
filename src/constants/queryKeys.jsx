// Centralised TanStack Query key factory.
// Co-locating keys prevents typo-based cache misses across the app.

export const QUERY_KEYS = {
  // Auth
  currentUser: ['auth', 'me'],
  sessions: ['auth', 'sessions'],

  // Monitors
  monitors: ['monitors'],
  monitor: (id) => ['monitors', id],
  monitorLogs: (id) => ['monitors', id, 'logs'],
  monitorStats: (id) => ['monitors', id, 'stats'],
  monitorChecks: (id) => ['monitors', id, 'checks'],

  // Monitored URL (endpoint)
  urlGraphs: (urlId) => ['monitoredUrl', urlId, 'graphs'],
  urlHealthChecks: (urlId) => ['monitoredUrl', urlId, 'healthChecks'],

  // User
  userSettings: ['user', 'settings'],
  userAlertChannels: ['user', 'alertChannels'],

  // Alerts
  alerts: ['alerts'],
  alert: (id) => ['alerts', id],

  // Incidents
  incidents: ['incidents'],
  incident: (id) => ['incidents', id],
};
