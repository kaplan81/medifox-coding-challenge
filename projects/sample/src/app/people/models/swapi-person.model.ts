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

export type NewPersonFields = Pick<
  SwapiPerson,
  'birth_year' | 'gender' | 'height' | 'mass' | 'name'
>;

export interface SwapiPeoplePage {
  results: SwapiPerson[];
}
