/**
 * @license
 * Copyright 2025 Google LLC
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
import { initializeApp } from 'firebase/app';
import {
  GenerationConfig,
  HarmBlockThreshold,
  HarmCategory,
  Content,
  SafetySetting,
  getAI,
  getGenerativeModel,
  GoogleAIBackend
} from 'firebase/ai';
import { firebaseConfig } from '@/lib/app_tests/firebase';
import { OK, FAILED } from '@/lib/app_tests/util';

export type TestResults = {
  initializeAppResult: string,
  getAIResult: string,
  getGenerativeModelResult: string,
  startChatResult: string,
  chatSendFirstMessageResult: string,
  chatFirstResponseCheckResult: string,
  chatSendSecondMessageResult: string,
  chatSecondResponseCheckResult: string,
  getHistoryResult: string,
};

export function initializeTestResults(): TestResults {
  const testAnalyticsResult: TestResults = {
    initializeAppResult: FAILED,
    getAIResult: FAILED,
    getGenerativeModelResult: FAILED,
    startChatResult: FAILED,
    chatSendFirstMessageResult: FAILED,
    chatFirstResponseCheckResult: FAILED,
    chatSendSecondMessageResult: FAILED,
    chatSecondResponseCheckResult: FAILED,
    getHistoryResult: FAILED,
  };
  return testAnalyticsResult;
}

const commonGenerationConfig: GenerationConfig = {
  temperature: 0,
  topP: 0,
  responseMimeType: 'text/plain'
};

const commonSafetySettings: SafetySetting[] = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE
  }
];

const commonSystemInstruction: Content = {
  role: 'system',
  parts: [
    {
      text: 'You are a friendly and helpful assistant.'
    }
  ]
};

export async function testAI(isServer: boolean = false): Promise<TestResults> {
  if (isServer) {
    console.log("Server side");
  }
  const result: TestResults = initializeTestResults();
  const firebaseApp = initializeApp(firebaseConfig);
  result.initializeAppResult = OK;

  result.signInAnonymouslyResult = OK;

  const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });
  result.getAIResult = OK;

  const model = getGenerativeModel(ai, {
    model: "gemini-2.5-flash",
    generationConfig: commonGenerationConfig,
    safetySettings: commonSafetySettings,
    systemInstruction: commonSystemInstruction
  });
  result.getGenerativeModelResult = OK;

  const chat = model.startChat();
  result.startChatResult = OK;

  const result1 = await chat.sendMessage(
    'What is the capital of France?'
  );
  result.chatSendFirstMessageResult = OK;

  const response1 = result1.response;
  if (response1.text().length !== 0) {
    result.chatFirstResponseCheckResult = OK;
  }

  const result2 = await chat.sendMessage('And what about Italy?');
  result.chatSendSecondMessageResult = OK;

  const response2 = result2.response;
  if (response2.text().length !== 0) {
    result.chatSecondResponseCheckResult = OK;
  }

  const history = await chat.getHistory();
  if (history.length !== 0) {
    result.getHistoryResult = OK;
  }

  return result;
}
