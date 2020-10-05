from django.shortcuts import render
from django.http import JsonResponse
from publicdata.models import AjaxCall
from publicdata.models import DynamoDb
from django.views.decorators.csrf import ensure_csrf_cookie

import json

# global vars
dynamoDb = DynamoDb('us-east-1')
table_name = 'leecounty'

@ensure_csrf_cookie
# Create your views here.
def index(request):
    c = {}
    return render(request, 'index.html', c)

def data(request):
    return render(request, 'data.html')

def ajx_autocomplete(request):
    # autocomplete = req.get('https://d1ebsyxxbc7tep.cloudfront.net/data/68052b5a-d49f-48ac-a1a0-50bce8182ba2/Wildfire/Autocomplete',
    # headers={'Accept': 'application/json'},
    # params={'q': ''})

    ajxUrl  = 'https://d1ebsyxxbc7tep.cloudfront.net/data/68052b5a-d49f-48ac-a1a0-50bce8182ba2/Wildfire/Autocomplete'
    data    = {'q': request.GET.get('term')}
    ajxCall = AjaxCall(ajxUrl, data, 'get')
    response = ajxCall.makeCall()

    return JsonResponse(response.get('response_data', ""), safe=False)

def ajx_propertydata(request):
    # propertyData = req.post('https://d1ebsyxxbc7tep.cloudfront.net/data/68052b5a-d49f-48ac-a1a0-50bce8182ba2/Wildfire/Records', 
    # data={'value':'', 'direct': 'false', 'skip': '0'})
    postBody = json.loads(request.body.decode('utf-8'))
    ajxUrl  = 'https://d1ebsyxxbc7tep.cloudfront.net/data/68052b5a-d49f-48ac-a1a0-50bce8182ba2/Wildfire/Records'
    data    = {'value': postBody.get('nameQuery'), 'direct': 'false', 'skip': '0'}
    ajxCall = AjaxCall(ajxUrl, data, 'post')
    response = ajxCall.makeCall()

    # put records in dynamoDb
    dataArray = response.get('response_data').get('Records')
    dynamoDb.addItems(dynamoDbObj = dynamoDb, table_name = table_name, item_type = 'property', item_array = dataArray)

    return JsonResponse(response)

def ajx_vehicledata(request):
    # propertyData = req.post('https://d1ebsyxxbc7tep.cloudfront.net/data/078970d5-d0c9-45ae-8491-99c87acb7810/Wildfire/Records', 
    # data={'value':'', 'direct': 'false', 'skip': '0'})
    postBody = json.loads(request.body.decode('utf-8'))
    ajxUrl  = 'https://d1ebsyxxbc7tep.cloudfront.net/data/078970d5-d0c9-45ae-8491-99c87acb7810/Wildfire/Records'
    data    = {'value': postBody.get('nameQuery'), 'direct': 'false', 'skip': '0'}
    ajxCall = AjaxCall(ajxUrl, data, 'post')
    response = ajxCall.makeCall()

    # put records in dynamoDb
    dataArray = response.get('response_data').get('Records')
    dynamoDb.addItems(dynamoDbObj = dynamoDb, table_name = table_name, item_type = 'vehicle', item_array = dataArray)

    return JsonResponse(response)
