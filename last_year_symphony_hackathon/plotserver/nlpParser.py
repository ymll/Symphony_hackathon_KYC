
# coding: utf-8
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.text import Text
import pandas as pd

keyWorks = [
	'price',
	'compare',
	'vwap'
]

routingPaths = [
	'/stock/<stockname>',
	'/compare/<stocka>/<stockb>',
	'/vwap/<stockname>'
]

stockNameSymbols = {
	'apple',
	'AAPL',
	'google',
	'GOOG',
	'goldman sachs',
	'GS',
	'morgan stanley',
	'MS'
}

class Parser:
	def getRoutingPath(self, question):
		stocksInSentence = self.getStockNames(question);
		VWAPInSentence = self.getVWAP(question);
		length = len(stocksInSentence);
		path = None
		parameter = ["nonthing"]
		if length == 1:
			if VWAPInSentence == True:
				path = routingPaths[2]
			else:
				path = routingPaths[0]
			parameter = stocksInSentence[0]
		if length == 2:
			path = routingPaths[2]
			parameter = stocksInSentence
		return((path, parameter))
		
	def getStockNames(self, question):
		a = "What is the market colour for google?"
		b = "What is market color for GOOGL?"
		c = "market color GOOGL?"
		d = "How are apple and tesla doing?"
		e = "How are APPL and TESL doing?"

		stocks = [
		    'APPL',
		    'apple',
		    'GOOG',
		    'google'
		]

		sentence = question; #enter command here
		tokens = word_tokenize(sentence);
		textList = Text(tokens)
		print (textList)

		results = [];
		for word in tokens:
			if word in stocks:
				results.append(word);
		print (results)
		
		return [results]

	def getVWAP(self, question):
		vwapVariables = [
			'vwap'
			'volume'
		]

		sentence = question; #enter command here
		tokens = word_tokenize(sentence);
		textList = Text(tokens)

		vwap = False;
		for word in tokens:
			if word in vwapVariables:
				vwap = True;
		
		return vwap
	dfStock = []
	def __init__(self):
		dfStock = pd.read_csv('data/constituents.csv')

	def getParseResult(self, question):
		tokens = word_tokenize(question);
		path = self.getRoutingPath(tokens)
		stockNames = self.getStockNames(tokens)
		parameter = {
			'StockNames': stockNames
		}
		return (path, parameter)

	def getRoutingPathDeprecated(self, tokens):
		for i, v in enumerate(tokens):
			if v in keyWorks:
				print(v, 'index ', i)
				return routingPaths[i]
		return None

	def getStockNamesDeprecated(self, tokens):
		results = []
		for t in tokens:
			if t in stockNameSymbols:
				results.append(stockNameSymbols[t])
		return results
