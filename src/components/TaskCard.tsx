import { useState } from 'react';
import { Calendar, Clock, Tag, MoreHorizontal, Edit, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Task } from '@/types/Task';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export const TaskCard = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  onToggleSubtask,
}: TaskCardProps) => {
  const [showSubtasks, setShowSubtasks] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-priority-high bg-red-50/50';
      case 'medium':
        return 'border-l-priority-medium bg-sky-50/50';
      case 'low':
        return 'border-l-priority-low bg-green-50/50';
      default:
        return 'border-l-muted';
    }
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString();
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  const completedSubtasks = task.subtasks.filter(st => st.completed).length;

  return (
    <Card className={cn(
      "p-4 transition-all duration-300 hover:shadow-card border-l-4 group",
      getPriorityColor(task.priority),
      task.completed && "opacity-60 bg-muted/30"
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-auto hover:bg-transparent"
            onClick={() => onToggleComplete(task.id)}
          >
            {task.completed ? (
              <CheckCircle2 className="h-5 w-5 text-success" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
            )}
          </Button>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className={cn(
                "font-medium text-card-foreground",
                task.completed && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h3>
              <Badge variant="outline" className="text-xs">
                {task.priority}
              </Badge>
            </div>
            
            {task.description && (
              <p className="text-sm text-muted-foreground">{task.description}</p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {task.dueDate && (
                <div className={cn(
                  "flex items-center gap-1",
                  isOverdue && "text-destructive"
                )}>
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(task.dueDate)}</span>
                  {task.dueTime && (
                    <>
                      <Clock className="h-4 w-4 ml-2" />
                      <span>{task.dueTime}</span>
                    </>
                  )}
                </div>
              )}
              
              {task.subtasks.length > 0 && (
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{completedSubtasks}/{task.subtasks.length}</span>
                </div>
              )}
            </div>
            
            {task.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {task.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            {task.subtasks.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSubtasks(!showSubtasks)}
                className="text-xs p-0 h-auto font-normal text-primary hover:bg-transparent"
              >
                {showSubtasks ? 'Hide' : 'Show'} subtasks ({task.subtasks.length})
              </Button>
            )}
            
            {showSubtasks && (
              <div className="space-y-2 pl-4 border-l-2 border-muted">
                {task.subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={subtask.completed}
                      onCheckedChange={() => onToggleSubtask(task.id, subtask.id)}
                    />
                    <span className={cn(
                      "text-sm",
                      subtask.completed && "line-through text-muted-foreground"
                    )}>
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(task.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
};