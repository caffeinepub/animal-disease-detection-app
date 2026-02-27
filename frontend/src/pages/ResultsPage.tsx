import { useNavigate, useSearch } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';
import DiseaseResultCard from '../components/DiseaseResultCard';
import { useDetectionHistory } from '../hooks/useDetectionHistory';
import { useEffect, useState } from 'react';
import type { DetectionRecord } from '../types/detection';

export default function ResultsPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { id?: string };
  const { history } = useDetectionHistory();
  const [record, setRecord] = useState<DetectionRecord | null>(null);

  useEffect(() => {
    if (search.id) {
      const found = history.find((r) => r.id === search.id);
      if (found) {
        setRecord(found);
      }
    } else if (history.length > 0) {
      // Show most recent if no ID specified
      setRecord(history[0]);
    }
  }, [search.id, history]);

  if (!record) {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No detection results found. Please perform a new detection.
            <Button variant="link" onClick={() => navigate({ to: '/detect' })} className="ml-2">
              Go to Detection
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { species, breed, age, symptoms, results, photo } = record;
  const hasDiseases = results.potentialDiseases.length > 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate({ to: '/detect' })}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Detection Results</h1>
          <p className="text-muted-foreground">
            Analysis for {breed} ({species}), {age} years old
          </p>
        </div>
      </div>

      {photo && (
        <Card className="shadow-md border-border/50 overflow-hidden">
          <CardHeader>
            <CardTitle>Animal Photo</CardTitle>
            <CardDescription>Photo captured during assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg overflow-hidden border border-border/30">
              <img 
                src={photo} 
                alt={`${breed} (${species})`}
                className="w-full max-h-96 object-contain bg-muted"
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-md border-border/50">
        <CardHeader>
          <CardTitle>Reported Symptoms</CardTitle>
          <CardDescription>Symptoms provided for analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {symptoms.map((symptom, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {symptom}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {results.matchedSymptoms.length > 0 && (
        <Card className="shadow-md border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Matched Symptoms
            </CardTitle>
            <CardDescription>Symptoms that match known disease patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {results.matchedSymptoms.map((symptom, index) => (
                <Badge key={index} className="text-sm">
                  {symptom}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-4">
          {hasDiseases ? 'Potential Diseases' : 'No Diseases Detected'}
        </h2>

        {hasDiseases ? (
          <div className="space-y-4">
            {results.potentialDiseases.map((disease, index) => (
              <DiseaseResultCard key={index} disease={disease} matchedSymptoms={results.matchedSymptoms} />
            ))}
          </div>
        ) : (
          <Alert className="border-border/50">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <AlertDescription>
              <p className="font-medium text-foreground mb-2">No matching diseases found</p>
              <p className="text-sm text-muted-foreground">
                Based on the symptoms provided, we couldn't identify any specific diseases in our database. However, if
                your animal is showing concerning symptoms, we strongly recommend consulting with a veterinarian for a
                professional evaluation.
              </p>
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Card className="bg-muted/30 border-border/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Professional Veterinary Care Recommended</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This AI-powered analysis is for informational purposes only and should not replace professional
                veterinary diagnosis and treatment. Please consult with a licensed veterinarian for proper medical care,
                especially if symptoms are severe or worsening.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={() => navigate({ to: '/detect' })} size="lg" className="flex-1">
          Check Another Animal
        </Button>
        <Button onClick={() => navigate({ to: '/' })} variant="outline" size="lg" className="flex-1">
          View Dashboard
        </Button>
      </div>
    </div>
  );
}
