import apiClient from './client';
import { ENDPOINTS } from '../constants/api';

export async function getMonitors() {
  return apiClient.get(ENDPOINTS.MONITORS);
}

export async function getMonitor(id) {
  return apiClient.get(ENDPOINTS.MONITOR_BY_ID(id));
}

export async function createMonitor(data) {
  return apiClient.post(ENDPOINTS.MONITOR_CREATE, data);
}

export async function deleteMonitor(id) {
  return apiClient.delete(ENDPOINTS.MONITOR_DELETE(id));
}

export async function addMonitorUrl(data) {
  return apiClient.post(ENDPOINTS.MONITOR_ADD_URL, data);
}

export async function deleteMonitorUrl(monitoredUrlId) {
  return apiClient.delete(ENDPOINTS.MONITOR_DELETE_URL(monitoredUrlId));
}

export async function enableMonitoring(data) {
  return apiClient.post(ENDPOINTS.MONITOR_ENABLE, data);
}

export async function getMonitorGraphs(monitoredUrlId) {
  return apiClient.get(ENDPOINTS.MONITOR_GRAPHS(monitoredUrlId));
}

export async function getMonitorHealthCheck(monitoredUrlId) {
  return apiClient.get(ENDPOINTS.MONITOR_HEALTH_CHECK(monitoredUrlId));
}

export async function getAllHealthChecks(monitoredUrlId) {
  return apiClient.get(ENDPOINTS.MONITOR_ALL_HEALTH_CHECKS(monitoredUrlId));
}
