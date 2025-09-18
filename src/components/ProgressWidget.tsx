import { TrendingUp, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TaskStats } from '@/types/Task';

interface ProgressWidgetProps {
  stats: TaskStats;
}

export const ProgressWidget = ({ stats }: ProgressWidgetProps) => {
  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
  
  const statsCards = [
    {
      title: 'Completed',
      value: stats.completed,
      total: stats.total,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Today',
      value: stats.today,
      icon: Clock,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Upcoming',
      value: stats.upcoming,
      icon: TrendingUp,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Completion Progress Card */}
      <Card className="col-span-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Overall Progress</h3>
            <p className="text-sm text-muted-foreground">
              {stats.completed} of {stats.total} tasks completed
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">
              {Math.round(completionRate)}%
            </div>
            <div className="text-sm text-muted-foreground">Complete</div>
          </div>
        </div>
        <Progress 
          value={completionRate} 
          className="h-3 bg-muted"
        />
      </Card>

      {/* Stats Cards */}
      {statsCards.map((stat) => (
        <Card key={stat.title} className="p-4 hover:shadow-card transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {stat.title}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {stat.value}
                </span>
                {stat.total !== undefined && (
                  <span className="text-sm text-muted-foreground">
                    / {stat.total}
                  </span>
                )}
              </div>
            </div>
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};