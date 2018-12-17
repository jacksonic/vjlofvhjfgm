foam.CLASS({
  package: 'foam.core',
  name: 'TypeProperty',
  extends: 'foam.core.Property',
  properties: [
    [
      'adapt',
      function(_, v) {
        /*
        return foam.core.type.toType(v);
        */
        return v;
      }
    ],
    [
      'assertValue',
      function(v) {
        //foam.assert(foam.core.Type.isSubClass(v), 'type is not a subclass of Type:', v);
      }
    ]
  ]
});

foam.CLASS({
  refines: 'foam.core.AbstractMethod',
  properties: [
    {
      class: 'TypeProperty',
      name: 'returns',
      value: 'Void'
    }
  ]
});

foam.CLASS({
  refines: 'foam.core.Property',
  properties: [
    {
      class: 'TypeProperty',
      name: 'type',
    },
  ],
});
