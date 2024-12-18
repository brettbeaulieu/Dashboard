"""
ASGI config for backendapi project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
from ethapp.routing import websocket_urlpatterns as ethapp_urlpatterns
from coinbase.routing import websocket_urlpatterns as coinbase_urlpatterns

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backendapi.settings")
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,

        "websocket": AllowedHostsOriginValidator(AuthMiddlewareStack(
            URLRouter(ethapp_urlpatterns + coinbase_urlpatterns)
        )),

    }
)