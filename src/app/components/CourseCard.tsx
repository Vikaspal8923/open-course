import { Link } from 'react-router';
import { Course } from '../data/mockData';
import { BookOpen, User } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const courseId = (course as Course & { _id?: string })._id || course.id;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">{course.title}</h3>
          <p className="max-h-40 overflow-y-auto pr-2 text-sm text-gray-600 dark:text-gray-300">{course.description}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <User className="w-4 h-4" />
          <span>Contributed by {course.instructor?.name || course.creator?.name || 'Unknown'}</span>
        </div>
        <Link
          to={`/courses/${courseId}`}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          View Course
        </Link>
      </div>
    </div>
  );
}
