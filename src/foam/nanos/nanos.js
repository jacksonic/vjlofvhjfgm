/**
 * @license
 * Copyright 2017 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

FOAM_FILES([
  { name: 'foam/nanos/fs/File' },
  { name: 'foam/nanos/fs/FileProperty' },
  { name: 'foam/nanos/fs/FileDAODecorator' },
  { name: 'foam/nanos/fs/FileArray' },
  { name: 'foam/nanos/fs/FileArrayDAODecorator' },
  { name: "foam/nanos/app/AppConfig" },
  { name: "foam/nanos/controller/ApplicationController" },
  { name: "foam/nanos/app/Mode" },
  { name: "foam/nanos/auth/DayOfWeek" },
  { name: "foam/nanos/auth/Hours" },
  { name: "foam/nanos/auth/Address" },
  { name: "foam/nanos/auth/ChangePassword" },
  { name: "foam/nanos/auth/EnabledAware" },
  { name: "foam/nanos/auth/Group" },
  { name: "foam/nanos/auth/ServiceProvider" },
  { name: "foam/nanos/auth/Language" },
  { name: "foam/nanos/auth/CreatedAware" },
  { name: "foam/nanos/auth/CreatedAwareDAO" },
  { name: "foam/nanos/auth/LastModifiedAware" },
  { name: "foam/nanos/auth/LastModifiedAwareDAO" },
  { name: "foam/nanos/auth/Login" },
  { name: "foam/nanos/auth/Permission" },
  { name: "foam/nanos/auth/Country" },
  { name: "foam/nanos/auth/Region" },
  { name: 'foam/nanos/auth/ResendVerificationEmail', flags: ['web'] },
  { name: "foam/nanos/auth/Phone" },
  { name: "foam/nanos/auth/HtmlDoc" },
  { name: "foam/nanos/auth/SignOutView" },
  { name: 'foam/nanos/auth/email/EmailTokenService'},
  { name: "foam/nanos/auth/email/EmailDocInterface" },
  { name: "foam/nanos/auth/email/EmailDocService" },
  { name: "foam/nanos/auth/email/ClientEmailDocService" },
  { name: "foam/nanos/auth/resetPassword/EmailView" },
  { name: "foam/nanos/auth/resetPassword/ResendView" },
  { name: "foam/nanos/auth/resetPassword/ResetView" },
  { name: "foam/nanos/auth/resetPassword/SuccessView" },
  { name: "foam/nanos/auth/resetPassword/ResetPasswordTokenService" },
  { name: "foam/nanos/auth/token/TokenService" },
  { name: "foam/nanos/auth/token/ClientTokenService" },
  { name: "foam/nanos/auth/token/Token" },
  { name: "foam/nanos/auth/token/AbstractTokenService" },
  { name: "foam/nanos/auth/ChangePasswordView"},
  { name: "foam/nanos/auth/User" },
  { name: "foam/nanos/auth/CreatedByAware" },
  { name: "foam/nanos/auth/CreatedByAwareDAO" },
  { name: "foam/nanos/auth/LastModifiedByAware" },
  { name: "foam/nanos/auth/LastModifiedByAwareDAO" },
  { name: "foam/nanos/auth/AddressDetailView", flags: ['web'] },
  { name: "foam/nanos/auth/PhoneDetailView", flags: ['web'] },
  { name: "foam/nanos/auth/SignInView", flags: ['web'] },
  { name: "foam/nanos/auth/SignUpView", flags: ['web'] },
  { name: "foam/nanos/auth/ProfilePictureView", flags: ['web'] },
  { name: "foam/nanos/auth/twofactor/OTPAuthService" },
  { name: "foam/nanos/auth/twofactor/AbstractOTPAuthService" },
  { name: "foam/nanos/auth/twofactor/AbstractTOTPAuthService" },
  { name: "foam/nanos/auth/twofactor/ClientOTPAuthService" },
  { name: "foam/nanos/auth/twofactor/TwoFactorSignInView" },
  { name: "foam/nanos/auth/twofactor/refinements" },
  { name: "foam/nanos/bench/Benchmark" },
  { name: "foam/nanos/boot/NSpec" },
  { name: "foam/nanos/session/Session" },
  { name: "foam/nanos/menu/AbstractMenu" },
  { name: "foam/nanos/menu/DAOMenu" },
  { name: "foam/nanos/menu/LinkMenu" },
  { name: "foam/nanos/menu/ListMenu" },
  { name: "foam/nanos/menu/Menu" },
  { name: "foam/nanos/menu/MenuBar" },
  { name: "foam/nanos/menu/PopupMenu" },
  { name: "foam/nanos/menu/SubMenu" },
  { name: "foam/nanos/menu/SubMenuView" },
  { name: "foam/nanos/menu/TabsMenu" },
  { name: "foam/nanos/menu/ViewMenu" },
  { name: "foam/nanos/menu/TreeAltView" },
  { name: "foam/nanos/auth/PermissionTableView", flags: ['web'] },
  { name: "foam/nanos/u2/navigation/TopNavigation", flags: ['web'] },
  { name: "foam/nanos/u2/navigation/FooterView", flags: ['web'] },
  { name: "foam/nanos/u2/navigation/BusinessLogoView", flags: ['web'] },
  { name: "foam/nanos/u2/navigation/UserView", flags: ['web'] },
  { name: "foam/nanos/u2/navigation/SubMenuBar", flags: ['web'] },
  { name: "foam/nanos/script/Language" },
  { name: "foam/nanos/script/ScriptStatus" },
  { name: "foam/nanos/script/Script" },
  { name: "foam/nanos/script/TestRunnerScript" },
  { name: "foam/nanos/test/Test" },
  { name: "foam/nanos/test/TestBorder" },
  { name: "foam/nanos/cron/Cron" },
  { name: "foam/nanos/export/ExportDriverRegistry"},
  { name: "foam/nanos/export/ExportDriver" },
  { name: "foam/nanos/export/JSONDriver"},
  { name: "foam/nanos/export/XMLDriver"},
  { name: "foam/nanos/export/CSVDriver"},
  { name: "foam/nanos/auth/Relationships" },
  { name: "foam/nanos/NanoService" },
  { name: "foam/nanos/auth/AuthService" },
  { name: "foam/nanos/auth/ProxyAuthService" },
  { name: "foam/nanos/auth/ClientAuthService" },
  { name: "foam/nanos/pm/PMInfo" },
  { name: "foam/nanos/pm/PMTableView", flags:['web'] },
  { name: "foam/nanos/pm/TemperatureCView" },
  { name: 'foam/nanos/notification/email/EmailMessage' },
  { name: 'foam/nanos/notification/email/EmailService' },
  { name: 'foam/nanos/notification/email/EmailTemplate' },
  { name: 'foam/nanos/notification/email/ClientEmailService' },
  { name: 'foam/nanos/notification/email/SMTPEmailService' },
  { name: 'foam/nanos/notification/push/PushService' },
  { name: 'foam/nanos/notification/push/FirebasePushService' },
  { name: 'foam/nanos/auth/twofactor/authy/AuthyService' },
  { name: 'foam/nanos/demo/DemoObject' },
  { name: 'foam/nanos/demo/Demo' },
  { name: 'foam/nanos/http/Format' },
  { name: 'foam/nanos/http/Command' },
  { name: "foam/nanos/http/ProxyWebAgent" },
  { name: "foam/nanos/http/HttpParameters" },
  { name: "foam/nanos/http/DefaultHttpParameters" },
  { name: 'foam/nanos/dig/DIG' },
  { name: 'foam/nanos/dig/DUG' },
  { name: 'foam/nanos/dig/LinkView' },
  { name: 'foam/nanos/demo/relationship/CourseType' },
  { name: 'foam/nanos/demo/relationship/Course' },
  { name: 'foam/nanos/demo/relationship/Professor' },
  { name: 'foam/nanos/demo/relationship/Student' },
  { name: 'foam/nanos/demo/relationship/Controller' },
  { name: 'foam/nanos/notification/Notification'},
  { name: 'foam/nanos/notification/notifications/ScriptRunNotification'},
  { name: 'foam/nanos/notification/NotificationListView'},
  { name: 'foam/nanos/notification/NotificationRowView'},
  { name: 'foam/nanos/notification/NotificationSettingsView'},
  { name: 'foam/nanos/notification/NotificationView'},
  { name: 'foam/nanos/notification/NotificationNotificationView'},
  { name: 'foam/nanos/notification/notifications/ScriptRunNotificationNotificationView'},
  { name: 'foam/demos/net/nap/web/model/RegulatoryNotice' },
  { name: 'foam/demos/net/nap/web/model/RegulatoryNoticeAudit' },
  { name: 'foam/demos/net/nap/web/RegulatoryNoticeForm', flags: ['web'] },
  { name: 'foam/demos/net/nap/web/RegulatoryNoticeList', flags: ['web'] },
  { name: 'foam/demos/net/nap/web/EditRegulatoryNotice', flags: ['web'] }


]);
