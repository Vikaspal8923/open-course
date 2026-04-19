import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, FileText, Play } from 'lucide-react';
import { api } from '../../services/api';
import { getYouTubeEmbedUrl } from '../utils/youtube';

export function LessonDetail() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const courseResponse = await api.getCourse(courseId!);
        const courseData = courseResponse?.course || courseResponse;
        setCourse(courseData);

        const lessonsResponse = await api.getLessonsByCourse(courseId!);
        const lessonsArray = Array.isArray(lessonsResponse)
          ? lessonsResponse
          : lessonsResponse?.lessons || lessonsResponse?.data || [];
        setLessons(lessonsArray);

        const lessonResponse = await api.getLesson(lessonId!);
        const singleLesson =
          lessonResponse?.lesson ||
          lessonResponse?.data ||
          lessonsArray.find((entry: any) => entry._id === lessonId);
        setLesson(singleLesson);
      } catch (err) {
        console.error('Failed to load lesson', err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId && lessonId) {
      fetchData();
    }
  }, [courseId, lessonId]);

  if (!course || !lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {loading ? 'Loading...' : 'Lesson not found'}
          </h2>
          <Link to="/courses" className="text-blue-600 hover:text-blue-700">
            Back to courses
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = lessons.findIndex((entry) => entry._id === lessonId);
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
  const embedUrl = getYouTubeEmbedUrl(lesson.videoUrl);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate(`/courses/${courseId}`)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Course</span>
        </button>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-blue-600">Lesson {lesson.order}</span>
            <span className="text-gray-400">/</span>
            <span className="text-sm text-gray-600">{course.title}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
        </div>

        {embedUrl && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Play className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Video Lesson</h2>
            </div>
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={embedUrl}
                title={lesson.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Lesson Content</h2>
          </div>
          <div
            className="lesson-rich-content max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: lesson.content || '<p>No lesson content available.</p>' }}
          />
          {!embedUrl && lesson.videoUrl && (
            <p className="mt-4 text-sm text-amber-700">
              This video URL could not be embedded automatically.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          {previousLesson ? (
            <button
              onClick={() => navigate(`/courses/${courseId}/lessons/${previousLesson._id}`)}
              className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <div className="text-left">
                <div className="text-xs text-gray-500">Previous</div>
                <div>{previousLesson.title}</div>
              </div>
            </button>
          ) : (
            <div />
          )}

          {nextLesson ? (
            <button
              onClick={() => navigate(`/courses/${courseId}/lessons/${nextLesson._id}`)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <div className="text-right">
                <div className="text-xs opacity-90">Next</div>
                <div>{nextLesson.title}</div>
              </div>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          ) : (
            <button
              onClick={() => navigate(`/courses/${courseId}`)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Complete Course
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
