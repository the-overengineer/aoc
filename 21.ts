import { constrainUniqueValues, difference, intersect, readLines, sum, union } from './utilityBelt';

type Food = string;
type Allergen = string;
type Label = [Set<Food>, Allergen[]];

const LABEL_PATTERN = /^([\w ]+) \(contains ([\w, ]+)\)$/;

async function readLabels(): Promise<Label[]> {
  const lines = await readLines('./21.txt');
  return lines.map((line): Label => {
    const [,foods, allergens] = LABEL_PATTERN.exec(line)!;
    return [new Set(foods.split(' ')), allergens.split(', ')];
  });
}

function mapAllergenToCandidates(labels: Label[]): Map<Allergen, Set<Food>> {
  const allergenCandidates: Map<Allergen, Set<Food>> = new Map();

  for (const [foods, allergens] of labels) {
    for (const allergen of allergens) {
      if (!allergenCandidates.has(allergen)) {
        allergenCandidates.set(allergen, foods);
      } else {
        allergenCandidates.set(allergen, intersect(foods, allergenCandidates.get(allergen)!));
      }
    }
  }

  return allergenCandidates;
}

async function main1() {
  const labels = await readLabels();

  const allergenCandidates = mapAllergenToCandidates(labels);
  const allFoods = union(...labels.map((l) => l[0]));
  const possibleAllergens = union(...allergenCandidates.values());
  const safeFoods = difference(allFoods, possibleAllergens);

  const totalSafeCount = sum(labels.map(([ingredients]) => intersect(safeFoods, ingredients).size));

  console.log(totalSafeCount);
}

async function main2() {
  const labels = await readLabels();
  const allergenCandidates = mapAllergenToCandidates(labels);
  const allergenToIngredient = constrainUniqueValues(allergenCandidates);

  const canonicalAllergenList = Array.from(allergenCandidates.keys())
    .sort((a, b) => a.localeCompare(b))
    .map((k) => Array.from(allergenToIngredient.get(k)!)[0]!)
    .join(',');

  console.log(canonicalAllergenList);
}

main2();
