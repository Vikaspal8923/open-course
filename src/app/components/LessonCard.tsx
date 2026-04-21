import { Lesson } from '../data/mockData';
import { FileText, Play } from 'lucide-react';

interface LessonCardProps {
  lesson: Lesson;
  onClick?: () => void;
}

export function LessonCard({ lesson, onClick }: LessonCardProps) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40">
          {lesson.videoUrl ? (
            <Play className="w-5 h-5 text-blue-600" />
          ) : (
            <FileText className="w-5 h-5 text-blue-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Lesson {lesson.order || 1}</span>
            {lesson.videoUrl && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                Video
              </span>
            )}
          </div>
          <h4 className="mb-1 font-medium text-gray-900 dark:text-white">{lesson.title}</h4>
          <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
            {lesson.content || lesson.description || 'No description'}
          </p>
        </div>
      </div>
    </div>
  );
}
