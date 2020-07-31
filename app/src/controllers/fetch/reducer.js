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

import { FETCH_SUCCESS, DEFAULT_OPTIONS, FETCH_ERROR, CONCAT_FETCH_SUCCESS } from './constants';

const computeInitialState = (options) => {
  if (!Object.prototype.hasOwnProperty.call(options, 'initialState')) {
    return DEFAULT_OPTIONS.initialState;
  }
  return options.initialState;
};

export const fetchReducer = (namespace, options = DEFAULT_OPTIONS) => (
  state = computeInitialState(options),
  { type, payload, meta, concat },
) => {
  if (meta && meta.namespace && meta.namespace !== namespace) {
    return state;
  }
  const contentPath = options.contentPath || DEFAULT_OPTIONS.contentPath;
  switch (type) {
    case FETCH_SUCCESS:
      return contentPath ? payload[contentPath] : payload;
    case CONCAT_FETCH_SUCCESS: {
      const data = contentPath ? payload[contentPath] : payload;

      if (data instanceof Array && concat) {
        return state.concat(data);
      }
      return data;
    }
    case FETCH_ERROR:
      return computeInitialState(options);
    default:
      return state;
  }
};
