import { Interview } from '../data/mockData';
import { Briefcase, User, Calendar } from 'lucide-react';
interface InterviewCardProps {
  interview: Interview;
}

export function InterviewCard({ interview }: InterviewCardProps) {
  const difficultyColor = {
    Easy: 'bg-green-100 text-green-700 border-green-300',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    Hard: 'bg-red-100 text-red-700 border-red-300',
  };
  const difficulty = interview.difficulty || 'Medium';
  const authorName =
    interview.author?.name ||
    interview.interviewee?.name ||
    'Anonymous';

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{interview.company}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-1 rounded-full border ${difficultyColor[difficulty]}`}>
                {difficulty}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Questions Asked:</h4>
        <ul className="space-y-1">
          {(interview.questionsAsked || interview.questions || []).map((question, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">•</span>
              <span>{typeof question === 'string' ? question : question?.question || question}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-1">Tips:</h4>
        <p className="text-sm text-gray-600">{interview.tipsAndAdvice || interview.tips || 'No tips available'}</p>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
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
