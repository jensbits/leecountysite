# Pull the base image
FROM python:3.7

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN mkdir /code
WORKDIR /code
#Upgrade pip
RUN pip install pip -U
ADD requirements.txt /code/
#Install dependencies
RUN pip install -r requirements.txt
RUN pip install requests
RUN pip install boto3
RUN pip install python-decouple
ADD . /code/