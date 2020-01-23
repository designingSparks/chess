// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js

var board = null
var game;
var myhandler;
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')

function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // only pick up pieces for the side to move
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function onDrop (source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback'

  updateStatus()
  sendMovePython(source, target) //Send the move back to python for engine update
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  board.position(game.fen())
}

function updateStatus () {
  var status = ''

  var moveColor = 'White'
  if (game.turn() === 'b') {
    moveColor = 'Black'
  }

  // checkmate?
  if (game.in_checkmate()) {
    status = 'Game over, ' + moveColor + ' is in checkmate.'
  }

  // draw?
  else if (game.in_draw()) {
    status = 'Game over, drawn position'
  }

  // game still on
  else {
    status = moveColor + ' to move'

    // check?
    if (game.in_check()) {
      status += ', ' + moveColor + ' is in check'
    }
  }

  $status.html(status)
  $fen.html(game.fen())
  $pgn.html(game.pgn())
}




$( document ).ready(function() {
    var config = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
      }
    board = Chessboard('board1', config);
    game = new Chess(); //chess.js
    updateStatus()


}); //document


/*
new QWebChannel(qt.webChannelTransport, function (channel) {
    window.handler = channel.objects.handler;
    handler.sendMove.connect(function(value) {
        console.log('Received move from python')
        var move = value.move;
    });
});
*/


/*
 *Do NOT create a second QWebchannel!
 *Just reference the main handler.
 */
new QWebChannel(qt.webChannelTransport, function (channel) {
    window.handler = channel.objects.handler; //make the handler global
  
    //Slot for the python signal "sendMove"
    //This is called when the engine generates a move.
    //Updating the castling position must be handled as chess.js doesn't do this
    //IDEA? Generate drop event?
    handler.sendMove.connect(function(value) {
        var move = value.move;
        console.log('Received move from python');

        //Updated the chessboard display object, board.
        // board.move(move[0]); //doesn't handle castling
        if (move.length == 1)
          board.move(move[0]);
        else if (move.length == 2) //castling
          board.move(move[0], move[1]);

        //Update the javascript game object
        var moveArr = move[0].split('-');
        var move = game.move({
            from: moveArr[0], //"e7"
            to: moveArr[1],  //"e5"
            promotion: 'q' // NOTE: always promote to a queen for example simplicity
        })

        updateStatus();
        
    });
  });
  

function sendMovePython(source, target) {
    console.log("Sending move to python");
    handler.webToAppSendData([source, target]); //don't create a new handler
}


