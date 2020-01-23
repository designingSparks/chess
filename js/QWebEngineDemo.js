//https://stackoverflow.com/questions/2834350/get-checkbox-value-in-jquery

$(document).ready(function(){
    console.log('Document Ready');
    // function $('#exampleCheckboxDefault').click( function() {
    //     new QWebChannel(qt.webChannelTransport, function (channel) {
    //         handler = channel.objects.handler;
    //         var chk = $('#exampleCheckboxDefault').is(":checked");
    //         handler.webToAppSendData(
    //             {"clicked": chk});
    //     });
    // });
     
        
    

    // $('#exampleCheckboxDefault').click(
    //     function() {
    //         console.log('checkbox clicked');
    //         new QWebChannel(qt.webChannelTransport, function (channel) {
    //             handler = channel.objects.handler;
    //             handler.webToAppSendData({"clicked": "True"});
    //         });
    //     }
    // );
}
// new QWebChannel(qt.webChannelTransport, function (channel) {
//     var JSobject = channel.objects.TheNameOfTheObjectUsed;
//     handler = channel.objects.handler;
//     // handler.webToAppSendData({"data": ["hello", "world", 1, {"A": true, "B": false}]});

//     handler.appToWebSendData.connect(function(value) {
//         console.log(value);
//         handler.webToAppSendData(
//             {"data": ["hello", "world", 1, {"A": true, "B": false}]});
//         handler.webToAppSendData(
//             [1, true, false, {"a": "b"}])
//     });

// });
/*
function onClickHandler(cb) {
    new QWebChannel(qt.webChannelTransport, function (channel) {
        handler = channel.objects.handler;
        // var chk = document.getElementById("exampleCheckboxDefault").checked;
        var chk = cb.checked;
        handler.webToAppSendData(
            {"clicked": chk, 'name': cb.name});
    // var mainWindow = channel.objects.messenger;
    // mainWindow.sendMessage(document.createWalletForm.from1.value, document.createWalletForm.to1.value, document.createWalletForm.text1.value, "1234567",  "1") ;
    });
}

function onClickHandler2(cb) {
    new QWebChannel(qt.webChannelTransport, function (channel) {
        handler = channel.objects.handler;
        // var chk = document.getElementById("exampleCheckboxDefault").checked;
        var chk = cb.checked;
        handler.webToAppSendData(
            {"clicked": chk, 'name': cb.name});
    // var mainWindow = channel.objects.messenger;
    // mainWindow.sendMessage(document.createWalletForm.from1.value, document.createWalletForm.to1.value, document.createWalletForm.text1.value, "1234567",  "1") ;
    });
}

*/