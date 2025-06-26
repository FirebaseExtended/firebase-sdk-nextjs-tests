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
  Bytes,
  collection,
  DocumentSnapshot,
  deleteDoc,
  doc,
  documentSnapshotFromJSON,
  GeoPoint,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  onSnapshotResume,
  QuerySnapshot,
  query,
  querySnapshotFromJSON,
  setDoc,
  Timestamp,
  updateDoc,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  VectorValue,
  vector
} from 'firebase/firestore';
import { firebaseConfig } from '@/lib/app_tests/firebase';
import { OK, FAILED, OK_SKIPPED } from '@/lib/app_tests/util';


// Data used to create and validate Firestore data types for
// toJSON/fromJSON tests.
const BYTES_DATA : Uint8Array = new Uint8Array([0, 1, 2, 3, 4, 5]);
const GEOPOINT_LATITTUDE : number = 1;
const GEOPOINT_LONGITITUDE : number  = 2;
const TIMESTAMP_SECONDS : number = 123;
const TIMESTAMP_NANOSECONDS : number= 456;
const VECTOR_NUM_ARRAY : number[]= [1, 2, 3];


/**
 * A structure that contains all of the results that playwright will ensure
 * are set to OK.  Note that TestResults needs to be a simple object (and
 * not a class) so that it may be passed across the SSR / CSR divide
 */
export type TestResults = {
  // Tests that are done in both the SSR and CSR phase.
  initializeAppResult: string,
  initializeFirestoreResult: string,
  createDocInstanceResult: string,
  setDocResult: string,
  onSnapshotSetDocResult: string,
  updateDocResult: string,
  onSnapshotUpdateDocResult: string,
  getDocResult: string,
  querySnapshotGetDocsResult: string,
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

  // Tests that are only specific to the desrialization of Firestore
  // types within the CSR phase.
  csrDocumentSnapshotResult: string,
  csrDocumentSnapshotOnResumeResult: string,
  csrQuerySnapshotResult: string
  csrQuerySnapshotOnResumeResult: string,
  csrDeserializedBytesResult: string,
  csrDeserializedGeoPointResult: string,
  csrDeserializedTimestampResult: string,
  csrDeserializedVectorValueResult: string
};

/**
 * Returns a {@link TestResults} initialized with a failure condition for
 * all fields.
 */
export function initializeTestResults(): TestResults {
  return {
    // SSR & CSR tests.
    initializeAppResult: FAILED,
    initializeFirestoreResult: FAILED,
    createDocInstanceResult: FAILED,
    setDocResult: FAILED,
    onSnapshotSetDocResult: FAILED,
    updateDocResult: FAILED,
    onSnapshotUpdateDocResult: FAILED,
    getDocResult: FAILED,
    querySnapshotGetDocsResult: FAILED,
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

    // CSR only tests.
    csrDocumentSnapshotResult: FAILED,
    csrDocumentSnapshotOnResumeResult: FAILED,
    csrQuerySnapshotResult: FAILED,
    csrQuerySnapshotOnResumeResult: FAILED,
    csrDeserializedBytesResult: FAILED,
    csrDeserializedGeoPointResult: FAILED,
    csrDeserializedTimestampResult: FAILED,
    csrDeserializedVectorValueResult: FAILED
  };
}

/**
 * Used by the 'firestore/web_client/page.tsx' to pass serialized
 * data from the SSR pahse to the CSR phase.
 */
export type SerializedFirestoreData = {
  documentSnapshotJson: object | null,
  querySnapshotJson: object | null,
  bytesJson: object | null,
  geoPointJson: object | null,
  timestampJson: object | null,
  vectorValueJson: object | null
}

/**
 * Util function that ensures the document in the Firestore service instance
 * is of the same type as we expect in these tests.
 */
async function setExpectedSerializedDataInFirestore(firestore, path) {
  const docRef = doc(firestore, path);

  await setDoc(docRef, {
    aBoolean: true,
    aName: "A name",
    aNull: null,
    anInteger: 1234
  });
}

/**
 * Returns a populated {@link SerializedFirestoreData} with Json serialized data.
 * This data can be validated by invoking {@link testSerializedFirestoreData}.
 * 
 * The intended flow is for the CSR tests to render a page with both SSR and CSR logic.
 * The SSR logic builds out this serialized data. The data is then passed to the CSR
 * phase via Next JS component parameters. The CSR component then invokes {@link
 * testSerializedFirestoreData} to deserialized the data and ensure it matches
 * the expected values.
 */
