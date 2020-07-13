/**
 * @license
 * Copyright 2020 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.mlang.expr',
  name: 'Ref',
  extends: 'foam.mlang.AbstractExpr',
  implements: [ 'foam.core.Serializable' ],

  documentation: 'A Binary Predicate which returns reference property object',

  javaImports: [
    'foam.core.AbstractFObjectPropertyInfo',
    'foam.core.FObject',
    'foam.core.PropertyInfo',
    'foam.nanos.logger.Logger',
    'foam.nanos.logger.StdoutLogger',
    'foam.util.StringUtil'
  ],

  properties: [
    {
      class: 'foam.mlang.ExprProperty',
      name: 'arg1'
    }
  ],

  methods: [
    {
      name: 'f',
      code: async function(o) {
        return o[arg1.name + '$find'];
      },
      javaCode: `
        PropertyInfo p1 = (PropertyInfo) getArg1();
        FObject refObj = null;
        try {
          refObj = (FObject)obj.getClass().getMethod("find" + StringUtil.capitalize(p1.getName()), foam.core.X.class).invoke(obj, ((FObject)obj).getX());
        } catch ( Throwable t ) {
          Logger logger = (Logger) getX().get("logger");
          if ( logger == null ) {
            logger = new StdoutLogger();
          }
          logger.error(t);
        }
        return refObj;
      `
    },

    function comparePropertyValues(o1, o2) {
      /**
         Compare property values using arg2's property value comparator.
         Used by GroupBy
      **/
      return this.arg2.comparePropertyValues(o1, o2);
    }
  ]
});