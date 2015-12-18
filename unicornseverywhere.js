Unicorns = new Mongo.Collection('unicorns');
Corrals = new Mongo.Collection('corrals');


if (Meteor.isClient) {
  Session
  // counter starts at 0
  var food = ['steak', 'ice cream', 'rainbows', 'candy', 'none']
  Session.setDefault('food', );

  Template.corrals.helpers({
    corrals: function() {
      return Corrals.find().fetch();
    },

    unicorns: function() {
      var corral = Corrals.findOne();
      return Unicorns.find({location: corral.location})
    }
  });

  Template.unicorns.helpers({
    unicorns: function() {
      return Unicorns.find().fetch();
    }
  });

  Template.corrals.events({
    'click .corral': function (evt) {
      //add bait

      var id = evt.target.id;
      var bait = _.sample(food);

      Corrals.update(id,{$set: {bait: bait}})
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Unicorns.find().count() === 0) {
      Unicorns.insert(
        {
        name: 'fred',
        color: 'orange',
        favFood: 'ice cream',
        location: 'hallway'
        }
      );

      Unicorns.insert(
        {
        name: 'barney',
        color: 'pink',
        favFood: 'candy',
        location: 'upstairs'
        }
      )
    }

    if (Corrals.find().count() === 0) {
      Corrals.insert(
        {
        location: 'conference room',
        bait: ''
        }
      );
    }
    // code to run on server at startup
  });
}