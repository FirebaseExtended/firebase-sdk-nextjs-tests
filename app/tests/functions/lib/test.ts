/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { deleteApp, initializeApp } from 'firebase/app';
import { firebaseConfig } from 'lib/firebase';
import { getFunctions, httpsCallable, httpsCallableFromURL } from 'firebase/functions';
import { getAuth, deleteUser, signInAnonymously } from 'firebase/auth';
import { OK, FAILED, waitForUserSignIn } from 'lib/util';

export type TestResults = {
  initializeAppResult: string,
  initializeAuthResult: string,
  authUserSignedInResult: string,
  initializeFunctionsResult: string,
  createCallTestResult: string,
  callTestInvokedSuccessfullyResult: string,
  callTestResponseResult: string,
  httpCallableTestInvokedSuccessfullyResult: string,
  httpCallableResponseResult: string,
  deleteUserResult: string,
  authSignedOutResult: string,
  deleteAppResult: string
};

export function initializeTestResults(): TestResults {
  return {
    initializeAppResult: FAILED,
    initializeAuthResult: FAILED,
    authUserSignedInResult: FAILED,
    initializeFunctionsResult: FAILED,
    createCallTestResult: FAILED,
    callTestInvokedSuccessfullyResult: FAILED,
    callTestResponseResult: FAILED,
    httpCallableTestInvokedSuccessfullyResult: FAILED,
    httpCallableResponseResult: FAILED,
    deleteUserResult: FAILED,
    authSignedOutResult: FAILED,
    deleteAppResult: FAILED
  };
}

export async function testFunctions(): Promise<TestResults> {
  const result: TestResults = initializeTestResults();
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    if (firebaseApp === null) {
      return result;
    }
    result.initializeAppResult = OK;

    const auth = getAuth(firebaseApp);
    await auth.authStateReady();
    result.initializeAuthResult = OK;

    await signInAnonymously(auth);
    await waitForUserSignIn(auth);
    if (auth.currentUser) {
      result.authUserSignedInResult = OK;

      const functions = getFunctions(firebaseApp);
      if (functions === null) {
        return result;
      }
      result.initializeFunctionsResult = OK;

      const callTest = httpsCallable<{ data: string }, { word: string }>(
        functions,
        'callTest'
      );
      if (!callTest) {
        return result;
      }
      result.createCallTestResult = OK;
      const callTestResult = await callTest({ data: 'blah' });
      result.callTestInvokedSuccessfullyResult = OK;
      if (callTestResult.data.word === 'hellooo') {
        result.callTestResponseResult = OK;
      }

      const httpCallableTest = httpsCallableFromURL<{ data: string }, { word: string }>(
        functions,
        `https://us-central1-${firebaseConfig.projectId}.cloudfunctions.net/callTest`
      );
      const httpsCallableResult = await httpCallableTest({ data: 'blah' });
      result.httpCallableTestInvokedSuccessfullyResult = OK;
      if (httpsCallableResult.data.word === 'hellooo') {
        result.httpCallableResponseResult = OK;
      }

      await deleteUser(auth.currentUser);
      result.deleteUserResult = OK;

      await auth.signOut();
      result.authSignedOutResult = OK;
    }

    deleteApp(firebaseApp);
    result.deleteAppResult = OK;
  } catch (e) {
    console.error("Caught error: ", e);
  }
  return result;
}
