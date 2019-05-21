import pandas_datareader as web
import pandas as pd
import datetime
import requests
import base64
from requests.auth import HTTPBasicAuth
import functools
from pandas.io.json import json_normalize
import datetime

class MarketDataService:

    @functools.lru_cache(maxsize=None)
    def get_morning_star_df(self, stock_name, start, end):
        try:
            df = web.DataReader(stock_name, 'morningstar', start, end).reset_index()
            return df
        except:
            return None

    @functools.lru_cache(maxsize=None)
    def get_quandl_df(self, stock_name, start, end):
        try:
            df = web.DataReader(stock_name, 'quandl', start, end).reset_index()
            return df
        except:
            return None

    @functools.lru_cache(maxsize=None)
    def get_iex_df(self, stock_name, start, end):
        try:
            df = web.DataReader(stock_name, 'iex', start, end).reset_index()
            df = df.rename(columns = {'date':'Date', 'open':'Open', 'high':'High', 'low':'Low', 'close':'Close', 'volume':'Volume'})
            return df
        except:
            return None

    @functools.lru_cache(maxsize=None)
    def get_crypto(self, sym, market, start, end, frequency=None):
        df = pd.DataFrame()
        if frequency is None:
            frequency = 'WEEKLY'
        url = 'https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_{}&symbol={}&market={}&apikey=O16MFPVKSJGHLIL6'.format(frequency, sym, market)
        print('url:', url)
        r = requests.get(url)
        j = r.json()
        data = j['Time Series (Digital Currency Weekly)']
        for i in data:
            d = {}
            print('i:', i)
            d['date'] = i
            count = 0
            for k in data[i]:
                field = 'a{}'.format(count)
                d[field] = data[i][k]
                count += 1
            df = df.append(d, ignore_index=True)
        df = df.rename(columns = {'open':'Open', 'high':'High', 'low':'Low', 'close':'Close', 'volume':'Volume'})
        return df
        
    def send_requests_to_intrinio(self, url):
        u = '00ce8b2727b4f3cf21e272fe3ce66b57'
        p = 'eefa9363ad30aa65b8ad3b6c71da1b0a'
        return requests.get(url, auth=(u, p))

    @functools.lru_cache(maxsize=None)
    def get_fx_df(self, currency_pair, start, end, timeframe=None):
        start_date = start.strftime('%Y-%m-%d')
        end_date = end.strftime('%Y-%m-%d')
        page_size = 100000
        page_number = 1
        if timeframe is None:
            timeframe = 'D1'

        df = pd.DataFrame()
        while (True):
            url = 'https://api.intrinio.com/currency_prices?pair={}&timeframe={}&start_date={}&end_date={}&page_size={}&page_number={}'\
                .format(currency_pair, timeframe, start_date, end_date, page_size, page_number)
            print(url)
            r = self.send_requests_to_intrinio(url)

            j = r.json()
            df = df.append(json_normalize(j['data']))
            if j['total_pages'] == 0:
                return None
            elif j['total_pages'] == j['current_page']:
                break
            else:
                page_number += 1
        # df = df.rename(columns = {'date':'Date', 'open_ask':'Open', 'high_ask':'High', 'low_ask':'Low', 'close_ask':'Close', 'total_ticks':'Volume'})

        return df


    def get_list_of_available_currencies():
        url = 'https://api.intrinio.com/currencies'
        r = self.send_requests_to_intrinio(url)
        if j['data']:
            return json_normalize(j['data']) # returning dataframe
            # return r['data'] # uncomment if we want to return in json format
        else:
            return None

    def get_list_of_available_currency_pairs():
        url = 'https://api.intrinio.com/currency_pairs'
        r = self.send_requests_to_intrinio(url)
        if j['data']:
            return json_normalize(j['data']) # returning dataframe
            # return r['data'] # uncomment if we want to return in json format
        else:
            return None

    # Usage: MarketDataService.get_df(stockname, 'morningstar', startTime, endTime)
    @functools.lru_cache(maxsize=None)
    def get_df(self, stock_name, service_name, start, end):
        return {
            'morningstar'   : self.get_morning_star_df,
            # 'quandl'        : self.get_quandl_df
            'iex'           : self.get_iex_df,
        }[service_name](stock_name, start, end)
