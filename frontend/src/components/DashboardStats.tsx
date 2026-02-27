import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, TrendingUp, Stethoscope } from 'lucide-react';
import type { HistoryStats } from '../types/detection';

interface DashboardStatsProps {
  stats: HistoryStats;
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="shadow-md border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Detections</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">{stats.totalDetections}</div>
          <p className="text-xs text-muted-foreground mt-1">Health assessments completed</p>
        </CardContent>
      </Card>

      <Card className="shadow-md border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Common Species</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {stats.commonSpecies.length > 0 ? (
            <div className="space-y-1">
              {stats.commonSpecies.map((item, index) => (
                <div key={item.species} className="flex items-center justify-between">
                  <span className="text-sm capitalize text-foreground">
                    {index + 1}. {item.species}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">{item.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No data yet</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-md border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Common Diseases</CardTitle>
          <Stethoscope className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {stats.commonDiseases.length > 0 ? (
            <div className="space-y-1">
              {stats.commonDiseases.map((item, index) => (
                <div key={item.disease} className="flex items-center justify-between">
                  <span className="text-sm text-foreground truncate">
                    {index + 1}. {item.disease}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground flex-shrink-0 ml-2">{item.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No data yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
