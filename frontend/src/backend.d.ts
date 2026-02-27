import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Disease {
    name: string;
    treatmentAdvice: string;
    symptoms: Array<string>;
    severity: string;
    affectedSpecies: Array<string>;
}
export interface SymptomCheckResult {
    potentialDiseases: Array<Disease>;
    matchedSymptoms: Array<string>;
}
export interface Animal {
    age: bigint;
    symptoms: Array<string>;
    breed: string;
    species: string;
}
export interface backendInterface {
    addAnimal(id: bigint, species: string, breed: string, age: bigint, symptoms: Array<string>): Promise<void>;
    addDisease(name: string, symptoms: Array<string>, affectedSpecies: Array<string>, severity: string, treatmentAdvice: string): Promise<void>;
    checkSymptoms(species: string, symptoms: Array<string>): Promise<SymptomCheckResult>;
    getAnimal(id: bigint): Promise<Animal>;
    getDisease(name: string): Promise<Disease>;
}
