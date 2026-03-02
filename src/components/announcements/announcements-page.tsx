'use client';

import { useAnnouncements } from '@/hooks/use-canvas';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, ExternalLink } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

export function AnnouncementsPage() {
  const { data: announcements, loading, error } = useAnnouncements();

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Announcements</h1>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Announcements</h1>
        <p className="text-muted-foreground">Failed to load announcements</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Bell className="h-6 w-6" />
        Announcements
      </h1>

      <Card>
        <CardContent className="pt-6">
          <ScrollArea className="h-[calc(100vh-220px)]">
            {!announcements || announcements.length === 0 ? (
              <p className="text-muted-foreground">No announcements</p>
            ) : (
              <div className="space-y-4">
                {announcements.map(announcement => (
                  <a
                    key={announcement.id}
                    href={announcement.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg border p-4 transition-colors hover:bg-muted"
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={announcement.author.avatar_image_url} />
                        <AvatarFallback>
                          {announcement.author.display_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className="font-medium text-sm">
                            {announcement.author.display_name}
                          </span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(announcement.posted_at), 'MMM d, yyyy')}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({formatDistanceToNow(new Date(announcement.posted_at), { addSuffix: true })})
                          </span>
                          {announcement.read_state === 'unread' && (
                            <Badge variant="secondary" className="text-xs">
                              New
                            </Badge>
                          )}
                        </div>

                        <h3 className="font-semibold mb-2">{announcement.title}</h3>

                        <div
                          className="prose prose-sm dark:prose-invert max-w-none text-sm line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: announcement.message }}
                        />
                      </div>

                      <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  </a>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
