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

import { Component } from 'react';
import track from 'react-tracking';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { EntitiesSelector } from 'components/filterEntities/entitiesSelector';
import { filterEntityShape } from '../propTypes';
import styles from './entitiesGroup.scss';

const cx = classNames.bind(styles);
@track()
export class EntitiesGroup extends Component {
  static propTypes = {
    entities: PropTypes.arrayOf(filterEntityShape),
    onAdd: PropTypes.func,
    onRemove: PropTypes.func,
    onChange: PropTypes.func,
    onValidate: PropTypes.func,
    errors: PropTypes.object,
    entitySmallSize: PropTypes.bool,
    tracking: PropTypes.shape({
      trackEvent: PropTypes.func,
      getTrackingData: PropTypes.func,
    }).isRequired,
    events: PropTypes.object,
    staticMode: PropTypes.bool,
    vertical: PropTypes.bool,
  };

  static defaultProps = {
    entities: [],
    errors: {},
    onAdd: () => {},
    onRemove: () => {},
    onChange: () => {},
    onValidate: () => {},
    entitySmallSize: false,
    events: {},
    staticMode: false,
    vertical: false,
  };

  state = {
    activeField: null,
  };

  getEntity = (id) => this.props.entities.find((entity) => entity.id === id);

  getActiveEntities = () => this.props.entities.filter((entity) => entity.active);

  handleChange = (entity, value, isConditionChange = false) => {
    this.props.tracking.trackEvent(entity.eventInfo);
    if (!isConditionChange) {
      this.validateEntity(entity, value.value);
    }
    this.props.onChange(entity.id, value);
  };

  handleFocus = (entityId) => this.setState({ activeField: entityId });

  handleBlur = (entityId) =>
    this.state.activeField === entityId ? this.setState({ activeField: null }) : null;

  toggleEntity = (entityId) => {
    const entity = this.getEntity(entityId);
    if (entity.active) {
      this.props.onRemove(entityId);
    } else {
      this.props.onAdd(entity);
    }
  };

  validateEntity = (entity, value) => {
    if (!entity.validationFunc) {
      return null;
    }
    const result = entity.validationFunc({ ...entity, value });
    this.props.onValidate(entity.id, result);
    return result;
  };

  render() {
    const { entities, entitySmallSize, errors, staticMode, vertical, events } = this.props;
    return (
      <div className={cx('entities-group')}>
        {this.getActiveEntities().map((entity) => {
          const EntityComponent = entity.component;
          const { id, removable, title, value, customProps = {} } = entity;
          return (
            <div key={id} className={cx('entity-item', { vertical })}>
              <EntityComponent
                entityId={id}
                smallSize={entitySmallSize}
                removable={removable}
                title={title}
                onRemove={() => {
                  this.toggleEntity(id);
                }}
                onChange={(newValue, condition) => this.handleChange(entity, newValue, condition)}
                onFocus={() => this.handleFocus(id)}
                onBlur={() => this.handleBlur(id)}
                value={value}
                active={this.state.activeField === id}
                error={errors[id]}
                vertical={vertical}
                customProps={customProps}
                events={events}
              />
            </div>
          );
        })}
        {!staticMode && (
          <EntitiesSelector entities={entities} onChange={this.toggleEntity} events={events} />
        )}
      </div>
    );
  }
}
