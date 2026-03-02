'use client';

import { useAnnouncements } from '@/hooks/use-canvas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function AnnouncementsFeed() {
  const { data: announcements, loading, error } = useAnnouncements();

  const getCourseFromContextCode = (contextCode: string) => {
    // context_code is like "course_12345"
    return contextCode.replace('course_', '');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Announcements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Announcements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Failed to load announcements</p>
        </CardContent>
      </Card>
    );
  }

  const recentAnnouncements = announcements?.slice(0, 5) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Announcements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {recentAnnouncements.length === 0 ? (
            <p className="text-sm text-muted-foreground">No announcements</p>
          ) : (
            <div className="space-y-4">
              {recentAnnouncements.map(announcement => (
                <a
                  key={announcement.id}
                  href={announcement.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg border p-3 transition-colors hover:bg-muted"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={announcement.author.avatar_image_url} />
                      <AvatarFallback>
                        {announcement.author.display_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground">
                          {announcement.author.display_name}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(announcement.posted_at), { addSuffix: true })}
                        </span>
                        {announcement.read_state === 'unread' && (
                          <Badge variant="secondary" className="text-xs">New</Badge>
                        )}
                      </div>
                      <p className="font-medium text-sm line-clamp-1">{announcement.title}</p>
                      <div
                        className="text-xs text-muted-foreground line-clamp-2 mt-1"
                        dangerouslySetInnerHTML={{
                          __html: announcement.message.replace(/<[^>]*>/g, ' ').slice(0, 100)
                        }}
                      />
                    </div>
                    <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  </div>
                </a>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
