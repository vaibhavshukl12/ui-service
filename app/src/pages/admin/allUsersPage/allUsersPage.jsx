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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, defineMessages } from 'react-intl';
import track from 'react-tracking';
import { PageLayout, PageHeader, PageSection } from 'layouts/pageLayout';
import { PaginationToolbar } from 'components/main/paginationToolbar';
import { withPagination, DEFAULT_PAGINATION, SIZE_KEY, PAGE_KEY } from 'controllers/pagination';
import { showScreenLockAction, hideScreenLockAction } from 'controllers/screenLock';
import { showNotification, NOTIFICATION_TYPES } from 'controllers/notification';
import { ADMIN_ALL_USERS_PAGE_EVENTS } from 'components/main/analytics/events';
import { NoItemMessage } from 'components/main/noItemMessage';
import { fetch } from 'common/utils';
import { URLS } from 'common/urls';
import {
  allUsersSelector,
  allUsersPaginationSelector,
  loadingSelector,
  toggleUserSelectionAction,
  toggleAllUsersAction,
  selectedUsersSelector,
  deleteItemsAction,
  unselectAllUsersAction,
  fetchAllUsersAction,
  DEFAULT_SORT_COLUMN,
} from 'controllers/administrate/allUsers';
import { userInfoSelector, userIdSelector } from 'controllers/user';
import { COMMON_LOCALE_KEYS } from 'common/constants/localization';
import { SORTING_ASC, withSortingURL } from 'controllers/sorting';
import { UsersToolbar } from './usersToolbar';
import { AllUsersGrid } from './allUsersGrid';

const messages = defineMessages({
  pageTitle: {
    id: 'administrateUsersPage.allUsers',
    defaultMessage: 'All users',
  },
  deleteModalHeader: {
    id: 'administrateUsersPage.deleteModalHeader',
    defaultMessage: 'Delete user',
  },
  deleteModalMultipleHeader: {
    id: 'administrateUsersPage.deleteModalMultipleHeader',
    defaultMessage: "Delete user's",
  },
  deleteModalContent: {
    id: 'administrateUsersPage.deleteModalContent',
    defaultMessage: 'Are you sure you want to delete user {name}?',
  },
  deleteModalMultipleContent: {
    id: 'administrateUsersPage.deleteModalMultipleContent',
    defaultMessage: 'Are you sure you want to delete users {names}?',
  },
  success: {
    id: 'administrateUsersPage.success',
    defaultMessage: 'User was deleted',
  },
  successMultiple: {
    id: 'administrateUsersPage.successMultiple',
    defaultMessage: 'Users were deleted',
  },
  error: {
    id: 'administrateUsersPage.error',
    defaultMessage: 'Error when deleting user',
  },
  errorMultiple: {
    id: 'administrateUsersPage.errorMultiple',
    defaultMessage: "Error when deleting user's",
  },
});

@track()
@connect(
  (state) => ({
    url: URLS.allUsers(state),
    users: allUsersSelector(state),
    loading: loadingSelector(state),
    selectedUsers: selectedUsersSelector(state),
    userInfo: userInfoSelector(state),
    userId: userIdSelector(state),
  }),
  {
    toggleUserSelectionAction,
    toggleAllUsersAction,
    deleteItemsAction,
    showScreenLockAction,
    hideScreenLockAction,
    showNotification,
    unselectAllUsersAction,
    fetchAllUsersAction,
  },
)
@withSortingURL({
  defaultFields: [DEFAULT_SORT_COLUMN],
  defaultDirection: SORTING_ASC,
})
@withPagination({
  paginationSelector: allUsersPaginationSelector,
})
@injectIntl
export class AllUsersPage extends Component {
  static propTypes = {
    activePage: PropTypes.number,
    itemCount: PropTypes.number,
    pageCount: PropTypes.number,
    pageSize: PropTypes.number,
    sortingColumn: PropTypes.string,
    sortingDirection: PropTypes.string,
    onChangeSorting: PropTypes.func,
    showModalAction: PropTypes.func,
    onChangePage: PropTypes.func,
    onChangePageSize: PropTypes.func,
    loading: PropTypes.bool,
    users: PropTypes.arrayOf(PropTypes.object),
    selectedUsers: PropTypes.arrayOf(PropTypes.object),
    intl: PropTypes.object.isRequired,
    toggleAllUsersAction: PropTypes.func,
    unselectAllUsersAction: PropTypes.func,
    toggleUserSelectionAction: PropTypes.func,
    userInfo: PropTypes.object,
    deleteItemsAction: PropTypes.func,
    userId: PropTypes.string,
    showScreenLockAction: PropTypes.func,
    hideScreenLockAction: PropTypes.func,
    showNotification: PropTypes.func,
    fetchAllUsersAction: PropTypes.func,
    tracking: PropTypes.shape({
      trackEvent: PropTypes.func,
      getTrackingData: PropTypes.func,
    }).isRequired,
  };

