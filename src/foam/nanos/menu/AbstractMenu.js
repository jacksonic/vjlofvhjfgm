/**
 * @license
 * Copyright 2017 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.nanos.menu',
  name: 'AbstractMenu',
  abstract: true,

  imports: [ 'menuListener?', 'pushMenu', 'isMenuOpen' ],

  methods: [
    function launch(X, menu) {
    this.isMenuOpen = false;
      X.stack.push(
        function() {
          // Set the menuId and call the menuListener so that the
          // hash is updated properly when stack.back() is called.
          this.pushMenu(menu);
          this.menuListener && this.menuListener(menu);
          return this.createView(X, menu);
        }.bind(this),
        X,
        menu.id);
    }
  ]
});
