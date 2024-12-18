from django.urls import path
from ethapp.consumers import EthereumBlockConsumer

websocket_urlpatterns = [
    path('ws/ethblock/', EthereumBlockConsumer.as_asgi()),
]