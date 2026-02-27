export interface DetectionRecord {
  id: string;
  timestamp: number;
  species: string;
  breed: string;
  age: number;
  symptoms: string[];
  photo?: string; // base64 data URL
  results: {
    potentialDiseases: Array<{
      name: string;
      treatmentAdvice: string;
      symptoms: string[];
      severity: string;
      affectedSpecies: string[];
    }>;
    matchedSymptoms: string[];
  };
}

export interface HistoryStats {
  totalDetections: number;
  commonSpecies: { species: string; count: number }[];
  commonDiseases: { disease: string; count: number }[];
}
