/**
 * @license
 * Copyright 2017 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */
supressWarnings([
  `Unknown property foam.core.Model.tableColumns: id,enabled,description,passed,failed,lastRun,run`,
  `Unknown property foam.core.Long.visibility: RO`,
  `Unknown property foam.core.Long.tableCellFormatter: function (value) {
        if ( value ) this.start().style({color: '#f00'}).add(value).end();
      }`,
  `Unknown property foam.core.Long.tableCellFormatter: function (value) {
        if ( value ) this.start().style({color: '#0f0'}).add(value).end();
      }`
])
foam.CLASS({
  package: 'foam.nanos.test',
  name: 'Test',
  extends: 'foam.nanos.script.Script',

  imports: [ 'testDAO as scriptDAO' ],

  javaImports: [
    'bsh.EvalError',
    'bsh.Interpreter',
    'foam.nanos.pm.PM',
    'java.io.ByteArrayOutputStream',
    'java.io.PrintStream',
    'java.util.Date'
  ],

  tableColumns: [
    'id', 'enabled', 'description', 'passed', 'failed', 'lastRun', 'run'
  ],


  properties: [
    'id',
    {
      class: 'Long',
      name: 'passed',
      visibility: foam.u2.Visibility.RO,
      tableCellFormatter: function(value) {
        if ( value ) this.start().style({color: '#0f0'}).add(value).end();
      }
    },
    {
      class: 'Long',
      name: 'failed',
      visibility: foam.u2.Visibility.RO,
      tableCellFormatter: function(value) {
        if ( value ) this.start().style({color: '#f00'}).add(value).end();
      }
    }
  ],

  methods: [
    {
      /** Template method used to add additional code in subclasses. */
      name: 'runTest',
      javaReturns: 'void',
      javaCode: '/* NOOP */'
    },
    {
      name: 'test',
      args: [
        {
          name: 'exp', javaType: 'boolean'
        },
        {
          name: 'message', javaType: 'String'
        }
      ],
      javaReturns: 'void',
      javaCode: `
        if ( exp ) {
          setPassed(getPassed()+1);
        } else {
          setFailed(getFailed()+1);
        }
        print((exp ? "SUCCESS: " : "FAILURE: ") + message);
      `
    },
    {
      name: 'print',
      args: [
        {
          name: 'message', javaType: 'String'
        }
      ],
      javaReturns: 'void',
      javaCode: `
        setOutput(getOutput() + "\\n" + message);
      `
    },
    {
      name: 'runScript',
      args: [
        {
          name: 'x', javaType: 'foam.core.X'
        }
      ],
      javaReturns: 'void',
      javaCode: `
        ByteArrayOutputStream baos  = new ByteArrayOutputStream();
        PrintStream           ps    = new PrintStream(baos);
        Interpreter           shell = createInterpreter(x);
        PM                    pm    = new PM(this.getClass(), getId());

        try {
          setPassed(0);
          setFailed(0);
          setOutput("");
          shell.setOut(ps);

          // creates the testing method
          shell.eval("test(boolean exp, String message) { if ( exp ) { currentScript.setPassed(currentScript.getPassed()+1); } else { currentScript.setFailed(currentScript.getFailed()+1); } print((exp ? \\"SUCCESS: \\" : \\"FAILURE: \\")+message);}");
          shell.eval(getCode());
          runTest();
        } catch (EvalError e) {
          e.printStackTrace();
        } finally {
          pm.log(x);
        }

        setLastRun(new Date());
        ps.flush();
        System.err.println("******************** Output: " + this.getPassed() + " " + this.getFailed() + " " + baos.toString());
        setOutput(baos.toString() + getOutput());
    `
    }
  ]
});
