import { AgendaTask, PermissionState } from '@/store/tasks-store';

export function formatCoordinates(location?: AgendaTask['location']) {
  if (!location) return 'Sin ubicación asociada';
  return `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`;
}

export function permissionMessage(resource: string, state: PermissionState) {
  if (state === 'granted') return `${resource}: permiso concedido`;
  if (state === 'denied') return `${resource}: permiso rechazado. Habilítalo desde ajustes para continuar.`;
  return `${resource}: permiso pendiente`;
}

export function isTaskReadyForCalendar(task: AgendaTask) {
  return Boolean(task.title.trim() && task.dueDate && task.location && task.contact);
}
