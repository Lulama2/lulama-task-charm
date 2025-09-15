import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description?: string, dueDate?: string, progress?: number) => void;
  editingTask?: Task | null;
  onUpdate?: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
}

export const TaskForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingTask,
  onUpdate 
}: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [progress, setProgress] = useState([0]);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setDueDate(editingTask.dueDate || '');
      setProgress([editingTask.progress || 0]);
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setProgress([0]);
    }
  }, [editingTask, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    if (editingTask && onUpdate) {
      onUpdate(editingTask.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
        progress: progress[0],
      });
    } else {
      onSubmit(
        title.trim(),
        description.trim() || undefined,
        dueDate || undefined,
        progress[0]
      );
    }
    
    setTitle('');
    setDescription('');
    setDueDate('');
    setProgress([0]);
    onClose();
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setProgress([0]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gradient-card border-0 shadow-elevated">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-primary bg-clip-text text-transparent">
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Task Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="border-border/50 focus:border-primary transition-colors"
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              className="border-border/50 focus:border-primary transition-colors resize-none"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dueDate" className="text-sm font-medium">
              Due Date (Optional)
            </Label>
            <div className="relative">
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="border-border/50 focus:border-primary transition-colors"
              />
              <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Progress: {progress[0]}%
            </Label>
            <Slider
              value={progress}
              onValueChange={setProgress}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Set your initial progress or update how far you are from completing this task
            </p>
          </div>
          
          <DialogFooter className="gap-2 pt-4">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleClose}
              className="px-6"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!title.trim()}
              className="px-6 bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              {editingTask ? (
                'Update Task'
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Task
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};