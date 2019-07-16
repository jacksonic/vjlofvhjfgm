/**
 * @license
 * Copyright 2017 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.u2.tag',
  name: 'Select',
  extends: 'foam.u2.View',

  axioms: [
    { class: 'foam.u2.TextInputCSS' }
  ],

  css: `
    ^:disabled {
      appearance: none;
      -moz-appearance:none;
      -webkit-appearance:none;
      border: none;
      background: rgba(0,0,0,0);
      color: initial;
    }

    ^read-only:hover {
      cursor: default;
    }
  `,

  properties: [
    ['nodeName', 'select'],
    {
      name: 'choices',
      factory: function() {
        return [];
      }
    },
    {
      name: 'placeholder',
      factory: function() {
        return undefined;
      }
    },
    'size'
  ],

  methods: [
    function initE() {
      this.SUPER();
      var self = this;

      this
        .addClass(this.myClass())
        .attrs({ size: this.size$ })
        .attrSlot().linkFrom(this.data$);

      this.setChildren(this.slot(function(choices, placeholder) {
        var cs = [];

        if ( placeholder ) {
          cs.push(self.E('option').attrs({
            value: -1,
            selected: self.data === -1
          }).add(placeholder));
        }

        for ( var i = 0 ; i < choices.length ; i++ ) {
          var c = choices[i];
          let value = c[1];
          let e = self.E('option').attrs({
            value: i,
            selected: self.data === i
          }).add(value);

          if ( value.indexOf('  ') !== -1 ) {
            // Hack to display spaces as nbsp's
            e.onload.sub(function() {
              e.el().innerHTML = value.replace(/ /g, '&nbsp;');
            });
          }

          cs.push(e);
        }

        return cs;
      }));
    },

    function updateMode_(mode) {
      /**
       * For read-only, we need to make it disabled since it is a SELECT element,
       * otherwise it will still act like a dropdown
       */
      this.setAttribute('disabled', mode == foam.u2.DisplayMode.RO || mode == foam.u2.DisplayMode.DISABLED)
      
      this.enableClass(this.myClass('read-only'), mode === foam.u2.DisplayMode.RO);
    }
  ]
});
