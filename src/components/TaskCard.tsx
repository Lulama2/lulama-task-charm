import { useState } from 'react';
import { Task } from '@/types/task';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Calendar, Clock, MoreVertical, Trash2, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isAfter, isBefore, addDays } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export const TaskCard = ({ task, onToggle, onDelete, onEdit }: TaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

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
            <h3 className={cn(
              "font-medium text-foreground transition-all duration-200",
              task.completed && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className={cn(
                "mt-1 text-sm text-muted-foreground",
                task.completed && "line-through"
              )}>
                {task.description}
              </p>
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