import asyncio
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ProductTicker
from channels.db import database_sync_to_async
from .serializers import ProductTickerSerializer

class TickerConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Get the product_id from the URL parameters
        self.product_id = self.scope['url_route']['kwargs']['product_id']
        
        # Define the group name based on product_id (e.g., 'ETH-USD')
        self.group_name = f"ticker_{self.product_id}"

        # Join the group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        # Accept the WebSocket connection
        await self.accept()

        # Store the last sent ticker's timestamp (or any unique field)
        self.last_sent_timestamp = None

        # Start the periodic message sending task
        self.send_task = asyncio.create_task(self.send_periodic_updates())

    async def disconnect(self, close_code):
        # Leave the group when the WebSocket is disconnected
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

        # Cancel the periodic message task when the consumer is disconnected
        if hasattr(self, 'send_task'):
            self.send_task.cancel()

    async def receive(self, text_data):
        # This method is not necessary for our specific use case, but we handle it just in case.
        pass

    async def send_periodic_updates(self):
        while True:
            # Get the latest ticker data
            ticker_data = await self.get_ticker_data()

            # Only send new data if it's different from the last sent data
            if ticker_data and (self.last_sent_timestamp != ticker_data.timestamp):
                # Serialize the data and send it to the WebSocket
                serializer = ProductTickerSerializer(ticker_data)
                serialized = json.dumps(serializer.data)

                # Send ticker data to the WebSocket
                await self.send(text_data=serialized)

                # Update the last sent timestamp
                self.last_sent_timestamp = ticker_data.timestamp

            # Wait for the next update (e.g., send an update every 2 seconds)
            await asyncio.sleep(2)  # Adjust the sleep time as needed

    @database_sync_to_async
    def get_ticker_data(self):
        """
        Query the latest ticker data for the product_id
        """
        try:
            return ProductTicker.objects.filter(product_id=self.product_id).latest('timestamp')
        except ProductTicker.DoesNotExist:
            return None
