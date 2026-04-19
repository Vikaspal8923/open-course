import { useEffect, useState } from 'react';
import { BookOpen, FileText, PlayCircle, User } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { EmptyState } from '../components/EmptyState';
import { api } from '../../services/api';
import { matchesUserId } from '../utils/auth';

export function Profile() {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <p className="text-gray-600">Loading profile...</p>
        ) : !currentUser ? (
          <p className="text-gray-600">Unable to load profile. Please login again.</p>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{currentUser.name}</h1>
                    <Badge
                      variant={currentUser.role === 'instructor' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {currentUser.role}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Active member of the Open Course community, passionate about sharing knowledge and
                    collaborative learning.
                  </p>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-600">Courses Created</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{createdCourses.length}</p>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium text-gray-600">Lessons Created</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{createdLessons.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Courses Created</h2>
              <div className="space-y-4">
                {createdCourses.length === 0 ? (
                  <EmptyState
                    icon={<BookOpen className="w-8 h-8 text-gray-400" />}
                    title="No courses created yet"
                    description="Start sharing your knowledge with the community. Create your first course today!"
                    action={{
                      label: 'Create Course',
                      onClick: () => (window.location.href = '/courses'),
                    }}
                  />
                ) : (
                  createdCourses.map((course) => (
                    <div
                      key={course._id}
                      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                          <div className="flex gap-4 text-sm text-gray-500">
                            <span>{course.lessons?.length || 0} lessons</span>
                            <span>/</span>
                            <span>{course.enrolledCount || 0} students</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Lessons Created</h2>
              <div className="space-y-4">
                {createdLessons.length === 0 ? (
                  <EmptyState
                    icon={<FileText className="w-8 h-8 text-gray-400" />}
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
                      className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-6"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          {lesson.videoUrl ? (
                            <PlayCircle className="w-5 h-5 text-white" />
                          ) : (
                            <FileText className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">{lesson.title}</h3>
                          <p className="text-sm text-gray-700 mb-2">
                            Lesson {lesson.order || 1} / {lesson.videoUrl ? 'Has video' : 'Text only'}
                          </p>
                          <span className="text-xs text-gray-600">
                            {new Date(lesson.createdAt).toLocaleDateString()}
                          </span>
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
