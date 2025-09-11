import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Task, TaskStatus } from '@/types/task';
import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';
import { TaskStats } from '@/components/TaskStats';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import heroImage from '@/assets/hero-image.jpg';

const Index = () => {
  const { 
    tasks, 
    filter, 
    setFilter, 
    addTask, 
    toggleTask, 
    deleteTask, 
    updateTask, 
    taskStats 
  } = useTasks();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const filterOptions: { value: TaskStatus; label: string; count: number }[] = [
    { value: 'all', label: 'All Tasks', count: taskStats.total },
    { value: 'active', label: 'Active', count: taskStats.active },
    { value: 'completed', label: 'Completed', count: taskStats.completed },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-primary opacity-90" />
        
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">
              Lulama's Tracker
            </h1>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Stay organized, set reminders, and accomplish your goals with ease. 
              Your personal productivity companion.
            </p>
            <Button 
              onClick={() => setIsFormOpen(true)}
              size="lg"
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-300 shadow-elevated"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Task
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="mb-8">
          <TaskStats stats={taskStats} />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filter:</span>
            <div className="flex gap-2">
              {filterOptions.map(option => (
                <Badge
                  key={option.value}
                  variant={filter === option.value ? "default" : "secondary"}
                  className={cn(
                    "cursor-pointer transition-all duration-200",
                    filter === option.value 
                      ? "bg-gradient-primary text-white shadow-soft" 
                      : "hover:bg-secondary/80"
                  )}
                  onClick={() => setFilter(option.value)}
                >
                  {option.label} ({option.count})
                </Badge>
              ))}
            </div>
          </div>
          
          <Button 
            onClick={() => setIsFormOpen(true)}
            className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-soft"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-primary opacity-10 flex items-center justify-center">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                {filter === 'completed' 
                  ? 'No completed tasks yet' 
                  : filter === 'active' 
                  ? 'No active tasks' 
                  : 'No tasks created yet'
                }
              </h3>
              <p className="text-muted-foreground mb-6">
                {filter === 'all' 
                  ? 'Get started by creating your first task!' 
                  : filter === 'active' 
                  ? 'All your tasks are completed. Great job!' 
                  : 'Complete some tasks to see them here.'
                }
              </p>
              {filter === 'all' && (
                <Button 
                  onClick={() => setIsFormOpen(true)}
                  variant="outline"
                  className="border-primary/20 hover:bg-primary/5"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Task
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                  onEdit={handleEditTask}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={addTask}
        editingTask={editingTask}
        onUpdate={updateTask}
      />
    </div>
  );
};

export default Index;
