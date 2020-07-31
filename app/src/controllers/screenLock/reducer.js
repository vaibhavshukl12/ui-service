/*
 * Copyright 2019 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { SHOW_SCREEN_LOCK, HIDE_SCREEN_LOCK } from './constants';

export const screenLockReducer = (state = { visible: false }, { type, payload }) => {
  switch (type) {
    case SHOW_SCREEN_LOCK:
      return payload;
    case HIDE_SCREEN_LOCK:
      return payload;
    default:
      return state;
  }
};
