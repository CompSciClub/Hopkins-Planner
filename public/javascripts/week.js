/* Week.js */

var eventDate; // Date info for the event currently being created

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
  classesToday = [];
  /* EVENT HANDLERS: */

  $( document ).bind( "mobileinit", function(){
    $.mobile.page.prototype.options.degradeInputs.date = true;
  });

  modalTypeVar = "new"; // whether editing (old) or creating (new). New by default
  currentEventLoc = [];
  
  /** EVENT HANDLERS: */
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
    var block = $(this).attr('class').split(" ")[0]; // figure out which block the event is
    /** Modal Stuff */

    // get the date and information
    console.log(getChildIndex(this));
    var date = new Date(monday + (getChildIndex(this) * 24 * 60 * 60 * 1000)); // get the current date by adding the number of milliseconds since monday.
        eventDate      = getCurrentDateString(date); // since only one event is created at a time, just use a date global
        eventDate.day  = getChildIndex(this);
        eventDate.node = this; // store the current element so we can put the event box in later

      modalTypeVar = "new"; // set the edit type to new;
      createEventModal("new", block);
    });
  // event popovers
  $(".event").popover({html: false, trigger: "hover"});

  $(".eventCheck").click(checkboxClicked);

  updateEventClickHandler();
  
  /* Modal releated events
     I moved them out of the click handler to be more memory effecient because the elements are never deleted
  */
  /* Once the modal is loaded, focus on the "Event name" box */
  $('#eventCreatorModal').bind('shown', function () {
    $("#eventNameInput").focus().select();
  });
  $("#cancelButton").click(function(){
    closeDialog();
  });
  $("#blockSelect").change(function(){
    $(".eventBlock").html($(this).val()); // change the block in the time string when they select a new block
  });
  $("#saveButton").click(function(){
    var i = 0;
	  for (i = 0; i < classesToday.length; i++){
		if (blocks[classesToday[i]] == $("#blockSelect").val()){
			break;
		}
	  }
	  eventDate.block = classesToday[i];
	  eventDate.node = $($("#CalendarTable tr")[i+1]).children("td")[eventDate.day];
      createEvent(modalTypeVar);
  });
  $("#deleteButton").click(function(){
    deleteEvent();
  });

  // if the input box has default text, select all of it to easily replace sample text
  $("input[value=\"Event Name\"], textarea").click(function(){
    console.log("focus");
    if (($(this).attr('id')=="modalDescriptionBox" && $(this).val()=="Description here") || ($(this).attr('id')=="eventNameInput" && $(this).val()=="Event Name")){
      $(this).select();
    }
  });
});

function updateEventClickHandler(){
	$(".event").click(function(event){
		console.log("event clicked"); // MDADD
		event.stopPropagation(); // stop from spreading
		modalTypeVar = "old"; // set the edit type to old
		editEvent(this);
	});
}

/*function populateOptions(){
  var bootClasses = ["label success","label important","label notice"];
  $("#options").html('');
  for (var i = 0; i < 3; i++){
    $("#options").append('<div class="options '+ bootClasses[i] +'" style="" >'+ '<input class="options" name="modalRadio1" type="radio" />   ' + $("#eventNameInput").val() +'</div> <br />');
  }
} // this is probably a smarter way to do this then just making them in jade, if we use a global bootClasses array */

/** Events */

function editEvent(node){
  console.log("editEvent called"); // MDADD
  var blockNode = $(node).parent("td")[0];
  getEventInfo(blockNode);
  var block = $(blockNode).attr('class').split(" ")[0];
  if (events[eventDate.day] && events[eventDate.day][block] && events[eventDate.day][block][getChildIndex(node)-1]){
	var thisEvent = events[eventDate.day][block][getChildIndex(node)-1];
  } else {
	var thisEvent = {};
	thisEvent.description = $(node).attr("data-content");
	thisEvent.name = $(node).attr("data-original-title");
	thisEvent.class = $(node).attr("class").split(" ")[2];
  }
  thisEvent.node = node;
  currentEventLoc = [eventDate.day, block, getChildIndex(node)-1];
  eventDate._id = thisEvent._id;
  console.log(thisEvent);
  createEventModal("edit", block, thisEvent);
}

// Creates a new event from info in modal
function createEvent(newOrOld){
  // grab the current eventDate object which we will extend
  var newEvent         = eventDate;
  newEvent.name        = $("#eventNameInput").val();
  newEvent.description = $("#modalDescriptionBox").val();
  newEvent.bootClass   = ""
  if (newOrOld == "old"){
    newEvent._id = eventDate._id;
   $($(eventDate.node).children("div[eventId="+ newEvent._id +"]")).remove();
  }
  if (newEvent.description === "Description here"){
    newEvent.description = "No description";
  }
  
  var radios = $('input[name=modalRadio1]:radio'); 
  var bootClasses = getBootClasses();
  for (var i = 0; i < radios.length; i++){
    if (radios[i].checked){
      newEvent.bootClass += bootClasses[i];
    }
  }
   // now add the element to the UI
    // TODO re-style these event boxes
    $(eventDate.node).append('<div eventid="'+ eventDate._id +'" class="label success '+newEvent.bootClass+' event" style="height:20px" rel="popover" data-original-title="' + escapeHtml(newEvent.name) + '"data-content="' + escapeHtml(newEvent.description) +'"><div class="eventText">' + newEvent.name + '</div><input type="checkbox" class="eventCheck"></div>');
    $(".eventCheck").unbind("click", checkboxClicked);
    $(".eventCheck").click(checkboxClicked);
    $(".event").popover({html: false, trigger: "hover"});
  
  // now save the event on the server
  newEvent.node = null; // remove node because it's waaay too big to transfer and is unnecessary
  var url = (newOrOld == "new") ? "/event" : "/event/" + newEvent._id;
  $.ajax({
    url: url,
    type: "POST",
    data: newEvent,
    failure: function(err){
      console.log(err);
      error(err);
    }
  });
  if (newOrOld == "old"){
    events[currentEventLoc[0]][currentEventLoc[1]].push(newEvent);
    console.log(newEvent);
  }
  closeDialog();
}

