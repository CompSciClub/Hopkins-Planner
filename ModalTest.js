/* ModalTest.js */

$(document).ready(function(){
	$("#loadButton").click(function(){
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
		// var date = new Date();
		// var dateString = getCurrentDateString(date);
		// var time1 = getCurrentTimeString(date);
		// date.setHours(date.getHours() + 1);
		// var time2 = getCurrentTimeString(date);
		// $("#eventCreatorModal-DateSelector .small").val(dateString);
		// $("#eventCreatorModal-DateSelector .mini:first").val(time1);
		// $("#eventCreatorModal-DateSelector .mini:last").val(time2);
		
		/* Initialize the Date objects that will be used to control the start and end dates */
		var startDate = new Date();
		var endDate = new Date();
		
		var monthOptions = ["January",	"February",
						"March",	"April",
						"May",		"June",
						"July",		"August",
						"September","October",
						"November",	"December"];
		$("#startMonthSelect").html(''); // clear the list
		$("#endMonthSelect").html(''); // clear the list
		for (var i = 0; i < monthOptions.length; i++){
			$("#startMonthSelect").append("<option>"+monthOptions[i]+"</option>");// add options
			$("#endMonthSelect").append("<option>"+monthOptions[i]+"</option>");// add options
		}
		
		$("#startMonthSelect").val(monthOptions[startDate.getMonth()]);
		$("#endMonthSelect").val(monthOptions[startDate.getMonth()]);
		$(".dateInput").val(startDate.getDate());
		
		/* Populate the year selectors */
		var options = new Array(2011,2012,2013);
		
		$(".yearSelect").html(''); // clear the list
		for (var i = 0; i < options.length; i++){
			$(".yearSelect").append("<option>"+options[i]+"</option>");// add options
		}
		
		$(".yearSelect").val(startDate.getFullYear());
		
		/* Control the dateInput input boxes to maintain valid date */		
		$(".dateInput").keyup(function(){
			if($(this).val()){
				var newVal = parseInt($(this).val());
				var newValString = newVal.toString();
				if (newVal){
					if (newVal > 31){
						newVal = parseInt(newVal.toString()[0]);
						newValString = newVal.toString();
					}
					$(this).val(newValString);
				} else {
					$(this).val("");
				}
			}
		});
		
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
		if (thisClass.indexOf('block')!=-1){
			$("#blockSelect").val(thisClass[0]+' block');
		}
		/* Launch the Modal */
		$("#eventCreatorModal").modal({
			keyboard: true,
			backdrop: true,
			show: true
		});
		
		/* Once the modal is loaded, focus on the "Event name" box */
		$('#eventCreatorModal').bind('shown', function () {
			$("#eventNameInput").focus();
		});
		$("#cancelButton").click(function(){
			$("#eventCreatorModal").modal('hide');
		});
		$(".monthSelect, .yearSelect, .dateInput, .timeInput").change(function(){
			startDate.setDate($("#startDateInput").val());
			startDate.setMonth($.inArray($("#startMonthSelect").val(), monthOptions));
			startDate.setFullYear($("#startYearSelect").val());
			console.log("startDate = "+startDate.getMonth() +" "+startDate.getDate() +" "+startDate.getFullYear() +" "+getCurrentTimeString(startDate));
			
			endDate.setDate($("#endDateInput").val());
			endDate.setMonth($.inArray($("#endMonthSelect").val(), monthOptions));
			endDate.setFullYear($("#endYearSelect").val());
			console.log("endDate = "+endDate.getMonth() +" "+endDate.getDate() +" "+endDate.getFullYear() +" "+getCurrentTimeString(endDate));
		});
	}); // end td click
});

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
	if (dateObject.getHours() < 12){
		if (dateObject.getHours()==0){
			return "12" + dateObject.toTimeString().slice(2,5)+"am";
		} else{
			return dateObject.toTimeString().slice(0,5) +"am";
		}
	} else {
		return ((dateObject.getHours()%12==0)?12:dateObject.getHours()%12) + dateObject.toTimeString().slice(2,5)+"pm";
	}
}