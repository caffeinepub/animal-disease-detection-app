import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCheckSymptoms } from '../hooks/useQueries';
import { useDetectionHistory } from '../hooks/useDetectionHistory';
import CameraCapture from './CameraCapture';

const SPECIES_OPTIONS = [
  { value: 'dog', label: 'Dog' },
  { value: 'cat', label: 'Cat' },
  { value: 'cattle', label: 'Cattle' },
  { value: 'poultry', label: 'Poultry' },
  { value: 'horse', label: 'Horse' },
  { value: 'sheep', label: 'Sheep' },
  { value: 'goat', label: 'Goat' },
];

export default function AnimalSymptomForm() {
  const navigate = useNavigate();
  const { addDetection } = useDetectionHistory();
  const checkSymptomsMutation = useCheckSymptoms();

  const [formData, setFormData] = useState({
    species: '',
    breed: '',
    age: '',
    symptoms: '',
  });

  const [capturedPhoto, setCapturedPhoto] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.species) newErrors.species = 'Please select an animal species';
    if (!formData.breed.trim()) newErrors.breed = 'Please enter the breed';
    if (!formData.age || parseInt(formData.age) < 0) newErrors.age = 'Please enter a valid age';
    if (!formData.symptoms.trim()) newErrors.symptoms = 'Please describe the symptoms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const symptomsArray = formData.symptoms
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    try {
      const result = await checkSymptomsMutation.mutateAsync({
        species: formData.species,
        symptoms: symptomsArray,
      });

      const detectionId = crypto.randomUUID();
      
      await addDetection({
        species: formData.species,
        breed: formData.breed,
        age: parseInt(formData.age),
        symptoms: symptomsArray,
        photo: capturedPhoto || undefined,
        results: result,
      });

      navigate({
        to: '/results',
        search: { id: detectionId },
      });
    } catch (error) {
      console.error('Detection failed:', error);
    }
  };

  const handlePhotoCapture = (photoDataUrl: string) => {
    setCapturedPhoto(photoDataUrl);
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-lg border-border/50">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Animal Health Assessment</CardTitle>
        <CardDescription>
          Enter your animal's details and symptoms to receive AI-powered disease detection and care recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="species">Animal Species *</Label>
            <Select value={formData.species} onValueChange={(value) => setFormData({ ...formData, species: value })}>
              <SelectTrigger id="species" className={errors.species ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select species" />
              </SelectTrigger>
              <SelectContent>
                {SPECIES_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.species && <p className="text-sm text-destructive">{errors.species}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="breed">Breed *</Label>
              <Input
                id="breed"
                placeholder="e.g., Labrador, Holstein"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                className={errors.breed ? 'border-destructive' : ''}
              />
              {errors.breed && <p className="text-sm text-destructive">{errors.breed}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age (years) *</Label>
              <Input
                id="age"
                type="number"
                min="0"
                placeholder="e.g., 5"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className={errors.age ? 'border-destructive' : ''}
              />
              {errors.age && <p className="text-sm text-destructive">{errors.age}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="symptoms">Symptoms *</Label>
            <Textarea
              id="symptoms"
              placeholder="Describe the symptoms (separate multiple symptoms with commas or new lines)&#10;e.g., lethargy, loss of appetite, coughing"
              value={formData.symptoms}
              onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
              className={`min-h-32 ${errors.symptoms ? 'border-destructive' : ''}`}
            />
            {errors.symptoms && <p className="text-sm text-destructive">{errors.symptoms}</p>}
            <p className="text-xs text-muted-foreground">
              Be as specific as possible. Include behavioral changes, physical symptoms, and duration.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Animal Photo (Optional)</Label>
            <CameraCapture onCapture={handlePhotoCapture} capturedPhoto={capturedPhoto} />
            <p className="text-xs text-muted-foreground">
              Adding a photo helps document the assessment but is not required for analysis.
            </p>
          </div>

          {checkSymptomsMutation.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to analyze symptoms. Please try again or contact support if the issue persists.
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={checkSymptomsMutation.isPending}>
            {checkSymptomsMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Symptoms...
              </>
            ) : (
              'Analyze Symptoms'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
