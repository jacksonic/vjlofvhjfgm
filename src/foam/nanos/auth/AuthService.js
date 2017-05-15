/**
 * @license
 * Copyright 2017 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.INTERFACE({
  package: 'foam.nanos.auth',
  name: 'AuthService',
  methods: [
		{
  		name: 'generateChallenge',
			javaReturns: 'String',
			args: [
				{
					name: 'username',
					javaType: 'String'
				}
			]
    },
		{
			name: 'loginWithContext',
			javaReturns: 'void',
			javaThrows: [ 'LoginException' ],
			args: [
				{
					name: 'x',
					javaType: 'X'
				},
				{
					name: 'response',
					javaType: 'String'
				}
			]
		},
		{
			name: 'login',
			javaReturns: 'void',
			args: [
				{
					name: 'username',
					javaType: 'String'
				},
				{
					name: 'password',
					javaType: 'String'
				}
			]
		},
		{
			name: 'logout',
			javaReturns: 'void',
			args: [
				{
					name: 'username',
					javaType: 'String'
				}
			]
		},
		{
			name: 'check',
			javaReturns: 'Boolean',
			args: [
				{
					name: 'x',
					javaType: 'X'
				},
				{
					name: 'principal',
					javaType: 'java.security.Principal'
				},
				{
					name: 'permission',
					javaType: 'java.security.Permission'
				}
			]
		},
		{
			name: 'updatePassword',
			javaReturns: 'void',
			javaThrows: [ 'IllegalStateException' ],
			args: [
				{
					name: 'x',
					javaType: 'X'
				},
				{
					name: 'principal',
					javaType: 'java.security.Principal'
				},
				{
					name: 'oldPassword',
					javaType: 'String'
				},
				{
					name: 'newPassword',
					javaType: 'String'
				}
			]
		},
		{
			name: 'validatePrincipal',
			javaReturns: 'void',
			javaThrows: [ 'IllegalStateException' ],
			args: [
				{
					name: 'x',
					javaType: 'X'
				},
				{
					name: 'oldValue',
					javaType: 'java.security.Principal'
				},
				{
					name: 'newValue',
					javaType: 'java.security.Principal'
				}
			]
		}
  ]
});
