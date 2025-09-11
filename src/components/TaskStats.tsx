import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Target, Play } from 'lucide-react';

interface TaskStatsProps {
  stats: {
    total: number;
    active: number;
    completed: number;
    inProgress: number;
  };
}

export const TaskStats = ({ stats }: TaskStatsProps) => {
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4 bg-gradient-card border-0 shadow-card">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Tasks</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-card border-0 shadow-card">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-warning/10">
            <Circle className="w-5 h-5 text-warning" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.active}</p>
            <p className="text-sm text-muted-foreground">Active Tasks</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-card border-0 shadow-card">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Play className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.inProgress}</p>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-card border-0 shadow-card">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-success/10">
            <CheckCircle className="w-5 h-5 text-success" />
          </div>
          <div className="flex-1">
            <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
          <Badge 
            variant="secondary" 
            className="bg-success/10 text-success border-success/20"
          >
            {completionRate}%
          </Badge>
        </div>
      </Card>
    </div>
  );
};