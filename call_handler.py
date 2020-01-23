# coding: utf-8
from qt import *


class CallHandler(QObject):
    '''
    '''
    # app_to_web_send_data = pyqtSignal(dict, name="appToWebSendData")

    #Note the the name of the js function must be the same as the name of the signal
    app_to_web_send_data = pyqtSignal(QJsonDocument, name="sendMove")

    def __init__(self, move_callback):
        QObject.__init__(self)
        self.move_callback = move_callback


    # ==========================================================================
    @staticmethod
    def recursive_qjsonvalue_convert(data):
        '''
        Helper function to convert the JSON value received from JS into a python
        list or dict object.
        '''
        if not isinstance(data, QJsonValue):
            return data
        # Python의 List
        if data.isArray():
            array = data.toArray()
            new_array = list()
            for d in array:
                new_array.append(
                    CallHandler.recursive_qjsonvalue_convert(d))
            return new_array
        # Python의 Dict
        elif data.isObject():
            objects = data.toObject()
            new_dict = dict()
            for key in list(objects.keys()):
                d = objects[key]
                new_dict[key] = \
                    CallHandler.recursive_qjsonvalue_convert(d)
            return new_dict

        elif data.isBool():
            return data.toBool()
        elif data.isDouble():
            return data.toDouble()
        elif data.isString():
            return data.toString()
        elif data.isUndefined():
            return None
        elif data.isNull():
            return None

    @pyqtSlot(QJsonValue, name='webToAppSendData')
    def web_to_app_send_data(self, value):
        # QJasonValue 데이터를 Python Dict 형태로 변환
        print('Received data')
        data = CallHandler.recursive_qjsonvalue_convert(value)
        # print(data) #e.g. ['e2', 'e4']
        self.move_callback(data)