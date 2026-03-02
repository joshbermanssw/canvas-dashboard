'use client';

import { useDiscussions, useCourses } from '@/hooks/use-canvas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function DiscussionsTracker() {
  const { data: discussions, loading, error } = useDiscussions();
  const { data: courses } = useCourses();

  const getCourseName = (courseId: number) => {
    return courses?.find(c => c.id === courseId)?.course_code || 'Unknown';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Discussions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-16 w-full" />
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
            <MessageSquare className="h-5 w-5" />
            Discussions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Failed to load discussions</p>
        </CardContent>
      </Card>
    );
  }

  const recentDiscussions = discussions?.slice(0, 10) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Discussions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {recentDiscussions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No discussions</p>
          ) : (
            <div className="space-y-3">
              {recentDiscussions.map(discussion => (
                <a
                  key={discussion.id}
                  href={discussion.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg border p-3 transition-colors hover:bg-muted"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={discussion.author?.avatar_image_url} />
                      <AvatarFallback>
                        {discussion.author?.display_name?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground">
                          {getCourseName(discussion.course_id)}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(
                            new Date(discussion.last_reply_at || discussion.posted_at),
                            { addSuffix: true }
                          )}
                        </span>
                      </div>
                      <p className="font-medium text-sm line-clamp-1">{discussion.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {discussion.unread_count > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {discussion.unread_count} unread
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {discussion.discussion_subentry_count} replies
                        </span>
                      </div>
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
