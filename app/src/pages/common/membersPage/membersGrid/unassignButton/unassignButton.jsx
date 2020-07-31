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

import { Fragment, Component } from 'react';
import track from 'react-tracking';
import { connect } from 'react-redux';
import { injectIntl, defineMessages } from 'react-intl';
import PropTypes from 'prop-types';
import { GhostButton } from 'components/buttons/ghostButton';
import { showModalAction } from 'controllers/modal';
import { fetch } from 'common/utils';
import { URLS } from 'common/urls';
import { COMMON_LOCALE_KEYS } from 'common/constants/localization';
import { canAssignUnassignInternalUser } from 'common/utils/permissions';
import { projectIdSelector } from 'controllers/pages';
import {
  activeProjectRoleSelector,
  userAccountRoleSelector,
  userIdSelector,
  assignedProjectsSelector,
} from 'controllers/user';
import { showNotification, NOTIFICATION_TYPES } from 'controllers/notification';
import { MEMBERS_PAGE_EVENTS } from 'components/main/analytics/events';
import UnassignIcon from 'common/img/unassign-inline.svg';

const messages = defineMessages({
  anassignUser: {
    id: 'UnassignButton.anassignUser',
    defaultMessage: 'User has been unassigned from project!',
  },
  btnTitle: {
    id: 'UnassignButton.anassignBtn',
    defaultMessage: 'Unassign',
  },
  unAssignTitlePersonal: {
    id: 'UnassignButton.unAssignTitlePersonal',
    defaultMessage: 'Impossible to unassign user from personal project',
  },
  unAssignTitleYou: {
    id: 'UnassignButton.unAssignTitleYou',
    defaultMessage: 'Impossible to unassign own account from project',
  },
  unAssignTitleNoPermission: {
    id: 'UnassignButton.unAssignTitleNoPermission',
    defaultMessage: 'You have no enough permission',
  },
  unAssignTitleExternal: {
    id: 'UnassignButton.unAssignTitleExternal',
    defaultMessage: 'Impossible to unassign UPSA-user from UPSA-project',
  },
  unAssignTitle: {
    id: 'UnassignButton.unAssignTitle',
    defaultMessage: 'Unassign user from the project',
  },
  unassign: {
    id: 'UnassignModal.unassign',
    defaultMessage: 'Unassign',
  },
  modalHeader: {
    id: 'UnassignModal.modalHeader',
    defaultMessage: 'Unassign user',
  },
  modalText: {
    id: 'UnassignModal.modalText',
    defaultMessage:
      "Are you sure you want to unassign user '<b>{user}</b>' from the project '<b>{project}</b>'?",
  },
});

@injectIntl
@connect(
  (state) => ({
    currentUser: userIdSelector(state),
    projectId: projectIdSelector(state),
    projectRole: activeProjectRoleSelector(state),
    accountRole: userAccountRoleSelector(state),
    entryType:
      assignedProjectsSelector(state)[projectIdSelector(state)] &&
      assignedProjectsSelector(state)[projectIdSelector(state)].entryType,
  }),
  { showNotification, showModalAction },
)
@track()
export class UnassignButton extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    showModalAction: PropTypes.func.isRequired,
    userId: PropTypes.string,
    projectId: PropTypes.string,
    accountRole: PropTypes.string,
    projectRole: PropTypes.string,
    currentUser: PropTypes.string,
    entryType: PropTypes.string,
    showNotification: PropTypes.func,
    fetchData: PropTypes.func,
    tracking: PropTypes.shape({
      trackEvent: PropTypes.func,
      getTrackingData: PropTypes.func,
    }).isRequired,
  };
  static defaultProps = {
    userId: '',
    projectId: '',
    accountRole: '',
    projectRole: '',
    currentUser: '',
    entryType: '',
    showNotification: () => {},
    fetchData: () => {},
  };
  getUnAssignTitle = () => {
    if (this.isPersonalProject()) {
      return this.props.intl.formatMessage(messages.unAssignTitlePersonal);
    } else if (this.props.currentUser === this.props.userId) {
      return this.props.intl.formatMessage(messages.unAssignTitleYou);
    } else if (!canAssignUnassignInternalUser(this.props.accountRole, this.props.projectRole)) {
      return this.props.intl.formatMessage(messages.unAssignTitleNoPermission);
    }
    return this.props.intl.formatMessage(messages.unAssignTitle);
  };
  isPersonalProject = () =>
    this.props.entryType === 'PERSONAL' &&
    this.props.projectId === `${this.props.userId.replace('.', '_')}_personal`;
  showUnassignModal = () => {
    const { tracking, intl, userId, projectId } = this.props;
    tracking.trackEvent(MEMBERS_PAGE_EVENTS.UNASSIGN_BTN_CLICK);
    this.props.showModalAction({
      id: 'confirmationModal',
      data: {
        message: intl.formatMessage(messages.modalText, {
          user: userId,
          project: projectId,
        }),
        onConfirm: this.unassignAction,
        title: intl.formatMessage(messages.modalHeader),
        confirmText: intl.formatMessage(messages.unassign),
        cancelText: intl.formatMessage(COMMON_LOCALE_KEYS.CANCEL),
        dangerConfirm: true,
      },
    });
  };

  unassignAction = () => {
    const { projectId, userId, intl } = this.props;
    fetch(URLS.userUnasign(projectId), {
      method: 'put',
      data: { userNames: [userId] },
    })
      .then(() => {
        this.props.showNotification({
          message: intl.formatMessage(messages.anassignUser),
          type: NOTIFICATION_TYPES.SUCCESS,
        });
        this.props.fetchData();
      })
      .catch((err) => {
        this.props.showNotification({
          message: err.message,
          type: NOTIFICATION_TYPES.ERROR,
        });
      });
  };
  render = () => (
    <Fragment>
      <GhostButton
        icon={UnassignIcon}
        onClick={this.showUnassignModal}
        title={this.getUnAssignTitle()}
        disabled={
          !canAssignUnassignInternalUser(this.props.accountRole, this.props.projectRole) ||
          this.props.currentUser === this.props.userId ||
          this.isPersonalProject()
        }
      >
        {this.props.intl.formatMessage(messages.btnTitle)}
      </GhostButton>
    </Fragment>
  );
}