function deleteEvent(node){ // sends a "DELETE" ajax request, deletes event visually
  // note: does not delete in local "events" variable...possible undo function?
  $.ajax({
      url: "/event/"+ eventDate._id,
      type: "DELETE",
      failure: function(err){
        console.log(err);
        error(err);
      }
  });
  $($(eventDate.node).children("div[eventId="+ eventDate._id +"]")).remove();
  closeDialog();
}

function getEventInfo(blockNode){
  var date = new Date(monday + (getChildIndex(blockNode) * 24 * 60 * 60 * 1000)); // get the current date by adding the number of milliseconds since monday.
  eventDate      = getCurrentDateString(date); // since only one event is created at a time, just use a date global
  eventDate.day  = getChildIndex(blockNode);
  eventDate.node = blockNode; // store the current element so we can put the event box in later
}

function checkboxClicked (event){
  var done    = ($(this).attr("checked") == "checked");
  var eventId = $(this).parent().attr("eventId");
  $.ajax({
    url: "/event/" + eventId,
    type: "POST",
    data: {
      done: done
    },
    failure: function(err){
      error(err.msg);
    }
  });
  $(this).parent().toggleClass("done");
  event.stopPropagation();
};

function getBootClasses(){
  return ["hw",
           "quiz",
           "test",
           "project",
           "reminder"]
}

/* We need to either fix the colors/fix this function, or get rid of it, because it isn't doing much of anything at the moment :P */
function setDarkColor(color){
  var lightColorsArray = new Array("","background-color:#f9f9f9","background-color:#EEB4B4");
  var darkColorsArray = new Array("background-color:#f5f5f5","background-color:#f5f5f5","background-color:#BB8888");
  var x = lightColorsArray.indexOf(color);
  return darkColorsArray[x];
}

/** Modal Stuff */

function createEventModal(modalType, block, thisEvent){
  // inject the date 
    // TODO add times. Kinda a pain in the ass with the way the schedule works, also we can't do this until we know what grade the user is in
    $(".eventDate").html(eventDate.string);

    //populateOptions();
  
    classesToday = [];
	
	var mainTableRows = $("#CalendarTable tr");
	for (var i = 1; i < mainTableRows.length; i++){
		if (eventDate.day < 5){ // hard code weekends
			if (i == 6 && eventDate.day > 2){
				var output = $(mainTableRows[i]).children("td")[eventDate.day-1];
			} else if (eventDate.day != 2 || i != 6){
				var output = $(mainTableRows[i]).children("td")[eventDate.day];
			} else {
				break;
			}
			output = $(output).attr("class").split(" ")[0];
			classesToday.push(output);
		} else if (eventDate.day == 5){
			classesToday = ["Saturday"];
		} else if (eventDate.day == 6){
			classesToday = ["Sunday"];
		}
	}
	
    /* Populate the block selector */

    $("#blockSelect").html(''); // clear the list
    for (blockName in blocks){
      if (blockName != "_id" && $.inArray(blockName, classesToday) != -1)
        $("#blockSelect").append("<option>"+blocks[blockName]+"</option>");// add options
    }

    // add in other blocks
    /* Set the block selector to the current block */
    $("#blockSelect").val(blocks[block]);
    $(".eventBlock").html(blocks[block]);
    eventDate.block = block; // convert block to number and add block info to the eventDate object
      if (modalType == "edit") {
        $("#eventNameInput").val(thisEvent.name);
        $("#modalDescriptionBox").val(thisEvent.description);
        var bootClasses = getBootClasses();
        var x = $.inArray(thisEvent.class, bootClasses);
        console.log(x);
        var radios = $('input[name=modalRadio1]:radio');
        radios[x].checked="true";
        $("#deleteButton").show();
      } else {
        $("#deleteButton").hide();
      }
    if (modalType == "edit") {
      $("#eventNameInput").val(thisEvent.name);
    } 
    /* Launch the Modal */
    $("#eventCreatorModal").modal({
      keyboard: true,
      backdrop: "static",
      show: true
    });  
}

// closes and resets the modal dialog
function closeDialog(){
  $("#eventCreatorModal").modal("hide"); // close the dialog
  
  // reset the information in the dialog
  $("#eventNameInput").val("Event Name");
  $("#modalDescriptionBox").val("Description here");
  // TODO reset the radio buttons, once we figure out what they're for
  updateEventClickHandler();
}

/** Other functions */

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
  return {
    string: month.slice(0,3) + " " + date + ", " + year,
    month: month,
    day: date,
    year: year,
    timestamp: dateObject.getTime()
  }
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

// function to find the index of a child element
function getChildIndex(child){
  var cnt = 0;
  while(child.previousSibling){
    cnt++;
    child = child.previousSibling
  }
  return cnt;
}
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/(\r\n|[\r\n])/g, "<br />")
    .replace(/'/g, "&#039;");
}
function error(msg){
  console.log("error", msg);
}