/**
 * Subtitle Player Class 
 
 */



var Emitter = require('component-emitter');

// Constructor
var VideoElement = function(src, options){
  var options = options || {};

  this.src = src;
  this.type = options.type || 'html';
  this.target = options.target ? '#' + options.target : '#player';
  $('.dropzone').toggleClass('active');
  this.isReady = false;


  // HTML 5
  if (this.type === 'html') {
    this.isHTML = true;
    this.buildHTMLVideo();
  }



  Subtitler.videoNode = this;
};

VideoElement.prototype = new Emitter();

// Functions
_.extend(VideoElement.prototype, {

  buildHTMLVideo: function() {
    var el = this.videoNode = document.createElement('video');

    // For backwards compatibility
    if (!this.src){
      _.defer(_.bind(this.onLoadingError, this));
      return;
    }


  $(el)
      .attr({ id: 'videoPlayer'
      })
      .on('error', _.bind(this.onLoadingError, this));
     
    $(this.target).html(el);
    this.bindReady();
    
    return this;
  },

  onTimeUpdate: function(data){
    if (Subtitler.draggingCursor)
      return;

    var end = Session.get('endTime')
      , duration = Session.get('loopDuration')
      , start = Session.get('startTime')
      , currentTime = data && data.seconds
        ? +data.seconds
        : this.getCurrentTime();

    Session.set('currentTime', currentTime);

    if (!end) {
      Session.set('endTime', currentTime + duration);
      Session.set('startTime', currentTime);
    } else if (Session.get('looping')
        && Session.get('videoPlaying')
        && currentTime > end) {
      this.seekTo(start);
    }
  },

  onPlayback: function(){
    Session.set('videoPlaying', true);
    if (this.isYoutube)
      this.youtubeTimeUpdate();
  },

  onLoadingError: function(){
    this.emit('loadingError');
  },

  onPauseOrError: function(){
    Session.set('videoPlaying', false);
    if (this.isYoutube && this.youtubeInterval)
      Meteor.clearInterval(this.youtubeInterval);
  },

  onReady: function(){
    this.isReady = true;
    this.bindEvents();
    this.emit('ready');
    if (this.isHTML){
      this.emit('metaDataReceived');
    }
  },


  // Bind our events
  bindEvents: function(){
    var vid = this.videoNode
      , self = this;

   // HTML5 Events
    if (this.isHTML) {
      vid.addEventListener('playing', _.bind(this.onPlayback, this));
      vid.addEventListener('pause', _.bind(this.onPauseOrError, this));
      vid.addEventListener('error', _.bind(this.onPauseOrError, this));
      vid.addEventListener('timeupdate', _.bind(this.onTimeUpdate, this));


    } 
  },


  bindReady: function(){
    var vid = this.videoNode;
    
    
    if (this.isHTML)
    {
      vid.addEventListener('loadedmetadata', _.bind(this.onReady, this));
      

      var getWowzaVodStream =function(){

      var url=Session.get('videolink'); 
      var context= new Dash.di.DashContext();
      var player = new MediaPlayer(context);
      player.startup();
      player.attachView(document.querySelector("#videoPlayer"));
      player.attachSource(url);
    
      }()
    //---------------------------------------------------
  }
  },

  // Playback Control / State
  getCurrentTime: function(){
    if (this.isHTML) return this.videoNode.currentTime;
  },

  pauseVideo: function(){
    if (this.isHTML) this.videoNode.pause();
  },

  playVideo: function(){
    if (this.isHTML) this.videoNode.play();
  },

  getVideoDuration: function(callback){
  if (this.isHTML) callback(this.videoNode.duration);
  },

  seekTo: function(number){
    if (this.isHTML) this.videoNode.currentTime = number;
  },


  setPlaybackRate: function(rate){
   if (this.isHTML) this.videoNode.playbackRate = rate;
  },

  setTarget: function(target){
    this.target = target;
    return this;
  },



  // Sync our video with our captions
  syncCaptions: function(time, options) {
    var end = Session.get('endTime')
      , start = Session.get('startTime')
      , options = options || {};

    options.silence = options.silent || false;

    if (time > end || time < start) {
      var result = Subtitles.findOne({startTime: {$lte : time}, endTime: {$gte: time}});
      if (result) {
        if (options.silent)
          Session.set('silentFocus', true);
        document.getElementById(result._id).focus();
        Session.set('currentSub', result);
      }
    }
  }

});

Subtitler.VideoElement = VideoElement;
