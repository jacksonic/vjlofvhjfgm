/**
 * @license
 * Copyright 2018 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.nanos.dig',
  name: 'DIG',
  extends: 'foam.nanos.http.DefaultHttpParameters',

  documentation: 'Data Integration Gateway - Perform DAO operations against a web service',

  requires: ['foam.net.web.HTTPRequest'], 

  tableColumns: [
    'id',
    'daoKey',
    'cmd',
    'format',
    'owner'
  ],

  searchColumns: [],

  constants: [
    {
      name: 'MAX_URL_SIZE',
      value: 2000,
      type: 'int'
    }
  ],

  properties: [
    'id',
    {
      class: 'String',
      name: 'daoKey',
      label: 'DAO',
      view: function(_, X) {
        var E = foam.mlang.Expressions.create();
        return foam.u2.view.ChoiceView.create({
          dao: X.nSpecDAO
            .where(E.ENDS_WITH(foam.nanos.boot.NSpec.ID, 'DAO'))
            .orderBy(foam.nanos.boot.NSpec.ID),
          objToChoice: function(nspec) {
            return [nspec.id, nspec.id];
          }
        });
      }
    },
    'cmd',
    'format',
    {
      class: 'String',
      name: 'dao',
      hidden: true,
      transient: true,
      postSet: function(old, nu) {
        this.daoKey = nu;
      }
    },
    {
      class: 'String',
      name: 'q',
      label: 'Query'
    },
    {
        class: 'String',
        name: 'key'
    },
    {
      class: 'EMail',
      displayWidth: 100,
      name: 'email'
    },
    {
      class: 'EMail',
      displayWidth: 100,
      name: 'subject'
    },
    'data',
    {
      class: 'URL',
      // TODO: appears not to work if named 'url', find out why.
      name: 'digURL',
      label: 'URL',
      displayWidth: 120,
      view: 'foam.nanos.dig.LinkView',
      setter: function() {}, // Prevent from ever getting set
      expression: function(key, data, email, subject, daoKey, cmd, format, q) {
        var query = false;
        var url = "/service/dig";

        if ( daoKey ) {
          url += query ? "&" : "?";
          query = true;
          url += "dao=" + daoKey;
        }
        if ( cmd ) {
          url += query ? "&" : "?";
          query = true;
          url += "cmd=" + cmd.name.toLowerCase();
        }
        if ( format ) {
          url += query ? "&" : "?";
          query = true;
          url += "format=" + format.name.toLowerCase();
        }
        if ( key ) {
          url += query ? "&" : "?";
          query = true;
          url += "id=" + key;
        }
        if ( email ) {
          url += query ? "&" : "?";
          query = true;
          url += "email=" + email;
        }
        if ( subject ) {
          url += query ? "&" : "?";
          query = true;
          url += "subject=" + subject;
        }
        if ( q ) {
          url += query ? "&" : "?";
          query = true;
          url += "q=" + q;
        }
        if ( data ) {
          if ( data.length + url.length < this.MAX_URL_SIZE ) {
            url += query ? "&" : "?";
            query = true;
            url += "data=" + data;
          }
        }
        return encodeURI(url);
      }
    }
  ],

  methods: [
  ],

  actions: [
    {
      name: 'postButton',
      label: 'Send Request',
      code: function() {
        var req = this.HTTPRequest.create({
          url: window.location.origin + this.digURL,
          method: 'POST',
          payload: this.data,
        }).send();

        req.then(function(resp) {
          console.log(resp.payload);
          alert('Success, see console for more details');
          resp.payload.then(function(result) {
            console.log(result);
          });
        }, function(error) {
          alert('Error. status: '+error.resp.status+' '+error.resp.statusText);
          console.log(error.resp);
        });
      }
    }
  ]
});
