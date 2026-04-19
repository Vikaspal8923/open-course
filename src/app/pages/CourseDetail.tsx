import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, BookOpen, PencilLine, Plus, User } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { LessonEditor } from '../components/LessonEditor';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { api } from '../../services/api';
import { getStoredUser, matchesUserId } from '../utils/auth';

export function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const currentUser = getStoredUser();
  const currentUserId = currentUser?._id || currentUser?.id || null;
  const isLoggedIn = Boolean(currentUserId);
  const [lessonData, setLessonData] = useState({
    title: '',
    description: '',
    content: '',
    videoUrl: '',
  });

  useEffect(() => {
    if (id) {
      fetchCourseData();
    }
  }, [id]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const courseResponse = await api.getCourse(id!);
      const courseData = courseResponse?.course || courseResponse;
      setCourse(courseData);

      const lessonsResponse = await api.getLessonsByCourse(id!);
      const lessonsArray = Array.isArray(lessonsResponse)
        ? lessonsResponse
        : lessonsResponse?.lessons || lessonsResponse?.data || [];
      setLessons(lessonsArray);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const resetLessonForm = () => {
    setEditingLessonId(null);
    setLessonData({
      title: '',
      description: '',
      content: '',
      videoUrl: '',
    });
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const existingLesson = lessons.find((lesson) => lesson._id === editingLessonId);
      const payload = {
        ...lessonData,
        courseId: id,
        order: existingLesson?.order || lessons.length + 1,
      };

      if (editingLessonId) {
        await api.updateLesson(editingLessonId, payload);
      } else {
        await api.createLesson(payload);
      }

      resetLessonForm();
      setLessonDialogOpen(false);
      fetchCourseData();
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          (editingLessonId ? 'Failed to update lesson' : 'Failed to create lesson'),
      );
    }
  };

  const canEditLesson = (lesson: any) => matchesUserId(lesson.createdBy, currentUserId);

  const openEditLesson = (lesson: any) => {
    setEditingLessonId(lesson._id);
    setLessonData({
      title: lesson.title || '',
      description: lesson.description || '',
      content: lesson.content || '',
      videoUrl: lesson.videoUrl || '',
    });
    setLessonDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h2>
          <Link to="/courses" className="text-blue-600 hover:text-blue-700">
            Back to courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Courses</span>
        </Link>

        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{course.title}</h1>
              <p className="text-lg text-gray-600 mb-4">{course.description}</p>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm">
                    Created by <span className="font-medium text-gray-900">{course.instructor?.name}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Lessons</h2>
                <p className="text-sm text-gray-600">{lessons.length} lessons available</p>
              </div>
            </div>

            {isLoggedIn && (
              <Dialog
                open={lessonDialogOpen}
                onOpenChange={(nextOpen) => {
                  setLessonDialogOpen(nextOpen);
                  if (!nextOpen) {
                    resetLessonForm();
                  }
                }}
              >
                <DialogTrigger asChild>
                  <button
                    onClick={resetLessonForm}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Lesson
                  </button>
                </DialogTrigger>
                <DialogContent className="!w-[96vw] !max-w-none sm:!w-[92vw]">
                  <DialogHeader>
                    <DialogTitle>{editingLessonId ? 'Edit Lesson Content' : 'Add New Lesson'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSaveLesson} className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="lesson-title">Lesson Title</Label>
                      <Input
                        id="lesson-title"
                        placeholder="e.g., Introduction to Components"
                        className="mt-1.5"
                        value={lessonData.title}
                        onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lesson-video">YouTube Video URL (optional)</Label>
                      <Input
                        id="lesson-video"
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="mt-1.5"
                        value={lessonData.videoUrl}
                        onChange={(e) => setLessonData({ ...lessonData, videoUrl: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lesson-description">Description</Label>
                      <Input
                        id="lesson-description"
                        placeholder="Brief description"
                        className="mt-1.5"
                        value={lessonData.description}
                        onChange={(e) => setLessonData({ ...lessonData, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lesson-content">Content</Label>
                      <div className="mt-1.5">
                        <LessonEditor
                          value={lessonData.content}
                          onChange={(value) => setLessonData({ ...lessonData, content: value })}
                        />
                      </div>
                    </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      {editingLessonId ? 'Save Lesson Changes' : 'Add Lesson'}
                    </button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="space-y-3">
            {lessons.length > 0 ? (
              lessons.map((lesson) => (
                <div
                  key={lesson._id}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <button
                      type="button"
                      className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"
                      onClick={() => navigate(`/courses/${id}/lessons/${lesson._id || lesson.id}`)}
                    >
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </button>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <button
                          type="button"
                          className="text-left"
                          onClick={() => navigate(`/courses/${id}/lessons/${lesson._id || lesson.id}`)}
                        >
                          <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                          <p className="mt-2 text-xs text-gray-500">
                            Contributed by {lesson.createdBy?.name || 'Unknown'}
                          </p>
                        </button>
                        {canEditLesson(lesson) && (
                          <button
                            type="button"
                            onClick={() => openEditLesson(lesson)}
                            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                          >
                            <PencilLine className="h-4 w-4" />
                            Edit lesson
                          </button>
                        )}
                      </div>
                      {lesson.videoUrl && <p className="mt-2 text-xs text-green-600">Has video content</p>}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                icon={<BookOpen className="w-8 h-8 text-gray-400" />}
                title="No lessons yet"
                description="Start building this course by creating your first lesson. Share knowledge and help others learn."
                action={
                  isLoggedIn
                    ? {
                        label: 'Add First Lesson',
                        onClick: () => setLessonDialogOpen(true),
                      }
                    : undefined
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
