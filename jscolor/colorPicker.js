/* colorPicker.js */

$(document).ready(function(){
	$(".Ablock").click(function(e){
		$("#colorInput").css('left',e.pageX);
		$("#colorInput").css('top',e.pageY);
		$("#colorInput").click();
	});
});