import { useState } from 'react';
import { Filter, SortAsc, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TaskCard } from './TaskCard';
import { Task } from '@/types/Task';
import { cn } from '@/lib/utils';

interface TaskListProps {
  tasks: Task[];
  listName: string;
  onToggleComplete: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

type SortOption = 'dueDate' | 'priority' | 'created' | 'alphabetical';
type FilterOption = 'all' | 'pending' | 'completed' | 'overdue';
type ViewMode = 'list' | 'grid';

export const TaskList = ({
  tasks,
  listName,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onToggleSubtask,
}: TaskListProps) => {
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const filterTasks = (tasks: Task[]) => {
    return tasks.filter(task => {
      switch (filterBy) {
        case 'pending':
          return !task.completed;
        case 'completed':
          return task.completed;
        case 'overdue':
          return task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
        default:
          return true;
      }
    });
  };

  const sortTasks = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        
        default:
          return 0;
      }
    });
  };

  const filteredAndSortedTasks = sortTasks(filterTasks(tasks));
  
  const getFilterBadgeCount = (filterType: FilterOption) => {
    switch (filterType) {
      case 'pending':
        return tasks.filter(t => !t.completed).length;
      case 'completed':
        return tasks.filter(t => t.completed).length;
      case 'overdue':
        return tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && !t.completed).length;
      default:
        return tasks.length;
    }
  };

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{listName}</h1>
          <p className="text-muted-foreground">
            {filteredAndSortedTasks.length} {filteredAndSortedTasks.length === 1 ? 'task' : 'tasks'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>

          {/* Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
                {filterBy !== 'all' && (
                  <Badge variant="secondary" className="ml-1">
                    {getFilterBadgeCount(filterBy)}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterBy('all')}>
                <div className="flex items-center justify-between w-full">
                  All Tasks
                  <Badge variant="outline">{getFilterBadgeCount('all')}</Badge>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy('pending')}>
                <div className="flex items-center justify-between w-full">
                  Pending
                  <Badge variant="outline">{getFilterBadgeCount('pending')}</Badge>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy('completed')}>
                <div className="flex items-center justify-between w-full">
                  Completed
                  <Badge variant="outline">{getFilterBadgeCount('completed')}</Badge>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy('overdue')}>
                <div className="flex items-center justify-between w-full">
                  Overdue
                  <Badge variant="outline">{getFilterBadgeCount('overdue')}</Badge>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort */}
          <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
            <SelectTrigger className="w-40">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="created">Date Created</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Task List */}
      {filteredAndSortedTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <List className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No tasks found</h3>
          <p className="text-muted-foreground">
            {filterBy === 'all' 
              ? "Start by creating your first task!" 
              : `No ${filterBy} tasks in this list.`
            }
          </p>
        </div>
      ) : (
        <div className={cn(
          "gap-4",
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
            : "flex flex-col"
        )}>
          {filteredAndSortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onToggleSubtask={onToggleSubtask}
            />
          ))}
        </div>
      )}
    </div>
  );
};