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
import { action } from '@storybook/addon-actions';
import { host } from 'storybook-host';

import { RegExEditor } from './regExEditor';
import README from './README.md';

storiesOf('Components/Inputs/RegExEditor', module)
  .addDecorator(
    host({
      title: 'Code editor component',
      align: 'center middle',
      backdrop: 'rgba(70, 69, 71, 0.2)',
      background: '#ffffff',
      height: 300,
      width: 300,
    }),
  )
  .addParameters({
    readme: {
      sidebar: README,
    },
  })
  .add('default state', () => <RegExEditor />)
  .add('with predefined value', () => <RegExEditor value="^[a-z]{1,125}$" />)
  .add('with predefined value & readonly', () => <RegExEditor value="^[a-z]{1,125}$" readonly />)
  .add('with actions', () => (
    <RegExEditor value="^[a-z]{1,125}$" onChange={action('change')} onBlur={action('blur')} />
  ));
