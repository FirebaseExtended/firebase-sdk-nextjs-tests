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
  documentSnapshotFromJSON,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  onSnapshotResume,
  query,
  querySnapshotFromJSON,
  QuerySnapshot,
  setDoc,
  updateDoc,

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
  reconstitutedDocDataResult: string,
  querySnapshotBundleResult: string,
  reconstitutedQueryDataResult: string,
  documentSnapshotOnSnapshotResumeResult: string,
  querySnapshotOnSnapshotResumeResult: string,
  deleteDocResult: string,
  onSnapshotDeleteDocResult: string,
  getDeletedDocResult: string,
  deleteAppResult: string,

  // Checks for the CSR phase
  clientSideDocumentSnapshotResult: string,
  clientSideDocumentSnapshotOnResumeResult: string,
  clientSideQuerySnapshotResult: string
  clientSideQuerySnapshotOnResumeResult: string,
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
    reconstitutedDocDataResult: FAILED,
    querySnapshotBundleResult: FAILED,
    reconstitutedQueryDataResult: FAILED,
    documentSnapshotOnSnapshotResumeResult: FAILED,
    querySnapshotOnSnapshotResumeResult: FAILED,
    deleteDocResult: FAILED,
    onSnapshotDeleteDocResult: FAILED,
    getDeletedDocResult: FAILED,
    deleteAppResult: FAILED,

    // Checks for the CSR phase
    clientSideDocumentSnapshotResult: FAILED,
    clientSideDocumentSnapshotOnResumeResult: FAILED,
    clientSideQuerySnapshotResult: FAILED,
    clientSideQuerySnapshotOnResumeResult: FAILED
  };
}

export type SerializedFirestoreData = {
  documentSnapshotJson: object | null,
  querySnapshotJson: object | null,
}

export async function setExpectedSerializedDataInFirestore(firestore, path) {
  const docRef = doc(firestore, path);

  await setDoc(docRef, {
    aBoolean: true,
    aName: "A name",
    aNull: null,
    anInteger: 1234
  });
}

export async function buildSerializedFirestoreData(): Promise<SerializedFirestoreData> {
  const QUERY_PATH = '/nextJsTestStaticCollection_DoNotDelete';
  const DOCUMENT_PATH = QUERY_PATH + '/doc';
  const result: SerializedFirestoreData = {
    documentSnapshotJson: null,
    querySnapshotJson: null
  };

  const firebaseApp = initializeApp(firebaseConfig);
  const firestore = getFirestore(firebaseApp);

  await setExpectedSerializedDataInFirestore(firestore, DOCUMENT_PATH);

  const docRef = doc(firestore, DOCUMENT_PATH);
  const docSnapshot = await getDoc(docRef);
  if (docSnapshot !== null) {
    result.documentSnapshotJson = docSnapshot.toJSON();
  }

  const queryRef = query(collection(firestore, QUERY_PATH));
  const querySnapshot = await getDocs(queryRef);
  if (querySnapshot !== null) {
    result.querySnapshotJson = querySnapshot.toJSON();
  }

  return result;
}

export async function testFirestore(isServer: boolean = false): Promise<TestResults> {
  const QUERY_PATH = '/nextJsTestDynamicCollection';
  const DOCUMENT_PATH = QUERY_PATH + '/trueDoc';
  const result: TestResults = initializeTestResults();

  if (isServer) {
    result.clientSideDocumentSnapshotResult = OK_SKIPPED;
    result.clientSideDocumentSnapshotOnResumeResult = OK_SKIPPED;
    result.clientSideQuerySnapshotResult = OK_SKIPPED;
    result.clientSideQuerySnapshotOnResumeResult = OK_SKIPPED;
  }

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

    // Create a doc test.
    const document = doc(firestore, DOCUMENT_PATH);
    if (document === null) {
      return result;
    }
    result.createDocInstanceResult = OK;

    // Set a doc test.
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

    // Update a doc test.
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

    // Get a doc test.
    const docSnapshot = await getDoc(document);
    if (docSnapshot.exists()) {
      const docData = docSnapshot.data();
      if (docData && docData.testbool !== undefined && docData.testbool === false) {
        result.getDocResult = OK;
      }
    }

    // QuerySnapshot test.
    const q = query(collection(firestore, QUERY_PATH));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length === 1) {
      if (querySnapshot.docs[0].data().testbool === false) {
        result.querySnapshotResult = OK;
      }
    }

    // DocumentSnapshot bundle tests.
    if (isServer) {
      const docJson = docSnapshot.toJSON();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((docJson as any).bundle !== undefined && (docJson as any).bundle != "NOT SUPPORTED") {
        result.documentSnapshotBundleResult = OK;
      }

      // Test deserializing the documentSnapshot.
      const reconstitutedData = documentSnapshotFromJSON(firestore, docJson).data();
      if (reconstitutedData && reconstitutedData.testbool !== undefined && reconstitutedData.testbool === false) {
        result.reconstitutedDocDataResult = OK;
      }

      // Test onSnapshotResume listener.
      const bundleDocSnapshotPromise = new Promise<void>((resolve, reject) => {
        let completed: boolean = false;
        setTimeout(() => { if (!completed) reject(); }, 2000);
        const unsubscribe = onSnapshotResume(firestore, docJson, (docSnapshot: DocumentSnapshot) => {
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
      result.reconstitutedDocDataResult = OK_SKIPPED;
    }

    // QuerySnapshot bundle tests.
    if (isServer) {
      const queryJson = querySnapshot.toJSON();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((queryJson as any).bundle !== undefined && (queryJson as any).bundle != "NOT SUPPORTED") {
        result.querySnapshotBundleResult = OK;
      }

      // Test deserializing the documentSnapshot.
      const reconstitutedData = querySnapshotFromJSON(firestore, queryJson);
      if (querySnapshot.docs.length === 1 && reconstitutedData.docs[0].data().testbool === false) {
        result.reconstitutedQueryDataResult = OK;
      }

      // Test onSnapshotResume listener.
      const bundleQuerySnapshotPromise = new Promise<void>((resolve, reject) => {
        let completed: boolean = false;
        setTimeout(() => { if (!completed) reject(); }, 2000);
        const unsubscribe = onSnapshotResume(firestore, queryJson, (querySnapshot: QuerySnapshot) => {
          if (querySnapshot.docs.length === 1 && querySnapshot.docs[0].data().testbool === false) {
            result.querySnapshotOnSnapshotResumeResult = OK;
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
      result.reconstitutedQueryDataResult = OK_SKIPPED;
    }

    // Delete a doc test.
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

    // Cleanup.
    deleteApp(firebaseApp);
    result.deleteAppResult = OK;
  } catch (e) {
    console.error("Caught error: ", e);
  }
  return result;
}
