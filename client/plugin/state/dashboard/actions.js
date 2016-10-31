export const OPEN_DASHBOARD = 'DASHBOARD::OPEN_DASHBOARD';
export const CLOSE_DASHBOARD = 'DASHBOARD::CLOSE_DASHBOARD';

export function openDashboard() {
  return {
    type: OPEN_DASHBOARD
  }
}

export function closeDashboard() {
  return {
    type: CLOSE_DASHBOARD
  }
}
