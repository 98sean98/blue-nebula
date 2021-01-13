# [Name of Application]

This is a bare [React Native](https://reactnative.dev/) Project, not managed through [Expo](https://expo.io/).

### Renaming this application

Consider renaming this application using [`react-native-rename`](https://www.npmjs.com/package/react-native-rename) tool.

Note that native build artifacts may not be properly renamed. After renaming the project, you should clean, build, and reinstall 3rd party dependencies to get it running properly with the new name.

## Development Setup

Please follow the [official docs](https://reactnative.dev/docs/environment-setup) to install the necessary device simulators, and other software before cloning this repo.

## Project Structure

**All source code should live within `/src`.**

**The root application file is `App.tsx`.**

### `api`

To connect to backend services. Altering the type of servers communicated should not affect the rest of the application.

### `assets`

Static assets like `icons` and `images`.

### `components`

Components split by modules.

- #### `components/shared`

  Shared components used across different screens / features.

- #### `components/[module_name]`
  Module-specific components.

### `config`

Application configuration.

### `containers`

Screen-based components like SplashScreen, HomeScreen, etc.

### `models`

Typescript types and interfaces shared across different screens / features.

### `navigation`

Application navigation like stack navigators, etc. A root navigator should be exported to `App.tsx` from here.

### `reduxApp`

Redux for state management.

- #### `reduxApp/[feature]/actions`

  Actions specific to the feature managing a certain state object.

- #### `reduxApp/[feature]/constants`

  Action constant types like `INCREMENT_EXAMPLE_COUNTER`.

- #### `reduxApp/[feature]/reducers`

  Reducers.

- #### `reduxApp/[feature]/sagas`

  Sagas.

- #### `reduxApp/[feature]/types`

  Typescript types for this feature in redux. Server data types should be stored in `/src/models`, not here. This is only for application state.

- #### `reduxApp/rootReducer`

  Combines all reducers.

- #### `reduxApp/rootSaga`

  Combines all sagas.

- #### `reduxApp/store`

  Creates the application store to be used at the top level component.

### `styles`

Global styles and themes for colors, fonts, etc.

### `utilities`

Utility functions like hooks, and math calculators.

- #### `utilities/context`

  React context for using the Context API.

- #### `utilities/hooks`

  Custom React hooks.

- #### `utilities/functions`
  Various functions.

---

## Project Setup

Typescript is the language chosen for this project. All components should be built using `.tsx` files. Babel is used to transpile React syntax to a `js`. ESLint, alongside a plethora of plugins, is used to ensure consistency in the written code syntax.

There are 4 files that control code syntax and behaviour.

- tsconfig.json
- babel.config.js
- .eslintrc.js
- .prettierrc.js

If you find updating these files necessary due to incompatibility issues caused by a newly added library, please carefully edit the rules / settings after reading any related documentation.
The current settings have been made after deep considerations for ensuring the long term success of the project.
**It may be necessary to update more than 1 of these files to achieve the desired result.**

### Module imports / exports

Absolute imports have been setup for the top level folders living inside `src`. For example, `import { User } from '@models'` can be done anywhere as long as `User` has been exported by name (named-exports) in the `models/index` file.

Exports should opt for using the named-exports method rather than default exports. However, default exports, namespace import / exports are still possible.

### Husky pre-commit hooks

`husky` is configured to run on before every git commit to ensure that the source code adheres to strict development practices such as `no-unused-vars`, and coherent code styling defined by `prettier`.

Please do not take shortcuts with excessive `// @tsconfig-ignore`, or `// eslint-*-ignore`. If so, it really defeats setting up good software development practices.

---

## Workflow Recommendations

### Debugging

Debugging should not depend on which debugger you prefer. Please see [the official docs on debugging](https://reactnative.dev/docs/debugging) for more information.

**Make sure to enable `remote JS debugging` on the ios / android device by hitting `Debug` in the Developer Menu.**

#### React Native Debugger

**Only works for macOS**

Quick installation using Homebrew Cask:

```shell script
brew cask install react-native-debugger
```

**Optionally use [`react-native-debugger-open`](https://github.com/jhen0409/react-native-debugger/tree/master/npm-package)**

Run `npx rndebugger-open` in the terminal which replaces `open debugger-ui with Chrome` to `open React Native Debugger` in react-native packager, saving you from closing the debugger-ui page every time it automatically opens.

To start development with this debugger:

```shell script
# launch react native debugger as an os application listening to port 8081
open "rndebugger://set-debugger-loc?host=localhost&port=8081"

# start developing and tell react native packager to debug on the rndebugger uri
REACT_DEBUGGER="open -g 'rndebugger://set-debugger-loc?port=8001' ||" npm start
```

If you are not comfortable with `rndebugger`, you may simply use the [built-in debugger that runs on Chrome](https://reactnative.dev/docs/debugging#debugging-on-a-device-with-chrome-developer-tools).
Other potential debuggers include [`react-devtools`](https://reactnative.dev/docs/debugging#react-developer-tools).

### Using libraries

See the [official docs](https://reactnative.dev/docs/libraries) to learn how to install, and use a library.

The [react native directory](https://reactnative.directory/) is a useful database of libraries built specifically for React native. This is the first place to look for a library for a React Native application.

Please take note of library compatibility issues across ios / android platforms, and make necessary arrangements.

## Important Libraries Installed

### [`react-navigation`](https://reactnavigation.org/docs/getting-started)

React Navigation v5 uses a much more improved and consolidated API that seems to support typescript out-of-the-box quite well.
This should make the application navigation behaviour much more predictable, as designed.

A few highlighted docs to study the fundamentals include:

- [passing parameters to routes](https://reactnavigation.org/docs/params)
- [nesting navigators](https://reactnavigation.org/docs/nesting-navigators)
- [navigation lifecycle](https://reactnavigation.org/docs/navigation-lifecycle)
- [typescript typechecking](https://reactnavigation.org/docs/typescript)

### [`react-redux`](https://react-redux.js.org/)

Redux is being used for application state management together with `redux-saga` for asynchronous actions.

Please pay close attention to the boilerplate shown in the `exampleCounter` feature for detailed setup of typescript typechecking, etc.
In particular,

- `types` file: types and interfaces for the `action.payload`, and the feature `state`.
- `constants` file: enum of action types

## Other Notes

### File import / export

Path aliases have been setup for all well defined directories. Please see either the `babel.config.js`, or the `tsconfig.json` file for details.

#### Example

```typescript jsx
// ./src/components/shared/index
export { Foo } from './Foo';

// ./src/navigation/generic/BarScreen
import { Foo } from '@components/shared';
```
