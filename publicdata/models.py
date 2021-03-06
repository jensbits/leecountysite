import requests as req
import boto3
import json

from decimal import Decimal
from django.db import models
from boto3.dynamodb.conditions import Key, Attr

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

class DynamoDb(models.Model):

    def __init__(self, region):
        self.region = region
        self.dynamodb = boto3.resource('dynamodb', region_name = self.region)

    def createTable(self, table_name):
        tableName = ""
        try:
            table = self.dynamodb.create_table(
                TableName = table_name,
                KeySchema = [
                    {
                        'AttributeName': 'type',
                        'KeyType': 'HASH'
                    },
                    {
                        'AttributeName': 'idhash',
                        'KeyType': 'RANGE'
                    }
                ],
                AttributeDefinitions = [
                    {
                        'AttributeName': 'type',
                        'AttributeType': 'S'
                    },
                    {
                        'AttributeName': 'idhash',
                        'AttributeType': 'S'
                    }
                ],
                ProvisionedThroughput={
                    'ReadCapacityUnits': 5,
                    'WriteCapacityUnits': 5
                }
            ) 
            table.meta.client.get_waiter('table_exists').wait(TableName=table_name)
            tableName = table_name  
        except:
            # do something here as you require
            pass

        return tableName   

    def getTable(self, table_name):
        return self.dynamodb.Table(table_name)

    def addItems(self, dynamoDbObj, table_name, item_type, item_array):
        dynamoDbObj.createTable(table_name)
        table = dynamoDbObj.getTable(table_name)
        for item in item_array:
            try:
                item_dump = json.dumps(item)
                item = json.loads(item_dump, parse_float=Decimal)
                table.put_item(
                    Item={
                        'type':   item_type,
                        'idhash': item.get('IDHash'),
                        'name':   item.get('OwnerName1'),
                        'record': item
                    }
                )
            except:
                pass


    def queryVehicleItems(self, dynamoDbObj, table_name, make, model):
        table = dynamoDbObj.getTable(table_name)
        data = []

        if len(make) and len(model):
            response = table.query( 
                KeyConditionExpression = Key('type').eq('vehicle'),
                FilterExpression = Attr('record.Make').contains(make) & Attr('record.Model').contains(model),
                ProjectionExpression="#rec",
                ExpressionAttributeNames={"#rec": "record"})
            data = response['Items']

            # LastEvaluatedKey indicates that there are more results
            while 'LastEvaluatedKey' in response:
                response = table.query( 
                    KeyConditionExpression = Key('type').eq('vehicle'),
                    FilterExpression = Attr('record.Make').contains(make) & Attr('record.Model').contains(model),
                    ProjectionExpression="#rec",
                    ExpressionAttributeNames={"#rec": "record"},
                    ExclusiveStartKey=response['LastEvaluatedKey'])
                data.extend(response['Items'])
        elif len(make):
            response = table.query( 
                KeyConditionExpression = Key('type').eq('vehicle'),
                FilterExpression = Attr('record.Make').contains(make),
                ProjectionExpression="#rec",
                ExpressionAttributeNames={"#rec": "record"})
            data = response['Items']

            # LastEvaluatedKey indicates that there are more results
            while 'LastEvaluatedKey' in response:
                response = table.query( 
                    KeyConditionExpression = Key('type').eq('vehicle'),
                    FilterExpression = Attr('record.Make').contains(make),
                    ProjectionExpression="#rec",
                    ExpressionAttributeNames={"#rec": "record"},
                    ExclusiveStartKey=response['LastEvaluatedKey'])
                data.extend(response['Items'])
        elif len(model):
            response = table.query( 
                KeyConditionExpression = Key('type').eq('vehicle'),
                FilterExpression = Attr('record.Model').contains(model),
                ProjectionExpression="#rec",
                ExpressionAttributeNames={"#rec": "record"})
            data = response['Items']

            # LastEvaluatedKey indicates that there are more results
            while 'LastEvaluatedKey' in response:
                response = table.query( 
                    KeyConditionExpression = Key('type').eq('vehicle'),
                    FilterExpression = Attr('record.Model').contains(model),
                    ProjectionExpression="#rec",
                    ExpressionAttributeNames={"#rec": "record"},
                    ExclusiveStartKey=response['LastEvaluatedKey'])
                data.extend(response['Items'])

        return data


        # kwargs = {
        #         "KeyConditionExpression": Key('type').eq('vehicle'),
        #         "ProjectionExpression": "#rec",
        #         "ExpressionAttributeNames": {"#rec": "record"}
        #         }

        # if len(make) and len(model):
        #     kwargs["FilterExpression"] = Attr('record.Make').contains(make) & Attr('record.Model').contains(model)
            
        # elif len(make):
        #     kwargs["FilterExpression"] = Attr('record.Make').contains(make)
           
        # elif len(model):
        #     kwargs["FilterExpression"] = Attr('record.Model').contains(model)

        # response = table.query(**kwargs)
        # data = response['Items']

        # # LastEvaluatedKey indicates that there are more results
        # kwargs["ExclusiveStartKey"] = response['LastEvaluatedKey']
        
        # while 'LastEvaluatedKey' in response:
        #     response = table.query(**kwargs)
        #     data.extend(response['Items'])