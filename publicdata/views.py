from django.shortcuts import render
from django.http import JsonResponse
from publicdata.models import AjaxCall

import json

# Create your views here.
def index(request):
    return render(request, 'index.html')

def data(request):
    return render(request, 'data.html')

def ajx_autocomplete(request):
    # autocomplete = req.get('https://d1ebsyxxbc7tep.cloudfront.net/data/68052b5a-d49f-48ac-a1a0-50bce8182ba2/Wildfire/Autocomplete',
    # headers={'Accept': 'application/json'},
    # params={'q': 'kang jennifer'})

    ajxUrl  = 'https://d1ebsyxxbc7tep.cloudfront.net/data/68052b5a-d49f-48ac-a1a0-50bce8182ba2/Wildfire/Autocomplete'
    data    = {'q': request.GET.get('term')}
    ajxCall = AjaxCall(ajxUrl, data, 'get')
    response = ajxCall.makeCall()

    return JsonResponse(response.get('response_data', ""), safe=False)

def ajx_propertydata(request):
    # propertyData = req.post('https://d1ebsyxxbc7tep.cloudfront.net/data/68052b5a-d49f-48ac-a1a0-50bce8182ba2/Wildfire/Records', 
    # data={'value':'kang jennifer', 'direct': 'false', 'skip': '0'})
    postBody = json.loads(request.body.decode('utf-8'))
    ajxUrl  = 'https://d1ebsyxxbc7tep.cloudfront.net/data/68052b5a-d49f-48ac-a1a0-50bce8182ba2/Wildfire/Records'
    data    = {'value': postBody.get('nameQuery'), 'direct': 'false', 'skip': '0'}
    ajxCall = AjaxCall(ajxUrl, data, 'post')
    response = ajxCall.makeCall()

    return JsonResponse(response)