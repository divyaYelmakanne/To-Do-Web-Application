import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TaskList } from './TaskList';
import { TaskForm } from './TaskForm';
import { ProgressWidget } from './ProgressWidget';
import { Task, TaskList as TList, TaskStats } from '@/types/Task';
import { useToast } from '@/hooks/use-toast';

// Initial demo data
const initialLists: TList[] = [
  { id: 'work', name: 'Work', color: '#3B82F6', icon: '💼', taskCount: 0 },
  { id: 'personal', name: 'Personal', color: '#10B981', icon: '🏠', taskCount: 0 },
  { id: 'shopping', name: 'Shopping', color: '#F59E0B', icon: '🛒', taskCount: 0 },
];

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Write and submit the Q4 project proposal for the marketing campaign',
    completed: false,
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000), // Tomorrow
    dueTime: '14:00',
    tags: ['work', 'important'],
    listId: 'work',
    subtasks: [
      { id: '1-1', title: 'Research competitor analysis', completed: true },
      { id: '1-2', title: 'Create budget overview', completed: false },
      { id: '1-3', title: 'Write executive summary', completed: false },
    ],
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
  },
  {
    id: '2',
    title: 'Buy groceries',
    description: 'Weekly grocery shopping - check the list on the fridge',
    completed: false,
    priority: 'medium',
    dueDate: new Date(),
    tags: ['personal', 'routine'],
    listId: 'shopping',
    subtasks: [
      { id: '2-1', title: 'Milk and eggs', completed: false },
      { id: '2-2', title: 'Fresh vegetables', completed: false },
      { id: '2-3', title: 'Chicken breast', completed: false },
    ],
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
  },
  {
    id: '3',
    title: 'Plan weekend trip',
    description: 'Research and book accommodation for the mountain hiking trip',
    completed: true,
    priority: 'low',
    dueDate: new Date(Date.now() - 86400000), // Yesterday (completed)
    tags: ['personal', 'travel'],
    listId: 'personal',
    subtasks: [],
    createdAt: new Date(Date.now() - 259200000), // 3 days ago
    completedAt: new Date(Date.now() - 43200000), // 12 hours ago
  },
];

export const TaskDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [lists] = useState<TList[]>(initialLists);
  const [activeListId, setActiveListId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const { toast } = useToast();

  // Calculate stats
  const stats: TaskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && !t.completed).length,
    today: tasks.filter(t => {
      if (!t.dueDate) return false;
      const today = new Date();
      const taskDate = new Date(t.dueDate);
      return taskDate.toDateString() === today.toDateString();
    }).length,
    upcoming: tasks.filter(t => {
      if (!t.dueDate || t.completed) return false;
      const today = new Date();
      const taskDate = new Date(t.dueDate);
      const diffTime = taskDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 && diffDays <= 7;
    }).length,
  };

  // Update list task counts
  useEffect(() => {
    lists.forEach(list => {
      list.taskCount = tasks.filter(t => t.listId === list.id).length;
    });
  }, [tasks, lists]);

  // Filter tasks based on active list and search
  const getFilteredTasks = () => {
    let filtered = tasks;

    // Filter by list
    switch (activeListId) {
      case 'today':
        filtered = tasks.filter(t => {
          if (!t.dueDate) return false;
          const today = new Date();
          const taskDate = new Date(t.dueDate);
          return taskDate.toDateString() === today.toDateString();
        });
        break;
      case 'upcoming':
        filtered = tasks.filter(t => {
          if (!t.dueDate || t.completed) return false;
          const today = new Date();
          const taskDate = new Date(t.dueDate);
          const diffTime = taskDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays > 0 && diffDays <= 7;
        });
        break;
      case 'overdue':
        filtered = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && !t.completed);
        break;
      case 'all':
        filtered = tasks;
        break;
      default:
        filtered = tasks.filter(t => t.listId === activeListId);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query) ||
        t.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  };

  const getListName = () => {
    switch (activeListId) {
      case 'all': return 'All Tasks';
      case 'today': return 'Today';
      case 'upcoming': return 'Upcoming';
      case 'overdue': return 'Overdue';
      default:
        const list = lists.find(l => l.id === activeListId);
        return list?.name || 'Tasks';
    }
  };

  const handleCreateTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title!,
      description: taskData.description,
      completed: false,
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate,
      dueTime: taskData.dueTime,
      tags: taskData.tags || [],
      listId: taskData.listId || lists[0]?.id || '',
      subtasks: taskData.subtasks || [],
      createdAt: new Date(),
    };

    setTasks(prev => [...prev, newTask]);
    toast({
      title: "Task created!",
      description: `"${newTask.title}" has been added to your list.`,
    });
  };

  const handleEditTask = (taskData: Partial<Task>) => {
    if (!taskData.id) return;

    setTasks(prev => prev.map(task => 
      task.id === taskData.id 
        ? { ...task, ...taskData }
        : task
    ));

    toast({
      title: "Task updated!",
      description: `"${taskData.title}" has been updated.`,
    });
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            completed: !task.completed,
            completedAt: !task.completed ? new Date() : undefined
          }
        : task
    ));

    const task = tasks.find(t => t.id === taskId);
    if (task) {
      toast({
        title: task.completed ? "Task reopened" : "Task completed!",
        description: `"${task.title}" marked as ${task.completed ? 'pending' : 'completed'}.`,
      });
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    
    if (task) {
      toast({
        title: "Task deleted",
        description: `"${task.title}" has been removed.`,
        variant: "destructive",
      });
    }
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? {
            ...task,
            subtasks: task.subtasks.map(st => 
              st.id === subtaskId 
                ? { ...st, completed: !st.completed }
                : st
            )
          }
        : task
    ));
  };

  const openTaskForm = (task?: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const closeTaskForm = () => {
    setEditingTask(undefined);
    setIsTaskFormOpen(false);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (editingTask) {
      handleEditTask(taskData);
    } else {
      handleCreateTask(taskData);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        lists={lists}
        stats={stats}
        activeListId={activeListId}
        searchQuery={searchQuery}
        onListSelect={setActiveListId}
        onNewList={() => toast({ title: "Coming soon!", description: "List creation will be available soon." })}
        onNewTask={() => openTaskForm()}
        onSearchChange={setSearchQuery}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6">
          <ProgressWidget stats={stats} />
        </div>
        
        <TaskList
          tasks={getFilteredTasks()}
          listName={getListName()}
          onToggleComplete={handleToggleComplete}
          onEditTask={openTaskForm}
          onDeleteTask={handleDeleteTask}
          onToggleSubtask={handleToggleSubtask}
        />
      </div>

      <TaskForm
        task={editingTask}
        lists={lists}
        isOpen={isTaskFormOpen}
        onClose={closeTaskForm}
        onSave={handleSaveTask}
      />
    </div>
  );
};