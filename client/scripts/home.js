Template.home.events({
	'submit form': function(event){
		event.preventDefault();
		var userEmail = event.target.inputEmail.value;
		var userPass = event.target.inputPassword.value;

		
		var authObj = {
			username: userEmail
		};
		if(Meteor.user())
			Session.set('currentView','gallery');
		else{
			Meteor.loginWithPassword(authObj,userPass,function(err){
				if(Meteor.user()){
					Session.set('currentView','gallery');
				}
				else{
					console.log('Auth error');
				}
			});
		};
		return;
	}
})