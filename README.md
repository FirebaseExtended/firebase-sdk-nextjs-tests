# Firebase SDK Next JS Tests

This repository contains automatic nightly tests that exercise the Firebase JS SDK within a Next.JS app environment.


## Getting Started

This project has be built and tested with `yarn` version `1.22.11`.

First, install dependencies:

```bash
yarn
```

To configure your Firebase project data:

**TBD**

As of now, add your firbase config data to `./lib/firebase.ts`.

To build the test apps:

```bash
yarn build
```

To execute the tests, run:

```bash
yarn test
```

To run the tests on an app server for manual testing:

```bash
yarn dev
```

