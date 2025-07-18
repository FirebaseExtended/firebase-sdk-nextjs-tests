# Firebase SDK Next JS Tests
![Status Badge](https://github.com/FirebaseExtended/firebase-js-sdk-framework-tests/actions/workflows/nightly-js-sdk.yaml/badge.svg)

This repository contains automatic nightly tests that exercise the Firebase JS SDK within a Next.JS app environment via the Playwright test framework. 

## Getting Started

### Tools
This project has be built and tested with `yarn` version `1.22.11`.

First, install dependencies:

```bash
yarn
```

### Firebase Project configuration
To configure your Firebase project data, add your project configuration to `./lib/firebase.ts`.


### Building and executing the tests:

```bash
yarn build
```

To execute all of the tests, run:

```bash
yarn test
```

To exeucte a single test, define the playwright test spec as a command line parameter. For instance,
to execute only the Auth tests:

```bash
yarn test tests/auth.spec.ts
```

To run the tests on an app server for manual testing:

```bash
yarn dev
```



