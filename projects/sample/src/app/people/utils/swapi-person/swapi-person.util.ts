import type { SwapiPerson } from '../../models/swapi-person.model';

interface SwapiPeoplePage {
  results: SwapiPerson[];
}

export function extractPersonRouteId(person: SwapiPerson): string {
  const trimmed: string = person.url.replace(/\/$/, '');
  const parts: string[] = trimmed.split('/');
  const last: string | undefined = parts[parts.length - 1];
  return last ?? '';
}

export function isLocalPersonId(routeId: string): boolean {
  return routeId.startsWith('local-');
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

function isSwapiPeoplePage(value: unknown): value is SwapiPeoplePage {
  return (
    typeof value === 'object' &&
    value !== null &&
    'results' in value &&
    Array.isArray(value.results)
  );
}
