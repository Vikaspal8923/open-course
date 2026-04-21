import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, MessageSquare, User, Calendar, ExternalLink, Send } from 'lucide-react';
import { Textarea } from '../components/ui/textarea';
import { api } from '../../services/api';

export function ThreadDetail() {
  const { id } = useParams();
  const [thread, setThread] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        setLoading(true);
        const response = await api.getThread(id!);
        const threadData = response?.thread || response;
        setThread(threadData);
      } catch (err) {
        console.error('Failed to load thread', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchThread();
    }
  }, [id]);

  const handleAddComment = async () => {
    if (!replyText.trim()) return;
    
    try {
      setSubmitting(true);
      await api.addComment(id!, replyText);
      setReplyText('');
      // Refresh thread to show new comment
      const response = await api.getThread(id!);
      const threadData = response?.thread || response;
      setThread(threadData);
    } catch (err) {
      console.error('Failed to add comment', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!thread) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center dark:bg-gray-950">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            {loading ? 'Loading...' : 'Thread not found'}
          </h2>
          <Link to="/research" className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300">
            Back to research
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/research"
          className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Research</span>
        </Link>

        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">{thread.title}</h1>
              <p className="mb-4 text-lg text-gray-600 dark:text-gray-300">{thread.description}</p>

              {thread.link && (
                <a
                  href={thread.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Reference</span>
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 border-t border-gray-100 pt-4 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{thread.author?.name || 'Anonymous'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>{thread.comments?.length || 0} replies</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Discussion</h2>
          <div className="space-y-4">
            {thread.comments && thread.comments.length > 0 ? (
              thread.comments.map((reply: any) => (
                <div key={reply._id} className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                  <div className="mb-3 flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">{reply.author?.name || 'Anonymous'}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-200">{reply.content}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-800 dark:bg-gray-900">
                <MessageSquare className="mx-auto mb-3 h-12 w-12 text-gray-400 dark:text-gray-500" />
                <p className="text-gray-600 dark:text-gray-300">No replies yet. Start the discussion!</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Add Your Reply</h3>
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Share your thoughts..."
            rows={4}
            className="mb-4"
            disabled={submitting}
          />
          <button 
            onClick={handleAddComment}
            disabled={submitting || !replyText.trim()}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-pink-700 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Posting...' : 'Post Reply'}
          </button>
        </div>
      </div>
    </div>
  );
}
