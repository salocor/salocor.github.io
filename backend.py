import json
from flask import Flask, jsonify, request
import requests as rq
backend = Flask(__name__)

data = { };
data["location"] = {
        "latitude": -1,
        "longitude": -1
        }

@backend.route('/location', methods=['GET'])
def putLocation():
    data["location"] = {
        "latitude": request.args.get("lat"),
        "longitude": request.args.get("long")
        }
    print("hiderLat: " + str(hiderLat) + " hiderLong: " + str(hiderLong))

@backend.route('/getLocation', methods=['GET'])
def getLocation():
    return jsonify(data);

backend.run(host = '0.0.0.0')


#url scheme: http://localhost:5000/location?lat=10&long=9
