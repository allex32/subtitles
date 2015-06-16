Template.videocontainer.helpers({

	video : function(){
		return Links.find();
	}
});

Template.videocontainer.events({

	'click a' : function(event){
		event.preventDefault();
		var hr = event.currentTarget.name;
		Router.navigate('project/'+hr,true);
	}
});