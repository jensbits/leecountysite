import requests as req

def autocomplete():
    autocomplete = req.get('https://d1ebsyxxbc7tep.cloudfront.net/data/68052b5a-d49f-48ac-a1a0-50bce8182ba2/Wildfire/Autocomplete',
    headers={'Accept': 'application/json'},
    params={'q': 'kang jennifer'})

    returnData = {
        'response_data': autocomplete.json(),
        'status_code': autocomplete.status_code,
        'success': 'true'
        }
    return returnData

def propertyData():

    propertyData = req.post('https://d1ebsyxxbc7tep.cloudfront.net/data/68052b5a-d49f-48ac-a1a0-50bce8182ba2/Wildfire/Records', 
    data={'value':'kang jennifer', 'direct': 'false', 'skip': '0'})

    returnData = {
        'response_data': propertyData.json(),
        'status_code': propertyData.status_code,
        'success': 'true'
        }
    return returnData

if __name__ == '__main__':
    return_val = propertyData()