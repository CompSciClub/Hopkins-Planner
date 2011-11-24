/* Calendar.js */
$(document).ready(function(){
	lastCalendarStyle = ""; // this String will record the color of the td that was moused-over
	createEmptyCalendar();
	$("td").hover(function(){ // mouseenter
		lastCalendarStyle = ($(this).attr("style")) ? $(this).attr("style") : "" ;
		$(this).attr("style","background-color:#f5f5f5;");
	} , function(){ // mouseleave
		$(this).attr("style", lastCalendarStyle);
	});
});

function createEmptyCalendar(){
	for (var i = 0; i < 4; i++){
		$("body tbody").append("<tr></tr>");
		for (var k = 0; k < 7; k++){
			var sty = ((i+k)%2 == 1) ? " style=\"background-color:#f9f9f9\"" : "";
			$("body tbody tr").last().append("<td"+sty +"></td>");
		}
	}
}