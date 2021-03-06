"""leecountysite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from publicdata import views as publicdata_views

urlpatterns = [
    path('', publicdata_views.index, name='index'),
    path('data', publicdata_views.data, name='data'),
    path('ajx_autocomplete', publicdata_views.ajx_autocomplete, name='ajx_autocomplete'),
    path('ajx_propertydata', publicdata_views.ajx_propertydata, name='ajx_propertydata'),
    path('ajx_vehicledata',  publicdata_views.ajx_vehicledata, name='ajx_vehicledata'),
    path('ajx_vehiclesearch', publicdata_views.ajx_vehiclesearch, name='ajx_vehiclesearch'),
    path('admin/', admin.site.urls),
]
