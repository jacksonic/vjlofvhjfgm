/**
 * @license
 * Copyright 2017 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.nanos.export',
  name: 'ExportDriverRegistry',

  documentation: 'Export driver registry model',

  tableColumns: [ 'id', 'driverName', 'targetModel', 'extension' ],

  properties: [
    { class: 'String', name: 'id', tableWidth: 80 },
    { class: 'String', name: 'driverName', tableWidth: 300 },
    { class: 'String', name: 'targetModel' },
    {
      class: 'String',
      name: 'extension',
      value: 'csv',
      tableWidth: 80
    },
    {
      class: 'String',
      name: 'mimeType',
      value: 'text/csv;charset=utf-8'
    },
    {
      class: 'Boolean',
      name: 'isConvertible'
    },
    {
      class: 'Boolean',
      name: 'isDownloadable'
    },
    {
      class: 'Boolean',
      name: 'isOpenable'
    },
    {
      class: 'Boolean',
      name: 'exportAllColumns',
      documentation: 'exportAllColumns should be set to true for export drivers, which handle both selected column export and export of all available columns'
    },
    {
      class: 'foam.mlang.predicate.PredicateProperty',
      name: 'enabledPredicate',
      factory: function () { return foam.mlang.predicate.True; },
      javaFactory: 'return foam.mlang.MLang.FALSE;'
    },
    {
      class: 'Boolean',
      name: 'isEnabled',
      factory: function() {
        if ( ! this.enabledPredicate )
          return false;
        return this.enabledPredicate.f();
      },
      javaFactory: `
        if ( getEnabledPredicate() == null )
          return false;
        return getEnabledPredicate().f(this);
      `
    }
  ]
});
