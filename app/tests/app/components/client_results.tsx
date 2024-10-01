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
import { testApp, createTestAppResult } from '../lib/app_test';
import AppResultsDisplay from './app_results_display';

export default function ClientResults() {
  const [testStatus, setTestStatus] = useState<string>("running...");
  const [testAppResult, setTestAppResult] = useState(createTestAppResult());
  useEffect(() => {
    const asyncTest = async () => {
      setTestAppResult(await testApp());
      setTestStatus("Complete!");
    }
    asyncTest().catch((e) => {
      console.error("Error encountered during testing: ", e);
      setTestStatus("Errored!");
    });
  }, []);

  return (
    <AppResultsDisplay statusString={testStatus} testAppResult={testAppResult} />
  );
}