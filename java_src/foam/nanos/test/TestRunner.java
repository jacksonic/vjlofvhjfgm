/**
 * @license
 * Copyright 2017 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

package foam.nanos.test;

import bsh.EvalError;
import bsh.Interpreter;
import foam.core.*;
import foam.dao.*;
import foam.mlang.MLang.*;
import foam.nanos.NanoService;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.util.Date;

public class TestRunner
  extends    ContextAwareSupport
  implements NanoService
{

  public void start() {
    final MapDAO tests = (MapDAO) getX().get("TestDAO");
    /* 
    TODO add listener for when test is scheduled
    */
    runAllTests();
  }

  public void runAllTests() {
    final MapDAO tests = (MapDAO) getX().get("TestDAO");
    try {
      final JournaledDAO jTests = new JournaledDAO(tests,"TestFile.jrl");
      ((AbstractDAO) tests.where(foam.mlang.MLang.EQ(Test.SCHEDULED, Boolean.TRUE))).select(new AbstractSink() {
        public void put(FObject obj, Detachable sub) {
          ((Test) obj).runScript();
          jTests.put(obj);
        }
      });
    } catch (IOException e){
      e.printStackTrace();
    }
  }

  public static void main(String[] args){
    MapDAO tests = new MapDAO();
    X      x     = EmptyX.instance().put("TestDAO", tests);
    tests.setX(x);
    tests.setOf(Test.getOwnClassInfo());
    try {
      JournaledDAO jTests = new JournaledDAO(tests,"TestFile.jrl");
      Test test1 = new Test();
      test1.setId("Test 1");
      test1.setCode("test(2==2 ,\"TRUE\");");
      jTests.put(test1);
      Test test2 = new Test();
      test2.setId("Test 2");
      test2.setCode("test(1==2 ,\"FALSE\");");
      test2.setScheduled(true);
      jTests.put(test2);
      Test test3 = new Test();
      test3.setId("Test 3");
      test3.setCode("print(\"All Done.\");");
      jTests.put(test3);
      TestRunner runner = new TestRunner();
      runner.setX(x);
      runner.start();
    } catch (IOException e){
      e.printStackTrace();
    }
  }
}
