/* Calendar.js */
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
	
	var year = 2011;
	var monthNames = new Array("January","February","March","April","May","June","July","August","September","October","November","December");	
	var monthName = "February"; // What month is it?
	var daysInMonth = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
	var monthNum = monthNames.indexOf(monthName);
	var startCell = new Date(year, monthNum, 1).getDay(); // Which day of the week is the first day of the month? 0 is Sunday.
	var daysNum = getDaysInMonth(monthNum, year, daysInMonth); // returns daysInMonth[monthNum] unless it's a leap year
	
	/* GLOBALS: */
	lastCalendarStyle = ""; // this String will record the color of the td that was moused-over
	
	$("#monthNameHeader").html(monthName); // Title the calendar
	
	createEmptyCalendar(daysNum, startCell);
	
	/* Quiz, Test, and Essay using Bootstrap alert messages */
	$("#calendarcell15").append('<h4 class="alert-message warning">QUIZ</h4>');
	$("#calendarcell25").append('<h4 class="alert-message error">TEST</h4>');
	$("#calendarcell28").append('<h4 class="alert-message info">ESSAY</h4>');
	
	// for (var i = 1; i < 29; i++){
		// $("#calendarcell"+i+"").append('<h4 class="alert-message error">TEST</h4>');
	// }
	
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
		if ($(this).attr("id") != "calendarcell"){
			if (!($(this).attr("class")) || $(this).attr("class").indexOf("colorCell") == -1){
				// var date = parseInt($(this).attr("id").substring(12)); // ex. id is calendarcell7, date is 7
				// /* find which day of the week corresponds using the table headers */
				// var day = $($("#CalendarTable th")[((date-1+startCell)%7) + 1]).text(); 
				// var week = Math.floor((date+startCell)/7);
				// var weekColor = (week%2 == 0) ? "Maroon" : "Gray";
				// //alert("This is " +weekColor +" " +day +", the " +date +"th.");
				window.location = "Week.html";
			}
		}
	}); // end td click
	
});

function createEmptyCalendar(daysNum, startCell){
	// daysNum = number of days in the month. See declaration at top of Calendar.js
	// startCell = the first day of the month. See declaration at top of Calendar.js
	var rowsNum = (daysNum+startCell)/7; // number of rows needed
	for (var i = 0; i < rowsNum; i++){ // week loop (4, 5 or 6)
		$("body tbody").append("<tr></tr>"); // New Row
		var colorCellClass = (i%2==0) ? "colorCellMaroon" : "colorCellGray"; // see css in Calendar.html
		$("body tbody tr").last().append("<td class=\"" +colorCellClass + "\"></td>");
		for (var k = 0; k < 7; k++){ // day loop (7)
			var x = (i*7)+k+1-startCell; // Calculate current date from position in calendar
			/* if the date is invalid, the cell will be blank and the id will be "calendarcell" */
			if (x > daysNum || x < 1){
				x = "";
				id = " id=\"calendarcell\"";
			} else {
				var id = " id=\"calendarcell"+x+"\""; // if the date is valid, id is calendarcell"date"
			}
			var sty = (k%2 == 0) ? " style=\"background-color:#f9f9f9\"" : ""; // "zebra-striped idea"
			if (k==0 || k==6) sty = " style=\"background-color:#EEB4B4\"" // Saturday and Sunday are special :)
			$("body tbody tr").last().append("<td" +id +sty +">"+x+"</td>");
		}
	}
}

// Returns the number of days in the month in a given year (January=0)
function getDaysInMonth(month,year,daysInMonth){
	if ((month==1)&&(year%4==0)&&((year%100!=0)||(year%400==0))){
		return 29;
	}else{
		return daysInMonth[month];
	}
}

function setDarkColor(color){
	var lightColorsArray = new Array("","background-color:#f9f9f9","background-color:#EEB4B4");
	var darkColorsArray = new Array("background-color:#f5f5f5","background-color:#f5f5f5","background-color:#BB8888");
	var x = lightColorsArray.indexOf(color);
	return darkColorsArray[x];
}