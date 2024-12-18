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
import { deleteApp, initializeApp, initializeServerApp } from 'firebase/app';
import { deleteUser, getAuth, signInAnonymously } from 'firebase/auth';
import { firebaseConfig } from '@/lib/app_tests/firebase';
import { OK, OK_SKIPPED, FAILED, waitForUserSignIn } from '@/lib/app_tests/util';

export type TestResults = {
  initializeAppResult: string,
  initializeAuthResult: string,
  signInAnonymouslyResult: string,
  getTokenResult: string,
  initializeServerAppResult: string,
  getAuthServerAppResult: string,
  getServerAppUserResult: string,
  deleteServerAppResult: string
  deleteUserResult: string,
  userSignedOutResult : string,
  deleteAppResult: string
};

export function initializeTestResults(): TestResults {
  return {
    initializeAppResult: FAILED,
    initializeAuthResult: FAILED,
    signInAnonymouslyResult: FAILED,
    getTokenResult: FAILED,
    initializeServerAppResult: FAILED,
    getAuthServerAppResult: FAILED,
    getServerAppUserResult: FAILED,
    deleteServerAppResult: FAILED,
    deleteUserResult: FAILED,
    userSignedOutResult : FAILED,
    deleteAppResult: FAILED
  };
}

export async function testAuth(isServer: boolean = false): Promise<TestResults> {
  const result: TestResults = initializeTestResults();
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    result.initializeAppResult = OK;
    const auth = getAuth(firebaseApp);
    await auth.authStateReady();
    result.initializeAuthResult = OK;
    await signInAnonymously(auth);
    await waitForUserSignIn(auth);
    if (auth.currentUser !== null) {
      result.signInAnonymouslyResult = OK;
      const idToken = await auth.currentUser.getIdToken();
      if (idToken.length !== 0) {
        result.getTokenResult = OK;
      }
      if (!isServer) {
        /* FirebaseServerApp doesn't work on clients. */
        result.initializeServerAppResult = OK_SKIPPED;
        result.getAuthServerAppResult = OK_SKIPPED;
        result.getServerAppUserResult = OK_SKIPPED;
        result.deleteServerAppResult = OK_SKIPPED;
      } else {
        const serverApp = initializeServerApp(firebaseConfig, { authIdToken: idToken });
        result.initializeServerAppResult = OK;
        const serverAuth = getAuth(serverApp);
        result.getAuthServerAppResult = OK;
        await serverAuth.authStateReady();
        if (serverAuth.currentUser !== null) {
          result.getServerAppUserResult = OK;
        }

        deleteApp(serverApp);
        result.deleteServerAppResult = OK;
      }
      await deleteUser(auth.currentUser);
      result.deleteUserResult = OK;
      await auth.signOut();
      if (auth.currentUser === null) {
        result.userSignedOutResult = OK;
      }
    }
    deleteApp(firebaseApp);
    result.deleteAppResult = OK;
  } catch (e) {
    console.log("Caught error: ", e);
  }
  return result;
}