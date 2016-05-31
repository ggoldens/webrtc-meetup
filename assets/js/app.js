/**
 * Created by andreaphillips on 5/25/16.
 */
var apiKey = '45596182';
var sessionId = '2_MX40NTU5NjE4Mn5-MTQ2NDIzNjc3Nzg1NX5Gcy9pNUFIYVY4NFZqMldLdHI0bFpqTk9-fg';
var token = 'T1==cGFydG5lcl9pZD00NTU5NjE4MiZzaWc9YjhjNjM3NjlmMjAzMTZlODAxZjNiZDY3ZWRiNmU4Y2QxZGFkNjYyYTpzZXNzaW9uX2lkPTJfTVg0ME5UVTVOakU0TW41LU1UUTJOREl6TmpjM056ZzFOWDVHY3k5cE5VRklZVlk0TkZacU1sZExkSEkwYkZwcVRrOS1mZyZjcmVhdGVfdGltZT0xNDY0MjM2ODEyJm5vbmNlPTAuNjQxMTg5MTI1NTk5MzM5NiZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNDY2ODI4ODEy';
var challenger_1 = null;
var challenger_2 = null;
var count = 3;

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
  .on('streamCreated', function(event) {
    if(challenger_1 && challenger_2) {
      return;
    }else if(!challenger_1) {
      challenger_1 = event.stream.id;
      session.subscribe(event.stream,"user_1",streamUIOptions,function(){
        $("#user_1").addClass("spot_taken");
      });
    }else if(!challenger_2){
      challenger_2 = event.stream.id;
      session.subscribe(event.stream,"user_2",streamUIOptions,function(){
        $("#user_2").addClass("spot_taken");
      });
    }
  })
  .on('streamDestroyed', function(event) {
    console.log("streamDestroyed");
    if(challenger_1 == event.stream.id){
      challenger_1 = null;
    }
    if(challenger_2 == event.stream.id){
      challenger_2 = null;
    }
  })
  .on('signal:clear_question', function(event) {
    $("#question").html("");
  })
  .on('signal:new_question', function(event) {
    countbackToQuestion(event.data.question);
  })
  .on('signal:challenge_accepted', function(event) {
    console.log("Challenge Accepted")
    if(publisher.stream.connection.connectionId == event.from.connectionId){
      $("#user_1").addClass("active");
    }else{
      $("#user_2").addClass("active");
    }
  })
  .on('signal:question_winner', function(event) {
    console.log("New Question Winner")
  })
  .connect(token, function(error) {
    console.log("connected to session! watch");
  });


var countbackToQuestion = function (question) {
  $("#question").html("GET READY!");
  $(".red_button").addClass("hidden");
  setTimeout(function(){startCounting(question)},2000);
}

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
    count = 3;
  }
}
