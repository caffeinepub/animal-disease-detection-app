import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Disease, SymptomCheckResult } from '../backend';

export function useCheckSymptoms() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<SymptomCheckResult, Error, { species: string; symptoms: string[] }>({
    mutationFn: async ({ species, symptoms }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.checkSymptoms(species, symptoms);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['symptoms'] });
    },
  });
}

export function useAddDisease() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    {
      name: string;
      symptoms: string[];
      affectedSpecies: string[];
      severity: string;
      treatmentAdvice: string;
    }
  >({
    mutationFn: async ({ name, symptoms, affectedSpecies, severity, treatmentAdvice }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addDisease(name, symptoms, affectedSpecies, severity, treatmentAdvice);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diseases'] });
    },
  });
}

export function useGetDisease(name: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Disease>({
    queryKey: ['disease', name],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getDisease(name);
    },
    enabled: !!actor && !isFetching && !!name,
  });
}
