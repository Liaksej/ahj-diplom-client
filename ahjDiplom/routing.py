from channels.routing import ProtocolTypeRouter, URLRouter
import app.routing

apolication = ProtocolTypeRouter(
    {"websocket": URLRouter(app.routing.websocket_urlpatterns)}
)
