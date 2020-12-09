/**
 * @license
 * Copyright 2017 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.nanos.notification.email',
  name: 'EmailTemplate',

  documentation: `Represents an email template that stores the default properties of a specific email,
  mimics the EmailMessage which is the end obj that is processed into email.`,

  javaImports: [
    'foam.i18n.Locale',
    'foam.i18n.TranslationService',
    'foam.nanos.auth.Subject',
    'foam.nanos.auth.User',
    'foam.nanos.logger.Logger',
    'foam.nanos.notification.email.EmailTemplateEngine',
    'foam.util.SafetyUtil',
    'java.nio.charset.StandardCharsets'
  ],

  tableColumns: ['id', 'name', 'group'],

  properties: [
    {
      class: 'String',
      name: 'id'
    },
    {
      class: 'String',
      name: 'name',
      documentation: 'Template name'
    },
    {
      class: 'String',
      name: 'group',
      value: '*'
    },
    {
      class: 'String',
      name: 'subject',
      documentation: 'Template subject'
    },
    {
      class: 'String',
      name: 'body',
      documentation: 'Template body',
      view: { class: 'foam.u2.tag.TextArea', rows: 40, cols: 150 }
    },
    {
      class: 'String',
      name: 'displayName',
      documentation: 'Displayed as the name in the email from field.'
    },
    {
      class: 'String',
      name: 'sendTo',
      documentation: 'This property will set to whomever the email is being sent to.'
    },
    {
      class: 'String',
      name: 'replyTo',
      documentation: 'Displayed as the from email field.'
    },
    {
      class: 'Array',
      name: 'bodyAsByteArray',
      hidden: true,
      transient: true,
      type: 'Byte[]',
      javaFactory: 'return getBody() != null ? getBody().getBytes(StandardCharsets.UTF_8) : null;'
    }
  ],

  methods: [
    {
      name: 'apply',
      type: 'foam.nanos.notification.email.EmailMessage',
      documentation: 'Applies template properties to emailMessage, where emailMessage property is empty',
      javaThrows: ['java.lang.NoSuchFieldException'],
      args: [
        {
          name: 'x',
          type: 'Context',
        },
        {
          name: 'group',
          class: 'String',
          documentation: 'group of user whose the recipient of the email being sent'
        },
        {
          name: 'emailMessage',
          type: 'foam.nanos.notification.email.EmailMessage',
          documentation: 'Email message'
        },
        {
          name: 'templateArgs',
          type: 'Map',
          documentation: 'Template arguments'
        }
      ],
      javaCode: `
        Logger logger = (Logger) x.get("logger");

        if ( emailMessage == null ) {
          throw new NoSuchFieldException("emailMessage is Null");
        }

        EmailTemplateEngine templateEngine = (EmailTemplateEngine) x.get("templateEngine");
        templateEngine.setX(x);
        templateEngine.setValues(templateArgs);
        // BODY:
        if ( ! emailMessage.isPropertySet("body") ) {
          emailMessage.setBody(templateEngine.renderTemplateStr(getBody()).toString());
        }

        // REPLY TO:
        if ( ! emailMessage.isPropertySet("replyTo") && ! SafetyUtil.isEmpty(getReplyTo()) ) {
            emailMessage.setReplyTo(templateEngine.renderTemplateStr(getReplyTo()).toString());
        }

        // DISPLAY NAME:
        if ( ! emailMessage.isPropertySet("displayName") && ! SafetyUtil.isEmpty(getDisplayName()) ) {
          emailMessage.setDisplayName(templateEngine.renderTemplateStr(getDisplayName()).toString());
        }

        // SUBJECT:
        if ( ! emailMessage.isPropertySet("subject") && ! SafetyUtil.isEmpty(getSubject()) ) {
          // translate first and then set
          TranslationService ts = (TranslationService) x.get("translationService");
          Subject subject = (Subject) x.get("subject");
          User user = subject.getRealUser();
          String locale = user.getLanguage().toString();
          String source = getId() + ".subject";
          String translatedSubject = ts.getTranslation(locale, source, getSubject());
          emailMessage.setSubject(templateEngine.renderTemplateStr(translatedSubject).toString());
        }

        // SEND TO:
        if ( ! emailMessage.isPropertySet("to") && ! SafetyUtil.isEmpty(getSendTo()) ) {
          emailMessage.setTo(new String[] { templateEngine.renderTemplateStr(getSendTo()).toString() });
        }

        return emailMessage;
      `
    }
  ]
});