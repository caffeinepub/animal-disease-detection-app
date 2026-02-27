import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Stethoscope, Image as ImageIcon } from 'lucide-react';
import type { DetectionRecord } from '../types/detection';

interface DetectionHistoryItemProps {
  record: DetectionRecord;
  onClick: () => void;
}

export default function DetectionHistoryItem({ record, onClick }: DetectionHistoryItemProps) {
  const date = new Date(record.timestamp);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const topDisease = record.results.potentialDiseases[0];

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50 border-border/50"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {record.photo ? (
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-border/50">
              <img 
                src={record.photo} 
                alt={`${record.species} - ${record.breed}`}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-8 h-8 text-primary" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="font-semibold text-foreground capitalize">
                  {record.species} - {record.breed}
                </h3>
                <p className="text-sm text-muted-foreground">Age: {record.age} years</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {formattedDate}
                </div>
                <p className="text-xs text-muted-foreground">{formattedTime}</p>
              </div>
            </div>
            {topDisease ? (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {topDisease.name}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {record.results.potentialDiseases.length} potential disease(s)
                </span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No diseases detected</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
