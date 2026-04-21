import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { BookOpen, FileText, PlayCircle, User } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { EmptyState } from '../components/EmptyState';
import { api } from '../../services/api';
import { matchesUserId } from '../utils/auth';

export function Profile() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [createdCourses, setCreatedCourses] = useState<any[]>([]);
  const [createdLessons, setCreatedLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const userResponse = await api.getCurrentUser();
        const user = userResponse?.user || userResponse;
        setCurrentUser(user);

        if (user && user._id) {
          const [coursesResponse, lessonsResponse] = await Promise.all([
            api.getInstructorCourses(user._id),
            api.getLessons(),
          ]);

          const courses = Array.isArray(coursesResponse)
            ? coursesResponse
            : coursesResponse?.courses || [];
          const allLessons = Array.isArray(lessonsResponse)
            ? lessonsResponse
            : lessonsResponse?.lessons || lessonsResponse?.data || [];
          const userLessons = allLessons.filter((lesson: any) =>
            matchesUserId(lesson.createdBy, user._id),
          );

          setCreatedCourses(courses);
          setCreatedLessons(userLessons);
        }
      } catch (err) {
        console.error('Failed to load profile data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleDeleteLesson = async (lessonId: string) => {
    const confirmed = window.confirm('Delete this lesson? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    try {
      await api.deleteLesson(lessonId);
      setCreatedLessons((currentLessons) => currentLessons.filter((lesson) => lesson._id !== lessonId));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete lesson');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <p className="text-gray-600 dark:text-gray-300">Loading profile...</p>
        ) : !currentUser ? (
          <p className="text-gray-600 dark:text-gray-300">Unable to load profile. Please login again.</p>
        ) : (
          <>
            <div className="mb-8 rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{currentUser.name}</h1>
                    <Badge
                      variant={currentUser.role === 'instructor' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {currentUser.role}
                    </Badge>
                  </div>
                  <p className="mb-6 text-gray-600 dark:text-gray-300">
                    Active member of the Open Course community, passionate about sharing knowledge and
                    collaborative learning.
                  </p>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/40">
                      <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Courses Created</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{createdCourses.length}</p>
                    </div>

                    <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-950/30">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Lessons Created</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{createdLessons.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Courses Created</h2>
              <div className="space-y-4">
                {createdCourses.length === 0 ? (
                  <EmptyState
                    icon={<BookOpen className="w-8 h-8 text-gray-400 dark:text-gray-500" />}
                    title="No courses created yet"
                    description="Start sharing your knowledge with the community. Create your first course today!"
                    action={{
                      label: 'Create Course',
                      onClick: () => (window.location.href = '/courses'),
                    }}
                  />
                ) : (
                  createdCourses.map((course) => (
                    <button
                      key={course._id}
                      type="button"
                      onClick={() => navigate(`/courses/${course._id}`)}
                      className="block w-full rounded-lg border border-gray-200 bg-white p-6 text-left transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">{course.title}</h3>
                          <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">{course.description}</p>
                          <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>{course.lessons?.length || 0} lessons</span>
                            <span>/</span>
                            <span>{course.enrolledCount || 0} students</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Lessons Created</h2>
              <div className="space-y-4">
                {createdLessons.length === 0 ? (
                  <EmptyState
                    icon={<FileText className="w-8 h-8 text-gray-400 dark:text-gray-500" />}
                    title="No lessons created yet"
                    description="Once you start creating lessons, they will appear here with their order and content type."
                    action={{
                      label: 'Browse Courses',
                      onClick: () => (window.location.href = '/courses'),
                    }}
                  />
                ) : (
                  createdLessons.map((lesson) => (
                    <div
                      key={lesson._id}
                      className="rounded-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 p-6 dark:border-purple-900 dark:from-gray-900 dark:to-blue-950/40"
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => navigate(`/courses/${lesson.course?._id || lesson.course}/lessons/${lesson._id}`)}
                          className="flex flex-1 items-start gap-3 text-left"
                        >
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-purple-600">
                            {lesson.videoUrl ? (
                              <PlayCircle className="w-5 h-5 text-white" />
                            ) : (
                              <FileText className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">{lesson.title}</h3>
                            <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                              Lesson {lesson.order || 1} / {lesson.videoUrl ? 'Has video' : 'Text only'}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {lesson.course?.title ? `${lesson.course.title} • ` : ''}
                              {new Date(lesson.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </button>
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => navigate(`/courses/${lesson.course?._id || lesson.course}/lessons/${lesson._id}`)}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200 dark:hover:bg-gray-800"
                          >
                            Open
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteLesson(lesson._id)}
                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/70"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
