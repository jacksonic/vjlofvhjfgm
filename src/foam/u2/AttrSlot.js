/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
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
  package: 'foam.u2',
  name: 'AttrSlot',
  implements: [
    {
      path: 'foam.core.Slot',
      flags: ['js'],
    },
  ],

  documentation: 'A Value bound to an Element attribute. Used to bind values to DOM.',

  properties: [
    {
      name: 'element',
      required: true
    },
    'value',
    [ 'property', 'value'  ],
    [ 'event',    'change' ]
  ],

  methods: [
    function get() {
      return this.element.getAttribute(this.property);
    },

    function set(value) {
      this.element.setAttribute(this.property, value);

      // The next line is necessary to fire a change event.
      // This is necessary because DOM isn't proper MVC and
      // doesn't fire a change event when the value is explicitly set.
      this.value = value;
    },

    function sub(l) {
      // TODO: remove listener on unsubscribe. But how?
      if ( ! this.hasListeners() ) {
        var self = this;
        this.element.on(this.event, function() {
          self.value = self.get();
        });
      }
      return this.SUPER('propertyChange', 'value', l);
    },

    function toString() {
      return 'AttrSlot(' + this.event + ', ' + this.property + ')';
    }
  ]
});
