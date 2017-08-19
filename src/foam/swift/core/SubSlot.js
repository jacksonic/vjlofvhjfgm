foam.CLASS({
  package: 'foam.swift.core',
  name: 'SubSlot',
  extends: 'foam.swift.core.Slot',

  properties: [
    {
      class: 'FObjectProperty',
      of: 'foam.swift.core.Slot',
      required: true,
      swiftWeak: true,
      name: 'parentSlot',
    },
    {
      class: 'String',
      name: 'name',
    },
    {
      name: 'value',
    },
    {
      swiftType: 'Subscription?',
      name: 'prevSub',
    },
  ],

  methods: [
    {
      name: 'init',
      swiftCode: function() {/*
onDetach(parentSlot.swiftSub(parentChange_listener))
onDetach(Subscription(detach: { self.value = nil }))
parentChange()
      */},
    },

    {
      name: 'swiftGet',
      swiftCode: function() {/*
if let o = parentSlot.swiftGet() as? FObject { return o.get(key: name) }
return nil
      */},
    },

    {
      name: 'swiftSet',
      swiftCode: function() {/*
if let o = parentSlot.swiftGet() as? FObject { o.set(key: name, value: value) }
      */},
    },

    {
      name: 'swiftSub',
      swiftCode: function() {/*
return sub(topics: ["propertyChange", "value"], listener: listener)
      */},
    },

  ],

  listeners: [
    {
      name: 'parentChange',
      swiftCode: function() {/*
prevSub?.detach()
prevSub = nil
if let o = parentSlot.swiftGet() as? FObject {
  prevSub = o.getSlot(key: name)?.swiftSub(valueChange_listener)
  onDetach(prevSub!)
}
valueChange()
      */},
    },

    {
      name: 'valueChange',
      swiftCode: function() {/*
if let parentValue = parentSlot.swiftGet() as? FObject {
  value = parentValue.get(key: name)
} else {
  value = nil
}
      */},
    },
  ]
});
