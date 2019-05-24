"""
Example python app with the Flask framework: http://flask.pocoo.org/
"""

import os, sys
from flask import Flask, make_response, jsonify, request
import json


app = Flask(__name__)

USERS_JSON = os.path.dirname(os.path.realpath(__file__)) + '/data/user.json'
ONBOARDING_ASSIGNMENT_JSON = os.path.dirname(os.path.realpath(__file__)) + '/data/onboarding_assignment.json'
VERIFY_LOG = os.path.dirname(os.path.realpath(__file__)) + '/data/verify_log.json'

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




@app.route('/api/v1/upload', methods = ['POST'])
def upload_doc():
    user_id = request.args.get('user_id')
    doc_path = request.args.get('doc_path')
    if user_id is None:
        return make_response('No user_id is given', 400)
    if doc_path is None:
        return make_response('No doc_path is given', 400)
    if USERS_JSON:
        with open(USERS_JSON, encoding='utf') as data_file:
            users = json.loads(data_file.read())
            for user in users:
                if user['id'] == int(user_id):
                    user['basic_info']['verify_status'] = 'In Process. Assigned to onboarding team'
        with open(USERS_JSON, 'w', encoding='utf-8') as fout:
           json.dump(users, fout)
    return make_response('Success', 200)


@app.route('/api/v1/user/create', methods = ['POST'])
def create_user():
    data = request.form
    new_user = {
        'id': data.get('id'),
        'public_key': None,
        'private_key': None,
        'basic_info': {}
    }
    new_user['basic_info']['company'] = data.get('company')
    new_user['basic_info']['phone'] = data.get('phone')
    new_user['basic_info']['national_id'] = data.get('national_id')
    new_user['basic_info']['email'] = data.get('email')
    new_user['basic_info']['identity'] = data.get('identity')
    new_user['basic_info']['address'] = data.get('address')
    new_user['basic_info']['position'] = data.get('position')
    new_user['basic_info']['division'] = data.get('division')
    new_user['basic_info']['doc_path'] = data.get('doc_path')
    if new_user['basic_info']['doc_path']:
        new_user['basic_info']['verified'] = True
        new_user['basic_info']['is_trader'] = True
        new_user['basic_info']['verify_status'] = 'verified'
        new_user['basic_info']['verify_expire_date'] = '2019-11-24'
    else:
        new_user['basic_info']['verified'] = False
        new_user['basic_info']['is_trader'] = False
        new_user['basic_info']['verify_status'] = 'not started'
        new_user['basic_info']['verify_expire_date'] = ''
    if USERS_JSON:
        with open(USERS_JSON, encoding='utf') as data_file:
            users = json.loads(data_file.read())
            users.append(new_user)
        with open(USERS_JSON, 'w', encoding='utf-8') as fout:
            json.dump(users, fout)
    return make_response('Success', 200)


@app.route('/api/v1/operation/pending', methods = ['GET'])
def get_pending_list():
    assignee_id = request.args.get('assignee_id')
    if assignee_id is None:
        return make_response('No assignee_id is given', 400)
    try:
        if ONBOARDING_ASSIGNMENT_JSON:
            with open(ONBOARDING_ASSIGNMENT_JSON, encoding='utf-8') as data_file:
                assignments = json.loads(data_file.read())
            for assignment in assignments:
                if assignment['assignee_id'] == int(assignee_id):
                    return make_response(jsonify(assignment['pending_tasks']), 200)
    except Exception as e:
        return make_response('You are not a part of the onboarding team' , 401)


@app.route('/api/v1/user/verify', methods = ['POST'])
def verify_user():
    verifier_id = request.args.get('verifier_id')
    user_id = request.args.get('user_id')
    if verifier_id is None:
        return make_response('No verifier_id is given', 400)
    if user_id is None:
        return make_response('No user_id is given', 400)
    try:
        if VERIFY_LOG:
            with open(VERIFY_LOG, encoding='utf') as data_file:
                logs = json.loads(data_file.read())
                logs.append({
                    "verifier_id": verifier_id,
                    "user_id": user_id
                })
            with open(VERIFY_LOG, 'w', encoding='utf-8') as fout:
                json.dump(logs, fout)
        if USERS_JSON:
            with open(USERS_JSON, encoding='utf') as data_file:
                users = json.loads(data_file.read())
                for user in users:
                    if user['id'] == int(user_id):
                        user['basic_info']['verify_status'] = 'Success'
                        user['basic_info']['verified'] = True
                        user['basic_info']['verify_expire_date'] = '2019-11-24'
            with open(USERS_JSON, 'w', encoding='utf-8') as fout:
                json.dump(users, fout)
        return make_response('Success', 200)
    except Exception as e:
        return make_response('Failed (Error:' + str(e) + ')', 400)



if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)