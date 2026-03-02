'use client';

import { useCanvasConfig } from '@/hooks/use-canvas';
import { UpcomingAssignments } from '@/components/dashboard/upcoming-assignments';
import { GradesOverview } from '@/components/dashboard/grades-overview';
import { WorkloadHeatmap } from '@/components/dashboard/workload-heatmap';
import { DueCountdowns } from '@/components/dashboard/due-countdowns';
import { TodoList } from '@/components/dashboard/todo-list';
import { AnnouncementsFeed } from '@/components/dashboard/announcements-feed';
import { DiscussionsTracker } from '@/components/dashboard/discussions-tracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function DashboardPage() {
  const isConfigured = useCanvasConfig();

  if (!isConfigured) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-500">
              <AlertTriangle className="h-5 w-5" />
              Canvas API Not Configured
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              To use the Canvas Dashboard, you need to configure your Canvas API credentials.
            </p>
            <ol className="text-sm space-y-2 list-decimal list-inside">
              <li>Copy <code className="bg-muted px-1 rounded">.env.example</code> to <code className="bg-muted px-1 rounded">.env.local</code></li>
              <li>Get your API token from Canvas → Account → Settings → Approved Integrations</li>
              <li>Add your token and Canvas URL to <code className="bg-muted px-1 rounded">.env.local</code></li>
              <li>Restart the development server</li>
            </ol>
            <div className="bg-muted rounded-lg p-3 text-xs font-mono">
              <p>NEXT_PUBLIC_CANVAS_API_TOKEN=your_token</p>
              <p>NEXT_PUBLIC_CANVAS_BASE_URL=https://canvas.your-school.edu</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Top row - Key metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DueCountdowns />
        <GradesOverview />
        <TodoList />
      </div>

      {/* Workload heatmap */}
      <WorkloadHeatmap />

      {/* Bottom row - Lists */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <UpcomingAssignments />
        <AnnouncementsFeed />
        <DiscussionsTracker />
      </div>
    </div>
  );
}
