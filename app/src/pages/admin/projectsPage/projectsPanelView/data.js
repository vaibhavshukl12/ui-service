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

export const state = {
  user: {
    info: {
      id: 1,
      userId: 'superadmin',
      email: 'superadminemail@domain.com',
      photoId: 'L2RhdGEvc3RvcmFnZS9zdXBlcmFkbWlu',
      fullName: 'tester',
      accountType: 'INTERNAL',
      userRole: 'ADMINISTRATOR',
      photoLoaded: true,
      metadata: {
        last_login: 1552559284869,
      },
      assignedProjects: {
        admin_personal: {
          projectRole: 'PROJECT_MANAGER',
          entryType: 'PERSONAL',
        },
        testlongname_personal: {
          projectRole: 'PROJECT_MANAGER',
          entryType: 'PERSONAL',
        },
        tester_personal: {
          projectRole: 'PROJECT_MANAGER',
          entryType: 'PERSONAL',
        },
        superadmin_personal: {
          projectRole: 'PROJECT_MANAGER',
          entryType: 'PERSONAL',
        },
        admin_personal_1: {
          projectRole: 'PROJECT_MANAGER',
          entryType: 'PERSONAL',
        },
        test352041_personal: {
          projectRole: 'PROJECT_MANAGER',
          entryType: 'PERSONAL',
        },
      },
    },
    activeProject: 'superadmin_personal',
    settings: {
      startTimeFormat: 'relative',
      photoTimeStamp: 1552561241887,
    },
    token: '09b8b872-64fb-42fb-8906-32ff23af1eea',
  },
  administrate: {
    events: {
      events: [],
      pagination: {},
      loading: false,
    },
    allUsers: {
      allUsers: [],
      pagination: {},
      loading: false,
      groupOperations: {
        selectedItems: [],
        errors: {},
        lastOperation: '',
      },
    },
    projects: {
      projects: [
        {
          id: 1,
          projectName: 'superadmin_personal',
          usersQuantity: 3,
          launchesQuantity: 36,
          launchesPerUser: null,
          uniqueTickets: null,
          launchesPerWeek: null,
          lastRun: 1553585182771,
          creationDate: 1553072627019,
          entryType: 'PERSONAL',
          organization: null,
        },
        {
          id: 2,
          projectName: 'default_personal',
          usersQuantity: 1,
          launchesQuantity: 29,
          launchesPerUser: null,
          uniqueTickets: null,
          launchesPerWeek: null,
          lastRun: 1553504640289,
          creationDate: 1553072627019,
          entryType: 'PERSONAL',
          organization: null,
        },
        {
          id: 73,
          projectName: 'vasya_personal',
          usersQuantity: 0,
          launchesQuantity: 0,
          launchesPerUser: null,
          uniqueTickets: null,
          launchesPerWeek: null,
          lastRun: null,
          creationDate: 1553076863303,
          entryType: 'PERSONAL',
          organization: null,
        },
        {
          id: 74,
          projectName: 'petya_personal',
          usersQuantity: 0,
          launchesQuantity: 0,
          launchesPerUser: null,
          uniqueTickets: null,
          launchesPerWeek: null,
          lastRun: null,
          creationDate: 1553077318245,
          entryType: 'PERSONAL',
          organization: null,
        },
        {
          id: 75,
          projectName: 'kolya_personal',
          usersQuantity: 0,
          launchesQuantity: 0,
          launchesPerUser: null,
          uniqueTickets: null,
          launchesPerWeek: null,
          lastRun: null,
          creationDate: 1553077471117,
          entryType: 'PERSONAL',
          organization: null,
        },
        {
          id: 76,
          projectName: 'roma_personal',
          usersQuantity: 0,
          launchesQuantity: 0,
          launchesPerUser: null,
          uniqueTickets: null,
          launchesPerWeek: null,
          lastRun: null,
          creationDate: 1553077530008,
          entryType: 'PERSONAL',
          organization: null,
        },
      ],
      pagination: {
        number: 1,
        size: 12,
        totalElements: 760,
        totalPages: 64,
      },
      loading: false,
      viewMode: 'grid',
      groupOperations: {
        selectedItems: [],
        errors: {},
        lastOperation: '',
      },
    },
  },
};
