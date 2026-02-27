import { useState, useEffect, useCallback } from 'react';
import type { DetectionRecord, HistoryStats } from '../types/detection';

const STORAGE_KEY = 'animal_detection_history';
const MAX_PHOTO_SIZE = 500 * 1024; // 500KB limit per photo

function compressImage(dataUrl: string, maxSize: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions to reduce file size
      const maxDimension = 800;
      if (width > height && width > maxDimension) {
        height = (height * maxDimension) / width;
        width = maxDimension;
      } else if (height > maxDimension) {
        width = (width * maxDimension) / height;
        height = maxDimension;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Try different quality levels to meet size requirement
      let quality = 0.8;
      let result = canvas.toDataURL('image/jpeg', quality);
      
      while (result.length > maxSize && quality > 0.1) {
        quality -= 0.1;
        result = canvas.toDataURL('image/jpeg', quality);
      }
      
      resolve(result);
    };
    img.src = dataUrl;
  });
}

export function useDetectionHistory() {
  const [history, setHistory] = useState<DetectionRecord[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }
  }, []);

  const addDetection = useCallback(
    async (detection: Omit<DetectionRecord, 'id' | 'timestamp'>) => {
      let processedPhoto = detection.photo;
      
      // Compress photo if it exists and is too large
      if (processedPhoto && processedPhoto.length > MAX_PHOTO_SIZE) {
        try {
          processedPhoto = await compressImage(processedPhoto, MAX_PHOTO_SIZE);
        } catch (e) {
          console.error('Failed to compress photo:', e);
          // Continue without photo if compression fails
          processedPhoto = undefined;
        }
      }
      
      const newRecord: DetectionRecord = {
        ...detection,
        photo: processedPhoto,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      };
      const updated = [newRecord, ...history];
      setHistory(updated);
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
        // If storage fails, try without photos
        const withoutPhotos = updated.map(r => ({ ...r, photo: undefined }));
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(withoutPhotos));
        } catch (e2) {
          console.error('Failed to save even without photos:', e2);
        }
      }
    },
    [history]
  );

  const getStats = useCallback((): HistoryStats => {
    const speciesCount = new Map<string, number>();
    const diseaseCount = new Map<string, number>();

    history.forEach((record) => {
      speciesCount.set(record.species, (speciesCount.get(record.species) || 0) + 1);
      record.results.potentialDiseases.forEach((disease) => {
        diseaseCount.set(disease.name, (diseaseCount.get(disease.name) || 0) + 1);
      });
    });

    return {
      totalDetections: history.length,
      commonSpecies: Array.from(speciesCount.entries())
        .map(([species, count]) => ({ species, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3),
      commonDiseases: Array.from(diseaseCount.entries())
        .map(([disease, count]) => ({ disease, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3),
    };
  }, [history]);

  return {
    history,
    addDetection,
    getStats,
  };
}
