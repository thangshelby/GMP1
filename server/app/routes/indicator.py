from flask import Blueprint,request
from app.controllers.indicator import get_SMA,get_EMA,get_RSI,get_MACD,get_BB,get_MFI
import yfinance as yf
from app.database.model import DbModel  

indicator_bp = Blueprint('indicator_bp', __name__)
model = DbModel()

@indicator_bp.route('/SMA', methods=['GET'])
def fetch_SMA():
    ticker= request.args.get('ticker')
    window= int(request.args.get('window'))
    return get_SMA(ticker,window)

@indicator_bp.route('/EMA', methods=['GET'])
def fetch_EMA():
    return get_EMA()

@indicator_bp.route('/RSI', methods=['GET'])
def fetch_RSI():
    ticker= request.args.get('ticker')
    window= int(request.args.get('window'))
    return get_RSI(ticker,window)

@indicator_bp.route('/MACD', methods=['GET'])
def fetch_MACD():
    
    
    ticker= request.args.get('ticker')
    print(ticker)
    window= int(request.args.get('window'))
    fast= int(request.args.get('fast'))
    slow= int(request.args.get('slow'))
    
    return get_MACD(ticker,window,fast,slow)

@indicator_bp.route('/BB', methods=['GET'])
def fetch_BB():
    ticker= request.args.get('ticker')
    window= int(request.args.get('window'))
    
    return get_BB(ticker,window)

@indicator_bp.route('/MFI', methods=['GET'])
def fetch_MFI():
    ticker= request.args.get('ticker')
    window= int(request.args.get('window'))
    return get_MFI(ticker,window)

