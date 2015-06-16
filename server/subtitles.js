Subtitler = {};

Subtitles = new Meteor.Collection('subtitles');
Links = new Meteor.Collection('links');
Acc = new Meteor.Collection('accounts');


Meteor.startup(function(){
  fs = Npm.require('fs');

  var __ROOT_APP_PATH__ = fs.realpathSync('.');
  console.log(__ROOT_APP_PATH__);
});

//Permissions

Subtitles.allow({

  insert : function(userId, doc) {
    return true;
  },

  update : function(userId, doc) {
    return true;
  },

  remove : function(userId, doc) {
    return true;
  },

  fetch: ['user']

});

  //PUBLISH

   Meteor.publish('links',function(){
     return Links.find();
   });

   Meteor.publish('subtitles', function(videoId) {
    return Subtitles.find({ videoId: videoId }, {sort: ['startTime', 'asc']});
  });
  
   

