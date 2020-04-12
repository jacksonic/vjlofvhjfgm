/**
 * @license
 * Copyright 2020 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.nanos.medusa',
  name: 'ClusterConfigMonitor',

  documentation: 'NOTE: do not start with cronjob. This process starts the ClusterConfigPinkSing which polls the Mediators and Nodes and will initiate Replay, and Elections.',

  axioms: [
    foam.pattern.Singleton.create()
  ],

  implements: [
    'foam.core.ContextAgent',
    'foam.nanos.NanoService'
  ],

  javaImports: [
    'foam.core.Agency',
    'foam.core.AgencyTimerTask',
    'foam.core.ContextAgent',
    'foam.core.X',
    'foam.dao.DAO',
    'foam.nanos.logger.PrefixLogger',
    'foam.nanos.logger.Logger',
    'static foam.mlang.MLang.AND',
    'static foam.mlang.MLang.EQ',
    'static foam.mlang.MLang.NEQ',
    'static foam.mlang.MLang.NOT',
    'java.util.Timer'
  ],

  properties: [
    {
      name: 'timerInterval',
      class: 'Long',
      value: 3000
    },
    {
      name: 'initialTimerDelay',
      class: 'Int',
      value: 5000
    },
    {
      name: 'pingTimeout',
      class: 'Int',
      value: 3000
    },
    {
      name: 'isRunning',
      class: 'Boolean',
      value: false,
      visibility: 'HIDDEN'
    },
    {
      name: 'logger',
      class: 'FObjectProperty',
      of: 'foam.nanos.logger.Logger',
      visibility: 'HIDDEN',
      transient: true,
      javaFactory: `
        return new PrefixLogger(new Object[] {
          this.getClass().getSimpleName()
        }, (Logger) getX().get("logger"));
      `
    }
  ],

  methods: [
    {
      documentation: 'Start as a NanoService',
      name: 'start',
      javaCode: `
      ClusterConfigSupport support = (ClusterConfigSupport) getX().get("clusterConfigSupport");
      Timer timer = new Timer(this.getClass().getSimpleName());
      timer.scheduleAtFixedRate(
        new AgencyTimerTask(getX(), support.getThreadPoolName(), this),
        getInitialTimerDelay(),
        getTimerInterval());
      `
    },
    {
      name: 'execute',
      args: [
        {
          name: 'x',
          type: 'Context'
        }
      ],
      javaCode: `
    try {
      synchronized ( this ) {
        if ( getIsRunning() ) {
          getLogger().debug("already running");
          return;
        }
        setIsRunning(true);
      }

      ClusterConfigSupport support = (ClusterConfigSupport) x.get("clusterConfigSupport");
      ClusterConfig config = support.getConfig(x, support.getConfigId());

      if ( config.getType() == MedusaType.NODE &&
           config.getEnabled() &&
          config.getStatus() == Status.OFFLINE ) {

        // Wait for own replay to complete,
        // then set node ONLINE.
        DAO dao = ((DAO) x.get("localMedusaEntryDAO"));

        // TODO: deal with digest failures - and Node taking self OFFLINE.
        // this timer will continually set it back to ONLINE.

        config = (ClusterConfig) config.fclone();
        config.setStatus(Status.ONLINE);
        ((DAO) x.get("localClusterConfigDAO")).put(config);
      }

// TODO: Nodes don't need to ping anything, just useful for reporting and network graph - the ping time could be reduced - see mn/services.jrl

      DAO dao = (DAO) x.get("localClusterConfigDAO");
      dao = dao.where(
        AND(
          EQ(ClusterConfig.ENABLED, true),
          NOT(EQ(ClusterConfig.ID, support.getConfigId()))
        ));
      dao.select(new ClusterConfigPingSink(x, dao, getPingTimeout()));
    } finally {
      setIsRunning(false);
    }
      `
    }
  ]
});
