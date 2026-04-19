import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowRight, Sparkles, BookOpen, Clock3 } from 'lucide-react';
import { CourseCard } from '../components/CourseCard';
import { EmptyState } from '../components/EmptyState';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { api } from '../../services/api';
import { isAuthenticated } from '../utils/auth';

export function Home() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [recentlyUpdated, setRecentlyUpdated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const coursesResponse = await api.getCourses();
        const coursesArray = Array.isArray(coursesResponse) ? coursesResponse : coursesResponse?.courses || [];

        const latestCourses = [...coursesArray].sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
        );

        const latestUpdatedCourses = [...coursesArray].sort((a, b) => {
          const first = new Date(b.updatedAt || b.createdAt || 0).getTime();
          const second = new Date(a.updatedAt || a.createdAt || 0).getTime();
          return first - second;
        });

        setCourses(latestCourses.slice(0, 3));
        setRecentlyUpdated(latestUpdatedCourses.slice(0, 2));
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateCourseClick = () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    navigate('/courses?create=true');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6" />
              <span className="text-sm font-medium opacity-90">Welcome to Open Course</span>
            </div>
            <h1 className="text-5xl font-bold mb-6">Learn. Share. Improve together.</h1>
            <p className="text-xl opacity-90 mb-8">
              A collaborative learning platform where knowledge grows through shared lessons and evolving courses.
              Discover new topics, build thoughtful learning paths, and keep knowledge moving forward.
            </p>
            <div className="flex gap-4">
              <Link
                to="/courses"
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                Browse Courses
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={handleCreateCourseClick}
                className="px-6 py-3 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
              >
                Create Course
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Featured Courses</h2>
            <p className="text-gray-600">Explore the latest courses from the platform</p>
          </div>
          <Link
            to="/courses"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {loading ? (
            <LoadingSkeleton count={3} />
          ) : courses.length === 0 ? (
            <div className="col-span-full">
              <EmptyState
                icon={<BookOpen className="w-8 h-8 text-gray-400" />}
                title="No courses available yet"
                description="Be the first to create a course and share your knowledge with the community."
                action={{
                  label: 'Create First Course',
                  onClick: handleCreateCourseClick,
                }}
              />
            </div>
          ) : (
            courses.map((course) => <CourseCard key={course._id} course={course} />)
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Recently Updated</h2>
          <p className="text-gray-600 mb-6">See which courses were refreshed most recently</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <LoadingSkeleton count={2} variant="item" />
          ) : recentlyUpdated.length === 0 ? (
            <div className="col-span-full">
              <EmptyState
                icon={<Clock3 className="w-8 h-8 text-gray-400" />}
                title="No recent updates yet"
                description="Freshly updated courses will appear here as content improves over time."
                action={{
                  label: 'Browse Courses',
                  onClick: () => navigate('/courses'),
                }}
              />
            </div>
          ) : (
            recentlyUpdated.map((course) => (
              <div key={course._id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <Clock3 className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{course.title}</h3>
                <p className="mb-3 text-sm text-gray-600">
                  Instructor: {course.instructor?.name || 'Unknown'}
                </p>
                <p className="text-sm text-gray-500">
                  Last updated {new Date(course.updatedAt || course.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
