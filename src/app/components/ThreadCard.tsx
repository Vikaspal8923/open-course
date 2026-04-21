import { Link } from 'react-router';
import { Thread } from '../data/mockData';
import { MessageSquare, User, Calendar, ExternalLink } from 'lucide-react';

interface ThreadCardProps {
  thread: Thread;
}

export function ThreadCard({ thread }: ThreadCardProps) {
  const threadId = (thread as Thread & { _id?: string })._id || thread.id;

  return (
    <Link
      to={`/research/${threadId}`}
      className="block rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-orange-700"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-pink-600">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">{thread.title}</h3>
          <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{thread.description}</p>

          {thread.link && (
            <a
              href={thread.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mb-3 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <ExternalLink className="w-3 h-3" />
              <span>View Reference</span>
            </a>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{thread.author?.name || thread.creator?.name || 'Anonymous'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(thread.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              <span>{thread.replies?.length || thread.comments?.length || 0} replies</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
