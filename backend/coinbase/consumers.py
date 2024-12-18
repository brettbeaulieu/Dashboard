import asyncio
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ProductTicker
from channels.db import database_sync_to_async

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

            if ticker_data:
                # Send ticker data to the WebSocket
                await self.send(text_data=json.dumps(ticker_data))

            # Wait for the next update (e.g., send an update every 5 seconds)
            await asyncio.sleep(5)  # Adjust the sleep time as needed

    @database_sync_to_async
    def get_ticker_data(self):
        """
        Query the latest ticker data for the product_id
        """
        try:
            ticker = ProductTicker.objects.filter(product_id=self.product_id).latest('timestamp')
            return {
                'timestamp': ticker.timestamp.isoformat(),
                'product_id': ticker.product_id,
                'price': str(ticker.price),
                'volume_24_h': str(ticker.volume_24_h),
                'low_24_h': str(ticker.low_24_h),
                'high_24_h': str(ticker.high_24_h),
                'low_52_w': str(ticker.low_52_w),
                'high_52_w': str(ticker.high_52_w),
                'price_percent_chg_24_h': str(ticker.price_percent_chg_24_h),
                'best_bid': str(ticker.best_bid),
                'best_ask': str(ticker.best_ask),
                'best_bid_quantity': str(ticker.best_bid_quantity),
                'best_ask_quantity': str(ticker.best_ask_quantity),
            }
        except ProductTicker.DoesNotExist:
            return None
