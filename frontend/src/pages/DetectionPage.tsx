import { Card } from '@/components/ui/card';
import AnimalSymptomForm from '../components/AnimalSymptomForm';
import { Stethoscope, Shield, Clock, Heart } from 'lucide-react';

export default function DetectionPage() {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl">
            <Stethoscope className="w-10 h-10 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-3">Animal Disease Detection</h1>
        <p className="text-lg text-muted-foreground">
          Get instant AI-powered insights into your animal's health. Our system analyzes symptoms and provides detailed
          disease information with treatment recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <Card className="p-4 text-center border-border/50">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">Instant Analysis</h3>
          <p className="text-sm text-muted-foreground">Get results in seconds</p>
        </Card>
        <Card className="p-4 text-center border-border/50">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">Accurate Detection</h3>
          <p className="text-sm text-muted-foreground">AI-powered diagnosis</p>
        </Card>
        <Card className="p-4 text-center border-border/50">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Heart className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">Care Advice</h3>
          <p className="text-sm text-muted-foreground">Treatment recommendations</p>
        </Card>
      </div>

      <AnimalSymptomForm />

      <div className="max-w-2xl mx-auto">
        <Card className="p-6 bg-muted/30 border-border/50">
          <h3 className="font-semibold text-foreground mb-3">Important Notice</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This tool provides preliminary health insights and should not replace professional veterinary care. Always
            consult with a licensed veterinarian for accurate diagnosis and treatment of your animal's health concerns.
          </p>
        </Card>
      </div>
    </div>
  );
}
