from channels.generic.websocket import AsyncJsonWebsocketConsumer


class AsyncConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive_json(self, data, **kwargs):
        # "Lazy Load Request" - это сообщение,
        # которое вы отправляете из JS при скроллинге вниз
        if data.get("type") == "Lazy Load Request":
            page_number = data.get("page")
            # Fetch data from DB
            data = fetch_data(page_number)
            await self.send_json(data)
