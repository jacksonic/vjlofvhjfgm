/**
 * @license
 * Copyright 2020 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.nanos.medusa',
  name: 'ReplayCmd',

  properties: [
    {
      name: 'details',
      class: 'FObjectProperty',
      of: 'foam.nanos.medusa.ReplayDetailsCmd'
    },
    // {
    //   documentation: 'Instance to replay to',
    //   name: 'requester',
    //   class: 'String',
    // },
    // {
    //   documentation: 'Instance to replay from',
    //   name: 'responder',
    //   class: 'String'
    // },
    {
      documentation: 'service name to replay to',
      name: 'serviceName',
      class: 'String',
      value: 'medusaEntryDAO'
    },
    {
      name: 'fromIndex',
      class: 'Long',
    },
    {
      name: 'toIndex',
      class: 'Long',
    }
  ]
});
