'''
Created on Dec 11, 2018

@author: john.schoenberger
'''
QT_API = 'PYQT5' #

if QT_API == 'PYSIDE2':
    from PySide2.QtCore import *
    from PySide2.QtGui import *
    from PySide2.QtWidgets import *
elif QT_API == 'PYQT5':
    from PyQt5.QtCore import *
    from PyQt5.QtGui import *
    from PyQt5.QtWidgets import *
    from PyQt5.QtWebEngineWidgets import QWebEngineView
    from PyQt5.QtWebChannel import QWebChannel
    Signal = pyqtSignal
    Slot = pyqtSlot
    
try: 
    from PyQt5.QtCore import pyqtWrapperType as wrappertype
except ImportError:
    from sip import wrappertype