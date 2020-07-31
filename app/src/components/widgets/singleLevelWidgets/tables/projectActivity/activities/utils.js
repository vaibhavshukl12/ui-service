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

import { PROJECT_LOG_PAGE, PROJECT_SETTINGS_TAB_PAGE, TEST_ITEM_PAGE } from 'controllers/pages';
import { ALL } from 'common/constants/reservedFilterIds';
import { getItemLevel } from 'controllers/testItem';
import { LEVEL_STEP } from 'common/constants/launchLevels';

export const getProjectSettingTabPageLink = (projectId, settingsTab) => ({
  type: PROJECT_SETTINGS_TAB_PAGE,
  payload: { projectId, settingsTab },
});

export const getTestItemPageLink = (projectId, testItemIds, itemType) => ({
  type: getItemLevel(itemType) === LEVEL_STEP ? PROJECT_LOG_PAGE : TEST_ITEM_PAGE,
  payload: {
    projectId,
    filterId: ALL,
    testItemIds,
  },
});
