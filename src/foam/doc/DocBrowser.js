foam.CLASS({
  package: 'foam.doc',
  name: 'DocBorder',
  extends: 'foam.u2.Element',

  axioms: [
    foam.u2.CSS.create({
      code: function() {/*
        ^ {
             display: inline-block;
             border-radius: 3px;
             box-shadow: 0 1px 3px rgba(0, 0, 0, 0.38);
        }
        ^title { padding: 6px; align-content: center; background: #c8e2f9; }
        ^info { float: right; font-size: smaller; }
        ^content { padding: 6px; min-width: 220px; height: 100%; background: white; }
      */}
    })
  ],

  properties: [
    'title',
    'info'
  ],

  methods: [
    function init() {
      this.
        cssClass(this.myCls()).
        start('div').
          cssClass(this.myCls('title')).
          add(this.title$).
          start('span').
            cssClass(this.myCls('info')).
            add(this.info$).
          end().
        end().
        start('div', null, this.content$).
          cssClass(this.myCls('content')).
        end();
    }
  ]
});


foam.CLASS({
  package: 'foam.doc',
  name: 'AxiomInfo',
  ids: ['name'],

  properties: [
    {
      name: 'axiom',
      hidden: true
    },
    {
      name: 'cls',
      label: 'Source Class',
      tableCellView: function(o, e) {
        return foam.doc.LinkView.create({data: o.cls}, e.__subSubContext__);
      },
      tableCellFormatter: function(value, obj, axiom) {
        this.tag(foam.doc.LinkView, { data: value });
      }
    },
    {
      name: 'type',
      tableCellView: function(o, e) {
        return o.type ?
          foam.doc.LinkView.create({data: foam.doc.Link.create({path: o.type.id, label: o.type.name})}, e.__subSubContext__) :
          'anonymous';
      },
      tableCellFormatter: function(value, obj, axiom) {
        if ( value ) {
          this.tag(foam.doc.LinkView, { data: foam.doc.Link.create({ path: value.id, label: value.name }) });
          return;
        }
        this.add('anonymous');
      }
    },
    {
      name: 'name'
    }
  ]
});


foam.CLASS({
  package: 'foam.doc',
  name: 'ClassList',
  extends: 'foam.u2.View',

  requires: [
    'foam.doc.DocBorder',
    'foam.doc.ClassLink'
  ],

  properties: [
    'title',
    {
      name: 'info',
      expression: function (data) {
        return data && data.length;
      }
    }
  ],

  methods: [
    function initE() {
      this.SUPER();
      var self = this;
      this.
        start(this.DocBorder, {title: this.title, info$: this.info$}).
          start('div').
            add(this.slot(function (data) {
              return self.E('span').forEach(data, function(d) { this.tag(self.ClassLink, {data: d, showPackage: true}).br(); });
            })).
          end().
        end();
    }
  ]
});


foam.CLASS({
  package: 'foam.doc',
  name: 'ClassDocView',
  extends: 'foam.u2.View',

  requires: [
    'foam.doc.Link',
    'foam.doc.ClassLink',
    'foam.doc.AxiomInfo',
    'foam.u2.view.TableView',
    'foam.dao.ArrayDAO'
  ],

  imports: [
    'selectedAxiom',
    'showInherited'
  ],

  methods: [
    function initE() {
      this.SUPER();

      var data = this.data;

      this.
          start('b').add(data.id).end().
          start('span').style({float:'right','font-size':'smaller'}).add(data.count_, ' created').end().br().
          add('extends: ');

      var cls = data;
      for ( var i = 0 ; cls ; i++ ) {
        cls = this.lookup(cls.model_.extends, true);
        if ( i ) this.add(' : ');
        this.start(this.ClassLink, {data: cls}).end();
        if ( cls === foam.core.FObject ) break;
      }
      this.br();
      this.add(data.documentation);

      this.add(this.slot(function (showInherited) {
        // TODO: hide 'Source Class' column if showInherited is false
        var axs = [];
        for ( var key in data.axiomMap_ ) {
          if ( showInherited || Object.hasOwnProperty.call(data.axiomMap_, key) ) {
            var a  = data.axiomMap_[key];
            var ai = foam.doc.AxiomInfo.create({
              axiom: a,
              type: a.cls_,
              cls: this.Link.create({
                path: a.sourceCls_.id,
                label: a.sourceCls_.name
              }),
              name: a.name
            });
            axs.push(ai);
          }
        }

        return this.TableView.create({
          of: this.AxiomInfo,
          data: this.ArrayDAO.create({array: axs}),
          hoverSelection$: this.selectedAxiom$
        });
      }));
    }
  ]
});


foam.CLASS({
  package: 'foam.doc',
  name: 'Link',

  properties: [
    'path',
    'label'
  ]
});


foam.CLASS({
  package: 'foam.doc',
  name: 'LinkView',
  extends: 'foam.u2.View',

  imports: [ 'browserPath' ],

  methods: [
    function initE() {
      this.SUPER();

      this.setNodeName('a').
        on('click', this.click).
        attrs({href: this.data.path}).
        add(this.data.label);
    }
  ],

  listeners: [
    function click(e) {
      this.browserPath$.set(this.data.path);
      e.preventDefault();
    }
  ]
});


