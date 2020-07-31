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

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, defineMessages } from 'react-intl';
import classNames from 'classnames/bind';
import Link from 'redux-first-router-link';
import { NOTIFICATIONS } from 'common/constants/settingsTabs';
import { getProjectSettingTabPageLink } from './utils';
import styles from './common.scss';

const cx = classNames.bind(styles);

const messages = defineMessages({
  notifications: {
    id: 'Notifications.notifications',
    defaultMessage: 'E-mail notifications',
  },
  updated: {
    id: 'Notifications.updateEmail',
    defaultMessage: 'updated',
  },
});

@injectIntl
export class Notifications extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    activity: PropTypes.object,
  };
  static defaultProps = {
    activity: {},
  };
  render() {
    const { activity, intl } = this.props;
    return (
      <Fragment>
        <span className={cx('user-name')}>{activity.user}</span>
        {intl.formatMessage(messages.updated)}
        <Link
          to={getProjectSettingTabPageLink(activity.projectName, NOTIFICATIONS)}
          className={cx('link')}
          target="_blank"
        >
          {intl.formatMessage(messages.notifications)}.
        </Link>
      </Fragment>
    );
  }
}
