'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/hooks/use-canvas';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LayoutDashboard,
  Calendar,
  GraduationCap,
  FileText,
  Bell,
  MessageSquare,
  CheckSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/grades', label: 'Grades', icon: GraduationCap },
  { href: '/assignments', label: 'Assignments', icon: FileText },
  { href: '/todo', label: 'To-Do', icon: CheckSquare },
  { href: '/announcements', label: 'Announcements', icon: Bell },
  { href: '/discussions', label: 'Discussions', icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: user, loading } = useUser();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background">
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-3 min-w-0">
          {loading ? (
            <>
              <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
              <Skeleton className="h-5 w-32" />
            </>
          ) : user ? (
            <>
              <Avatar className="h-9 w-9 flex-shrink-0">
                <AvatarImage src={user.avatar_url} alt={user.name} />
                <AvatarFallback>{user.short_name?.charAt(0) || user.name?.charAt(0) || '?'}</AvatarFallback>
              </Avatar>
              <span className="text-base font-semibold truncate">{user.short_name || user.name}</span>
            </>
          ) : (
            <>
              <GraduationCap className="h-6 w-6 flex-shrink-0" />
              <span className="text-lg font-semibold">Canvas Dashboard</span>
            </>
          )}
        </Link>
      </div>

      <nav className="space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
