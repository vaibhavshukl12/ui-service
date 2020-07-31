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

import classNames from 'classnames/bind';
import { InputFilter } from 'components/inputs/inputFilter';
import { FilterEntitiesURLContainer } from 'components/filterEntities/containers';
import { ACTIVITIES } from 'components/filterEntities/constants';
import { EventsEntities } from '../eventsEntities';
import styles from './eventsToolbar.scss';

const cx = classNames.bind(styles);

export const EventsToolbar = () => (
  <div className={cx('events-toolbar')}>
    <FilterEntitiesURLContainer
      debounced={false}
      render={({ entities, onChange }) => (
        <InputFilter
          id={ACTIVITIES}
          entitiesProvider={EventsEntities}
          filterValues={entities}
          onChange={onChange}
        />
      )}
    />
  </div>
);
