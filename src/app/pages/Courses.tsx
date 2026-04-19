import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Plus, BookOpen, Search } from 'lucide-react';
import { CourseCard } from '../components/CourseCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { api } from '../../services/api';
import { isAuthenticated } from '../utils/auth';

export function Courses() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
  });

  const sortCourses = (items: any[]) => {
    const sorted = [...items];

    if (sortBy === 'oldest') {
      return sorted.sort(
        (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime(),
      );
    }

    if (sortBy === 'title') {
      return sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return sorted.sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
    );
  };

  const fetchCourses = async (search = searchQuery) => {
    try {
      setLoading(true);
      const response = await api.getCourses(search ? { search } : undefined);
      const coursesArray = Array.isArray(response) ? response : response?.courses || response?.data || [];
      setCourses(sortCourses(coursesArray));
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, [location.pathname]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchCourses(searchQuery);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchQuery, sortBy]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('create') === 'true' && loggedIn) {
      setOpen(true);
    }
  }, [location.search, loggedIn]);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createCourse(formData);
      setFormData({ title: '', description: '', category: '' });
      setOpen(false);
      fetchCourses('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create course');
    }
  };

  const handleCourseAction = () => {
    if (!loggedIn) {
      navigate('/login');
      return;
    }

    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Courses</h1>
            <p className="text-gray-600">Browse and discover courses from our community</p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            {loggedIn ? (
              <DialogTrigger asChild>
                <button
                  onClick={handleCourseAction}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Course
                </button>
              </DialogTrigger>
            ) : (
              <button
                onClick={handleCourseAction}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Login to Create Course
              </button>
            )}
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateCourse} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Introduction to HCI Design"
                    className="mt-1.5"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what students will learn..."
                    className="mt-1.5"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Field</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger id="category" className="mt-1.5">
                      <SelectValue placeholder="Select a field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Development">Development</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="Art">Art</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Create Course
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses by title or description"
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="title">Title A to Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LoadingSkeleton count={6} />
          </div>
        ) : courses.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="w-8 h-8 text-gray-400" />}
            title="No courses available"
            description="Start creating your first course to share knowledge with the community. It's a great way to contribute and help others learn."
            action={{
              label: loggedIn ? 'Create Your First Course' : 'Login to Create Course',
              onClick: handleCourseAction,
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
