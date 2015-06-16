/**
 * Video View
 */

Template.mainPlayerView.destroyed = function(){
  Session.set('videoPlaying', false);
  delete Subtitler.videoNode;
};


Template.video.helpers({
  projectName : function() {

    var vid = { name: Session.get('currentVideo') };
    if (vid) return vid.name;
  }
});

Template.mainPlayerView.rendered = function(){
  Session.set('videoPlaying', false);
  

  var vidSource = {
     target:'html',
     url: 'testlink'
  };
  createVideo.call(this,vidSource);

};

Template.mainPlayerView.helpers({
  error: function(){
    return Session.get('loadingError');
  }
});

function createVideo(vidSource){
  var self = this, target;

  if (vidSource && !Session.get('loadingError')) {
    Session.set('loading', true);

    // Establish our target.
   
      target = 'main-player-drop';
    

    // Create our Video Node
    var videoNode = new Subtitler.VideoElement(vidSource.url, {
      target: target,
      type: vidSource.type
    });


    videoNode.on('metaDataReceived', function(){

      // Determine our videoDuration prior to constructing the
      // timeline
      if (this.duration) {
        Session.set('videoDuration', this.duration);
      } else {
        this.getVideoDuration(function(duration){
          Session.set('videoDuration', duration);
        });
      }
      Session.set('loading', null);
    });


    videoNode.on('loadingError', function(){
      delete Subtitler.videoNode;
      Session.set('loading', null);
      Session.set('loadingError', true);
    });
  }
}


// Canvas Loading Animation
Template.loading.rendered = function(){
  var loading = require('bmcmahen-canvas-loading-animation')
    , spinner = new loading({
        color: '220, 220, 220',
        width: 40,
        height: 40,
        radius: 9,
        dotRadius: 1.8
      });

  var wrapper = this.find('#loading-wrapper');
  if (wrapper) wrapper.appendChild(spinner.canvas);
};
