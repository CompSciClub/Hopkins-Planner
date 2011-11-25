/* Calendar.js */
$(document).ready(function(){
	/* GLOBALS: */
	lastCalendarStyle = ""; // this String will record the color of the td that was moused-over
	startCell = 3; // Which day of the week is the first day of the month? 0 is Sunday.
	
	createEmptyCalendar();
	
	/* EVENT HANDLERS: */
	$("td").hover(
		/* mouseenter */
		function(){
			lastCalendarStyle = ($(this).attr("style")) ? $(this).attr("style") : "" ;
			$(this).attr("style","background-color:#f5f5f5;");
		} ,
		/* mouseleave */
		function(){
			$(this).attr("style", lastCalendarStyle);
		}
	); // end td hover
	
	$("td").click(function(){
		if ($(this).attr("id") != "calendarcell"){
			var date = $(this).attr("id").substring(12); // ex. id is calendarcell7, date is 7
		
			/* find which day of the week corresponds using the table headers */
			var day = $($("th")[(date-1+startCell)%7]).text(); 
			
			alert("This is " +day +", the " +date +"th.");
		}
	}); // end td click
});

function createEmptyCalendar(){
	//startCell = 1; //see GLOBALS at top of file
	var daysNum = 31; // number of days in the month
	var rowsNum = (daysNum+startCell)/7; // number of rows needed
	for (var i = 0; i < rowsNum; i++){ // week loop (4, 5 or 6)
		$("body tbody").append("<tr></tr>"); // New Row
		
		for (var k = 0; k < 7; k++){ // day loop (7)
		
			var x = (i*7)+k+1-startCell; // Calculate current date from position in calendar
			
			/* if the date is invalid, the cell will be blank and the id will be "calendarcell" */
			if (x > daysNum || x < 1){
				x = "";
				id = "";
			} else {
				var id = " id=\"calendarcell"+x+"\""; // if the date is valid, id is calendarcell"date"
			}
			
			var sty = (k%2 == 0) ? " style=\"background-color:#f9f9f9\"" : ""; // "zebra-striped idea"
			if (k==0 || k==6) sty = " style=\"background-color:#EEB4B4\"" // Saturday and Sunday are special :)
			$("body tbody tr").last().append("<td" +id +sty +">"+x+"</td>");
		}
	}
}