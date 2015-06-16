// Subtitles
//
// MIT. By Ben Mcmahen.
//
// Enjoy.


// Our Collections are Global, which kinda stinks.
//Videos = new Meteor.Collection('videos');
Subtitles = new Meteor.Collection('subtitles');
Links = new Meteor.Collection('links');



(function(){

  var root = this
    , Subtitler = {};

  // Our Backbone Router. It'd be nice to use something
  // that didn't require backbone since I don't use Backbone
  // anywhere els.e

  Meteor.startup(function () {
    Backbone.history.start({ pushState : true });
  });
  var Router = Backbone.Router.extend({

    routes : {
      '': 'home',
      'project/:id' : 'project',
      'gallery' : 'gallery',
      'autherror' : 'autherror'
    },

    home : function() {
      if(!Meteor.loggingIn() && !Meteor.user())
         Session.set('currentView', 'home');
      else
         this.navigate('gallery',true);
       
    },

    gallery : function()
    {
      if(!Meteor.loggingIn() && !Meteor.user())
        this.navigate('',true);
      else
        Session.set('currentView','gallery');
    },

    project : function(id) {
     
        if(!Meteor.loggingIn() && !Meteor.user()){
          Session.set('currentView','home');
          this.navigate('',true);
        }
        else{
          //доразобрать момент (если в бразуере сразу щелкнуть по пути и переинициализировать коллекции)
            Session.set('currentView','app');
            Session.set('currentVideo', id);
            var videoData = Links.find({'name':id}).fetch();
            console.log(videoData[0].link);
            Session.set('videolink',videoData[0].link);
          }
    
    }

  });



  // Create our Router. Another global....
  root.Router = new Router();


  

  // The HUGE LIST of Session Variables. There should be a better
  // way to do this. Consider making a local, reactive model?
  Session.setDefault('looping', true);
  Session.setDefault('loopDuration', 5);
  Session.setDefault('playbackRate', 1);
  Session.setDefault('videoPlaying', false);
  Session.setDefault('currentTime', null);
  Session.setDefault('startTime', 0);
  Session.setDefault('endTime', null);
  Session.setDefault('currentVideo', null);
  Session.setDefault('currentSub', null);
  Session.setDefault('isLooping', null);
  Session.setDefault('saving', null);
  Session.setDefault('currentView', null);
  Session.setDefault('overlay', null);
  Session.setDefault('loading', null);
  Session.setDefault('createProjectFlow', null);
  Session.setDefault('currentVideo',null);
 
  // Handle the presence of a resetToken separately, since
  // this doesn't work well with Backbone's router.
  if (Accounts._resetPasswordToken) {
    Session.set('overlay', 'loginView');
    Session.set('resetPassword', Accounts._resetPasswordToken);
  }

  // Subscriptions.
  //
  // Videos.
  /*
  Deps.autorun(function() {
    if (Meteor.user()) Meteor.subscribe('videos', Meteor.user()._id);
  });
*/
  // Subtitles.
  Deps.autorun(function () {
    var selectedVideo = Session.get('currentVideo');
    if (selectedVideo) Meteor.subscribe('subtitles', selectedVideo);
  });

  Deps.autorun(function(){
    Meteor.subscribe('links');
  });





  root.Subtitler = Subtitler;

}).call(this);



