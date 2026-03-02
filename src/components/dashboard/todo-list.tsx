'use client';

import { useState, useEffect } from 'react';
import { useTodoItems } from '@/hooks/use-canvas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Plus, ExternalLink, Trash2 } from 'lucide-react';
import type { PersonalTask } from '@/lib/types';

const STORAGE_KEY = 'canvas-dashboard-personal-tasks';

export function TodoList() {
  const { data: canvasTodos, loading, error } = useTodoItems();
  const [personalTasks, setPersonalTasks] = useState<PersonalTask[]>([]);
  const [newTask, setNewTask] = useState('');

  // Load personal tasks from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setPersonalTasks(JSON.parse(stored));
    }
  }, []);

  // Save personal tasks to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(personalTasks));
  }, [personalTasks]);

  const addTask = () => {
    if (!newTask.trim()) return;

    const task: PersonalTask = {
      id: Date.now().toString(),
      title: newTask.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setPersonalTasks(prev => [task, ...prev]);
    setNewTask('');
  };

  const toggleTask = (id: string) => {
    setPersonalTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setPersonalTasks(prev => prev.filter(task => task.id !== id));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            To-Do
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5" />
          To-Do
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add task input */}
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Add a personal task..."
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
          />
          <Button size="icon" onClick={addTask}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[300px] pr-4">
          {/* Personal tasks */}
          {personalTasks.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">Personal Tasks</p>
              <div className="space-y-2">
                {personalTasks.map(task => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 rounded-lg border p-2"
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                    />
                    <span
                      className={`flex-1 text-sm ${
                        task.completed ? 'line-through text-muted-foreground' : ''
                      }`}
                    >
                      {task.title}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Canvas to-do items */}
          {error ? (
            <p className="text-sm text-muted-foreground">Failed to load Canvas tasks</p>
          ) : canvasTodos && canvasTodos.length > 0 ? (
            <div>
              <p className="text-xs text-muted-foreground mb-2">From Canvas</p>
              <div className="space-y-2">
                {canvasTodos.map((item, index) => (
                  <a
                    key={index}
                    href={item.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border p-2 transition-colors hover:bg-muted"
                  >
                    <div className="h-4 w-4 rounded border flex items-center justify-center">
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm truncate block">
                        {item.assignment?.name || 'Canvas Task'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.context_name}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Canvas
                    </Badge>
                  </a>
                ))}
              </div>
            </div>
          ) : (
            personalTasks.length === 0 && (
              <p className="text-sm text-muted-foreground">No tasks yet</p>
            )
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