  static defaultProps = {
    activePage: DEFAULT_PAGINATION[PAGE_KEY],
    itemCount: null,
    pageCount: null,
    pageSize: DEFAULT_PAGINATION[SIZE_KEY],
    sortingColumn: null,
    sortingDirection: null,
    userId: '',
    onChangeSorting: () => {},
    showModalAction: () => {},
    onChangePage: () => {},
    onChangePageSize: () => {},
    loading: false,
    users: [],
    selectedUsers: [],
    toggleAllUsersAction: () => {},
    unselectAllUsersAction: () => {},
    toggleUserSelectionAction: () => {},
    userInfo: {},
    deleteItemsAction: () => {},
    showScreenLockAction: () => {},
    hideScreenLockAction: () => {},
    showNotification: () => {},
    fetchAllUsersAction: () => {},
  };

  componentWillUnmount() {
    this.props.unselectAllUsersAction();
  }

  getBreadcrumbs = () => [
    {
      title: this.props.intl.formatMessage(messages.pageTitle),
    },
  ];
  get excludeFromSelection() {
    const { userInfo } = this.props;
    return [userInfo];
  }
  get selectedUsersNames() {
    return this.props.selectedUsers.map((user) => `'<b>${user.fullName}</b>'`).join(', ');
  }
  get usersAvailableForSelection() {
    const {
      users,
      userInfo: { id },
    } = this.props;
    return users.filter((user) => user.id !== id);
  }
  handleOneUserSelection = (value) => {
    this.props.toggleUserSelectionAction(value);
  };
  handleToggleAllUserSelection = () => {
    const users = this.usersAvailableForSelection;
    this.props.toggleAllUsersAction(users);
  };
  confirmDeleteItems = (items) => {
    const ids = items.map((item) => item.id);
    this.props.showScreenLockAction();
    fetch(URLS.user(), {
      method: 'delete',
      data: {
        ids,
      },
    })
      .then(() => {
        this.props.unselectAllUsersAction();
        this.props.fetchAllUsersAction();
        this.props.hideScreenLockAction();
        this.props.showNotification({
          message:
            items.length === 1
              ? this.props.intl.formatMessage(messages.success)
              : this.props.intl.formatMessage(messages.successMultiple),
          type: NOTIFICATION_TYPES.SUCCESS,
        });
      })
      .catch(() => {
        this.props.hideScreenLockAction();
        this.props.showNotification({
          message:
            items.length === 1
              ? this.props.intl.formatMessage(messages.error)
              : this.props.intl.formatMessage(messages.errorMultiple),
          type: NOTIFICATION_TYPES.ERROR,
        });
      });
  };
  handlerDelete = () => {
    const { selectedUsers, intl, tracking } = this.props;
    tracking.trackEvent(ADMIN_ALL_USERS_PAGE_EVENTS.DELETE_BTN);
    this.props.deleteItemsAction(this.props.selectedUsers, {
      onConfirm: this.confirmDeleteItems,
      header:
        selectedUsers.length === 1
          ? intl.formatMessage(messages.deleteModalHeader)
          : intl.formatMessage(messages.deleteModalMultipleHeader),
      mainContent:
        selectedUsers.length === 1
          ? intl.formatMessage(messages.deleteModalContent, { name: this.selectedUsersNames })
          : intl.formatMessage(messages.deleteModalMultipleContent, {
              names: this.selectedUsersNames,
            }),
      eventsInfo: {
        closeIcon: ADMIN_ALL_USERS_PAGE_EVENTS.CLOSE_ICON_DELETE_MODAL,
        cancelBtn: ADMIN_ALL_USERS_PAGE_EVENTS.CANCEL_BTN_DELETE_MODAL,
        deleteBtn: ADMIN_ALL_USERS_PAGE_EVENTS.DELETE_BTN_DELETE_MODAL,
      },
    });
  };
  render() {
    const {
      activePage,
      itemCount,
      pageCount,
      pageSize,
      onChangePage,
      onChangePageSize,
      loading,
      users,
      selectedUsers,
      intl,
      sortingColumn,
      sortingDirection,
      onChangeSorting,
    } = this.props;
    return (
      <PageLayout>
        <PageHeader breadcrumbs={this.getBreadcrumbs()} />
        <PageSection>
          <UsersToolbar onDelete={this.handlerDelete} selectedUsers={selectedUsers} />
          <AllUsersGrid
            data={users}
            loading={loading}
            selectedItems={selectedUsers}
            onToggleSelection={this.handleOneUserSelection}
            excludeFromSelection={this.excludeFromSelection}
            onToggleSelectAll={this.handleToggleAllUserSelection}
            sortingColumn={sortingColumn}
            sortingDirection={sortingDirection}
            onChangeSorting={onChangeSorting}
          />
          {!!pageCount && !loading && (
            <PaginationToolbar
              activePage={activePage}
              itemCount={itemCount}
              pageCount={pageCount}
              pageSize={pageSize}
              onChangePage={onChangePage}
              onChangePageSize={onChangePageSize}
            />
          )}
          {!users.length && !loading && (
            <NoItemMessage message={intl.formatMessage(COMMON_LOCALE_KEYS.NO_RESULTS)} />
          )}
        </PageSection>
      </PageLayout>
    );
  }
}
