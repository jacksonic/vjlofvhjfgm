/**
 * @license
 * Copyright 2017 The FOAM Authors. All Rights Reserved.
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
  package: 'foam.dao',
  name: 'BoxDAOListener',

  implements: [
    'foam.dao.Sink'
  ],

  requires: [
    'foam.box.Message',
    'foam.dao.DAOEvent',
  ],

  properties: [
    {
      class: 'FObjectProperty',
      of: 'foam.box.Box',
      name: 'box',
    }
  ],

  methods: [
    function put(obj) {
      this.box.send(this.Message.create({
        object: this.DAOEvent.create({
          name: 'put', obj: obj
        })
      }));
    },
    function remove(obj) {
      this.box.send(this.Message.create({
        object: this.DAOEvent.create({
          name: 'remove', obj: obj
        })
      }));
    },
    function eof() {
      this.box.send(this.Message.create({
        object: this.DAOEvent.create({
          name: 'eof'
        })
      }));
    },
    function reset() {
      this.box.send(this.Message.create({
        object: this.DAOEvent.create({
          name: 'reset'
        })
      }));
    }
  ]
});
