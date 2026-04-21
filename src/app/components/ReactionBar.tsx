import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { matchesUserId } from '../utils/auth';

interface ReactionBarProps {
  likes?: Array<string | { _id?: string; id?: string }>;
  dislikes?: Array<string | { _id?: string; id?: string }>;
  currentUserId?: string | null;
  onLike: () => void;
  onDislike: () => void;
  disabled?: boolean;
}

export function ReactionBar({
  likes = [],
  dislikes = [],
  currentUserId = null,
  onLike,
  onDislike,
  disabled = false,
}: ReactionBarProps) {
  const likedByCurrentUser = likes.some((entry) => matchesUserId(entry, currentUserId));
  const dislikedByCurrentUser = dislikes.some((entry) => matchesUserId(entry, currentUserId));

  return (
    <div className="inline-flex items-center overflow-hidden rounded-full border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
      <button
        type="button"
        onClick={onLike}
        disabled={disabled}
        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
          likedByCurrentUser
            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        <ThumbsUp className="h-4 w-4" />
        <span>Like</span>
        <span>{likes.length}</span>
      </button>
      <div className="h-6 w-px bg-gray-200 dark:bg-gray-600" />
      <button
        type="button"
        onClick={onDislike}
        disabled={disabled}
        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
          dislikedByCurrentUser
            ? 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        <ThumbsDown className="h-4 w-4" />
        <span>Dislike</span>
        <span>{dislikes.length}</span>
      </button>
    </div>
  );
}
