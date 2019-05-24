"""
Example python app with the Flask framework: http://flask.pocoo.org/
"""

import os, sys
from flask import Flask, make_response, jsonify, request
import json


app = Flask(__name__)

USERS_JSON = os.path.dirname(os.path.realpath(__file__)) + '/data/user.json'

@app.route('/')
@app.route('/hello/<name>')
def hello_world(name=None):
    if name is None:
        return 'Hello world!'
    return 'Hello world, {}!'.format(name)


@app.route('/api/v1/users', methods = ['GET'])
def get_users():
    if USERS_JSON:
        with open(USERS_JSON, encoding='utf-8') as data_file:
            users = json.loads(data_file.read())
    return make_response(jsonify(users), 200)


@app.route('/api/v1/user', methods = ['GET'])
def get_user_info():
    id = request.args.get('id')
    if id is None:
        return make_response('No ID is given', 400)
    try:
        if USERS_JSON:
            with open(USERS_JSON, encoding='utf-8') as data_file:
                users = json.loads(data_file.read())
        for user in users:
            if user['id'] == int(id):
                return make_response(jsonify(user['basic_info']), 200)
    except Exception as e:
        return make_response('No info is found. Error:' + str(e), 404)


@app.route('/api/v1/user/create', methods = ['POST'])
def create_user():
    data = request.form
    return


if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)