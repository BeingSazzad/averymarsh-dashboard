import { Link } from 'react-router-dom'
import { Bell, CheckCheck, CreditCard, KeyRound, LifeBuoy, ShieldAlert, Timer } from 'lucide-react'
import { PageHeader } from '../../components/layout/PageHeader'
import { Badge } from '../../components/shared/Badge'
import { Button } from '../../components/ui/Button'
import { formatDate } from '../../lib/utils'
import { markAllNotificationsRead, markNotificationRead } from '../../store/platformSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import type { NotificationKind } from '../../types/common.types'
import { ROUTES } from '../../constants/routes'

function kindMeta(kind: NotificationKind) {
  if (kind === 'payment') return { icon: CreditCard, tone: 'blue' as const, label: 'Payment' }
  if (kind === 'trial') return { icon: Timer, tone: 'amber' as const, label: 'Trial' }
  if (kind === 'access') return { icon: KeyRound, tone: 'green' as const, label: 'Access' }
  if (kind === 'support') return { icon: LifeBuoy, tone: 'blue' as const, label: 'Support' }
  return { icon: ShieldAlert, tone: 'slate' as const, label: 'System' }
}

export function NotificationsPage() {
  const notifications = useAppSelector((state) => state.platform.notifications)
  const unread = notifications.filter((note) => !note.read).length
  const dispatch = useAppDispatch()

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageHeader
        title="Notifications"
        subtitle={unread ? `${unread} unread · platform alerts` : 'You are caught up'}
        action={
          <Button
            variant="secondary"
            disabled={unread === 0}
            onClick={() => dispatch(markAllNotificationsRead())}
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </Button>
        }
      />

      {notifications.length === 0 ? (
        <div className="panel p-10 text-center text-sm text-[#68707C]">
          <Bell className="w-6 h-6 mx-auto mb-2 text-[#94A3B8]" />
          No notifications yet.
        </div>
      ) : (
        <ul className="panel divide-y divide-[#EAEDF1] overflow-hidden">
          {notifications.map((note) => {
            const meta = kindMeta(note.kind)
            const Icon = meta.icon
            return (
              <li
                key={note.id}
                className={`p-4 md:p-5 flex gap-3 ${note.read ? 'bg-white' : 'bg-[#F8FBFF]'}`}
              >
                <span className="w-10 h-10 rounded-2xl bg-[#EAF3FF] text-[#1677FF] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-[#171A1F]">{note.title}</p>
                    <Badge tone={meta.tone}>{meta.label}</Badge>
                    {!note.read ? <Badge tone="blue">New</Badge> : null}
                  </div>
                  <p className="text-sm text-[#68707C] mt-1 leading-relaxed">{note.body}</p>
                  <p className="text-[11px] text-[#94A3B8] mt-2">
                    {formatDate(note.createdAt.slice(0, 10))}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {note.href ? (
                      <Link
                        to={note.href}
                        onClick={() => dispatch(markNotificationRead(note.id))}
                        className="text-xs font-semibold text-[#1677FF] hover:underline"
                      >
                        Open
                      </Link>
                    ) : null}
                    {!note.read ? (
                      <button
                        type="button"
                        onClick={() => dispatch(markNotificationRead(note.id))}
                        className="text-xs font-semibold text-[#68707C] hover:text-[#171A1F] cursor-pointer"
                      >
                        Mark read
                      </button>
                    ) : null}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <p className="text-xs text-[#94A3B8]">
        Tip: grant company access from{' '}
        <Link to={ROUTES.companies} className="text-[#1677FF] font-semibold hover:underline">
          Companies
        </Link>
        .
      </p>
    </div>
  )
}
