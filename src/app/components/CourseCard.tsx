import { Link } from 'react-router';
import { Course } from '../data/mockData';
import { BookOpen, User } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const courseId = (course as Course & { _id?: string })._id || course.id;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
          <p className="max-h-40 overflow-y-auto pr-2 text-sm text-gray-600">{course.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <User className="w-4 h-4" />
          <span>Contributed by {course.instructor?.name || course.creator?.name || 'Unknown'}</span>
        </div>
        <Link
          to={`/courses/${courseId}`}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Course
        </Link>
      </div>
    </div>
  );
}
