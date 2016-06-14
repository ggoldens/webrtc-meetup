/**
 * Created by andreaphillips on 5/25/16.
 */
var apiKey = '45596182';
var sessionId = '1_MX40NTU5NjE4Mn5-MTQ2NTg1MjgzNDA5Mn5FWXFOZ1VpZDJWSDJzQzJJdTYxL2EyMTV-fg';
var token ='T1==cGFydG5lcl9pZD00NTU5NjE4MiZzaWc9OTdhYzY5Y2ZjZDM2OTI4ZmM0YmM2NmQ5M2M5NDIzYzBjMDUzNzA3YzpzZXNzaW9uX2lkPTFfTVg0ME5UVTVOakU0TW41LU1UUTJOVGcxTWpnek5EQTVNbjVGV1hGT1oxVnBaREpXU0RKelF6SkpkVFl4TDJFeU1UVi1mZyZjcmVhdGVfdGltZT0xNDY1ODUyODkxJm5vbmNlPTAuMzA1MTkxNDg0OTc4NDIyNSZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNDY4NDQ0ODg5';
var publisher = null;
var count = 3;
var answer_number = 1;

var streamUIOptions = {
  showControls: true,
  width: "100%",
  height: "100%",
  frameRate: 15,
  insertMode: 'append',
  publishAudio:true,
};

var session = OT.initSession(apiKey, sessionId)
  .on('streamCreated', function(event) {
    var user_id = event.stream.connection.connectionId;
    if(session.connection.connectionID != user_id){
      $("#user_holder").append(userBoxTemplate(user_id));
      session.subscribe(event.stream,'user_'+user_id,streamUIOptions);
    }
  })
  .on('streamDestroyed', function(event) {
    var user_id = event.stream.connection.connectionId;
    $("#box_"+user_id).remove();
  })
  .on('signal:start_publishing',function(){
    $("#user_holder").append(userBoxTemplate(session.connection.connectionId));
    publisher = OT.initPublisher('user_'+session.connection.connectionId,streamUIOptions,function(){
      console.log("ready to publish");
    });
    session.publish(publisher);
    $("#participant_message").removeClass("hidden");
  })
  .on('signal:start_round', function(event) {
    $("#user_message").addClass("hidden");
    $("#answer").val("");
  })
  .on('signal:clear_question', function(event) {
    $("#question").html("");
    $(".question-wrap").addClass("hidden");
    $(".participant").removeClass("active");
    $("#answer").val("");
    $(".footer").removeClass("user-ready show-answer");
  })
  .on('signal:new_question', function(event) {
    countbackToQuestion(event.data.question);
  })
  .on('signal:question_answered', function(event) {
    $("#answer_"+event.from.connectionId).html(event.data.answer);
    $("#answer_order_"+event.from.connectionId).html(answer_number);
    $("#answer_"+event.from.connectionId).parent().parent().addClass("user-ready");
    answer_number++;
  })
  .on('signal:reveal_answers', function(event) {
    $(".footer").addClass("user-ready show-answer");
  })
  .on('signal:clear_participants', function(event) {
    if(publisher){
      $("#box_"+publisher.stream.connection.connectionId).remove();
      session.unpublish(publisher);
      publisher = null;
      $("#participant_message").addClass("hidden");
    }
    $("#question").html("");
    $(".question-wrap").addClass("hidden");
    $(".participant").removeClass("active");
    $("#user_message").removeClass("hidden");
    $("#participant_message").addClass("hidden");
  })
  .on('signal:winner', function(event) {
    $("#"+event.data.winner).addClass("winner");
  })
  .connect(token, function(error) {
    console.log("Connected to session");
  });

var countbackToQuestion = function (question) {
  answer_number = 1;
  $(".question-wrap").removeClass("hidden");
  $("#question").html("GET READY!");
    $("#answer_fields").addClass("hidden");
    setTimeout(function(){startCounting(question)},2000);
};

var startCounting = function(question){

  var interval_count = setInterval(function(){ countback() }, 1000);
  var countback = function() {
    if(count == 0){
      stopCounting()
    }else{
      $("#question").html(count);
      --count;
    }
  }

  var stopCounting = function() {
    clearInterval(interval_count);
    $("#question").html(question);
    if(publisher){
      $("#answer_fields").removeClass("hidden");
    }
    count = 3;
  }
}

var userBoxTemplate = function(connection_Id){
  var template = _.template('<div class="video-box" id="<%- user_box_id %>">'+
    '<div class="video participant" id="<%- box_id %>"></div>'+  
    '<div class="footer">'+ 
    '<div class="visualizer vslzr-gif"></div>'+
    '<div class="visualizer vslzr-mask"></div>'+
    '<div class="answer-wrap">'+
    '<strong class="answer-count" id="<%- answer_count %>">1</strong>'+
    '<span id="<%- answer_id %>"></span>'+
    '</div>'+
    '</div>'+
    '</div>');
  return template({user_box_id:"box_"+connection_Id,box_id:"user_"+connection_Id, answer_id:"answer_"+connection_Id, answer_count:"answer_order_"+connection_Id});
};




$(document).ready(function(){

  $("#answer_question").click(function() {
    var message = {
      type: 'question_answered',
      data:{
        answer:$("#answer").val()
      }
    };
    session.signal(message,function (error) {
      if (error) {
        console.log('onSendWarningSignal:ERROR', error);
      } else {
        console.log('answer has been sent!');
        $("#answer_fields").addClass("hidden");
      }});
  });
});
