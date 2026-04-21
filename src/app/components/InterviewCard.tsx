import { Interview } from '../data/mockData';
import { Briefcase, User, Calendar } from 'lucide-react';

interface InterviewCardProps {
  interview: Interview;
}

export function InterviewCard({ interview }: InterviewCardProps) {
  const difficultyColor = {
    Easy: 'border-green-300 bg-green-100 text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300',
    Medium:
      'border-yellow-300 bg-yellow-100 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950/40 dark:text-yellow-300',
    Hard: 'border-red-300 bg-red-100 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300',
  };
  const difficulty = interview.difficulty || 'Medium';
  const authorName = interview.author?.name || interview.interviewee?.name || 'Anonymous';

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{interview.company}</h3>
            <div className="mt-1 flex items-center gap-2">
              <span className={`rounded-full border px-2 py-1 text-xs ${difficultyColor[difficulty]}`}>
                {difficulty}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Questions Asked:</h4>
        <ul className="space-y-1">
          {(interview.questionsAsked || interview.questions || []).map((question, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span className="mt-0.5 text-gray-400 dark:text-gray-500">&bull;</span>
              <span>{typeof question === 'string' ? question : question?.question || question}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-950/30">
        <h4 className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">Tips:</h4>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {interview.tipsAndAdvice || interview.tips || 'No tips available'}
        </p>
      </div>

      <div className="flex items-center gap-4 border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          <span>{authorName}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{new Date(interview.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
