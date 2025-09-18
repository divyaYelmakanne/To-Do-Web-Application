import { Plus, Search, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { TaskList, TaskStats } from '@/types/Task';
import { cn } from '@/lib/utils';

interface SidebarProps {
  lists: TaskList[];
  stats: TaskStats;
  activeListId: string;
  searchQuery: string;
  onListSelect: (listId: string) => void;
  onNewList: () => void;
  onNewTask: () => void;
  onSearchChange: (query: string) => void;
}

export const Sidebar = ({
  lists,
  stats,
  activeListId,
  searchQuery,
  onListSelect,
  onNewList,
  onNewTask,
  onSearchChange,
}: SidebarProps) => {
  const quickViews = [
    { id: 'all', name: 'All Tasks', icon: CheckCircle, count: stats.total },
    { id: 'today', name: 'Today', icon: Calendar, count: stats.today },
    { id: 'upcoming', name: 'Upcoming', icon: Clock, count: stats.upcoming },
    { id: 'overdue', name: 'Overdue', icon: AlertCircle, count: stats.overdue },
  ];

  return (
    <div className="w-80 bg-sidebar text-sidebar-foreground flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            TaskFlow
          </h1>
          <Button 
            onClick={onNewTask} 
            size="sm" 
            className="bg-gradient-primary hover:opacity-90 border-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/60" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/60"
          />
        </div>
      </div>

      {/* Quick Views */}
      <div className="p-4">
        <h2 className="text-sm font-medium text-sidebar-foreground/80 mb-3">Quick Views</h2>
        <div className="space-y-1">
          {quickViews.map((view) => (
            <Button
              key={view.id}
              variant="ghost"
              className={cn(
                "w-full justify-between hover:bg-sidebar-accent",
                activeListId === view.id && "bg-sidebar-accent"
              )}
              onClick={() => onListSelect(view.id)}
            >
              <div className="flex items-center gap-3">
                <view.icon className="h-4 w-4" />
                <span>{view.name}</span>
              </div>
              <Badge variant="secondary" className="bg-sidebar-accent text-xs">
                {view.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Lists */}
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-sidebar-foreground/80">Lists</h2>
          <Button 
            onClick={onNewList} 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="space-y-1">
          {lists.map((list) => (
            <Button
              key={list.id}
              variant="ghost"
              className={cn(
                "w-full justify-between hover:bg-sidebar-accent",
                activeListId === list.id && "bg-sidebar-accent"
              )}
              onClick={() => onListSelect(list.id)}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: list.color }}
                />
                <span>{list.name}</span>
              </div>
              <Badge variant="secondary" className="bg-sidebar-accent text-xs">
                {list.taskCount}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Progress Summary */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="bg-sidebar-accent rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Today's Progress</span>
            <span className="text-sm text-sidebar-foreground/80">
              {stats.completed}/{stats.total}
            </span>
          </div>
          <div className="w-full bg-sidebar-border rounded-full h-2">
            <div 
              className="bg-gradient-success h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};