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
import { storiesOf } from '@storybook/react';
import { host } from 'storybook-host';

import { EntityInputConditional } from 'components/filterEntities';
import {
  ENTITY_NAME,
  ENTITY_DESCRIPTION,
  ENTITY_NUMBER,
  CONDITION_CNT,
  CONDITION_GREATER_EQ,
} from 'components/filterEntities/constants';
import { InputFilter } from './inputFilter';
import README from './README.md';

const value = 'Adam';
const entities = [
  {
    id: ENTITY_NAME,
    component: EntityInputConditional,
    value: {
      value: '',
      condition: CONDITION_CNT,
    },
    title: 'Name',
    active: true,
    removable: false,
    static: true,
  },
  {
    id: ENTITY_DESCRIPTION,
    component: EntityInputConditional,
    value: {
      value: '',
      condition: CONDITION_CNT,
    },
    title: 'Login',
    active: true,
    removable: false,
  },
  {
    id: ENTITY_NUMBER,
    component: EntityInputConditional,
    value: {
      value: '',
      condition: CONDITION_GREATER_EQ,
    },
    title: 'Email',
    active: true,
    removable: false,
  },
];

storiesOf('Components/Inputs/InputFilter', module)
  .addDecorator(
    host({
      title: 'InputFilter component',
      align: 'center top',
      backdrop: 'rgba(70, 69, 71, 0.2)',
      background: '#ffffff',
      height: 38,
    }),
  )
  .addParameters({
    readme: {
      sidebar: README,
    },
  })
  .add('default state', () => <InputFilter filterEntities={entities} />)
  .add('with value', () => <InputFilter value={value} />)
  .add('with placeholder', () => <InputFilter placeholder="Search" />)
  .add('active', () => <InputFilter active />);
