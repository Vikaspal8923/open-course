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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {loading ? 'Loading...' : 'Thread not found'}
          </h2>
          <Link to="/research" className="text-orange-600 hover:text-orange-700">
            Back to research
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          to="/research"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Research</span>
        </Link>

        {/* Thread Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{thread.title}</h1>
              <p className="text-lg text-gray-600 mb-4">{thread.description}</p>

              {thread.link && (
                <a
                  href={thread.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Reference</span>
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-100">
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

        {/* Replies */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Discussion</h2>
          <div className="space-y-4">
            {thread.comments && thread.comments.length > 0 ? (
              thread.comments.map((reply: any) => (
                <div key={reply._id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{reply.author?.name || 'Anonymous'}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{reply.content}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No replies yet. Start the discussion!</p>
              </div>
            )}
          </div>
        </div>

        {/* Reply Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Add Your Reply</h3>
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
