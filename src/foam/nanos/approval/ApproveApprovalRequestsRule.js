/**
 * @license
 * Copyright 2020 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'net.nanopay.partner.treviso',
  name: 'ApproveApprovalRequestsRule',

  implements: [
    'foam.nanos.ruler.RuleAction'
  ],

  documentation: ``,

  javaImports: [
    'foam.core.ContextAgent',
    'foam.core.X',
    'foam.core.FObject',
    'foam.core.X',
    'foam.dao.ArraySink',
    'foam.dao.DAO',
    'foam.nanos.app.AppConfig',
    'foam.nanos.app.Mode',
    'foam.nanos.auth.AuthService',
    'foam.nanos.auth.User',
    'foam.nanos.crunch.UserCapabilityJunction',
    'foam.nanos.logger.Logger',
    'static foam.mlang.MLang.*',
    'foam.nanos.approval.ApprovalRequest',
    'foam.nanos.approval.ApprovalStatus',
    'java.util.List'
  ],

  properties: [
    {
      class: 'StringArray',
      name: 'autoApprovablePermissions',
    }
  ],

  methods: [
    {
      name: 'applyAction',
      javaCode: `
      agency.submit(x, new ContextAgent() {
        @Override
        public void execute(X x) {
          AppConfig appConfig = (AppConfig) x.get("appConfig");
          Logger logger = (Logger) x.get("logger");

          if ( appConfig.getMode() == Mode.DEVELOPMENT ||
               appConfig.getMode() == Mode.STAGING ) {
            
            DAO approvalRequestDAO = (DAO) x.get("approvalRequestDAO");

            List approvalRequestToApproveSink = ((ArraySink) ((DAO)x.get("approvalRequestDAO")).inX(x).where(
              IN(ApprovalRequest.CLASSIFICATION, getAutoApprovablePermissions())
            ).select(new ArraySink())).getArray();   

            for ( Object obj: approvalRequestToApproveSink ) {
              ApprovalRequest request = (ApprovalRequest)obj;
              request.setStatus(ApprovalStatus.APPROVED);
              approvalRequestDAO.put(request);
              logger.warning("ApproveApprovalRequestsRule: Approval request " + request.getId() +  " was automatically approved");
            }
          }
        }
      }, "When the business account is approved, send emails to all directors, signing officers who have signed contratos de câmbio.");
      `
    }
  ]
});
