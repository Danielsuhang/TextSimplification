from __future__ import print_function # In python 2.7
from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS, cross_origin


from flask_jsonpify import jsonify
import sys
reload(sys)
sys.setdefaultencoding('utf-8')

app = Flask(__name__)
api = Api(app)
CORS(app)

language = ""

#Tying a url to a Python function

#Tensorflow: 1.4
#Python 2.7 
#virtual environment

@app.route('/')
def getBook():
    global langauge 
    return jsonify({'books': [{'title': 'Content Title', 'content': language}]})


@app.route('/post-text', methods=['POST'])
def postBook():
    global language
    # language = request.args.get('book-text') #if key doesn't exist, returns None
    language = request.data
    return '''<h1>The text value is: {}'''.format(language)


if __name__ == "__main__":
    app.debug = True
    app.run(port=5002)
