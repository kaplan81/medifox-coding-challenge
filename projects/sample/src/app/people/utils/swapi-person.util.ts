import type { SwapiPerson } from '../models/swapi-person.model';

export function extractPersonRouteId(person: SwapiPerson): string {
  const trimmed: string = person.url.replace(/\/$/, '');
  const parts: string[] = trimmed.split('/');
  const last: string | undefined = parts[parts.length - 1];
  return last ?? '';
}

export function isLocalPersonId(routeId: string): boolean {
  return routeId.startsWith('local-');
}
