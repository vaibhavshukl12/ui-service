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
import track from 'react-tracking';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import { ALIGN_CENTER, Grid } from 'components/main/grid';
import { FILTERS_PAGE_EVENTS } from 'components/main/analytics/events';
import { PROJECT_LAUNCHES_PAGE } from 'controllers/pages';
import { canDeleteFilter } from 'common/utils/permissions';
import { FilterName } from './filterName';
import { FilterOptions } from './filterOptions';
import { ShareFilter } from './shareFilter';
import { DisplayFilter } from './displayFilter';
import { DeleteFilterButton } from './deleteFilterButton';
import styles from './filterGrid.scss';

const cx = classNames.bind(styles);
const messages = defineMessages({
  nameCol: { id: 'MembersGrid.nameCol', defaultMessage: 'Filter name' },
  optionsCol: { id: 'MembersGrid.optionsCol', defaultMessage: 'Options' },
  ownerCol: { id: 'MembersGrid.ownerCol', defaultMessage: 'Owner' },
  sharedCol: { id: 'MembersGrid.sharedCol', defaultMessage: 'Shared' },
  displayCol: { id: 'MembersGrid.displayCol', defaultMessage: 'Display on launches' },
  deleteCol: { id: 'MembersGrid.deleteCol', defaultMessage: 'Delete' },
});

const NameColumn = ({ className, value, customProps }) => (
  <div className={cx('name-col', className)}>
    <FilterName
      userFilters={customProps.userFilters}
      filter={value}
      onClickName={customProps.onClickName}
      onEdit={customProps.onEdit}
      userId={customProps.userId}
      nameLink={{
        type: PROJECT_LAUNCHES_PAGE,
        payload: { projectId: customProps.activeProject, filterId: value.id },
      }}
      isLink
      isBold
      noShareIcons
      userRole={customProps.userRole}
      projectRole={customProps.projectRole}
    />
  </div>
);
NameColumn.propTypes = {
  className: PropTypes.string.isRequired,
  value: PropTypes.object,
  customProps: PropTypes.object,
};
NameColumn.defaultProps = {
  value: {},
  customProps: {},
};

const OptionsColumn = ({ className, value }) => (
  <div className={cx('options-col', className)}>
    <FilterOptions entities={value.conditions} sort={value.orders} />
  </div>
);
OptionsColumn.propTypes = {
  className: PropTypes.string.isRequired,
  value: PropTypes.object,
};
OptionsColumn.defaultProps = {
  value: {},
};

const OwnerColumn = ({ className, value }) => (
  <div className={cx('owner-col', className)}>
    <div className={cx('mobile-label', 'owner-label')}>
      <FormattedMessage id={'OwnerColumn.owner'} defaultMessage={'Owner:'} />
    </div>
    {value.owner}
  </div>
);
OwnerColumn.propTypes = {
  className: PropTypes.string.isRequired,
  value: PropTypes.object,
};
OwnerColumn.defaultProps = {
  value: {},
};

const SharedColumn = ({ className, value, customProps }) => (
  <div className={cx('shared-col', className)}>
    <ShareFilter userId={customProps.userId} filter={value} onEdit={customProps.onEdit} />
  </div>
);
SharedColumn.propTypes = {
  className: PropTypes.string.isRequired,
  value: PropTypes.object,
  customProps: PropTypes.object,
};
SharedColumn.defaultProps = {
  value: {},
  customProps: {},
};

const DisplayOnLaunchColumn = ({ className, value, customProps }) => (
  <div className={cx('display-col', className)}>
    <DisplayFilter
      filter={value}
      onChangeDisplay={customProps.onChangeDisplay}
      userFilters={customProps.userFilters}
    />
  </div>
);
DisplayOnLaunchColumn.propTypes = {
  className: PropTypes.string.isRequired,
  value: PropTypes.object,
  customProps: PropTypes.object,
};
DisplayOnLaunchColumn.defaultProps = {
  value: {},
  customProps: {},
};

const DeleteColumn = ({ className, value, customProps }) => (
  <div className={cx('delete-col', className)}>
    <DeleteFilterButton
      filter={value}
      canDelete={canDeleteFilter(
        customProps.accountRole,
        customProps.projectRole,
        customProps.userId === value.owner,
      )}
      onDelete={customProps.onDelete}
    />
  </div>
);
DeleteColumn.propTypes = {
  className: PropTypes.string.isRequired,
  value: PropTypes.object,
  customProps: PropTypes.object,
};
DeleteColumn.defaultProps = {
  value: {},
  customProps: {},
};

