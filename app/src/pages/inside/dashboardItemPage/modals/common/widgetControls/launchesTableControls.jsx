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
import { connect } from 'react-redux';
import { FieldProvider } from 'components/fields/fieldProvider';
import { arrayRemoveDoubles } from 'common/utils/arrayRemoveDoubles';
import { validate, bindMessageToValidator, commonValidators } from 'common/utils/validation';
import { injectIntl, defineMessages } from 'react-intl';
import { defectTypesSelector } from 'controllers/project';
import {
  PRODUCT_BUG,
  AUTOMATION_BUG,
  SYSTEM_ISSUE,
  TO_INVESTIGATE,
  NO_DEFECT,
} from 'common/constants/defectTypes';
import { getWidgetCriteriaOptions } from './utils/getWidgetCriteriaOptions';
import {
  LAUNCH_GRID_COLUMNS_OPTIONS,
  LAUNCH_STATUSES_OPTIONS,
  DEFECT_TYPES_GROUPS_OPTIONS,
  STATIC_CRITERIA,
  ITEMS_INPUT_WIDTH,
} from './constants';
import { FiltersControl, DropdownControl, InputControl } from './controls';

const DEFECT_STATISTICS_BASE = 'statistics$defects$';
const DEFAULT_ITEMS_COUNT = '50';
const STATIC_CONTENT_FIELDS = [
  STATIC_CRITERIA.NAME,
  STATIC_CRITERIA.NUMBER,
  STATIC_CRITERIA.STATUS,
];
const messages = defineMessages({
  CriteriaFieldLabel: {
    id: 'LaunchesTableControls.CriteriaFieldLabel',
    defaultMessage: 'Criteria for widget',
  },
  ItemsFieldLabel: {
    id: 'LaunchesTableControls.ItemsFieldLabel',
    defaultMessage: 'Items',
  },
  ItemsValidationError: {
    id: 'LaunchesTableControls.ItemsValidationError',
    defaultMessage: 'Items count should have value from 1 to 600',
  },
  ContentFieldsValidationError: {
    id: 'LaunchesTableControls.ContentFieldsValidationError',
    defaultMessage: 'You must select at least one item',
  },
});

const contentFieldsValidator = (message) =>
  bindMessageToValidator(validate.launchesWidgetContentFields, message);

@injectIntl
@connect((state) => ({
  defectTypes: defectTypesSelector(state),
}))
export class LaunchesTableControls extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    defectTypes: PropTypes.object.isRequired,
    widgetSettings: PropTypes.object.isRequired,
    initializeControlsForm: PropTypes.func.isRequired,
    formAppearance: PropTypes.object.isRequired,
    onFormAppearanceChange: PropTypes.func.isRequired,
    eventsInfo: PropTypes.object,
  };

  static defaultProps = {
    eventsInfo: {},
  };

  constructor(props) {
    super(props);
    const { intl, widgetSettings, initializeControlsForm } = props;
    this.criteria = getWidgetCriteriaOptions(
      [LAUNCH_STATUSES_OPTIONS, DEFECT_TYPES_GROUPS_OPTIONS, LAUNCH_GRID_COLUMNS_OPTIONS],
      intl.formatMessage,
      { withoutNoDefect: true },
    );
    initializeControlsForm({
      contentParameters: widgetSettings.contentParameters || {
        contentFields: this.parseContentFields(this.criteria),
        widgetOptions: {},
        itemsCount: DEFAULT_ITEMS_COUNT,
      },
    });
  }

  formatContentFields = (criteries) =>
    arrayRemoveDoubles(
      criteries.map((criteria) =>
        criteria.indexOf(DEFECT_STATISTICS_BASE) !== -1 ? criteria.split('$')[2] : criteria,
      ),
    ).filter((criteria) => STATIC_CONTENT_FIELDS.indexOf(criteria) === -1);

  parseContentFields = (criteries) => {
    if (!criteries) {
      return this.props.widgetSettings.contentParameters.contentFields;
    }
    return STATIC_CONTENT_FIELDS.concat(
      criteries
        .map((criteria) => {
          const value = criteria.value || criteria;
          return [PRODUCT_BUG, AUTOMATION_BUG, SYSTEM_ISSUE, TO_INVESTIGATE, NO_DEFECT].indexOf(
            value,
          ) + 1
            ? this.props.defectTypes[value.toUpperCase()].map(
                (defect) => `${DEFECT_STATISTICS_BASE}${value}$${defect.locator}`,
              )
            : value;
        })
        .reduce((acc, val) => acc.concat(val), []),
    );
  };

  normalizeValue = (value) => value && `${value}`.replace(/\D+/g, '');

  formatFilterValue = (value) => value && value[0];
  parseFilterValue = (value) => value && [value];

  render() {
    const {
      intl: { formatMessage },
      formAppearance,
      onFormAppearanceChange,
      eventsInfo,
    } = this.props;

    return (
      <Fragment>
        <FieldProvider name="filters" parse={this.parseFilterValue} format={this.formatFilterValue}>
          <FiltersControl
            formAppearance={formAppearance}
            onFormAppearanceChange={onFormAppearanceChange}
            eventsInfo={eventsInfo}
          />
        </FieldProvider>
        {!formAppearance.isMainControlsLocked && (
          <Fragment>
            <FieldProvider
              name="contentParameters.contentFields"
              parse={this.parseContentFields}
              format={this.formatContentFields}
              validate={contentFieldsValidator(
                formatMessage(messages.ContentFieldsValidationError),
              )}
            >
              <DropdownControl
                fieldLabel={formatMessage(messages.CriteriaFieldLabel)}
                multiple
                selectAll
                options={this.criteria}
              />
            </FieldProvider>
            <FieldProvider
              name="contentParameters.itemsCount"
              validate={commonValidators.createNumberOfLaunchesValidator(
                formatMessage(messages.ItemsValidationError),
              )}
              format={String}
              normalize={this.normalizeValue}
            >
              <InputControl
                fieldLabel={formatMessage(messages.ItemsFieldLabel)}
                inputWidth={ITEMS_INPUT_WIDTH}
                maxLength="3"
                hintType={'top-right'}
              />
            </FieldProvider>
          </Fragment>
        )}
      </Fragment>
    );
  }
}
