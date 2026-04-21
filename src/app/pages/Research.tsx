import { useState, useEffect } from 'react';
import { ThreadCard } from '../components/ThreadCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Plus, FlaskConical } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { api } from '../../services/api';

export function Research() {
  const [open, setOpen] = useState(false);
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'Discussion',
    tags: [] as string[],
  });

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const response = await api.getThreads({ category: 'Discussion' });
      const threadsArray = Array.isArray(response) ? response : response?.threads || response?.data || [];
      setThreads(threadsArray);
    } catch (error) {
      console.error('Failed to fetch threads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createThread(formData);
      setFormData({ title: '', description: '', content: '', category: 'Discussion', tags: [] });
      setOpen(false);
      fetchThreads();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create thread');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center">
              <FlaskConical className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="mb-1 text-3xl font-bold text-gray-900 dark:text-white">Research Discussions</h1>
              <p className="text-gray-600 dark:text-gray-300">Collaborate on research topics and ideas</p>
            </div>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-pink-700 transition-all flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create Thread
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Research Thread</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateThread} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="thread-title">Thread Title</Label>
                  <Input
                    id="thread-title"
                    placeholder="e.g., Impact of AI on Development"
                    className="mt-1.5"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="thread-description">Description</Label>
                  <Textarea
                    id="thread-description"
                    placeholder="Describe the topic you want to discuss..."
                    className="mt-1.5"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="thread-content">Full Discussion</Label>
                  <Textarea
                    id="thread-content"
                    placeholder="Detailed content..."
                    className="mt-1.5"
                    rows={4}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-pink-700 transition-all"
                >
                  Create Thread
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              <LoadingSkeleton count={3} variant="item" />
            </div>
          ) : threads.length > 0 ? (
            threads.map((thread) => (
              <ThreadCard key={thread._id} thread={thread} />
            ))
          ) : (
            <EmptyState
              icon={<FlaskConical className="w-8 h-8 text-gray-400" />}
              title="No research discussions yet"
              description="Start a discussion about research topics and ideas. Collaborate with the community to explore innovative concepts."
              action={{
                label: 'Create First Thread',
                onClick: () => setOpen(true)
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
