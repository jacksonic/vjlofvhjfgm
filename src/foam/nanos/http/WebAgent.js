/**
 * @license
 * Copyright 2017 The FOAM Authors. All Rights Reserved.
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

foam.INTERFACE({
  package: 'foam.nanos.http',
  name: 'WebAgent',
  extends: 'foam.core.ContextAgent',

  methods: [
    {
      name: 'execute',
      returns: 'Void',
      args: [
        {
          name: 'x',
          type: 'Context'
        }
      ]
    }
  ]
});
