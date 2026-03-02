'use client';

import { useState, useEffect } from 'react';
import { useTodoItems, useCourses } from '@/hooks/use-canvas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckSquare,
  Plus,
  ExternalLink,
  Trash2,
  Calendar,
} from 'lucide-react';
import { format } from 'date-fns';
import type { PersonalTask } from '@/lib/types';

const STORAGE_KEY = 'canvas-dashboard-personal-tasks';

export function TodoPage() {
  const { data: canvasTodos, loading, error } = useTodoItems();
  const { data: courses } = useCourses();
  const [personalTasks, setPersonalTasks] = useState<PersonalTask[]>([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');

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
      dueDate: newTaskDate || undefined,
      createdAt: new Date().toISOString(),
    };

    setPersonalTasks(prev => [task, ...prev]);
    setNewTask('');
    setNewTaskDate('');
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

  const pendingPersonal = personalTasks.filter(t => !t.completed);
  const completedPersonal = personalTasks.filter(t => t.completed);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">To-Do</h1>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <CheckSquare className="h-6 w-6" />
        To-Do
      </h1>

      {/* Add task form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add Personal Task</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="What do you need to do?"
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTask()}
              className="flex-1"
            />
            <Input
              type="date"
              value={newTaskDate}
              onChange={e => setNewTaskDate(e.target.value)}
              className="w-40"
            />
            <Button onClick={addTask}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="personal">
            Personal ({personalTasks.length})
          </TabsTrigger>
          <TabsTrigger value="canvas">
            Canvas ({canvasTodos?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedPersonal.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardContent className="pt-6">
              <ScrollArea className="h-[calc(100vh-380px)]">
                <div className="space-y-3">
                  {/* Pending personal tasks */}
                  {pendingPersonal.map(task => (
                    <PersonalTaskItem
                      key={task.id}
                      task={task}
                      onToggle={toggleTask}
                      onDelete={deleteTask}
                    />
                  ))}

                  {/* Canvas tasks */}
                  {canvasTodos?.map((item, index) => (
                    <CanvasTaskItem
                      key={index}
                      item={item}
                      courses={courses}
                    />
                  ))}

                  {pendingPersonal.length === 0 && (!canvasTodos || canvasTodos.length === 0) && (
                    <p className="text-muted-foreground text-center py-8">
                      No tasks! You're all caught up.
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personal">
          <Card>
            <CardContent className="pt-6">
              <ScrollArea className="h-[calc(100vh-380px)]">
                <div className="space-y-3">
                  {pendingPersonal.map(task => (
                    <PersonalTaskItem
                      key={task.id}
                      task={task}
                      onToggle={toggleTask}
                      onDelete={deleteTask}
                    />
                  ))}
                  {pendingPersonal.length === 0 && (
                    <p className="text-muted-foreground text-center py-8">
                      No personal tasks yet. Add one above!
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="canvas">
          <Card>
            <CardContent className="pt-6">
              <ScrollArea className="h-[calc(100vh-380px)]">
                {error ? (
                  <p className="text-muted-foreground">Failed to load Canvas tasks</p>
                ) : (
                  <div className="space-y-3">
                    {canvasTodos?.map((item, index) => (
                      <CanvasTaskItem
                        key={index}
                        item={item}
                        courses={courses}
                      />
                    ))}
                    {(!canvasTodos || canvasTodos.length === 0) && (
                      <p className="text-muted-foreground text-center py-8">
                        No Canvas tasks
                      </p>
                    )}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardContent className="pt-6">
              <ScrollArea className="h-[calc(100vh-380px)]">
                <div className="space-y-3">
                  {completedPersonal.map(task => (
                    <PersonalTaskItem
                      key={task.id}
                      task={task}
                      onToggle={toggleTask}
                      onDelete={deleteTask}
                    />
                  ))}
                  {completedPersonal.length === 0 && (
                    <p className="text-muted-foreground text-center py-8">
                      No completed tasks
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PersonalTaskItem({
  task,
  onToggle,
  onDelete,
}: {
  task: PersonalTask;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
      />
      <div className="flex-1 min-w-0">
        <span
          className={`block ${task.completed ? 'line-through text-muted-foreground' : ''}`}
        >
          {task.title}
        </span>
        {task.dueDate && (
          <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Calendar className="h-3 w-3" />
            {format(new Date(task.dueDate), 'MMM d, yyyy')}
          </span>
        )}
      </div>
      <Badge variant="outline" className="text-xs">Personal</Badge>
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8"
        onClick={() => onDelete(task.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

function CanvasTaskItem({
  item,
  courses,
}: {
  item: { assignment?: { name: string; due_at?: string | null }; context_name: string; html_url: string };
  courses: { id: number; course_code: string }[] | null;
}) {
  return (
    <a
      href={item.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted"
    >
      <div className="h-5 w-5 rounded border flex items-center justify-center">
        <ExternalLink className="h-3 w-3 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <span className="block">{item.assignment?.name || 'Canvas Task'}</span>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <span>{item.context_name}</span>
          {item.assignment?.due_at && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(item.assignment.due_at), 'MMM d, h:mm a')}
              </span>
            </>
          )}
        </div>
      </div>
      <Badge variant="secondary" className="text-xs">Canvas</Badge>
    </a>
  );
}
