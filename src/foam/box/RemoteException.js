/**
 * @license
 * Copyright 2017 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.box',
  name: 'RemoteException',
  implements: ['foam.core.Exception'],
  properties: [
    {
      class: 'String',
      name: 'id'
    },
    {
      class: 'String',
      name: 'message'
    },
    {
      class: 'Object',
      name: 'foamException'
    }
  ],

  methods: [
    {
      name: 'toString',
      type: 'String',
      javaCode: 'return getMessage();',
      code: function() {
        return this.message;
      }
    }
  ]
});
