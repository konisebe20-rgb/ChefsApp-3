# ChefsApp-3

A React Native (Expo, Typescript) app that lets a chef capture, view, manage, search and analyse the dishes on their menu.

- GitHiub repo: https://github.com/konisebe20-rgb/ChefsApp-3/edit/main/README.md
- **Video demostration:**_ video link

# how to run

```bash
npm install
npx expo start
```

Scan the QR code with expo Go, or, press a to open the an emulator and if you it is not working you can press w to open it on the web



# Change log ( from part 2)

The change log followa the same five areas as the assesment. In each area , part 2 is what the app already did, asn the final part a (PEO) is what was added or changed afterwards.

## 1. Buildt the user interface 

Part 2
- Clear application tittle ( Chefs menu) and a simple, good looking layout.
- Appropriate React Native components

Final PoE
- i added a 3 second splash screen with the app name and a loading bar
- theres a hero card on the home screen.
- added navigation that include menu, search, stats.
- kept the same colour pallete, spacing and text sizes on every screen

## 2. Capture Menu Information 

Part 2
- Chef can enter the dish name, description, course and the price using TextInput fields and course buttons.

Final PoE
- The same form is used to now reused for editing a dish, with the existing values pre-filled.
- Added a photo URL field with a live image preview.

## 3. Display Menu Items

Part 2
- Dishes can be added, and the full list of dishes is displayed.
- The list updatess automatiucally when a dish is added.

Final PeO
- Added a dish details screen showing the image, course, name, price and description.
- Added edit and delete ( with confirmation screen) so dishes can be managed after they are added.
- Added search by dish name and filter by course with a result count and an empty state when nothing matches.
- Added statastics screen.

## 4. improve the user experience 

Part 2
- Validation for required fields, with error messages.

Final PoE
- Validation now also checks that the price is a valid number
- Added a confirmation screen before a dish is deleted
- Added a No dishes found message when a search is not accurate to the menu

## 5. User Experience

Final PoE
- Clear navigation between features using the bottom navigation baar and back buttons.
- Success and error feedback through alerts and screen message.
- Consistent look and feel across all screens

  # Factoring changes
  - Replaced repeated screen code with reusable components: `Header`, `StatCard`, `NavItem` and `BottomNavigation`.
- Combined the add and edit screens into one reusable `DishForm` component.
- Moved all colours into a single `COLORS` object so the theme can be changed in one place.
- Separated each screen into its own component (`MenuScreen`, `SearchScreen`, `DetailsScreen`, `DeleteScreen`, `StatisticsScreen`) with `App` handling the state and the add, update and delete functions.
- Used `useMemo` for the search and filter results so the list is only recalculated when the dishes, search text or course change.
- Moved all styles into one `StyleSheet.create` block, grouped by screen.

 
