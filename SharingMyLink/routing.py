from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator, OriginValidator
import SharingMyLinkApp.routing 
#The AllowedHostOriginValidator was added later

application = ProtocolTypeRouter({
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(
                SharingMyLinkApp.routing.websocket_urlpatterns,
            )
        )
    )
})