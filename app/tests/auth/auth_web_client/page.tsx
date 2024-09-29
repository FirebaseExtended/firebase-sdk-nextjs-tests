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
import Link from 'next/link';
import ClientResults from './client_results';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Auth Web SDK CSR test',
}

export default function Page() {
  return (
    <>
      <h1>Auth CSR Test results:</h1>
      <ClientResults/>
      <p/>
      <Link href="/">Back to test index</Link>
    </>
  );
}