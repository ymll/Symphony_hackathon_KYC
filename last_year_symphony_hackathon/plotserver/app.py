from flask import Flask, request, send_from_directory
from router import Router
from datetime import datetime, timedelta
from nlp import Engine

mode = "server" # server/web, server will return static url 
router = Router(mode)
engine = Engine()
today = datetime.now()

app = Flask(__name__)
app.debug = True

def parseDate(strDate, defaultDate):
    result = defaultDate
    if strDate != None:
        result = datetime.strptime(strDate, "%Y-%m-%d")
    return(result)

@app.route('/')
def index():
    return("welcome to symphony hackathon")

@app.route('/crypto/<symbol>/<market>')
def crypto(symbol, market):
    start = parseDate(request.args.get('start'),today-timedelta(days=5*365))
    end = parseDate(request.args.get('end'),today)
    timeframe = request.args.get('timeframe')
    return(router.getCrypto(symbol, market, start, end, timeframe))

@app.route('/fx/<currencypair>')
def fx(currencypair):
    start = parseDate(request.args.get('start'),today-timedelta(days=5*365))
    end = parseDate(request.args.get('end'),today)
    timeframe = request.args.get('timeframe')
    return(router.getFx(currencypair, start, end, timeframe))

@app.route('/stock/<stockname>')
def stock(stockname):
    start = parseDate(request.args.get('start'),today-timedelta(days=5*365))
    end = parseDate(request.args.get('end'),today)
    return(router.getStock(stockname, start, end))

@app.route('/compare/<stocka>/<stockb>')
def compare(stocka, stockb):
    start = parseDate(request.args.get('start'),today-timedelta(days=5*365))
    end = parseDate(request.args.get('end'),today)
    return(router.compareStock(stocka, stockb, start, end))

@app.route('/vwap/<stockname>')
def vwap(stockname):
    start = parseDate(request.args.get('start'),today-timedelta(days=5*365))
    end = parseDate(request.args.get('end'),today)
    return(router.stockVWAP(stockname, start, end))

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

@app.route('/histogram/<stockname>')
def histogram(stockname):
    start = parseDate(request.args.get('start'),today-timedelta(days=5*365))
    end = parseDate(request.args.get('end'),today)
    return(router.stockHistogram(stockname, start, end))

@app.route('/capm/<stockname>')
def capm(stockname):
    start = parseDate(request.args.get('start'),today-timedelta(days=5*365))
    end = parseDate(request.args.get('end'),today)
    return(router.capm(stockname, start, end))

@app.route('/sector/<timerange>')
def sectorPerformance(timerange):
    return(router.sectorPerformance(timerange))

@app.route('/question/<q>')
def parser(q):
    return(engine.parse(q))


if __name__ == '__main__':
    app.run(host='0.0.0.0',  debug=True,  port=6312)