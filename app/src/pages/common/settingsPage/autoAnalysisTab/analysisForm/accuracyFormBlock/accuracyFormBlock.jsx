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
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { injectIntl, defineMessages } from 'react-intl';
import { InputWithIcon } from 'components/inputs/inputWithIcon';
import { InputDropdown } from 'components/inputs/inputDropdown';
import { FieldErrorHint } from 'components/fields/fieldErrorHint';
import { BigButton } from 'components/buttons/bigButton';
import { FormField } from 'components/fields/formField';
import styles from './accuracyFormBlock.scss';

const cx = classNames.bind(styles);

const messages = defineMessages({
  minimumShouldMatchTitle: {
    id: 'AccuracyFormBlock.minimumShouldMatchTitle',
    defaultMessage: 'Minimum should match',
  },
  numberOfLogLinesTitle: {
    id: 'AccuracyFormBlock.numberOfLogLinesTitle',
    defaultMessage: 'Number of log lines',
  },
  minimumShouldMatchDescription: {
    id: 'AccuracyFormBlock.minimumShouldMatchDescription',
    defaultMessage:
      'Percent of words equality between analyzed log and particular log from the ElasticSearch. If a log from ElasticSearch has the value less then set, this log will be ignored for AA.',
  },
  numberOfLogLinesDescription: {
    id: 'AccuracyFormBlock.numberOfLogLinesDescription',
    defaultMessage:
      'The number of first lines of log message that should be considered in ElasticSearch.',
  },
  numberOfLogLinesAllOption: {
    id: 'AccuracyFormBlock.numberOfLogLinesAllOption',
    defaultMessage: 'All',
  },
  submitButtonText: {
    id: 'AccuracyFormBlock.submitButtonText',
    defaultMessage: 'Submit',
  },
});

@injectIntl
export class AccuracyFormBlock extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    onInputChange: PropTypes.func,
  };

  static defaultProps = {
    disabled: false,
    onInputChange: () => {},
  };

  constructor(props) {
    super(props);
    this.dropDownOptions = [
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
      { value: '5', label: '5' },
      {
        value: '-1',
        label: props.intl.formatMessage(messages.numberOfLogLinesAllOption),
      },
    ];
  }

  normalizeValue = (value) => value && `${value}`.replace(/\D+/g, '');

  render() {
    const { intl, disabled } = this.props;
    return (
      <Fragment>
        <FormField
          name="minShouldMatch"
          fieldWrapperClassName={cx('accuracy-form-input-wrapper')}
          label={intl.formatMessage(messages.minimumShouldMatchTitle)}
          onChange={this.props.onInputChange}
          normalize={this.normalizeValue}
          format={String}
          customBlock={{
            node: <p>{intl.formatMessage(messages.minimumShouldMatchDescription)}</p>,
          }}
          disabled={disabled}
        >
          <FieldErrorHint>
            <InputWithIcon
              icon={<i className={cx('percent-icon')}>%</i>}
              maxLength="3"
              mobileDisabled
            />
          </FieldErrorHint>
        </FormField>

        <FormField
          name="numberOfLogLines"
          fieldWrapperClassName={cx('drop-down-block')}
          label={intl.formatMessage(messages.numberOfLogLinesTitle)}
          onChange={this.props.onInputChange}
          format={String}
          customBlock={{
            node: <p>{intl.formatMessage(messages.numberOfLogLinesDescription)}</p>,
          }}
          disabled={disabled}
        >
          <InputDropdown options={this.dropDownOptions} mobileDisabled />
        </FormField>

        <div className={cx('submit-button-container')}>
          <div className={cx('submit-button-wrapper')}>
            <BigButton type="submit" disabled={disabled}>
              <span className={cx('submit-button-text')}>
                {intl.formatMessage(messages.submitButtonText)}
              </span>
            </BigButton>
          </div>
        </div>
      </Fragment>
    );
  }
}
