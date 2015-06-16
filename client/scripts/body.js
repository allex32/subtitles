Template.body.helpers({

  appView: function(){
    return Session.get('currentView');
  },

  app : function(){

	return Session.equals('currentView', 'app');
  },

  home: function(){

  	return Session.equals('currentView','home');
  },

  gallery: function(){

  	return Session.equals('currentView', 'gallery');
  },

  autherror: function(){
  	return Session.equals('currentView', 'autherror');
  }


});

