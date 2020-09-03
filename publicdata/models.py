import requests as req

from django.db import models

# Create your models here.
class AjaxCall(models.Model):

    def __init__(self, url, data, action, headers = {}):
        self.url    = url
        self.data   = data
        self.action = action
        self.headers = headers

    def makeCall(self):
        # url is string of fully qualified url
        # data is dictionary of data to send by post or get
        jsonData = {}
        success = 'false'

        if self.action == 'post':
            responseData = req.post(self.url, headers = self.headers, data = self.data)
        if self.action == 'get':
            responseData = req.get(self.url, headers = self.headers, params = self.data) 

        if responseData.status_code == 200:
            success = 'true'
            jsonData = responseData.json()

        returnData = {
            'response_data':jsonData,
            'status_code': responseData.status_code,
            'request_data': self.data,
            'success': success
        }
        
        return returnData
