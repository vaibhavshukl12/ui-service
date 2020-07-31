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
import classNames from 'classnames/bind';
import { activeProjectSelector } from 'controllers/user';
import {
  activeDashboardIdSelector,
  PROJECT_DASHBOARD_PAGE,
  PROJECT_DASHBOARD_ITEM_PAGE,
} from 'controllers/pages';
import { dashboardItemsSelector, dashboardItemPropTypes } from 'controllers/dashboard';
import { InputDropdown } from 'components/inputs/inputDropdown';
import { NavLink } from 'components/main/navLink';
import { AddDashboardButton } from './addDashboardButton';
import styles from './dashboardPageHeader.scss';

const cx = classNames.bind(styles);
const messages = defineMessages({
  allDashboardsTitle: {
    id: 'DashboardPageHeader.allDashboardsTitle',
    defaultMessage: 'All dashboards',
  },
});

const DASHBOARD_PAGE_ITEM_VALUE = 'All';

@connect((state) => ({
  projectId: activeProjectSelector(state),
  dashboards: dashboardItemsSelector(state),
  activeItemId: activeDashboardIdSelector(state),
}))
@injectIntl
export class DashboardPageHeader extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    activeItemId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dashboards: PropTypes.arrayOf(dashboardItemPropTypes),
    eventsInfo: PropTypes.object,
  };

  static defaultProps = {
    activeItemId: '',
    dashboards: [],
    eventsInfo: {},
  };

  getDashboardPageItem = () => ({
    label: (
      <NavLink
        exact
        to={{
          type: PROJECT_DASHBOARD_PAGE,
          payload: { projectId: this.props.projectId },
        }}
        className={cx('link')}
        activeClassName={cx('active-link')}
      >
        {this.props.intl.formatMessage(messages.allDashboardsTitle)}
      </NavLink>
    ),
    value: DASHBOARD_PAGE_ITEM_VALUE,
  });

  createDashboardLink = (dashboardId) => ({
    type: PROJECT_DASHBOARD_ITEM_PAGE,
    payload: { projectId: this.props.projectId, dashboardId },
  });

  generateOptions = () =>
    [this.getDashboardPageItem()].concat(
      this.props.dashboards.map((item) => ({
        label: (
          <NavLink
            to={this.createDashboardLink(item.id)}
            className={cx('link')}
            activeClassName={cx('active-link')}
          >
            {item.name}
          </NavLink>
        ),
        value: item.id,
      })),
    );

  render() {
    const { activeItemId, eventsInfo } = this.props;

    return (
      <div className={cx('dashboard-page-header')}>
        <div className={cx('dashboards-nav-list-mobile')}>
          <InputDropdown
            options={this.generateOptions()}
            value={activeItemId || DASHBOARD_PAGE_ITEM_VALUE}
          />
        </div>
        <AddDashboardButton eventsInfo={eventsInfo} />
      </div>
    );
  }
}
