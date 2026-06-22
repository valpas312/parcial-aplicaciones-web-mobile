import { create } from 'zustand';

export type PermissionState = 'pending' | 'granted' | 'denied';

export type TaskAttachment = {
  imageUri?: string;
  location?: { latitude: number; longitude: number; label?: string };
  contact?: { id?: string; name: string; phone?: string; email?: string };
  calendarEventId?: string;
};

export type AgendaTask = TaskAttachment & {
  id: string;
  title: string;
  notes?: string;
  dueDate: string;
};

type TaskStore = {
  tasks: AgendaTask[];
  addTask: (task: Omit<AgendaTask, 'id'> & { id?: string }) => AgendaTask;
  updateTask: (id: string, changes: Partial<AgendaTask>) => void;
  deleteTask: (id: string) => void;
  resetTasks: (tasks?: AgendaTask[]) => void;
};

const initialTasks: AgendaTask[] = [
  {
    id: 'demo-1',
    title: 'Preparar entrega del parcial',
    notes: 'Adjuntar evidencia, ubicación, responsable y recordatorio.',
    dueDate: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  },
];

export const useTasksStore = create<TaskStore>((set) => ({
  tasks: initialTasks,
  addTask: (task) => {
    const newTask: AgendaTask = { ...task, id: task.id ?? `task-${Date.now()}` };
    set((state) => ({ tasks: [newTask, ...state.tasks] }));
    return newTask;
  },
  updateTask: (id, changes) =>
    set((state) => ({ tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...changes } : task)) })),
  deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),
  resetTasks: (tasks = initialTasks) => set({ tasks }),
}));