export async function buildSerializedFirestoreData(): Promise<SerializedFirestoreData> {
  const QUERY_PATH = '/nextJsTestStaticCollection_DoNotDelete';
  const DOCUMENT_PATH = QUERY_PATH + '/doc';
  const result: SerializedFirestoreData = {
    documentSnapshotJson: null,
    querySnapshotJson: null,
    bytesJson: null,
    geoPointJson: null,
    timestampJson: null,
    vectorValueJson: null
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

  result.bytesJson = Bytes.fromUint8Array(BYTES_DATA).toJSON();
  result.geoPointJson = new GeoPoint(GEOPOINT_LATITTUDE, GEOPOINT_LONGITITUDE).toJSON();
  result.timestampJson = new Timestamp(TIMESTAMP_SECONDS, TIMESTAMP_NANOSECONDS).toJSON();
  result.vectorValueJson = vector(VECTOR_NUM_ARRAY).toJSON();

  return result;
}

/**
 * 
 * @param testResults the state tests that may have already been executed.
 * @param serializedFirestoreData an instance of the data that was JSON serialized
 * in the SSR phase.
 * @returns the TestResults object updated with the results of these tests.
 */
export async function testSerializedFirestoreData(
  testResults: TestResults,
  serializedFirestoreData: SerializedFirestoreData
): Promise<TestResults> {
  const firebase = initializeApp(firebaseConfig);
  const firestore = getFirestore(firebase);

  // DocumentSnapshotTests
  if (serializedFirestoreData.documentSnapshotJson != null) {
    const snapshot = documentSnapshotFromJSON(firestore, serializedFirestoreData.documentSnapshotJson);
    const data = snapshot.data();
    if (validateDocumentData(data)) {
      testResults.csrDocumentSnapshotResult = OK;
    }

    // onResume Test
    const bundleDocSnapshotPromise = new Promise<void>((resolve, reject) => {
      let completed: boolean = false;
      setTimeout(() => { if (!completed) reject(); }, 2000);
      const unsubscribe = onSnapshotResume(
        firestore,
        serializedFirestoreData.documentSnapshotJson!,
        (docSnapshot: DocumentSnapshot
        ) => {
          if (docSnapshot.exists()) {
            if (validateDocumentData(docSnapshot.data())) {
              unsubscribe();
              testResults.csrDocumentSnapshotOnResumeResult = OK;
              completed = true;
              resolve();
            }
          }
        });
    });
    await bundleDocSnapshotPromise;
  }

  // QuerySnapshotTests
  if (serializedFirestoreData.querySnapshotJson != null) {
    const snapshot = querySnapshotFromJSON(firestore, serializedFirestoreData.querySnapshotJson);
    if (snapshot.docs.length === 1 && validateDocumentData(snapshot.docs[0].data())) {
      testResults.csrQuerySnapshotResult = OK;
    }

    // onResume test
    const bundleQuerySnapshotPromise = new Promise<void>((resolve, reject) => {
      let completed: boolean = false;
      setTimeout(() => { if (!completed) reject(); }, 2000);
      const unsubscribe = onSnapshotResume(
        firestore,
        serializedFirestoreData.querySnapshotJson!,
        (querySnapshot: QuerySnapshot
        ) => {
          if (querySnapshot.docs.length === 1 && validateDocumentData(querySnapshot.docs[0].data())) {
            testResults.csrQuerySnapshotOnResumeResult = OK;
            unsubscribe();
            completed = true;
            resolve();
          }
        });
    });
    await bundleQuerySnapshotPromise;
  }

  // Other data type tests.
  if(serializedFirestoreData.bytesJson !== null) {
    const bytes = Bytes.fromJSON(serializedFirestoreData.bytesJson);
    if(bytes.isEqual(Bytes.fromUint8Array(BYTES_DATA))) {
      testResults.csrDeserializedBytesResult = OK;
    }
  }

  if(serializedFirestoreData.geoPointJson !== null) {
    const geoPoint = GeoPoint.fromJSON(serializedFirestoreData.geoPointJson);
    if(geoPoint.latitude === GEOPOINT_LATITTUDE && geoPoint.longitude === GEOPOINT_LONGITITUDE) {
      testResults.csrDeserializedGeoPointResult = OK;
    }
  }

  if(serializedFirestoreData.timestampJson !== null) {
    const timestamp = Timestamp.fromJSON(serializedFirestoreData.timestampJson);
    if(timestamp.seconds === TIMESTAMP_SECONDS && timestamp.nanoseconds === TIMESTAMP_NANOSECONDS) { 
      testResults.csrDeserializedTimestampResult = OK;
    }
  }

  if(serializedFirestoreData.vectorValueJson !== null) {
    const deserializedVectorValue = VectorValue.fromJSON(serializedFirestoreData.vectorValueJson);
    const controlVectorValue = vector(VECTOR_NUM_ARRAY);
    if(deserializedVectorValue.isEqual(controlVectorValue)) {
      testResults.csrDeserializedVectorValueResult =  OK;
    }
  }
  
  return testResults;
}

/**
 * Ensures the content of the document queried from Firestore matches the
 * format that the tests expect.
 */
export function validateDocumentData(documentData): boolean {
  if (documentData !== undefined) {
    if (
      documentData.aBoolean && documentData.aBoolean === true &&
      documentData.aName && documentData.aName === "A name" &&
      documentData.anInteger && documentData.anInteger === 1234) {
      return true;
    }
  }
  return false;
}


/**
 * The standard playwright tests.
 */
export async function testFirestore(isServer: boolean = false): Promise<TestResults> {
  const QUERY_PATH = '/nextJsTestDynamicCollection';
  const DOCUMENT_PATH = QUERY_PATH + '/trueDoc';
  const result: TestResults = initializeTestResults();

  if (isServer) {
    result.csrDocumentSnapshotResult = OK_SKIPPED;
    result.csrDocumentSnapshotOnResumeResult = OK_SKIPPED;
    result.csrQuerySnapshotResult = OK_SKIPPED;
    result.csrQuerySnapshotOnResumeResult = OK_SKIPPED;
    result.csrDeserializedBytesResult = OK_SKIPPED;
    result.csrDeserializedGeoPointResult = OK_SKIPPED;
    result.csrDeserializedTimestampResult = OK_SKIPPED;
    result.csrDeserializedVectorValueResult = OK_SKIPPED;
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
        result.querySnapshotGetDocsResult = OK;
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
