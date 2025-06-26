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
'use client'

import { useState, useEffect } from 'react'
import { initializeApp } from 'firebase/app';
import { testFirestore, initializeTestResults, SerializedFirestoreData, TestResults } from '@/lib/app_tests/firestore/test';
import ResultsDisplay from './results_display';
import {
  Bytes,
  DocumentSnapshot,
  documentSnapshotFromJSON,
  getFirestore,
  GeoPoint,
  Timestamp,
  onSnapshotResume,
  QuerySnapshot,
  querySnapshotFromJSON,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  VectorValue,
  vector
} from 'firebase/firestore';
import { firebaseConfig } from '@/lib/app_tests/firebase';
import { OK } from '@/lib/app_tests/util';

function validateDocumentData(documentData): boolean {
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
async function runDeserializationTests(
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
      testResults.clientSideDocumentSnapshotResult = OK;
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
              testResults.clientSideDocumentSnapshotOnResumeResult = OK;
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
      testResults.clientSideQuerySnapshotResult = OK;
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
            testResults.clientSideQuerySnapshotOnResumeResult = OK;
            unsubscribe();
            completed = true;
            resolve();
          }
        });
    });
    await bundleQuerySnapshotPromise;
  }

  if(serializedFirestoreData.bytesJson !== null) {
    const bytes = Bytes.fromJSON(serializedFirestoreData.bytesJson);
    if(bytes.isEqual(Bytes.fromUint8Array(new Uint8Array([0, 1, 2, 3, 4, 5])))) {
      testResults.clientSideDeserializedBytesResult = OK;
    }
  }

  if(serializedFirestoreData.geoPointJson !== null) {
    const geoPoint = GeoPoint.fromJSON(serializedFirestoreData.geoPointJson);
    if(geoPoint.latitude === 1 && geoPoint.longitude === 2) {
      testResults.clientSideDeserializedGeoPointResult = OK;
    }
  }

  if(serializedFirestoreData.timestampJson !== null) {
    const timestamp = Timestamp.fromJSON(serializedFirestoreData.timestampJson);
    if(timestamp.seconds === 123 && timestamp.nanoseconds === 456) { 
      testResults.clientSideDeserializedTimestampResult = OK;
    }
  }

  if(serializedFirestoreData.vectorValueJson !== null) {
    const num: number[] = [1, 2, 3];
    const deserializedVectorValue = VectorValue.fromJSON(serializedFirestoreData.vectorValueJson);
    const controlVectorValue = vector(num);
    if(deserializedVectorValue.isEqual(controlVectorValue)) {
      testResults.clientSideDeserializedVectorValueResult =  OK;
    }
  }
  
  return testResults;
}

export default function CsrTestRunner(props) {
  const [testStatus, setTestStatus] = useState<string>("running...");
  const [testResults, setTestResults] = useState(initializeTestResults());
  useEffect(() => {
    const asyncTest = async () => {
      let testResults = await testFirestore(/* isServer= */ false);
      testResults = await runDeserializationTests(testResults, props.serializedFirestoreData);
      setTestResults(testResults);
      setTestStatus("Complete!");
    }
    asyncTest().catch((e) => {
      console.error("Error encountered during testing: ", e);
      setTestStatus("Errored!");
    });
  }, [props.serializedFirestoreData]);

  return (
    <ResultsDisplay statusString={testStatus} testResults={testResults} />
  );
}
