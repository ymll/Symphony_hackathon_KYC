from nlpParser import Parser
from flask import redirect, url_for

parser = Parser()

class Engine:
    def parse(self, question):
        path, parameters = parser.getRoutingPath(question)
        print(path)
        print(parameters)
        return redirect(url_for('stock', stockname="AAPL"))

