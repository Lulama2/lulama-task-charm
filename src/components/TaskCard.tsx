import { useState } from 'react';
import { Task } from '@/types/task';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Calendar, Clock, MoreVertical, Trash2, Edit, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isAfter, isBefore, addDays } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onUpdateProgress: (id: string, progress: number) => void;
}

export const TaskCard = ({ task, onToggle, onDelete, onEdit, onUpdateProgress }: TaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showProgressSlider, setShowProgressSlider] = useState(false);

  const getDueDateStatus = () => {
    if (!task.dueDate) return null;
    
    const due = new Date(task.dueDate);
    const today = new Date();
    const tomorrow = addDays(today, 1);
    
    if (isBefore(due, today) && !task.completed) {
      return { status: 'overdue', label: 'Overdue' };
    }
    if (isBefore(due, tomorrow) && !task.completed) {
      return { status: 'due-soon', label: 'Due soon' };
    }
    return { status: 'normal', label: format(due, 'MMM dd') };
  };

  const dueDateInfo = getDueDateStatus();

  const getStatusBadge = () => {
    switch (task.status) {
      case 'not-started':
        return { variant: 'secondary' as const, label: 'Not Started', icon: null };
      case 'in-progress':
        return { variant: 'default' as const, label: 'In Progress', icon: Play };
      case 'completed':
        return { variant: 'default' as const, label: 'Completed', icon: null };
    }
  };

  const statusInfo = getStatusBadge();

  const handleProgressChange = (value: number[]) => {
    onUpdateProgress(task.id, value[0]);
  };

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden border-0 bg-gradient-card shadow-card transition-all duration-300 hover:shadow-elevated",
        task.completed && "opacity-75",
        isHovered && "scale-[1.02]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggle(task.id)}
            className="mt-1 data-[state=checked]:bg-success data-[state=checked]:border-success"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={cn(
                "font-medium text-foreground transition-all duration-200",
                task.completed && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h3>
              
              <Badge 
                variant={statusInfo.variant}
                className={cn(
                  "text-xs font-medium",
                  task.status === 'in-progress' && "bg-primary text-primary-foreground",
                  task.status === 'completed' && "bg-success text-success-foreground"
                )}
              >
                {statusInfo.icon && <statusInfo.icon className="w-3 h-3 mr-1" />}
                {statusInfo.label}
              </Badge>
              
              {task.progress > 0 && task.progress < 100 && (
                <Badge variant="outline" className="text-xs">
                  {task.progress}%
                </Badge>
              )}
            </div>
            
            {task.description && (
              <p className={cn(
                "mt-1 text-sm text-muted-foreground",
                task.completed && "line-through"
              )}>
                {task.description}
              </p>
            )}
            
            {/* Progress Bar */}
            {(task.progress > 0 || task.status === 'in-progress') && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Progress</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-1 text-xs"
                    onClick={() => setShowProgressSlider(!showProgressSlider)}
                  >
                    Update
                  </Button>
                </div>
                <Progress 
                  value={task.progress} 
                  className="h-2"
                />
                
                {showProgressSlider && !task.completed && (
                  <div className="pt-2">
                    <Slider
                      value={[task.progress]}
                      onValueChange={handleProgressChange}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex items-center gap-2 mt-3">
              {task.dueDate && dueDateInfo && (
                <Badge 
                  variant={dueDateInfo.status === 'overdue' ? 'destructive' : 
                          dueDateInfo.status === 'due-soon' ? 'default' : 'secondary'}
                  className={cn(
                    "text-xs font-medium",
                    dueDateInfo.status === 'due-soon' && "bg-warning text-warning-foreground"
                  )}
                >
                  <Calendar className="w-3 h-3 mr-1" />
                  {dueDateInfo.label}
                </Badge>
              )}
              
              <span className="text-xs text-muted-foreground">
                <Clock className="w-3 h-3 inline mr-1" />
                {format(new Date(task.createdAt), 'MMM dd')}
              </span>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className={cn(
                  "opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0",
                  isHovered && "opacity-100"
                )}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowProgressSlider(!showProgressSlider)}>
                <Play className="w-4 h-4 mr-2" />
                Update Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(task.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {task.completed && (
        <div className="absolute inset-0 bg-gradient-success opacity-5 pointer-events-none" />
      )}
    </Card>
  );
};