foam.CLASS({
  package: 'foam.doc',
  name: 'ClassLink',
  extends: 'foam.u2.View',

  imports: [ 'browserPath' ],

  properties: [
    {
      class: 'Class',
      name: 'data'
    },
    {
      class: 'Boolean',
      name: 'showPackage'
    }
  ],

  methods: [
    function initE() {
      this.SUPER();

      this.setNodeName('a').
        on('click', this.click).
        attrs({href: this.data.id}).
        add(this.showPackage ? this.data.id : this.data.name);
    }
  ],

  listeners: [
    function click(e) {
      this.browserPath$.set(this.data.id);
      e.preventDefault();
    }
  ]
});


foam.CLASS({
  package: 'foam.doc',
  name: 'DocBrowser',
  extends: 'foam.u2.Element',

  requires: [
    'foam.doc.DocBorder',
    'foam.doc.ClassList',
    'foam.doc.ClassDocView'
  ],

  exports: [
    'as data',
    'path as browserPath',
    'axiom as selectedAxiom',
    'showInherited'
  ],

  properties: [
    'path',
    {
      name: 'selectedClass',
      expression: function (path) {
        return foam.lookup(path, true);
      }
    },
    {
      class: 'Boolean',
      name: 'showInherited',
      value: true
    },
    {
      class: 'FObjectProperty',
      name: 'axiom',
      view: { class: 'foam.u2.DetailView' }
    },
    {
      name: 'subClasses',
      expression: function (path) {
        return Object.values(foam.USED).
            filter(function(cls) { return cls.model_.extends == path || 'foam.core.' + cls.model_.extends == path; }).
            sort(foam.core.Model.ID.compare);
      }
    },
    {
      name: 'requiredByClasses',
      expression: function (path) {
        return Object.values(foam.USED).
            filter(function(cls) {
              return cls.model_.requires && cls.model_.requires.map(
                  function(r) { return r.path; }).includes(path);
            }).
            sort(foam.core.Model.ID.compare);
      }
    },
    {
      name: 'relationshipClasses',
      expression: function (path) {
        return [];
      }
    },
    'subClassCount'
  ],

  methods: [
    function initE() {
      this.SUPER();

      this.
        tag(this.PATH, {displayWidth: 80}).
          start('span').
            style({'margin-left': '12px', 'font-size':'small'}).
            add('  Show Inherited Axioms: ').
          end().
          tag(this.SHOW_INHERITED, {data$: this.showInherited$}).
        br().br().
        start('table').
          start('tr').
            start('td').
              style({'vertical-align': 'top'}).
              tag(this.ClassList, {title: 'Class List', data: Object.values(foam.USED).sort(foam.core.Model.ID.compare)}).
            end().
            start('td').
              style({'vertical-align': 'top'}).
          start(this.DocBorder, {title: 'Class Definition', info$: this.slot(function(selectedClass) { return selectedClass.getOwnAxioms().length + ' / ' + selectedClass.getAxioms().length; })}).
                add(this.slot(function(selectedClass) {
                  if ( ! selectedClass ) return '';
                  return this.ClassDocView.create({data: selectedClass});
                })).
              end().
            end().
            start('td').
              style({'vertical-align': 'top'}).
              tag(this.ClassList, {title: 'Sub-Classes', data$: this.subClasses$}).
              br().br().
              tag(this.ClassList, {title: 'Required-By', data$: this.requiredByClasses$}).
              br().br().
              tag(this.ClassList, {title: 'Relationships', data$: this.relationshipClasses$}).
            end().
            start('td').
              style({'vertical-align': 'top'}).
              start(this.DocBorder, {title: 'Axiom Definition'}).
                add(this.slot(function (axiom) { return axiom && foam.u2.DetailView.create({data: axiom.axiom}); })).
              end().
            end().
          end().
        end();
    }
  ]
});


foam.CLASS({
  package: 'foam.doc',
  name: 'DocBrowserWindow',

  requires: [
    'foam.doc.DocBrowser',
    'foam.core.Window'
  ],

  imports: [ 'window' ],

  properties: [
    'initialClass'
  ],

  methods: [
    function init() {
      // TODO: There should be some helper support to make this easier
      var w = this.window.open('', '', 'width=700, heigh=1000');
      var window = foam.core.Window.create({window: w});
      var browser = this.DocBrowser.create({path: this.initialClass}, window.__subContext__);
      w.document.body.insertAdjacentHTML('beforeend', browser.outerHTML);
      browser.load();
    }
  ]
});


foam.debug.doc = function(opt_obj, showUnused) {
  if ( showUnused ) {
    for ( var key in foam.UNUSED ) foam.lookup(key);
  }

  foam.doc.DocBrowserWindow.create({
    initialClass: foam.core.FObject.isSubClass(opt_obj) ?
      opt_obj.id :
      ( opt_obj && opt_obj.cls_ ) ? opt_obj.cls_.id :
      'foam.core.FObject' });
};
