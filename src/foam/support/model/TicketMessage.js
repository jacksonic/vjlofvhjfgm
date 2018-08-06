foam.CLASS({
  package: 'foam.support.model',
  name: 'TicketMessage',

  documentation: 'Message Model Class and Properties',

  properties: [
    {
      class: 'Long',
      name: 'id'
    },
    {
      class: 'Long',
      name: 'senderId'
    },
    {
      class: 'Long',
      name: 'receiverId'
    },
    {
      class: 'Date',
      name: 'dateCreated'
    },
    {
      class: 'String',
      name: 'message'
    },
    {
      class: 'String',
      name: 'type'
    }
  ]
});