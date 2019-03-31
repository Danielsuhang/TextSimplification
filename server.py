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
    return jsonify({'books': [{'title':'The Adventures of Sherlock Holmes','content': 'This is some sample text for what would go into the novel'},
    {'title': 'Post Title', 'content': language} ] })

@app.route('/post-text', methods=['POST'])
def query_example():
    global language
    language = request.args.get('book-text') #if key doesn't exist, returns None

    return '''<h1>The text value is: {}'''.format(language)


if __name__ == "__main__":
    app.debug = True
    
    app.run(port=5002)
