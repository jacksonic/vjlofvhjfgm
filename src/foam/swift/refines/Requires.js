/**
 * @license
 * Copyright 2017 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  refines: 'foam.core.Requires',
  flags: ['swift'],
  requires: [
    'foam.swift.Argument',
    'foam.swift.Method',
  ],
  properties: [
    {
      name: 'swiftReturns',
      expression: function(path) {
        return path.replace(/\./g, '_');
//        return this.__context__.lookup(path).model_.swiftName;
      },
    },
  ],
  methods: [
    function writeToSwiftClass(cls, parentCls) {
      if ( ! parentCls.hasOwnAxiom(this.name) ) return;
      if (foam.core.InterfaceModel.isInstance(this.__context__.lookup(this.path).model_)) {
        return;
      }
      // TODO skip refines.
      cls.methods.push(this.Method.create({
        name: this.name + '_create',
        returnType: this.swiftReturns,
        visibility: 'public',
        body: this.swiftInitializer(),
        args: [
          this.Argument.create({
            localName: 'args',
            defaultValue: '[:]',
            type: '[String:Any?]',
          }),
          this.Argument.create({
            localName: 'x',
            defaultValue: 'nil',
            type: 'Context?',
          }),
        ],
      }));
    },
  ],
  templates: [
    {
      name: 'swiftInitializer',
      args: [],
      template: function() {/*
return (x ?? __subContext__).create(<%=this.swiftReturns%>.self, args: args)!
      */},
    },
  ],
});
