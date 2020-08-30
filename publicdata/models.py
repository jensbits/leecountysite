import json
import requests as req

from django.db import models
from django.http import JsonResponse

# Create your models here.
class AjaxCall(models.Model):

    def makeCall(url, data, action):
        # url is string of fully qualified url
        # data is dictionary of data to send by post or get
        jsonData = {}
        success = 'false'
        if action == 'post':
            responseData = req.post(url, data = data)
        else:
            responseData = req.get(url, headers = {'Accept': 'application/json'}, params = data) 

        if responseData.status_code == 200:
            success = 'true'
            jsonData = responseData.json()

        returnData = {
            'response_data':jsonData,
            'status_code': responseData.status_code,
            'success': success
        }
        
        return returnData
