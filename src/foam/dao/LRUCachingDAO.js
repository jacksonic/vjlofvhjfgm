/**
 * @license
 * Copyright 2019 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

 foam.CLASS({
  package: 'foam.dao',
  name: 'LRUCachingDAO',
  extends: 'foam.dao.ProxyDAO',
  implements: [ 'foam.mlang.Expressions' ],

  requires: [
    'foam.dao.MDAO',
    'foam.dao.QuickSink'
  ],

  documentation: `
     Least Recently Used CachingDAO :
     Manages a DAO\'s size by removing old items. Commonly applied inside a cache to limit the cache\'s size.
  `,

  classes: [
    {
      /** Links an object id to a last-accessed seqNo */
      name: 'LRUCacheItem',
      properties: [
        {
          name: 'id',
        },
        {
          class: 'Int',
          name: 'seqNo'
        },
        {
          class: 'Boolean',
          name: 'hasSourceObj',
          value: false
        }
      ]
    }
  ],

  properties: [
    {
      /** The maximum size to allow the target dao to be. */
      class: 'Int',
      name: 'maxSize',
      value: 10000
    },
    {
      /** Tracks the age of items in the target dao. */
      name: 'trackingDAO',
      of: 'foam.dao.DAO',
      factory: function() {
        return this.MDAO.create({ of: this.LRUCacheItem });
      }
    },
    {
      /** By starting at 0 */
      class: 'Int',
      name: 'lastTimeUsed_',
      factory: function() { return 0; }
    },
    {
      class: 'foam.dao.DAOProperty',
      name: 'cacheDAO',
      factory: function() {
        return this.MDAO.create({ of: this.of });
      }
    }
  ],

  methods: [
    function init() {
      this.SUPER();
      var self = this;

      self.delegate.sub('on', 'put',    this.onPut);
      self.delegate.sub('on', 'remove', this.onRemove);
      self.delegate.sub('on', 'reset',  this.onReset);
    },

    /** Calculates a seqNo to use in the tracking dao. */
    function getSeqNO() {
      // Just increment on each request.
      return this.lastTimeUsed_++;
    },

    /** to keep the dao size. */
    function cleanup() {
      var self = this;

      self.trackingDAO
        .orderBy(self.DESC(self.LRUCacheItem.SEQ_NO))
        .skip(self.maxSize)
        .select({
          put: function(obj) {
            self.cacheDAO.remove(obj);
            self.trackingDAO.remove(obj);
          }
        });
    },

    function find_(x, id) {
      var self = this;

      return this.trackingDAO.find_(x, id).then(function(o) {
        if ( o ) {
          self.put(x, o.id, true);
          return o;
        } else {
          return self.delegate.find_(x, id).then(function(o) {
            if ( o ) {
              self.put(x, o.id, true);
              return o;
            } else {
              self.put(x, id, false);
              return null;
            }
          })
        }
      });
    },

    function put(x, objId, hasSrcObj) {
      var self = this;

      console.log("put : " + objId);
      console.log("put : " + hasSrcObj);
      return this.trackingDAO.put(
         this.LRUCacheItem.create({
           id: objId,
           seqNo: self.getSeqNO(),
           hasSourceObj: hasSrcObj
         })
       ).then(function() {
         self.cleanup();
      });
    },

    function remove(x, o) {
      var self = this;
      return self.trackingDAO.remove(o);
    }
  ],

  listeners: [
    /** Adds the put() item to the tracking dao, runs cleanup() to check the dao size. */
    function onPut(obj) {
      var self = this;

      this.trackingDAO.put(
        this.LRUCacheItem.create({
          id: obj.id,
          seqNo: self.getSeqNO(),
          hasSourceObj: true
        })
      ).then(function() {
        self.cleanup();
      });
    },

    /** Clears the remove()'d item from the trackingDAO. */
    function onRemove(obj) {
      this.trackingDAO.remove(obj);
    },

    /** On reset, clear the tracking dao. */
    function onReset(obj) {
      this.trackingDAO.removeAll(obj);
    }
  ]
});
