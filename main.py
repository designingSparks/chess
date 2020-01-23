# coding: utf-8
#TODO: On form close event, kill the engine 
#TODO: Use chess.js to detect the last move and send this back to stockfish.

import sys
from qt import *
import chess
import chess.engine
import os
from call_handler import CallHandler

p = os.path.abspath('.')
p = os.path.join(p, 'engine', 'stockfish_20011801_x64.exe')
engine = chess.engine.SimpleEngine.popen_uci(p)


class Form(QWidget):
    def __init__(self):
        QWidget.__init__(self, flags=Qt.Widget)
        self.layout_1 = QBoxLayout(QBoxLayout.LeftToRight, self)
        self.layout_2 = QBoxLayout(QBoxLayout.LeftToRight)
        self.layout_3 = QBoxLayout(QBoxLayout.TopToBottom)
        self.layout_1.addLayout(self.layout_2)
        self.layout_1.addLayout(self.layout_3)
        self.web = QWebEngineView()
        self.pb_1 = QPushButton("Move")
        self.pb_1.clicked.connect(self.move)
        
        #Link web page to CallHandler object
        channel = QWebChannel(self.web.page())
        self.web.page().setWebChannel(channel)
        self.handler = CallHandler(self.move_js)  
        channel.registerObject('handler', self.handler)  # js
        
        self.setLayout(self.layout_1)
        self.init_widget()


    def init_widget(self):
        self.setWindowTitle("QWebChannel")
        self.setFixedWidth(640)
        self.setFixedHeight(480)
        url = QDir().current().filePath("html/index.html")
        url = QUrl.fromLocalFile(url)
        self.web.load(url)
        self.layout_2.addWidget(self.web)
        self.layout_3.addWidget(self.pb_1)


    def send_data(self):
        print('In send_data')
        print('Sending data')
        # value = {"data": "ABC", "msg": ["DEF", 1, {"A": False, "B": True}]}
        value = {"move": "e2-e4"}
        document = QJsonDocument()
        document.setObject(value)
        self.handler.app_to_web_send_data.emit(document)
    

    def is_castle_move(self, move):
        '''
        Return True if the king was castled.
        '''
        is_king = board.piece_at(move.to_square).piece_type == chess.KING
        diff = chess.square_file(move.from_square) - chess.square_file(move.to_square)
        # print('King moved: {}'.format(is_king))
        # print('diff: {}'.format(diff))
        return is_king and abs(diff) > 1
                

    def generate_rook_move(self, move):
        print('Creating castling move')
        a_side = chess.square_file(move.to_square) < chess.square_file(move.from_square)
        print('a_side: {}'.format(a_side))

        #TODO: Simplify this using the last digit of the move
        # if board.turn == chess.BLACK: #black's turn next
        #     #Create white rook move
        #     if a_side:
        #         rook_move = 'a1-d1'
        #     else:
        #         rook_move = 'h1-f1'
        # else:
        #     #Create black rook move
        #     if a_side:
        #         rook_move = 'a8-d8'
        #     else:
        #         rook_move = 'h8-f8'

        rank = str(move)[-1] #'8' or '1'
        if a_side:
            rook_move = 'a{}-d{}'.format(rank, rank)
        else:
            rook_move = 'h{}-f{}'.format(rank, rank)

        print('Rook move: {}'.format(rook_move))
        return rook_move

    def move_js(self, data):
        s = ''.join(x for x in data)
        print('The following move was made in js: {}'.format(s))
        
        
#         from_string = data[0].upper()
#         to_string = data[1].upper()

        from_square = chess.SQUARE_NAMES.index(data[0])
        to_square = chess.SQUARE_NAMES.index(data[1])
        
        #Create move object for sending to engine
        move = chess.Move(from_square, to_square)
        board.push(move)
        
    def move(self):
        result = engine.play(board, chess.engine.Limit(time=0.1))
        board.push(result.move) #board is a global object

        #First move - normal coase
        move_list = list()
        move = str(result.move)
        move = move[:2] + '-' + move[-2:] #convert 'e2e4' into 'e2-e4' for chessboard.js
        move_list.append(move)

        #If move was a castle move, append the rook move for the javascript display
        #Only needed for computer-generated moves
        if self.is_castle_move(result.move):
            rook_move = self.generate_rook_move(result.move)
            move_list.append(rook_move)

        print('Sending move to js: {}'.format(result.move))
        value = {"move": move_list}
        document = QJsonDocument()
        document.setObject(value)
        self.handler.app_to_web_send_data.emit(document)


    def castle_debug(self):
        '''
        Send two moves simultaneously to the chessboard
        '''
        move = ["e1-g1", "h1-f1"]
        value = {"move": move}
        document = QJsonDocument()
        document.setObject(value)
        self.handler.app_to_web_send_data.emit(document)

        
if __name__ == "__main__":
    sys.argv.append("--remote-debugging-port=8000")
    # sys.argv.append("--enable-logging")
    # sys.argv.append("--log-level=0")
    app = QApplication(sys.argv)
    form = Form()
    form.show()

    board = chess.Board()
    # while not board.is_game_over():
    #     result = engine.play(board, chess.engine.Limit(time=0.1))
    #     print(result.move)
    #     board.push(result.move)
    #     form.send_move(result.move) #send to js

    
    exit(app.exec_())

    # engine.quit()