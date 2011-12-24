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
		// create a new event
		// This will be a nice cool popup where you add in event details but right now it's just gonna submit a request
		// var input = $('<div class="alert-message info event_container" style="height:30px"><input class="event_input" type="text"></div>');
		// input.click(function(e){
			// e.stopPropagation();
		// });
		// $(this).append(input);
		// input.children()[0].focus();
		/** Modal Stuff */
			// if the input box has default text, select all of it to easily replace sample text
		$("input[value=\"Event Name\"], textarea").click(function(){
			if (($(this).attr('id')=="modalDescriptionBox" && $(this).val()=="Description here") || ($(this).attr('id')=="eventNameInput" && $(this).val()=="Event Name")){
				$(this).select();
			}
		});
		
		/* Date stuff...may or may not be unnecessary */
		var date = new Date();
		var dateString = getCurrentDateString(date);
		var time1 = getCurrentTimeString(date);
		date.setHours(date.getHours() + 1);
		var time2 = getCurrentTimeString(date);
		$("#eventCreatorModal-DateSelector .small").val(dateString);
		$("#eventCreatorModal-DateSelector .mini:first").val(time1);
		$("#eventCreatorModal-DateSelector .mini:last").val(time2);
		
		/* Populate the block selector */
		var options = new Array("A block","B block",
								"C block","D block",
								"E block","F block",
								"G block","H block",
								"activity","lunch","after school");
		
		$("#blockSelect").html(''); // clear the list
		for (var i = 0; i < options.length; i++){
			$("#blockSelect").append("<option>"+options[i]+"</option>");// add options
		}
		
		/* Set the block selector to the current block */
		var thisClass = $(this).attr('class');
		if (thisClass.indexOf('block')!=0){
			$("#blockSelect").val(thisClass[0]+' block');
		}
		
		/* Set other default values */
		$("#eventNameInput").val("Event Name");
		$("#modalDescriptionBox").val("Description here");

		
		/* Launch the Modal */
		$("#eventCreatorModal").modal({
			keyboard: true,
			backdrop: true,
			show: true
		});
		
		/* Once the modal is loaded, focus on the "Event name" box and select it */
		$('#eventCreatorModal').bind('shown', function () {
			$("#eventNameInput").focus();
			$("#eventNameInput").select();

		});
		$("#cancelButton").click(function(){
			$("#eventCreatorModal").modal('hide');
		});
	}); // end td click
	
});

/* Populate CalendarTable */
function createEmptyWeek(weekColor){
	var weekStructure = getWeekStructure(weekColor);

	for( var i = 0; i < 6; i++ ){
		$("#CalendarTable tbody").append("<tr></tr>"); // New Row
		for (var k = 0; k <= 6; k++){
			var tdClass = weekStructure[k][i] + "-block";
			$("#CalendarTable tbody tr").last().append("<td class=\""+tdClass +"\">"+tdClass+"</td>");
		}
	}
}

/* Get the structure of the current week...returns an array of arrays...why is the hopkins schedule so complicated... */
function getWeekStructure(weekColor){
	var maroonWeek = new Array();
		maroonWeek[0] = new Array('A','C','D','E','F','G');
		maroonWeek[1] = new Array('B','C','D','F','G','H');
		maroonWeek[2] = new Array('A','B','E','F','activity','');
		maroonWeek[3] = new Array('A','C','D','E','G','H');
		maroonWeek[4] = new Array('B','A','C','F','G','H');
		maroonWeek[5] = new Array('No School','','','','','');
		maroonWeek[6] = new Array('No School','','','','','');
	var grayWeek = new Array();
		grayWeek[0] = new Array('A','C','D','E','F','H');
		grayWeek[1] = new Array('B','C','D','E','G','H');
		grayWeek[2] = new Array('A','B','E','F','activity','');
		grayWeek[3] = new Array('B','C','D','E','G','H');
		grayWeek[4] = new Array('B','A','D','F','G','H');
		grayWeek[5] = new Array('No School','','','','','');
		grayWeek[6] = new Array('No School','','','','','');
		
	return (weekColor == "maroon") ? maroonWeek.slice(0) : grayWeek.slice(0);
}

/* We need to either fix the colors/fix this function, or get rid of it, because it isn't doing much of anything at the moment :P */
function setDarkColor(color){
	var lightColorsArray = new Array("","background-color:#f9f9f9","background-color:#EEB4B4");
	var darkColorsArray = new Array("background-color:#f5f5f5","background-color:#f5f5f5","background-color:#BB8888");
	var x = lightColorsArray.indexOf(color);
	return darkColorsArray[x];
}

/* Modal Stuff */
/* Get the current date in the form "Dec 19, 2011" (might not be necessary if we redo the UI a bit)*/
function getCurrentDateString(dateObject){
	var date = dateObject.getDate();
	var months=new Array(12);
		months[0]="January";
		months[1]="February";
		months[2]="March";
		months[3]="April";
		months[4]="May";
		months[5]="June";
		months[6]="July";
		months[7]="August";
		months[8]="September";
		months[9]="October";
		months[10]="November";
		months[11]="December";
	var month = months[dateObject.getMonth()];
	var year = dateObject.getFullYear();
	return month.slice(0,3) + " " + date + ", " + year;
}

/* Get the current time in the form 12:30pm (might not be necessary if we redo the UI a bit)*/
function getCurrentTimeString(dateObject){
	if (dateObject.getHours() < 13){
		if (dateObject.getHours()==0){
			return "12" + dateObject.toTimeString().slice(2,5)+"am";
		} else{
			return dateObject.toTimeString().slice(0,5) +"am";
		}
	} else {
		return ((dateObject.getHours()%12==0)?12:dateObject.getHours()%12) + dateObject.toTimeString().slice(2,5)+"pm";
	}
}
