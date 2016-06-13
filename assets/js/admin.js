/**
 * Created by andreaphillips on 5/25/16.
 */
var apiKey = '45596182';
var sessionId = '1_MX40NTQ5NDMzMn5-MTQ2NTg1MTA0ODgyMn43ei9xdUd0Q1B3WExXaVRiVXQwbmZiRm9-fg';
var token='T1==cGFydG5lcl9pZD00NTQ5NDMzMiZzaWc9OTIzYjE2NDc1ZGNiYmFmNTVmZWE5MjNmNjEzYTQ2MzY0ZDkzNDA1YTpzZXNzaW9uX2lkPTFfTVg0ME5UUTVORE16TW41LU1UUTJOVGcxTVRBME9EZ3lNbjQzZWk5eGRVZDBRMUIzV0V4WGFWUmlWWFF3Ym1aaVJtOS1mZyZjcmVhdGVfdGltZT0xNDY1ODUxMzI4Jm5vbmNlPTAuMzI5OTk1MjY4NDkwMTY1NDcmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTQ2ODQ0MzMyOA==';
var publisher = null;
var users = [];
var subscribers={};
var answer_number = 1;


var streamUIOptions = {
  showControls: false,
  width: "100%",
  height: "100%",
  frameRate: 15,
  insertMode: 'append',
  publishAudio:false,
  fitMode: 'contain'
};

var session = OT.initSession(apiKey, sessionId)
  .on('connectionCreated',function(event){
    console.log(event);
    if(event.connection != session.connection){
      users.push(event.connection);
      $("#user_count").html(users.length);
    }
  })
  .on('connectionDestroyed',function(event){
    console.log(event);
    var index = users.indexOf(event.connection);
    if (index > -1) {
      users.splice(index, 1);
    }
    $("#user_count").html(users.length);
  })
  .on('streamCreated', function(event) {
    var user_id = event.stream.connection.connectionId;
    $("#user_holder").append(userBoxTemplate(user_id));
    subscribers[user_id] = session.subscribe(event.stream,'user_'+user_id,streamUIOptions);
  })
  .on('streamDestroyed', function(event) {
    var user_id = event.stream.connection.connectionId;
    $("#box_"+user_id).remove();
  })
  .on('signal:clear_question', function(event) {
    $("#asked_question").html("");
  })
  .on('signal:new_question', function(event) {
    $("#asked_question").html(event.data.question);
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

  })
  .connect(token, function(error) {
    console.log("admin in session");
  });

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

var sendStartRound = function(){
  session.signal({type:"start_round"},function (error) {
    if (error) {
      console.log('onSendStartPublishing:ERROR', error);
    } else {
      console.log("start round");
    }});
}


var sendStartPublishing = function(){
  var temp_users = _.sample(users,2);
  _.each(temp_users,function(user){
    session.signal({type:"start_publishing",to:user},function (error) {
      if (error) {
        console.log('onSendStartPublishing:ERROR', error);
      } else {
        console.log("start publishing sent");
      }});
  });
}

$(document).ready(function(){

  $("#send_question").click(function() {
    answer_number = 1;
    var message = {
      type: 'new_question',
      data:{
        "question": $("#question").val()
      }
    };
    session.signal(message,function (error) {
      if (error) {
        console.log('onSendWarningSignal:ERROR', error);
      } else {
        console.log('warning signal sent.');
      }});
  });

  $("#clear_question").click(function() {
    var message = {
      type: 'clear_question'
    };
    session.signal(message,function (error) {
      if (error) {
        console.log('onSendWarningSignal:ERROR', error);
      } else {
        console.log('warning signal sent.');
      }});
  });

  $("#reveal_answers").click(function() {
    var message = {
      type: 'reveal_answers'
    };
    session.signal(message,function (error) {
      if (error) {
        console.log('onreveal_answers:ERROR', error);
      } else {
        console.log('warning signal sent.');
      }});
  });


  $("#start_round").click(function () {
    var message = {
      type: 'clear_participants',
      data:{
        "question": $("#question").val()
      }
    };
    session.signal(message,function (error) {
      if (error) {
        console.log('onSendWarningSignal:ERROR', error);
      } else {
        console.log('warning signal sent.');
        sendStartRound();
        sendStartPublishing();
      }});
  });
});
