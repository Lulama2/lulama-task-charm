import { useState, useEffect } from 'react';
import { Task, TaskStatus } from '@/types/task';

const STORAGE_KEY = 'lulama-tasks';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskStatus>('all');

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title: string, description?: string, dueDate?: string, progress: number = 0) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: progress === 100,
      progress,
      status: progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'not-started',
      dueDate,
      createdAt: new Date().toISOString(),
      completedAt: progress === 100 ? new Date().toISOString() : undefined,
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { 
            ...task, 
            completed: !task.completed,
            progress: !task.completed ? 100 : task.progress,
            status: !task.completed ? 'completed' : task.progress > 0 ? 'in-progress' : 'not-started',
            completedAt: !task.completed ? new Date().toISOString() : undefined
          }
        : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const updateTask = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const updatedTask = { ...task, ...updates };
        // Auto-update status based on progress
        if (updates.progress !== undefined) {
          if (updates.progress === 100) {
            updatedTask.completed = true;
            updatedTask.status = 'completed';
            updatedTask.completedAt = new Date().toISOString();
          } else if (updates.progress > 0) {
            updatedTask.completed = false;
            updatedTask.status = 'in-progress';
            updatedTask.completedAt = undefined;
          } else {
            updatedTask.completed = false;
            updatedTask.status = 'not-started';
            updatedTask.completedAt = undefined;
          }
        }
        return updatedTask;
      }
      return task;
    }));
  };

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'active':
        return !task.completed;
      case 'completed':
        return task.completed;
      case 'in-progress':
        return task.status === 'in-progress';
      default:
        return true;
    }
  });

  const taskStats = {
    total: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
  };

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    filter,
    setFilter,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    taskStats,
  };
};