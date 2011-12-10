/* Week.js */

$(document).ready(function(){
	/* For IE Compatibility */
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function(obj, start) {
			for (var i = (start || 0), j = this.length; i < j; i++) {
				if (this[i] === obj) { return i; }
			}
			return -1;
		}
		console.log("you suck, internet explorer");
	}
	
	/* GLOBALS: */
	lastCalendarStyle = ""; // this String will record the color of the td that was moused-over
	
	createEmptyWeek("gray");
	
	var randNum = Math.floor(Math.random()*3);
	$($(".Eblock")[randNum]).append('<div class="alert-message info" style="height:30"><h4>QUIZ</h4></div>');

	
	/* EVENT HANDLERS: */
	$("#CalendarTable td").hover(
		/* mouseenter */
		function(){
			/* This 'if' is to stop anything from happining when mouseover the empty cells
			 * if this is ugly, just remove this if and the mouseleave if.*/
			if ($(this).attr("id") != "calendarcell"){
				//if ((this.attr("class")) && (this.attr("class").substring())
				lastCalendarStyle = ($(this).attr("style")) ? $(this).attr("style") : "" ;
				$(this).attr("style",setDarkColor(lastCalendarStyle));
			}
		} ,
		/* mouseleave */
		function(){
			if ($(this).attr("id") != "calendarcell"){
				$(this).attr("style", lastCalendarStyle);
			}
		}
	); // end td hover
	$("#CalendarTable td").click(function(){
		var tdClass = $(this).attr("class");
		$("#colorInput").click(); // triggers JSColor
		console.log(jscolor.picker);
		$(jscolor.picker.box).mousedown(function(e){
			$("#colorInput").change(function(){
				var tdColor = $("#colorInput").css('background-color').toLowerCase();
				changeColor(tdClass, tdColor);
			});
		});
		// jscolor.picker.owner.hidePicker();
	}); // end td click
	
});

function changeColor(input, color){
	$("."+input).css('background-color', color);
}

function createEmptyWeek(weekColor){
	
	var weekStructure = getWeekStructure(weekColor);
	
	for( var i = 0; i < 6; i++ ){
		$("#CalendarTable tbody").append("<tr></tr>"); // New Row
		for (var k = 0; k <= 6; k++){
			var tdClass = weekStructure[k][i] + "block";
			$("#CalendarTable tbody tr").last().append("<td class=\""+tdClass +"\">"+tdClass+"</td>");
		}
	}
}

function getWeekStructure(weekColor){
	var maroonWeek = new Array();
		maroonWeek[0] = new Array('A-','C-','D-','E-','F-','G-');
		maroonWeek[1] = new Array('B-','C-','D-','F-','G-','H-');
		maroonWeek[2] = new Array('A-','B-','E-','F-','activity-','');
		maroonWeek[3] = new Array('A-','C-','D-','E-','G-','H-');
		maroonWeek[4] = new Array('B-','A-','C-','F-','G-','H-');
		maroonWeek[5] = new Array('No School-','','','','','');
		maroonWeek[6] = new Array('No School-','','','','','');
	var grayWeek = new Array();
		grayWeek[0] = new Array('A-','C-','D-','E-','F-','H-');
		grayWeek[1] = new Array('B-','C-','D-','E-','G-','H-');
		grayWeek[2] = new Array('A-','B-','E-','F-','activity','');
		grayWeek[3] = new Array('B-','C-','D-','E-','G-','H-');
		grayWeek[4] = new Array('B-','A-','D-','F-','G-','H-');
		grayWeek[5] = new Array('No School-','','','','','');
		grayWeek[6] = new Array('No School-','','','','','');
		
	return (weekColor == "maroon") ? maroonWeek.slice(0) : grayWeek.slice(0);
}

function setDarkColor(color){
	var lightColorsArray = new Array("","background-color:#f9f9f9","background-color:#EEB4B4");
	var darkColorsArray = new Array("background-color:#f5f5f5","background-color:#f5f5f5","background-color:#BB8888");
	var x = lightColorsArray.indexOf(color);
	return darkColorsArray[x];
}