@injectIntl
@track()
export class FilterGrid extends Component {
  static propTypes = {
    filters: PropTypes.arrayOf(PropTypes.object),
    intl: PropTypes.object.isRequired,
    userFilters: PropTypes.arrayOf(PropTypes.object),
    onEdit: PropTypes.func,
    userId: PropTypes.string,
    showFilterOnLaunchesAction: PropTypes.func,
    hideFilterOnLaunchesAction: PropTypes.func,
    projectRole: PropTypes.string,
    onDelete: PropTypes.func,
    accountRole: PropTypes.string,
    loading: PropTypes.bool,
    tracking: PropTypes.shape({
      trackEvent: PropTypes.func,
      getTrackingData: PropTypes.func,
    }).isRequired,
    activeProject: PropTypes.string,
  };

  static defaultProps = {
    filters: [],
    userFilters: [],
    onEdit: () => {},
    showFilterOnLaunchesAction: () => {},
    hideFilterOnLaunchesAction: () => {},
    userId: '',
    projectRole: '',
    onDelete: () => {},
    accountRole: '',
    loading: false,
    activeProject: null,
  };

  getColumns = () => [
    {
      id: 'name',
      title: {
        full: this.props.intl.formatMessage(messages.nameCol),
      },
      component: NameColumn,
      customProps: {
        userFilters: this.props.userFilters,
        onClickName: (filter) => {
          const isActiveFilter = this.props.userFilters.find((item) => item.id === filter.id);
          if (!isActiveFilter) {
            this.props.showFilterOnLaunchesAction(filter);
          }
          this.props.tracking.trackEvent(FILTERS_PAGE_EVENTS.CLICK_FILTER_NAME);
        },
        onEdit: (filter) => {
          this.props.onEdit(filter);
          this.props.tracking.trackEvent(FILTERS_PAGE_EVENTS.CLICK_EDIT_ICON);
        },
        userId: this.props.userId,
        activeProject: this.props.activeProject,
        userRole: this.props.accountRole,
        projectRole: this.props.projectRole,
      },
    },
    {
      id: 'options',
      title: {
        full: this.props.intl.formatMessage(messages.optionsCol),
      },
      component: OptionsColumn,
    },
    {
      id: 'owner',
      title: {
        full: this.props.intl.formatMessage(messages.ownerCol),
      },
      component: OwnerColumn,
    },
    {
      id: 'shared',
      title: {
        full: this.props.intl.formatMessage(messages.sharedCol),
      },
      align: ALIGN_CENTER,
      component: SharedColumn,
      customProps: {
        userId: this.props.userId,
        onEdit: (filter) => {
          this.props.onEdit(filter);
          this.props.tracking.trackEvent(FILTERS_PAGE_EVENTS.CLICK_SHARED_ICON);
        },
      },
    },
    {
      id: 'display',
      title: {
        full: this.props.intl.formatMessage(messages.displayCol),
      },
      align: ALIGN_CENTER,
      component: DisplayOnLaunchColumn,
      customProps: {
        userFilters: this.props.userFilters,
        onChangeDisplay: (isFilterDisplayed, filter) => {
          isFilterDisplayed
            ? this.props.hideFilterOnLaunchesAction(filter)
            : this.props.showFilterOnLaunchesAction(filter);
          this.props.tracking.trackEvent(FILTERS_PAGE_EVENTS.CLICK_DISPLAY_ON_LAUNCH_SWITCHER);
        },
      },
    },
    {
      id: 'delete',
      title: {
        full: this.props.intl.formatMessage(messages.deleteCol),
      },
      align: ALIGN_CENTER,
      component: DeleteColumn,
      customProps: {
        onDelete: (filter) => {
          this.props.onDelete(filter);
          this.props.tracking.trackEvent(FILTERS_PAGE_EVENTS.CLICK_DELETE_FILTER_ICON);
        },
        accountRole: this.props.accountRole,
        projectRole: this.props.projectRole,
        userId: this.props.userId,
      },
    },
  ];

  render() {
    return (
      <Grid
        columns={this.getColumns()}
        data={this.props.filters}
        changeOnlyMobileLayout
        loading={this.props.loading}
      />
    );
  }
}
