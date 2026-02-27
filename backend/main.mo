import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";

actor {
  type Disease = {
    name : Text;
    symptoms : [Text];
    affectedSpecies : [Text];
    severity : Text;
    treatmentAdvice : Text;
  };

  type Animal = {
    species : Text;
    breed : Text;
    age : Nat;
    symptoms : [Text];
  };

  type SymptomCheckResult = {
    potentialDiseases : [Disease];
    matchedSymptoms : [Text];
  };

  let diseases = Map.empty<Text, Disease>();
  let animals = Map.empty<Nat, Animal>();

  // Add a new disease to the system
  public shared ({ caller }) func addDisease(name : Text, symptoms : [Text], affectedSpecies : [Text], severity : Text, treatmentAdvice : Text) : async () {
    let disease = {
      name;
      symptoms;
      affectedSpecies;
      severity;
      treatmentAdvice;
    };
    diseases.add(name, disease);
  };

  // Add a new animal to the system
  public shared ({ caller }) func addAnimal(id : Nat, species : Text, breed : Text, age : Nat, symptoms : [Text]) : async () {
    let animal = {
      species;
      breed;
      age;
      symptoms;
    };
    animals.add(id, animal);
  };

  // Get disease information
  public query ({ caller }) func getDisease(name : Text) : async Disease {
    switch (diseases.get(name)) {
      case (null) { Runtime.trap("Disease not found") };
      case (?disease) { disease };
    };
  };

  // Get animal information
  public query ({ caller }) func getAnimal(id : Nat) : async Animal {
    switch (animals.get(id)) {
      case (null) { Runtime.trap("Animal not found") };
      case (?animal) { animal };
    };
  };

  // Check symptoms and suggest potential diseases
  public query ({ caller }) func checkSymptoms(species : Text, symptoms : [Text]) : async SymptomCheckResult {
    let potentialDiseases = diseases.values().toArray().filter(
      func(d) {
        d.affectedSpecies.any(
          func(s) { Text.equal(s, species) }
        );
      }
    );

    var matchedSymptoms : [Text] = [];

    for (disease in potentialDiseases.values()) {
      let filteredSymptoms = disease.symptoms.filter(
        func(s) { symptoms.any(func(sym) { Text.equal(sym, s) }) }
      );
      matchedSymptoms := matchedSymptoms.concat(filteredSymptoms);
    };

    {
      potentialDiseases;
      matchedSymptoms;
    };
  };
};
