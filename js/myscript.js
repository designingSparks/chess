var board;
var game; //chess.js object

function onDrop (source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback'

  //updateStatus()
}

new QWebChannel(qt.webChannelTransport, function (channel) {
  myhandler = channel.objects.handler;

  //Slot for the python signal "sendMove"
  myhandler.sendMove.connect(function(value) {
    var move = value.move;

      console.log(move);

      if (move.length == 1)
        board.move(move[0]);
      else if (move.length == 2) //castling
        board.move(move[0], move[1]);
  });
});



$( document ).ready(function() {
  // Create the board in the document ready() function since chessboard.js
  // must first be loaded.
  var config = {
    position: 'start',
    onDrop: onDrop,
    draggable: true
  }
  board = ChessBoard('board1', config);
  game = new Chess();
  // board.move('e2-e4');
});