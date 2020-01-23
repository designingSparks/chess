$(document).ready(function(){
console.log('Document Ready');

new QWebChannel(qt.webChannelTransport, function (channel) {
    var JSobject = channel.objects.TheNameOfTheObjectUsed;
    myhandler = channel.objects.handler;
    // handler.webToAppSendData({"data": ["hello", "world", 1, {"A": true, "B": false}]});

    //This function receives the data that was sent from python via the signal "appToWebSendData"
    myhandler.appToWebSendData.connect(function(value) {

        console.log(value);
        // myhandler.webToAppSendData(
        //     {"data": ["hello", "world", 1, {"A": true, "B": false}]});
        // myhandler.webToAppSendData(
        //     [1, true, false, {"a": "b"}])
    });

});

//https://stackoverflow.com/questions/2834350/get-checkbox-value-in-jquery
$("#exampleCheckboxDefault").click( function() {
    console.log('Clicked');
    new QWebChannel(qt.webChannelTransport, function (channel) {
        var chk = $("#exampleCheckboxDefault").prop('checked');
        // var chk = $("#exampleCheckboxDefault").attr("checked") ? 1 : 0;
        handler = channel.objects.handler;
        handler.webToAppSendData({"checked": chk});
    });
});

});