import pandas_datareader as web
import plotly.graph_objs as go
import plotly.plotly as plt
from pathlib import Path
from flask import render_template
from pathlib import Path
from datetime import datetime
import re
from PIL import Image
import json

import numpy as np
import matplotlib.pyplot as mplot
import statsmodels.api as sm
from statsmodels import regression
from marketdataservice import MarketDataService
from alpha_vantage.sectorperformance import SectorPerformances

#plt.sign_in('sheepjian', 'jpl9cET3s2Ytr8riYYJR') # Replace the username, and API key with your credentials.
plt.sign_in('disha_j25', 'a8QJvpWrBYslZGF8PWpl') #backup key for plotly

imageFolder = "static"
stockChartBaseName = "-simple-plot.png"
stockTemplate = "stock.html"

def fileBaseName(startTime, endTime):
    return(startTime.strftime("%Y-%m-%d") + '-' \
            + endTime.strftime("%Y-%m-%d") + \
            "-" + datetime.now().strftime("%Y-%m-%d-%H-%M-%S") +stockChartBaseName) 

def linReg(x,y):
    x = sm.add_constant(x)
    model = regression.linear_model.OLS(y,x).fit()
    x = x[:,1]
    return model.params[0], model.params[1]

class Router:
    mode = 'server'

    def __init__(self, mode):
        self.mode = mode

    def showResult(self,stockTemplate,imageFolder,fileName):
        if self.mode == "server":
            imagePath = imageFolder +'/'  + fileName
            with Image.open(imagePath) as img:
                width, height = img.size
                print('height is ', height)
                return(json.dumps({
                        'path': imagePath,
                        'width':width,
                        'height': height
                })) 
        else:
            return render_template(stockTemplate,imageFolder=imageFolder,fileName=fileName)

    def getCrypto(self, symbol, market, startTime, endTime, timeframe=None):
        filename = symbol + "-" + fileBaseName(startTime, endTime)
        filePath = imageFolder +'/'  + filename

        MDS = MarketDataService()
        df = MDS.get_crypto(symbol, market, startTime, endTime, timeframe)
        trace = go.Ohlc(x=df.date,
                open=df.a0,
                high=df.a2,
                low=df.a4,
                close=df.a6)

        layout = go.Layout(
            xaxis = dict(
                rangeslider = dict(
                    visible = False
                )
            )
        )
        data = [trace]
        fig = go.Figure(data=data, layout=layout)
        
        plt.image.save_as(fig, filename=Path(filePath))

        return(self.showResult(stockTemplate, imageFolder, filename))

    def getFx(self, currency_pair, startTime, endTime, timeframe=None):
        filename = currency_pair + "-"+ fileBaseName(startTime, endTime)
        filePath = imageFolder +'/'  + filename
        # to be replaced by market data service
        MDS = MarketDataService()
        print('timeframe:', timeframe)
        df = MDS.get_fx_df(currency_pair, startTime, endTime, timeframe)

        trace_ask_high  = go.Scatter(
                            x=df.date,
                            y=df.high_ask,
                            mode = 'lines',
                            name = 'high ask',
                            line = dict(
                                    color = ('rgb(205, 12, 24)'),
                                    width = 1,
                                    dash = 'dash'
                                    )
                            )

        trace_ask_low   = go.Scatter(
                            x=df.date,
                            y=df.low_ask,
                            mode = 'lines',
                            name = 'low ask',
                            line = dict(
                                    color = ('rgb(205, 12, 24)'),
                                    width = 1,
                                    dash = 'dash'
                                    )
                            )

        trace_ask_close = go.Scatter(
                            x=df.date,
                            y=df.close_ask,
                            mode = 'lines',
                            name = 'close ask',
                            line = dict(
                                    color = ('rgb(205, 12, 24)'),
                                    width = 1,
                                    )
                            )

        trace_bid_high  = go.Scatter(
                            x=df.date,
                            y=df.high_bid,
                            mode = 'lines',
                            name = 'high bid',
                            line = dict(
                                    color = ('rgb(22, 96, 167)'),
                                    width = 1,
                                    dash = 'dash'
                                    )
                            )

        trace_bid_low   = go.Scatter(
                            x=df.date,
                            y=df.low_bid,
                            mode = 'lines',
                            name = 'low bid',
                            line = dict(
                                    color = ('rgb(22, 96, 167)'),
                                    width = 1,
                                    dash = 'dash'
                                    )
                            )

        trace_bid_close = go.Scatter(
                            x=df.date,
                            y=df.close_bid,
                            mode = 'lines',
                            name = 'bid close',
                            line = dict(
                                    color = ('rgb(22, 96, 167)'),
                                    width = 1,
                                    )
                            )

        layout = go.Layout(
            xaxis = dict(
                rangeslider = dict(
                    visible = False
                )
            )
        )
        data = [trace_ask_low, trace_ask_high, trace_ask_close, trace_bid_low, trace_bid_high, trace_bid_close]
        fig = go.Figure(data=data, layout=layout)
        
        plt.image.save_as(fig, filename=Path(filePath))

        return(self.showResult(stockTemplate, imageFolder, filename))

    def getStock(self, stockname, startTime, endTime):
        filename = stockname + "-" + fileBaseName(startTime, endTime)
        filePath = imageFolder +'/'  + filename

        # to be replaced by market data service
        # df = web.DataReader(stockname, 'morningstar', startTime, endTime).reset_index()
        MDS = MarketDataService()
        df = MDS.get_df(stockname, 'morningstar', startTime, endTime)
        trace = go.Ohlc(x=df.Date,
                open=df.Open,
                high=df.High,
                low=df.Low,
                close=df.Close)

        layout = go.Layout(
            xaxis = dict(
                rangeslider = dict(
                    visible = False
                )
            )
        )
        data = [trace]
        fig = go.Figure(data=data, layout=layout)
        
        plt.image.save_as(fig, filename=Path(filePath))

        return(self.showResult(stockTemplate, imageFolder, filename))

    def compareStock(self, stocka, stockb, startTime, endTime):
        filename = stocka+ "-" + stockb + "-"+ fileBaseName(startTime, endTime)
        filePath = imageFolder +'/'  + filename
        # to be replaced by market data service
        dfa = web.DataReader(stocka, 'morningstar', startTime, endTime).reset_index()
        dfb = web.DataReader(stockb, 'morningstar', startTime, endTime).reset_index()

        tracea = go.Scatter(
                x=dfa.Date,
                y=dfa.Close,
                mode = 'lines',
                name = stocka)

        traceb = go.Scatter(x=dfb.Date,
                y=dfb.Close,
                mode = 'lines',
                name = stockb)

        layout = go.Layout(
            xaxis = dict(
                rangeslider = dict(
                    visible = False
                )
            )
        )
        data = [tracea, traceb]
        fig = go.Figure(data=data, layout=layout)
        
        plt.image.save_as(fig, filename=Path(filePath))

        return(self.showResult(stockTemplate, imageFolder, filename))

    def stockVWAP(self, stocka, startTime, endTime):
        filename = stocka+ "-VWAP-" + fileBaseName(startTime, endTime)
        filePath = imageFolder +'/'  + filename
        # to be replaced by market data service
        dfa = web.DataReader(stocka, 'morningstar', startTime, endTime).reset_index()

        dfa['vwap'] = (dfa.Volume*(dfa.High+dfa.Low)/2).cumsum() / dfa.Volume.cumsum()
        

        tracea = go.Scatter(
                x=dfa.Date,
                y=dfa.Close,
                mode = 'lines',
                name = stocka)

        traceb = go.Scatter(x=dfa.Date,
                y=dfa.vwap,
                mode = 'lines',
                name = 'vwap')

        layout = go.Layout(
            xaxis = dict(
                rangeslider = dict(
                    visible = False
                )
            )
        )
        data = [tracea, traceb]
        fig = go.Figure(data=data, layout=layout)
        
        plt.image.save_as(fig, filename=Path(filePath))

        return(self.showResult(stockTemplate, imageFolder, filename))

    def stockHistogram(self, stocka, startTime, endTime):
        filename = stocka+ "-histogram-" + fileBaseName(startTime, endTime)
        filePath = imageFolder +'/'  + filename
        # to be replaced by market data service
        dfa = web.DataReader(stocka, 'morningstar', startTime, endTime).reset_index()

        returns = (dfa.Close - dfa.Close.shift(1))/dfa.Close
        
        tracea = go.Histogram(x=returns,
                     histnorm='return percentage %')

        layout = go.Layout(
            xaxis = dict(
                rangeslider = dict(
                    visible = False
                )
            )
        )
        data = [tracea]
        fig = go.Figure(data=data, layout=layout)
        
        plt.image.save_as(fig, filename=Path(filePath))

        return(self.showResult(stockTemplate, imageFolder, filename))

    def capm(self, stocka, startTime, endTime):
        filename = stocka+ "-capm-" + fileBaseName(startTime, endTime)
        filePath = imageFolder +'/'  + filename
        # to be replaced by market data service
        df = web.DataReader(stocka, 'morningstar', startTime, endTime)
        fd = web.DataReader("spx", 'morningstar', startTime, endTime)
        
        return_index = fd.Close.pct_change()[1:]
        return_stock = df.Close.pct_change()[1:]

        y = return_stock.values
        x = return_index.values

        alpha, beta = linReg(x, y)

        x2 = np.linspace(x.min(), x.max(), 100)
        y_hat = x2*beta+alpha

        fig = mplot.figure()
        mplot.scatter(x,y,alpha=0.3)
        mplot.xlabel("index")
        mplot.ylabel(stocka)
        mplot.plot(x2,y_hat, "r", alpha=0.9)
        mplot.annotate('alpha: '+str(alpha)+", beta: "+str(beta), xy=(0.05, 0.95), xycoords='axes fraction')
        fig.savefig(Path(filePath))

        return(self.showResult(stockTemplate, imageFolder, filename))

    def sectorPerformance(self, timerange):
        filename = timerange+ "-sector-" + "-" + datetime.now().strftime("%Y-%m-%d-%H-%M-%S") +stockChartBaseName
        filePath = imageFolder +'/'  + filename
        keyMap = {
           'realtime': 'Rank A: Real-Time Performance',
           '1d': 'Rank B: Day Performance',
           '5d': 'Rank C: Day Performance',
           '1m': 'Rank D: Month Performance',
           '3m': 'Rank E: Month Performance',
           'ytd': 'Rank F: Year-to-Date (YTD) Performance',
           '1y': 'Rank G: Year Performance',
           '3y': 'Rank H: Year Performance',
           '5y': 'Rank I: Year Performance',
           '10y': 'Rank J: Year Performance'
        }
        if timerange not in keyMap:
            throw('unknown timerage '+timerange)

        key = keyMap[timerange]

        title = key
        if timerange != 'realtime' and timerange != 'ytd':
            title = key[0:7] + ' '+  re.findall(r'\d+', timerange)[0] + ' ' + key[8:]

        sp = SectorPerformances(key='O16MFPVKSJGHLIL6', output_format='pandas')
        data, meta_data = sp.get_sector()
        fig = mplot.figure()
        data[key].plot(kind='bar')
        mplot.title(title)
        mplot.tight_layout()
        mplot.grid()
        fig.savefig(Path(filePath))

        return(self.showResult(stockTemplate, imageFolder, filename))


