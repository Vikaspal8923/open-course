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
      className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-2">{thread.title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{thread.description}</p>

          {thread.link && (
            <a
              href={thread.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 mb-3"
            >
              <ExternalLink className="w-3 h-3" />
              <span>View Reference</span>
            </a>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-500">
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
              <span>{(thread.replies?.length || thread.comments?.length || 0)} replies</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
