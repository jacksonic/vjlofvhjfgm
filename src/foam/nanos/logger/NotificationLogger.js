
/**
 * @license
 * Copyright 2018 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */


foam.CLASS({
  package: 'foam.nanos.logger',
  name: 'NotificationLogger',
  extends: 'foam.nanos.logger.ProxyLogger',

  javaImports: [
    'foam.dao.DAO',
    'foam.core.X',
    'org.apache.http.client.methods.HttpPost',
    'org.apache.http.util.EntityUtils',
    'org.apache.http.entity.StringEntity',
    'org.apache.http.client.HttpClient',
    'org.apache.http.impl.client.DefaultHttpClient',
    'org.apache.http.impl.client.CloseableHttpClient',
    'org.apache.http.impl.client.HttpClients',
    'org.apache.http.client.methods.CloseableHttpResponse'    
  ],

  requires: [
    'foam.nanos.logger.LogLevel',
    'foam.nanos.notification.Notification',
  ],

  properties: [
    {
      class: 'Int',
      name: 'errorLevelThreshhold',
      value: 1,
    },
    {
      class: 'Enum',
      of: 'foam.nanos.logger.LogLevel',
      name: 'lastLogLevel',
      factory: function() { return foam.nanos.logger.LogLevel.INFO; }
    }
  ],

  methods: [
    {
      name: 'generateNotificationEvent',
      args: [
        {
          name: 'type',
          javaType: 'String'
        },
        {
          name: 'args',
          javaType: 'Object...'
        }
      ],
      javaCode: `
  X x = x_.put("logger", NullLogger.instance() ) ; 

  foam.nanos.notification.Notification notif = new foam.nanos.notification.Notification();
  
  String message = type + ": ";
  for ( int i = 0 ; i < args.length ; i++ ) {
    message = message + args[i] + " ";  
  }

  notif.setEmailIsEnabled(true);
  notif.setGroupId("NOC");
  notif.getEmailArgs().put("type", type);
  notif.getEmailArgs().put("message", message);
  notif.setEmailName("notification-logger-error");
  if (x.get("notificationDAO") != null) ((DAO) x.get("notificationDAO")).put_(x,notif) ;         
  notif.setSendSlackMessage(true);
  notif.setSlackWebhook("https://hooks.slack.com/services/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");
  notif.setSlackMessage(message);

  `
    },
    {
      name: 'info',
      args: [
        {
          name: 'args',
          javaType: 'Object...'
        }
      ],
      javaReturns: 'void',
      javaCode: `
  if (LogLevel.INFO.getOrdinal() >= getErrorLevelThreshhold() ) {
    String logLevel = LogLevel.INFO.name_;
    generateNotificationEvent(logLevel,args);
  }
  getDelegate().info(args);          
  `
  },
  {
    name: 'warning',
    args: [
      {
        name: 'args',
        javaType: 'Object...'
      }
    ],
    javaReturns: 'void',
    javaCode: `
  if (LogLevel.WARNING.getOrdinal() >= getErrorLevelThreshhold() ) {
    String logLevel = LogLevel.WARNING.name_;
    generateNotificationEvent(logLevel,args);
  }
  getDelegate().warning(args);          
  `
  },
  {
  name: 'error',
  args: [
    {
      name: 'args',
      javaType: 'Object...'
    }
  ],
  javaReturns: 'void',
  javaCode: `
  if (LogLevel.ERROR.getOrdinal() >= getErrorLevelThreshhold() ) {
    String logLevel = LogLevel.ERROR.name_;  
    generateNotificationEvent(logLevel,args);
  }
  getDelegate().error(args);          
  `
  },
  ]
});

