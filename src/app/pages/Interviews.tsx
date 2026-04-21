import { useState, useEffect } from 'react';
import { InterviewCard } from '../components/InterviewCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Plus, Briefcase } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { api } from '../../services/api';

export function Interviews() {
  const [open, setOpen] = useState(false);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    questions: '',
    tips: '',
    difficulty: 'Medium'
  });

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const response = await api.getInterviews();
      const interviewsArray = Array.isArray(response) ? response : response?.interviews || [];
      setInterviews(interviewsArray);
    } catch (err) {
      setError('Failed to load interviews');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.createInterview({
        company: formData.company,
        questionsAsked: formData.questions.split('\n').filter(q => q.trim()),
        tipsAndAdvice: formData.tips,
        difficulty: formData.difficulty
      });
      setFormData({ company: '', questions: '', tips: '', difficulty: 'Medium' });
      setOpen(false);
      fetchInterviews();
    } catch (err) {
      setError('Failed to share interview');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="mb-1 text-3xl font-bold text-gray-900 dark:text-white">Interview Experiences</h1>
              <p className="text-gray-600 dark:text-gray-300">Share and learn from real interview experiences</p>
            </div>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Share Experience
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Share Interview Experience</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input 
                    id="company" 
                    placeholder="e.g., Google" 
                    className="mt-1.5"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="questions">Questions (one per line)</Label>
                  <Textarea
                    id="questions"
                    placeholder="Design a URL shortener&#10;Implement LRU Cache"
                    className="mt-1.5"
                    rows={4}
                    value={formData.questions}
                    onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tips">Tips & Advice</Label>
                  <Textarea
                    id="tips"
                    placeholder="Share your advice for candidates..."
                    className="mt-1.5"
                    rows={3}
                    value={formData.tips}
                    onChange={(e) => setFormData({ ...formData, tips: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <select
                    id="difficulty"
                    className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
                {error && <p className="text-sm text-red-600 dark:text-red-300">{error}</p>}
                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Sharing...' : 'Share Experience'}
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <LoadingSkeleton count={4} />
          ) : interviews.length === 0 ? (
            <div className="col-span-full">
              <EmptyState
                icon={<Briefcase className="w-8 h-8 text-gray-400" />}
                title="No interview experiences yet"
                description="Share your real interview experiences and help others prepare. Your insights can make a difference!"
                action={{
                  label: 'Share First Experience',
                  onClick: () => setOpen(true)
                }}
              />
            </div>
          ) : (
            interviews.map((interview) => (
              <InterviewCard key={interview._id} interview={interview} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
