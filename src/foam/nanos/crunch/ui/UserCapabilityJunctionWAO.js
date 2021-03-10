/**
 * @license
 * Copyright 2020 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.nanos.crunch.ui',
  name: 'UserCapabilityJunctionWAO',
  implements: [ 'foam.u2.wizard.WAO' ],
  flags: ['web'],

  requires: [
    'foam.nanos.crunch.CapabilityJunctionStatus'
  ],

  imports: [
    'crunchService'
  ],

  properties: [
    {
      class: 'FObjectProperty',
      of: 'foam.nanos.auth.Subject',
      name: 'subject'
    }
  ],

  methods: [
    function save(wizardlet) {
      if ( ! wizardlet.isAvailable ) return Promise.resolve();
      var wData = wizardlet.data ? wizardlet.data.clone() : null;
      wizardlet.loading = true;
      let p = this.subject ? this.crunchService.updateJunctionFor(
        null, wizardlet.capability.id, wData, null,
        this.subject.user, this.subject.realUser
      ) : this.crunchService.updateJunction(null,
        wizardlet.capability.id, wData, null
      );
      return p.then((ucj) => {
        this.crunchService.pub('grantedJunction');
        this.load_(wizardlet, ucj);
        return ucj;
      });
      // return this.crunchService.updateJunction( null,
      //   wizardlet.capability.id, wizardlet.data, null
      // ).then((ucj) => {
      //   this.crunchService.pub('grantedJunction');
      //   this.load_(wizardlet, ucj);
      //   return ucj;
      // });
    },
    function cancel(wizardlet) {
      return this.crunchService.updateJunction( null,
        wizardlet.capability.id, null, null
      ).then((ucj) => {
        this.crunchService.pub('updateJunction');
        return ucj;
      });
    },
    function load(wizardlet) {
      wizardlet.loading = true;
      let p = this.subject ? this.crunchService.getJunctionFor(
        null, wizardlet.capability.id, this.subject.user, this.subject.realUser
      ) : this.crunchService.getJunction(
        null, wizardlet.capability.id
      );
      return p.then(ucj => {
        this.load_(wizardlet, ucj);
      });
    },
    function load_(wizardlet, ucj) {
      wizardlet.status = ucj.status;

      // No 'of'? No problem
      if ( ! wizardlet.of ) return;

      // Load UCJ data to wizardlet
      var loadedData = wizardlet.of.create({}, wizardlet);
      if ( ucj.data ) loadedData.copyFrom(ucj.data);

      // Set transient 'capability' property if it exists
      // TODO: Get rid of support for this as soon as possible
      var prop = wizardlet.of.getAxiomByName('capability');
      if ( prop ) prop.set(loadedData, wizardlet.capability);

      // Finally, apply new data to wizardlet
      if ( wizardlet.data ) {
        wizardlet.data.copyFrom(loadedData);
      } else {
        wizardlet.data = loadedData.clone(this.__subContext__);
      }
      wizardlet.loading = false;
    }
  ]
});
