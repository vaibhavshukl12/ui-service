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

import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import classNames from 'classnames/bind';
import { INFO_CONFIG } from './constants';
import styles from './generalInfo.scss';

const cx = classNames.bind(styles);

export const GeneralInfo = injectIntl(({ intl: { formatMessage }, data }) =>
  Object.keys(INFO_CONFIG).map((key) => (
    <div key={key} className={cx('info-row')}>
      <span className={cx('data-value')}>{data[key] || 0}</span>
      <span className={cx('data-text')}>{formatMessage(INFO_CONFIG[key])}</span>
    </div>
  )),
);

GeneralInfo.propTypes = {
  data: PropTypes.object.isRequired,
};
