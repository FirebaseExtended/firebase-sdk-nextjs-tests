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
import { Auth, onAuthStateChanged } from 'firebase/auth';

export const OK: string = "OK";
export const OK_SKIPPED: string = "OK - SKIPPED";
export const FAILED: string = "FAILED";

export async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function waitForUserSignedIn(auth : Auth): Promise<void> {
  const promise: Promise<void> = new Promise<void>((resolve, reject) => {
    let completed: boolean = false;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        completed = true;
        unsubscribe();
        resolve();
      }
    });
    setTimeout(() => {
      if (!completed) {
        completed = true;
        unsubscribe();
        reject();
      }
    }, 3000);
  });
  return promise;
}
