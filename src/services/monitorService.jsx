import { monitors as mockData } from '../data/mockMonitors';

const FETCH_DELAY_MS = 1200;
const LIST_DELAY_MS = 800;

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Simulates fetching a single monitor by id from a remote API.
 * Throws if the id is not found, mirroring real API 404 behavior.
 */
export async function fetchMonitorById(id) {
  await wait(FETCH_DELAY_MS);
  const found = mockData.find(m => m.id === id);
  if (!found) {
    throw new Error(`Monitor "${id}" not found. It may have been removed.`);
  }
  // Return a deep copy to simulate receiving a fresh server response each time
  return JSON.parse(JSON.stringify(found));
}

/**
 * Simulates fetching the full monitors list from a remote API.
 */
export async function fetchAllMonitors() {
  await wait(LIST_DELAY_MS);
  return JSON.parse(JSON.stringify(mockData));
}
