import json
import requests as req

from django.db import models
from django.http import JsonResponse

# Create your models here.
class AjaxCall(models.Model):

    def __init__(self, url, data, action):
        self.url    = url
        self.data   = data
        self.action = action

    def makeCall(self):
        # url is string of fully qualified url
        # data is dictionary of data to send by post or get
        jsonData = {}
        success = 'false'
        if self.action == 'post':
            responseData = req.post(self.url, data = self.data)
        else:
            responseData = req.get(self.url, headers = {'Accept': 'application/json'}, params = self.data) 

        if responseData.status_code == 200:
            success = 'true'
            jsonData = responseData.json()

        returnData = {
            'response_data':jsonData,
            'status_code': responseData.status_code,
            'success': success
        }
        
        return returnData
