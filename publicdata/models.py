import json
from publicdata.data_requests import propertyData

from django.db import models
from django.http import JsonResponse

# Create your models here.
class AjaxCall(models.Model):

    def makeCall(url, data):
        # url is string of fully qualified url
        # data is dictionary of data to send by post or get
        success = 'false'
        responseData = propertyData()

        # # print(responseData.status_code)
        # # print(responseData.json())

        # if responseData.status_code == 200:
        #     success = 'true'

        returnData = {
        'response_data': responseData.get('response_data', {}),
        'status_code': responseData.get('status_code', '500'),
        'success': success
        }

        return JsonResponse(returnData)
