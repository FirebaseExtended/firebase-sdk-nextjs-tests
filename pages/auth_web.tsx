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
import Head from 'next/head';
import { useState, useEffect } from 'react'
import { testAuth, TestAuthResult } from '../lib/auth_test';

export default function Page() {
  const [initializeAppResult, setInitializeAppResult] = useState("FAILED");
  const [signInAnonymouslyResult, setSignInAnonymouslyResult] = useState("FAILED");
  const [getTokenResult, setGetTokenResult] = useState("FAILED");
  const [deleteUserResult, setDeleteUserResult] = useState("FAILED");
  const [deleteAppResult, setDeleteAppResult] = useState("FAILED");
  const [testStatus, setTestStatus] = useState ("running...");
  useEffect(() => { 
    const asyncTest = async () => {
      const testAuthResult : TestAuthResult = await testAuth();
      setInitializeAppResult(testAuthResult.initializeAppResult);
      setSignInAnonymouslyResult(testAuthResult.signInAnonymouslyResult);
      setGetTokenResult(testAuthResult.getTokenResult);
      setDeleteUserResult(testAuthResult.deleteUserResult);
      setDeleteAppResult(testAuthResult.deleteAppResult);
      setTestStatus("Complete!");
    }
    asyncTest().catch((e) => { 
      console.error("Error encountered during testing: ", e );
    });
  }, []);

  return (
    <>
      <Head>
        <title>Auth CSR Test</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <h1>Auth CSR Test results:</h1>
      <h2 title="testStatus">Tests {testStatus}</h2>
      <h3 title="initializeAppResult">initializeAppResult: {initializeAppResult}</h3>
      <h3 title="signInAnonymouslyResult">signInAnonymouslyResult: {signInAnonymouslyResult}</h3>
      <h3 title="getTokenResult">getTokenResult: {getTokenResult}</h3>
      <h3 title="deleteUserResult">deleteUserResult: {deleteUserResult}</h3>
      <h3 title="deleteAppResult">deleteAppResult: {deleteAppResult}</h3>
    </>
  );
}