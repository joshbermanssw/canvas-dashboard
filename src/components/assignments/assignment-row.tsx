import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import type { Assignment } from '@/lib/types';

type AssignmentStatus =
  | { kind: 'done'; label: string }
  | { kind: 'overdue'; label: string }
  | { kind: 'due'; label: string; urgent: boolean };

/** Countdown/submission status for an assignment, relative to now. */
function getStatus(assignment: Assignment): AssignmentStatus {
  const state = assignment.submission?.workflow_state;
  if (state === 'submitted' || state === 'graded') return { kind: 'done', label: 'Done' };

  const now = new Date();
  const due = new Date(assignment.due_at!);
  if (due <= now) return { kind: 'overdue', label: 'Overdue' };

  const days = differenceInDays(due, now);
  const hours = differenceInHours(due, now) % 24;
  const minutes = differenceInMinutes(due, now) % 60;

  if (days > 0) return { kind: 'due', label: `${days}d ${hours}h`, urgent: days <= 1 };
  if (hours > 0) return { kind: 'due', label: `${hours}h ${minutes}m`, urgent: true };
  return { kind: 'due', label: `${minutes}m`, urgent: true };
}

/**
 * Linked assignment card with a countdown badge. Shared by the dashboard's
 * "Due Soon" list and the calendar day panel. Expects `assignment.due_at` to be set.
 */
export function AssignmentRow({
  assignment,
  courseName,
}: {
  assignment: Assignment;
  courseName: string;
}) {
  const status = getStatus(assignment);
  const done = status.kind === 'done';
  const alert = status.kind === 'overdue' || (status.kind === 'due' && status.urgent);

  return (
    <a
      href={assignment.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block rounded-lg border p-3 transition-colors hover:bg-muted ${
        done ? 'bg-green-500/10 border-green-500/30' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground mb-1">{courseName}</p>
          <p className="font-medium text-sm truncate">{assignment.name}</p>
        </div>
        <div className="flex items-center gap-2">
          {done ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : alert ? (
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          ) : null}
          <Badge
            variant={done ? 'default' : alert ? 'destructive' : 'secondary'}
            className={`font-mono text-sm ${done ? 'bg-green-500 hover:bg-green-600' : ''}`}
          >
            {status.label}
          </Badge>
        </div>
      </div>
    </a>
  );
}
