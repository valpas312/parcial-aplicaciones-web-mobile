import { useTasksStore } from '../tasks-store';

describe('tasks store', () => {
  beforeEach(() => useTasksStore.getState().resetTasks([]));

  it('adds, updates and deletes tasks', () => {
    const task = useTasksStore.getState().addTask({ id: 'task-test', title: 'Test', dueDate: '2026-06-22' });
    expect(task.id).toBe('task-test');
    useTasksStore.getState().updateTask('task-test', { contact: { name: 'Grace' } });
    expect(useTasksStore.getState().tasks[0].contact?.name).toBe('Grace');
    useTasksStore.getState().deleteTask('task-test');
    expect(useTasksStore.getState().tasks).toHaveLength(0);
  });
});
