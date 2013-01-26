var centerContainer;
$(document).ready(function(){
  centerContainer();

  $(window).resize(centerContainer);

/*  $("#learnmore").click(function(){
    /*$("html,body").animate({
      scrollTop: ($(window).height() - 41) // scroll to the container. Make sure to subtract height of header
    }, 600);
    $(".page-two").modal({
      keyboard: true,
      show: true
    });
  });*/

  /*$("#signUp_btn").click(function(){
    $("#accountModal").modal({
      keyboard: true,
      backdrop: true,
      show: true
    });
  });*/

});

function login(type){
  if(type == 0){
    var email = $(".email_input"), pass = $(".password_input");
  }
  else{
    var email = $(".createEmail_input"), pass = $(".createPassword_input");
  }

  var errors = [], errorElements = [];
  if (email.val() == ""){
    errors.push("You must enter an email");
    errorElements.push(email);
  }
  if (pass.val() == ""){
    errors.push("You must enter a password");
    errorElements.push(pass);
  }
  
  if (errors.length == 0){
    pass.val(SHA256(pass.val()));
    return true;
  }else{
    error(errors, errorElements);
    return false;
  }
}

function error(msgs, elements){
  for (var i = 0; i < msgs.length; i++){
    $("#errors").append("<div data-alert=\"error\" class=\"fade in alert-message error\">" + 
                        "<a class=\"close\" href=\"#\">x</a><p>" + msgs[i] +
                        "</p></div>");
  }
  //$(".error").alert();

  for (i = 0; i < elements.length; i++){
    elements[i].parent().addClass("error");
  }
}

if (typeof console === "undefined" || typeof console.log === "undefined") {
  console = {};
  console.log = function() {};
}

centerContainer = function(){
  var height = $(window).height(); //finds the height of the window
  var containerHeight = $("#firstContent").height();
  console.log("height ", height);
  $(".container.content").css("margin-top", ((height / 2) - containerHeight / 2) + "px"); //centers the container verticaly
  $(".page-two").css("top", ((height))+"px");

  var pHeight = $(".white").height();
  $(".white").css("margin-top", (containerHeight / 2) - pHeight / 2 + "px");
}
