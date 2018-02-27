foam.CLASS({
  package: 'foam.doc',
  name: 'ModelBrowser',
  extends: 'foam.u2.Element',
  documentation: 'Show UML & properties for passed in models',

  requires: [
    'foam.doc.DocBorder',
    'foam.doc.ClassList',
    'foam.doc.SimpleClassView',
    'foam.doc.UMLDiagram',
    'foam.nanos.boot.NSpec',
  ],

  imports: [
    'nSpecDAO'
  ],

  exports: [
    'showOnlyProperties',
    'showInherited'
  ],

  properties: [
    {
      name: 'models',
      value: []
    },
    {
      name: 'showOnlyProperties',
      value: true
    },
    {
      name: 'showInherited',
      value: false
    }
  ],

  css: `
    ^ {
      display: flow-root;
      height: auto;
      width: 700px;
      margin: 20px;
    }
    ^ .foam-doc-UMLDiagram{ 
      width: 700px;
      margin: 0;
      margin-bottom: 20px;
    }
    ^ .foam-doc-UMLDiagram canvas{
      width: 700px;
    }
    ^ .foam-u2-view-TableView-foam-doc-PropertyInfo{
      width: 700px;
      float: left;
      margin-top: 20px;
      margin-bottom: 30px;
    }
    ^ .net-nanopay-ui-ActionView-printPage{
      margin-top: 20px;
    }
    @media print{
      .foam-u2-view-TableView-th-editColumns{
        display: none;
      }
      ^ .net-nanopay-ui-ActionView-printPage{
        display: none;
      }
      .net-nanopay-ui-topNavigation-TopNav{
        display: none;
      }
    }
  `,

  methods: [
    function initE(){
      this.SUPER();
      var self = this;

      this.nSpecDAO.select({
        put: function(o){
          self.modelArray(o);
        }
      });

      this.start().addClass(this.myClass())
        .start('h2').add("Model Browser").end()
        .start().add(this.PRINT_PAGE).end()
        .add(this.slot(function(models) {
          return self.E().forEach(models, function(m) {
            model = foam.lookup(m, true);
            if( !model ) {
              return;
            }
            this.start().style({ 'font-size' : '20px', 'margin-top' : '20px'}).add("Model " + a).end()
            this.tag(self.UMLDiagram.create({ data: model }))
            this.tag(self.SimpleClassView.create({data: model }))
          })
        }))
      .end();
    },

    function modelArray(m){
      var cls = JSON.parse(m.client);
      cls.of ? this.pushArray(cls.of) : this.pushArray(cls.class);
    },

    function pushArray(cls){
      this.models.push(cls);
      this.models = Array.from(this.models);
    }
  ],

  actions: [
    {
      name: 'printPage',
      label: 'Print',
      code: function(){
        window.print();
      }
    }
  ],

});

foam.CLASS({
  package: 'foam.doc',
  name: 'SimpleClassView',
  extends: 'foam.u2.View',

  requires: [
    'foam.dao.ArrayDAO',
    'foam.doc.AxiomInfo',
    'foam.doc.PropertyInfo',
    'foam.doc.ClassLink',
    'foam.doc.Link',
    'foam.u2.view.TableView'
  ],

  imports: [
    'selectedAxiom',
    'showInherited',
    'showOnlyProperties'
  ],

  methods: [
    function initE() {
      this.SUPER();

      var data = this.data;

      this.
          start('b').add(data.id).end().br().
          add('Extends: ');

      var cls = data;
      for ( var i = 0 ; cls ; i++ ) {
        cls = this.lookup(cls.model_.extends, true);
        if ( i ) this.add(' : ');
        this.start(this.ClassLink, {data: cls}).end();
        if ( cls === foam.core.FObject ) break;
      }
      this.br();
      this.start(foam.u2.HTMLElement).style({ 'margin-top' : '10px'}).add('Documentation: ', data.model_.documentation).end();

      this.add( this.slot(function (showInherited, showOnlyProperties) {
        var axs = [];
        for ( var key in data.axiomMap_ ) {
          if ( showInherited || Object.hasOwnProperty.call(data.axiomMap_, key) ) {
            var a  = data.axiomMap_[key];
	            if ( ( ! showOnlyProperties ) || foam.core.Property.isInstance(a) ) {

                var ai = foam.doc.PropertyInfo.create({
                  axiom: a,
                  type: a.cls_,
                  required: a.required,
                  documentation: a.documentation,
                  name: a.name
                });
              axs.push(ai);
	          }
          }
        }
        return this.TableView.create({
          of: this.PropertyInfo,
          data: this.ArrayDAO.create({array: axs})
        });
      }));
    }
  ]
});

foam.CLASS({
  package: 'foam.doc',
  name: 'PropertyInfo',
  documentation: "Table view model to display model in printable model browser's",
  ids: ['name'],

  tableColumns: [
    'name', 'required', 'type', 'documentation'
  ],

  properties: [
    {
      name: 'name',
      tableCellFormatter: function(value, obj, axiom) {
        this.add(value);
      }
    },
    {
      name: 'axiom',
      hidden: true
    },
    {
      name: 'required',
      tableCellFormatter: function(value, obj, axiom) {
        this.add(value);
      }
    },
    {
      name: 'type',
      tableCellFormatter: function(value, obj, axiom) {
        if ( value ) {
          this.add(value.name);
          return;
        }
        this.add('anonymous');
      }
    },
    {
      name: 'documentation',
      tableCellFormatter: function(value, obj, axiom) {
        this.add(value);
      }
    }
  ]
});
