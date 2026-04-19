import { Material } from '../data/mockData';
import { FileText, Link as LinkIcon } from 'lucide-react';
import { Badge } from './ui/badge';

interface MaterialCardProps {
  material: Material;
}

export function MaterialCard({ material }: MaterialCardProps) {
  const badgeVariant = {
    Notes: 'default' as const,
    Paper: 'secondary' as const,
    Resource: 'outline' as const,
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 mb-1">{material.title}</h4>
            <Badge variant={badgeVariant[material.type]}>{material.type}</Badge>
          </div>
        </div>
        <a
          href={material.link}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
        >
          <LinkIcon className="w-4 h-4" />
          <span>Open</span>
        </a>
      </div>
    </div>
  );
}
