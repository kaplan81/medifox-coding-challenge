# Angular Sample Task

As part of this task, a list view including a detail view for characters from Star Wars should be implemented. The data source to be used is SWAPI.info:

https://swapi.info

This is an official Star Wars API for retrieving various information related to the Star Wars universe. The exact implementation is specified below.

## The task consists of the following points:

- Display all people with their names in a list (People endpoint)
- When clicking on a person, navigate to a detail page and display the following data:
  - `name`
  - `height`
  - `mass`
  - `birth_year`
  - `gender`
- It must be possible to add a new person to the list (the API should not be used for this)

## Possible extensions to this task:

- Delete an entry from the list
- Search for a name within the list

## Optionally, the following techniques can be used:

- Adding a new entry via a dialog
- Displaying the list of names and the detail view side-by-side in one view (via routing)
- Implementing styling with Angular Material
