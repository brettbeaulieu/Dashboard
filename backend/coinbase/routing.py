# routing.py

from django.urls import re_path
from .consumers import TickerConsumer

websocket_urlpatterns = [
    re_path(r'ws/ticker/(?P<product_id>\w+-\w+)/$', TickerConsumer.as_asgi()),
]
