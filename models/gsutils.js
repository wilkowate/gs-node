module.exports = {
	createTempTableName: function(prefix) {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for (var i = 0; i < 15; i++){
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
 
		return prefix+text;
	}
};
