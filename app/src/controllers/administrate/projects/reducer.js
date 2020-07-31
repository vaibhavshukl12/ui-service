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

import { combineReducers } from 'redux';
import { fetchReducer } from 'controllers/fetch';
import { paginationReducer } from 'controllers/pagination';
import { loadingReducer } from 'controllers/loading';
import { PROJECTS_PAGE } from 'controllers/pages';
import { groupOperationsReducer } from 'controllers/groupOperations';
import { ASSIGN_TO_RROJECT_SUCCESS, UNASSIGN_FROM_PROJECT_SUCCESS } from 'controllers/user';
import { queueReducers } from 'common/utils/queueReducers';
import { createPageScopedReducer } from 'common/utils/createPageScopedReducer';
import { NAMESPACE, SET_PROJECTS_VIEW_MODE, GRID_VIEW } from './constants';

export const setViewModeReducer = (state = GRID_VIEW, { type, payload }) => {
  switch (type) {
    case SET_PROJECTS_VIEW_MODE:
      return payload;

    default:
      return state;
  }
};

export const projectFetchReducer = fetchReducer(NAMESPACE, {
  contentPath: 'content',
  initialState: [],
});

export const assignProjectReducer = (state = [], { type, payload }) => {
  switch (type) {
    case ASSIGN_TO_RROJECT_SUCCESS:
      return state.map((project) =>
        project.projectName === payload.projectName
          ? { ...project, usersQuantity: project.usersQuantity + 1 }
          : project,
      );
    case UNASSIGN_FROM_PROJECT_SUCCESS: {
      const { projectName } = payload;
      return state.map((project) =>
        project.projectName === projectName
          ? { ...project, usersQuantity: project.usersQuantity - 1 }
          : project,
      );
    }
    default:
      return state;
  }
};

const reducer = combineReducers({
  projects: queueReducers(projectFetchReducer, assignProjectReducer),
  pagination: paginationReducer(NAMESPACE),
  loading: loadingReducer(NAMESPACE),
  viewMode: setViewModeReducer,
  groupOperations: groupOperationsReducer(NAMESPACE),
});

export const projectsReducer = createPageScopedReducer(reducer, PROJECTS_PAGE);
