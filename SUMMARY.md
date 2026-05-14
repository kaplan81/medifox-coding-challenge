# Project Summary

This project implements the Star Wars people challenge described in `SPEC.md` as an Angular 21 application. The feature fetches Star Wars characters from SWAPI.info, displays them in a searchable list, supports detail navigation, and allows local-only additions and deletions without writing back to the API.

## Implemented Features

- Displays all people from `https://swapi.info/api/people`.
- Provides a detail page for each person with `name`, `height`, `mass`, `birth_year`, and `gender`.
- Allows users to add a new person through a CDK Dialog backed by Angular Material form controls.
- Stores added people locally in browser memory only.
- Allows deleting both SWAPI and local entries from the visible in-memory list.
- Allows searching by character name across both SWAPI and local entries.
- Uses Angular Material and CDK for the visual interface, dialog, toolbar, cards, buttons, icons, inputs, and loading states.

## Architecture

The people feature is lazy loaded from `projects/sample/src/app/people/people.routes.ts`.

The main feature areas are:

- `containers/people-list`: the searchable character list, add dialog trigger, and delete actions.
- `containers/people-detail`: the character detail view.
- `components/add-person-dialog`: presentational dialog for creating a local person.
- `services/swap-people`: HTTP adapter for SWAPI.info.
- `services/swapi-people-state`: entity state for API-backed people.
- `services/local-people-state`: entity state for local-only people.
- `services/people-state`: consolidated facade that merges, sorts, searches, deletes, and exposes list state to components.

## State Management

State is managed with Angular signals and the shared `StateMixin` from `projects/sample/src/app/app/mixins/state/state.mixin.ts`.

There are two entity stores:

- `SwapiPeopleStateService` stores SWAPI people as entities keyed by route id.
- `LocalPeopleStateService` stores locally created people as entities keyed by `local-<uuid>`.

`PeopleStateService` is the facade consumed by the UI. It exposes:

- `people`: combined and sorted SWAPI + local list.
- `filteredPeople`: list filtered by search term.
- `searchTerm`, `filteredCount`, `totalCount`, and `localCount`.
- `loadState` for loading/error/ready UI states.
- `add()`, `remove()`, `loadAll()`, `getByRouteId()`, and `setSearchTerm()`.

Deleting SWAPI entries is intentionally in-memory only. No delete request is sent to SWAPI.info.

## UI

The application uses a dark Angular Material theme with a Star Wars inspired yellow/violet palette.

The list view includes:

- Sticky toolbar with count information.
- Material search input.
- Responsive Material cards.
- Local-entry badges.
- Per-card delete buttons.
- Floating action button to open the add-person dialog.
- Loading, error, and empty-search states.

The detail view includes:

- Sticky toolbar with back navigation.
- Material card layout.
- Character avatar initial.
- Required character fields in a responsive detail grid.
- Loading, error, and not-found states.

## Testing And Verification

The implementation includes unit coverage for:

- SWAPI HTTP service.
- SWAPI entity state service.
- Local entity state service.
- Consolidated people state facade.
- List and detail containers.
- Add-person dialog.
- SWAPI utility functions.

The latest verification completed successfully:

- `npm test`: 13 test files passed, 66 tests passed.
- `npm run build`: production build completed successfully.

