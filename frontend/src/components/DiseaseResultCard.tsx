import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import type { Disease } from '../backend';

interface DiseaseResultCardProps {
  disease: Disease;
  matchedSymptoms: string[];
}

export default function DiseaseResultCard({ disease, matchedSymptoms }: DiseaseResultCardProps) {
  const getSeverityConfig = (severity: string) => {
    const normalized = severity.toLowerCase();
    if (normalized.includes('critical') || normalized.includes('severe')) {
      return {
        icon: AlertTriangle,
        color: 'bg-destructive text-destructive-foreground',
        label: 'Critical',
      };
    }
    if (normalized.includes('moderate')) {
      return {
        icon: Info,
        color: 'bg-chart-5 text-primary-foreground',
        label: 'Moderate',
      };
    }
    return {
      icon: CheckCircle2,
      color: 'bg-chart-2 text-primary-foreground',
      label: 'Mild',
    };
  };

  const severityConfig = getSeverityConfig(disease.severity);
  const SeverityIcon = severityConfig.icon;

  const matchCount = disease.symptoms.filter((s) => matchedSymptoms.includes(s)).length;
  const matchPercentage = Math.round((matchCount / disease.symptoms.length) * 100);

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow border-border/50">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{disease.name}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Badge className={severityConfig.color}>
                <SeverityIcon className="w-3 h-3 mr-1" />
                {severityConfig.label}
              </Badge>
              <span className="text-xs">
                {matchCount} of {disease.symptoms.length} symptoms match ({matchPercentage}%)
              </span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm text-foreground mb-2">Affected Species</h4>
          <div className="flex flex-wrap gap-2">
            {disease.affectedSpecies.map((species) => (
              <Badge key={species} variant="secondary" className="capitalize">
                {species}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-sm text-foreground mb-2">Common Symptoms</h4>
          <ul className="space-y-1">
            {disease.symptoms.map((symptom) => (
              <li
                key={symptom}
                className={`text-sm flex items-center gap-2 ${
                  matchedSymptoms.includes(symptom) ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}
              >
                {matchedSymptoms.includes(symptom) ? (
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-border inline-block" />
                )}
                {symptom}
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4 border-t border-border/50">
          <h4 className="font-semibold text-sm text-foreground mb-2">Treatment & Care Advice</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{disease.treatmentAdvice}</p>
        </div>
      </CardContent>
    </Card>
  );
}
