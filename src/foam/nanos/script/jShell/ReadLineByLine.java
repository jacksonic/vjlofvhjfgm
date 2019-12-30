/**
 * @license
 * Copyright 2019 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */
package foam.nanos.script.jShell;

import java.io.BufferedReader;
import java.io.FileReader;
import java.util.LinkedList;
import java.util.List;

import foam.util.SafetyUtil;
import jdk.jshell.JShell;

public class ReadLineByLine {
  protected List<String> lineScripts;
  public JShell          jShell;
  public List<String>    listInstraction;

  public ReadLineByLine(JShell jShell) {
    this.listInstraction = new LinkedList<String>();
    this.lineScripts = new LinkedList<>();
    this.jShell = jShell;
  }
  
  public List<String> ReadByLine(String initialScript) {
    try {
      BufferedReader br = new BufferedReader(new FileReader(initialScript));
      for ( String scriptLine; ( scriptLine = br.readLine() ) != null; ) {
        if ( SafetyUtil.isEmpty(scriptLine.trim()) ) continue;
        this.lineScripts.add(scriptLine);
      }
      br.close();
    } catch (Exception e) {
      e.printStackTrace();
    }
    return lineScripts;
  }
}