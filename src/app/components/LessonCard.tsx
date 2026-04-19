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
      className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
          {lesson.videoUrl ? (
            <Play className="w-5 h-5 text-blue-600" />
          ) : (
            <FileText className="w-5 h-5 text-blue-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-gray-500">Lesson {lesson.order || 1}</span>
            {lesson.videoUrl && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                Video
              </span>
            )}
          </div>
          <h4 className="font-medium text-gray-900 mb-1">{lesson.title}</h4>
          <p className="text-sm text-gray-600 line-clamp-2">
            {lesson.content || lesson.description || 'No description'}
          </p>
        </div>
      </div>
    </div>
  );
}
