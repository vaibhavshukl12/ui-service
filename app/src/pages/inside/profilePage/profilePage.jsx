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
import track from 'react-tracking';
import { defineMessages, injectIntl } from 'react-intl';
import classNames from 'classnames/bind';
import { PageLayout, PageHeader, PageSection } from 'layouts/pageLayout';
import { PROFILE_PAGE } from 'components/main/analytics/events';
import { PersonalInfoBlock } from './personalInfoBlock';
import { AccessTokenBlock } from './accessTokenBlock';
import { AssignedProjectsBlock } from './assignedProjectsBlock';
import { ConfigExamplesBlock } from './configExamplesBlock';
import { LocalizationBlock } from './localizationBlock';
import styles from './profilePage.scss';

const cx = classNames.bind(styles);

const messages = defineMessages({
  profilePageTitle: {
    id: 'ProfilePage.title',
    defaultMessage: 'User profile',
  },
});
@injectIntl
@track({ page: PROFILE_PAGE })
export class ProfilePage extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  };

  getBreadcrumbs = () => [{ title: this.props.intl.formatMessage(messages.profilePageTitle) }];

  render = () => (
    <PageLayout>
      <PageHeader breadcrumbs={this.getBreadcrumbs()} />
      <PageSection>
        <div className={cx('container')}>
          <div className={cx('column')}>
            <PersonalInfoBlock />
            <AssignedProjectsBlock />
            <LocalizationBlock />
          </div>
          <div className={cx('column')}>
            <AccessTokenBlock />
            <ConfigExamplesBlock />
          </div>
        </div>
      </PageSection>
    </PageLayout>
  );
}
