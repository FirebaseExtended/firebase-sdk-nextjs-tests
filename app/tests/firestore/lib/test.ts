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
import { doc, deleteDoc, getDoc, getFirestore, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { firebaseConfig } from 'lib/firebase';
import { OK, FAILED } from 'lib/util';

export type TestResults = {
  initializeAppResult: string,
  initializeFirestoreResult: string,
  createDocInstanceResult: string,
  setDocResult: string,
  onSnapshotSetDocResult: string,
  updateDocResult: string,
  onSnapshotUpdateDocResult: string,
  getDocResult: string,
  deleteDocResult: string,
  onSnapshotDeleteDocResult: string,
  getDeletedDocResult: string,
  deleteAppResult: string
};

export function initializeTestResults(): TestResults {
  return {
    initializeAppResult: FAILED,
    initializeFirestoreResult: FAILED,
    createDocInstanceResult: FAILED,
    setDocResult: FAILED,
    onSnapshotSetDocResult: FAILED,
    updateDocResult: FAILED,
    onSnapshotUpdateDocResult: FAILED,
    getDocResult: FAILED,
    deleteDocResult: FAILED,
    onSnapshotDeleteDocResult: FAILED,
    getDeletedDocResult: FAILED,
    deleteAppResult: FAILED
  };
}

export async function testFirestore(): Promise<TestResults> {
  const result: TestResults = initializeTestResults();
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    if (firebaseApp === null) {
      return result;
    }
    result.initializeAppResult = OK;

    const firestore = getFirestore(firebaseApp);
    if (firestore === null) {
      return result;
    }
    result.initializeFirestoreResult = OK;

    const document = doc(firestore, 'testCollection/trueDoc');
    if (document === null) {
      return result;
    }
    result.createDocInstanceResult = OK;

    const setDocPromise = new Promise<void>((resolve, reject) => {
      let completed: boolean = false;
      setTimeout(() => { if (!completed) reject(); }, 2000);
      const unsubscribe = onSnapshot(document, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const docData = docSnapshot.data();
          if (docData && docData.testbool !== undefined && docData.testbool === true) {
            unsubscribe();
            result.onSnapshotSetDocResult = OK;
            completed = true;
            resolve();
          }
        }
      });
    });

    await setDoc(document, {
      testbool: true
    });
    result.setDocResult = OK;
    await setDocPromise;

    const updateDocPromise = new Promise<void>((resolve, reject) => {
      let completed: boolean = false;
      setTimeout(() => { if (!completed) reject(); }, 2000);
      const unsubscribe = onSnapshot(document, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const docData = docSnapshot.data();
          console.log("docData: ", docData);
          if (docData && docData.testbool !== undefined && docData.testbool === false) {
            unsubscribe();
            result.onSnapshotUpdateDocResult = OK;
            completed = true;
            resolve();
          }
        }
      });
    });

    await updateDoc(document, {
      testbool: false
    });
    result.updateDocResult = OK;
    await updateDocPromise;

    const docSnapshot = await getDoc(document);
    if (docSnapshot.exists()) {
      const docData = docSnapshot.data();
      if (docData && docData.testbool !== undefined && docData.testbool === false) {
        result.getDocResult = OK;
      }
    }

    const deleteDocPromise = new Promise<void>((resolve, reject) => {
      let completed: boolean = false;
      setTimeout(() => { if (!completed) reject(); }, 2000);
      const unsubscribe = onSnapshot(document, (docSnapshot) => {
        if (!docSnapshot.exists()) {
          unsubscribe();
          result.onSnapshotDeleteDocResult = OK;
          completed = true;
          resolve();
        }
      });
    });

    await deleteDoc(document);
    result.deleteDocResult = OK;
    await deleteDocPromise;

    const deletedDocument = await getDoc(document);
    if (!deletedDocument.exists()) {
      result.getDeletedDocResult = OK;
    }

    deleteApp(firebaseApp);
    result.deleteAppResult = OK;
  } catch (e) {
    console.error("Caught error: ", e);
  }
  return result;
}