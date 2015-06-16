var Imports = Subtitler.Imports = function(file) {

  var reader = this.reader = new FileReader(file);
  this.file = file;
  this.type = file.name.split('.').pop();
  this.project = {};
  this.subtitles = [];
};

/**
 * METHODS
 */

_.extend(Imports.prototype, {
  trim : function(val) {
    return val.replace(/^\s*|\s*$/g, "");
  },

  parseSRT : function(callback){
    var self = this;
    Meteor.call('parse', self.string, function(err, result){
      if (!err) {
        self.subtitles = result;
        callback();
      }
    });
  },

  insertSubs : function(subtitles) {
 
    var self = this
      , subs = subtitles || self.subtitles
      , usr = Meteor.userId();

    var removeAndInsert = function(){
      _.each(subs, function(sub){
        _.extend(sub, {
          saved : true,
          user : usr,
          videoId : Session.get('currentVideo')
        });
        Subtitles.insert(sub);
      });
    };

    removeAndInsert();

  },

  readAsText : function(callback){
    var self = this;
    self.reader.readAsText(self.file);
    self.reader.onloadend = function(e) {
      self.string = self.reader.result;
      callback();
    };
  },

  hmsToSeconds : function(string) {
    var parts = string.split(':')
      , hours = Number(parts[0]) * 3600
      , minutes = Number(parts[1]) * 60
      , seconds = Number(parts[2].replace(',', '.'));

    return hours + minutes + seconds;
  }

});