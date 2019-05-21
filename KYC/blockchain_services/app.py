"""
Example python app with the Flask framework: http://flask.pocoo.org/
"""

from os import environ

from flask import Flask
from flask import render_template


app = Flask(__name__)


@app.route('/')
@app.route('/hello/<name>')
def hello_world(name=None):
    if name is None:
        return 'Hello world!'
    return 'Hello world, {}!'.format(name)

if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)