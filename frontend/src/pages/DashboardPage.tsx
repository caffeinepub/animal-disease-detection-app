import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, History } from 'lucide-react';
import DashboardStats from '../components/DashboardStats';
import DetectionHistoryItem from '../components/DetectionHistoryItem';
import { useDetectionHistory } from '../hooks/useDetectionHistory';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { history, getStats } = useDetectionHistory();
  const stats = getStats();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Track your animal health assessments and history</p>
        </div>
        <Button onClick={() => navigate({ to: '/detect' })} size="lg">
          <Stethoscope className="mr-2 h-5 w-5" />
          New Detection
        </Button>
      </div>

      <DashboardStats stats={stats} />

      <Card className="shadow-md border-border/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            <CardTitle>Detection History</CardTitle>
          </div>
          <CardDescription>View and review past animal health assessments</CardDescription>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-12">
              <Stethoscope className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No detections yet</h3>
              <p className="text-muted-foreground mb-6">
                Start by performing your first animal health assessment
              </p>
              <Button onClick={() => navigate({ to: '/detect' })}>
                <Stethoscope className="mr-2 h-4 w-4" />
                Start First Detection
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((record) => (
                <DetectionHistoryItem
                  key={record.id}
                  record={record}
                  onClick={() => navigate({ to: '/results', search: { id: record.id } })}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
