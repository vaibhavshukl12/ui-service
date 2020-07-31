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
import React from 'react';
import classNames from 'classnames/bind';
import styles from './patternGrid.scss';

const cx = classNames.bind(styles);

export const PatternNameColumn = ({ value, onPatternClick }) => (
  <div className={cx('patterns-name')}>
    <span className={cx('pattern-link')} onClick={() => onPatternClick(value.name)}>
      {value.name}
    </span>
  </div>
);
PatternNameColumn.propTypes = {
  value: PropTypes.object,
  onPatternClick: PropTypes.func,
};
PatternNameColumn.defaultProps = {
  value: {},
  onPatternClick: () => {},
};

export const TestCasesColumn = ({ value }) => <div className={cx('test-cases')}>{value.count}</div>;
TestCasesColumn.propTypes = {
  value: PropTypes.object,
};
TestCasesColumn.defaultProps = {
  value: {},
};
