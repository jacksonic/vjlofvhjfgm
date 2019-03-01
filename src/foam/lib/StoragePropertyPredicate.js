foam.CLASS({
    package: 'foam.lib',
    name: 'StoragePropertyPredicate',
    extends: 'foam.lib.PermissionedPropertyPredicate',
    javaImports: [
        'foam.nanos.auth.AuthService',
        'foam.lib.PermissionedPropertyPredicate'
    ],
    
    methods: [
      {
        name: 'propertyPredicateCheck',
        type: 'boolean',
        args: [
          {
            name: 'x',
            type: 'foam.core.X'
          },
          {
            name: 'fo',
            type: 'FObject'
          },
          {
            name: 'prop',
            type: 'foam.core.PropertyInfo'
          }
        ],
        javaCode: `
        if ( ! prop.getStorageTransient()) return false;
        return super.propertyPredicateCheck(x, fo, prop);
  `
      }
    ]
  });
    