/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
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
  package: 'foam.core',
  name: 'Static',
  extends: 'foam.core.AbstractMethod',

  documentation: 'An Axiom for defining static methods.',

  properties: [
    //get prop from foam.core.AbstractMethod
    { name: 'code', required: true },//TODO javaCode
    { name: 'static', value: true }
  ],

  methods: [
    function exportAs(obj) {
      /*var m = obj[this.name];
      // Bind the method to 'this' when exported so that it still works.
      return function exportedMethod() { return m.apply(obj, arguments); };*/
    }
  ]
});

foam.CLASS({
  refines: 'foam.core.Model',

  properties: [
    {
      class: 'AxiomArray',
      of: 'Static',
      name: 'static',
      adaptArrayElement: function(o) {
        if ( typeof o === 'function' ) {
          var name = foam.Function.getName(o);
          foam.assert(name, 'Static must be named');
          return foam.core.Static.create({name: name, code: o});
        }

        return foam.core.Static.isInstance(o) ?
            o :
            foam.core.Static.create(o) ;
      }
    }
  ]
});
