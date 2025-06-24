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
import {
  collection,
  DocumentSnapshot,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  onSnapshotResume,
  query,
  QuerySnapshot,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { firebaseConfig } from '@/lib/app_tests/firebase';
import { OK, FAILED, OK_SKIPPED } from '@/lib/app_tests/util';

export type TestResults = {
  initializeAppResult: string,
  initializeFirestoreResult: string,
  createDocInstanceResult: string,
  setDocResult: string,
  onSnapshotSetDocResult: string,
  updateDocResult: string,
  onSnapshotUpdateDocResult: string,
  getDocResult: string,
  querySnapshotResult: string,
  documentSnapshotBundleResult: string,
  querySnapshotBundleResult: string,
  documentSnapshotOnSnapshotResumeResult: string,
  querySnapshotOnSnapshotResumeResult: string,
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
    querySnapshotResult: FAILED,
    documentSnapshotBundleResult: FAILED,
    querySnapshotBundleResult: FAILED,
    documentSnapshotOnSnapshotResumeResult: FAILED,
    querySnapshotOnSnapshotResumeResult: FAILED,
    deleteDocResult: FAILED,
    onSnapshotDeleteDocResult: FAILED,
    getDeletedDocResult: FAILED,
    deleteAppResult: FAILED
  };
}

export async function testFirestore(isServer: boolean = false): Promise<TestResults> {
  const QUERY_PATH = 'nextJsTestCollection';
  const DOCUMENT_PATH = QUERY_PATH + '/trueDoc';
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

    const document = doc(firestore, DOCUMENT_PATH);
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

    const q = query(collection(firestore, QUERY_PATH));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length === 1) {
      if (querySnapshot.docs[0].data().testbool === false) {
        result.querySnapshotResult = OK;
      }
    }

    // DocumentSnapshot bundle tests
    if (isServer) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bundleJson = docSnapshot.toJSON() as any;
      if (bundleJson.bundle !== undefined && bundleJson.bundle != "NOT SUPPORTED") {
        result.documentSnapshotBundleResult = OK;
      }

      const bundleDocSnapshotPromise = new Promise<void>((resolve, reject) => {
        let completed: boolean = false;
        setTimeout(() => { if (!completed) reject(); }, 2000);
        const unsubscribe = onSnapshotResume(firestore, bundleJson, (docSnapshot: DocumentSnapshot) => {
          if (docSnapshot.exists()) {
            const docData = docSnapshot.data();
            if (docData && docData.testbool !== undefined && docData.testbool === false) {
              unsubscribe();
              result.documentSnapshotOnSnapshotResumeResult = OK;
              completed = true;
              resolve();
            }
          }
        });
      });
      await bundleDocSnapshotPromise;
    } else {
      result.documentSnapshotBundleResult = OK_SKIPPED;
      result.documentSnapshotOnSnapshotResumeResult = OK_SKIPPED;
    }

    // QuerySnapshot bundle tests
    if (isServer) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bundleJson = querySnapshot.toJSON() as any;
      if (bundleJson.bundle !== undefined && bundleJson.bundle != "NOT SUPPORTED") {
        result.querySnapshotBundleResult = OK;
      }
      const bundleQuerySnapshotPromise = new Promise<void>((resolve, reject) => {
        let completed: boolean = false;
        setTimeout(() => { if (!completed) reject(); }, 2000);
        const unsubscribe = onSnapshotResume(firestore, bundleJson, (querySnapshot: QuerySnapshot) => {
          if (querySnapshot.docs.length === 1) {
            if (querySnapshot.docs[0].data().testbool === false) {
              result.querySnapshotOnSnapshotResumeResult = OK;
            }
            unsubscribe();
            completed = true;
            resolve();
          }
        });
      });
      await bundleQuerySnapshotPromise;
    } else {
      result.querySnapshotBundleResult = OK_SKIPPED;
      result.querySnapshotOnSnapshotResumeResult = OK_SKIPPED;
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
