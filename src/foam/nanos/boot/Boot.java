/**
 * @license
 * Copyright 2017 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

package foam.nanos.boot;

import foam.core.*;
import foam.dao.*;
import java.io.IOException;

public class Boot {
  protected DAO serviceDAO_;
  protected X   root_ = new ProxyX();

  public Boot() {
    try {
      // Used for all the services that will be required when Booting
      serviceDAO_ = new foam.dao.PMDAO(new JDAO(NSpec.getOwnClassInfo(), "services"));
    } catch (IOException e) {
      e.printStackTrace();
    }

    serviceDAO_.select(new AbstractSink() {
      public void put(FObject obj, Detachable sub) {
        NSpec sp = (NSpec) obj;
        System.out.println("Registering: " + sp.getName());
        root_.putFactory(sp.getName(), new SingletonFactory(new NSpecFactory(sp)));
      }
    });

    /**
     * Revert root_ to non ProxyX to avoid letting children add new bindings.
     */
    root_ = root_.put("firewall", "firewall");

    // Export the ServiceDAO
    ((ProxyDAO) root_.get("nSpecDAO")).setDelegate(serviceDAO_);

    DAO localUserDAO = (DAO) root_.get("localUserDAO");
    ((ProxyDAO) root_.get("userDAO")).setDelegate(localUserDAO);

    serviceDAO_.where(foam.mlang.MLang.EQ(NSpec.LAZY, false)).select(new AbstractSink() {
      public void put(FObject obj, Detachable sub) {
        NSpec sp = (NSpec) obj;

        System.out.println("Starting: " + sp.getName());
        root_.get(sp.getName());
      }
    });
  }

  public X getX() { return root_; }

  public static void main (String[] args)
    throws Exception
  {
    System.out.println("Starting Nanos Server");
    new Boot();
  }
}
