export interface SwapiPerson {
  birth_year: string;
  gender: string;
  height: string;
  mass: string;
  name: string;
  url: string;
  created?: string;
  edited?: string;
  eye_color?: string;
  films?: string[];
  hair_color?: string;
  homeworld?: string;
  skin_color?: string;
  species?: string[];
  starships?: string[];
  vehicles?: string[];
}

export type NewPersonFields = Pick<SwapiPerson, 'birth_year' | 'gender' | 'height' | 'mass' | 'name'>;

interface SwapiPeoplePage {
  results: SwapiPerson[];
}

function isSwapiPeoplePage(value: unknown): value is SwapiPeoplePage {
  return (
    typeof value === 'object' &&
    value !== null &&
    'results' in value &&
    Array.isArray((value as SwapiPeoplePage).results)
  );
}

export function normalizeSwapiPeopleListPayload(raw: unknown): SwapiPerson[] {
  if (Array.isArray(raw)) {
    return raw as SwapiPerson[];
  }
  if (isSwapiPeoplePage(raw)) {
    return raw.results;
  }
  return [];
}
