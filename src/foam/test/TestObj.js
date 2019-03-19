/**
 * @license
 * Copyright 2018 The FOAM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

foam.CLASS({
  package: 'foam.test',
  name: 'TestObj',
  properties: [
    {
      class: 'String',
      name: 'id'
    },
    {
      class: 'String',
      name: 'description',
      documentation: `
        This property is available so that you can write tests that need you to
        be able to update a TestObj. If the only property was 'id', you wouldn't
        be able to update a TestObj.
      `
    },
    {
      class: 'Map',
      name: 'map',
      factory: function() {
        return {
          hello: 'world'
        };
      },
      view: {
        class: 'foam.u2.MultiView',
        views: [
          { class: 'foam.u2.view.JSONTextView' },
          { class: 'foam.u2.view.JSONView' },
        ]
      }
    }
  ]
});