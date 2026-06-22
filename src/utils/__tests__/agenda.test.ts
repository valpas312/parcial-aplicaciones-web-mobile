import { formatCoordinates, isTaskReadyForCalendar, permissionMessage } from '../agenda';

describe('agenda utils', () => {
  it('formats permissions and validates calendar readiness', () => {
    expect(permissionMessage('cámara', 'denied')).toContain('permiso rechazado');
    expect(formatCoordinates({ latitude: -34.603722, longitude: -58.381592 })).toBe('-34.60372, -58.38159');
    expect(isTaskReadyForCalendar({ id: '1', title: 'Evento', dueDate: '2026-06-22', location: { latitude: 1, longitude: 2 }, contact: { name: 'Ada' } })).toBe(true);
  });
});
