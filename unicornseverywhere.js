Unicorns = new Mongo.Collection('unicorns');
Corrals = new Mongo.Collection('corrals');


if (Meteor.isClient) {

  var baitList = ['steak', 'ice cream', 'rainbows', 'candy', 'none']
  var baitsUsed = [];
  var baitsUsedDep = new Tracker.Dependency;

  var getBaitsUsed = function () {
    baitsUsedDep.depend();
    return baitsUsed;
  };

  var setBaitsUsed = function (newValue) {
    if (newValue !== baitsUsed) baitsUsedDep.changed();
    baitsUsed = newValue;
  };

  Template.corrals.helpers({
    corrals: function() {
      var baits = []
      var myCorrals = Corrals.find().map(function(corral) {
        corral.location = corral.location.toUpperCase() + ' CORRAL';
        corral.caught = Unicorns.find({favFood: corral.bait}).fetch();
        baits.push(corral.bait);
        setBaitsUsed(baits);
        return corral;
      });
      return myCorrals;
    },

    unicorns: function() {
      console.log(getBaitsUsed());
      return Unicorns.find({favFood: {$nin: getBaitsUsed()}});
    }
  });

  Template.corrals.events({
    'click .corral': function (evt) {
      //add bait

      var id = evt.target.id;
      var bait = _.sample(baitList);

      Corrals.update(id, {$set: {bait: bait}});
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Unicorns.remove({});
    Unicorns.insert(
      {
      name: 'Fred',
      color: 'orange',
      favFood: 'ice cream',
      location: 'hallway'
      }
    );

    Unicorns.insert(
      {
      name: 'Barney',
      color: 'pink',
      favFood: 'candy',
      location: 'upstairs'
      }
    );

    Unicorns.insert(
      {
      name: 'Wilma',
      color: 'fuchsia',
      favFood: 'popcorn',
      location: 'basement'
      }
    );

    Unicorns.insert(
      {
      name: 'Betty',
      color: 'teal',
      favFood: 'cake',
      location: 'basement'
      }
    );

    if (Corrals.find().count() === 0) {
      Corrals.insert(
        {
        location: 'The Hardy room',
        bait: ''
        }
      );
    }
  });
}
