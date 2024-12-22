import asyncio
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import EthereumBlock
from .serializers import EthereumBlockSerializer

class EthereumBlockConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Accept the WebSocket connection
        await self.accept()

        # Store the last sent block's number
        self.last_sent_block_number = None

        # Start checking for new blocks and send updates
        self.send_task = asyncio.create_task(self.send_periodic_updates())

    async def disconnect(self, code):
        # Clean up any resources or tasks here
        await self.clean_up()

        print(f"WebSocket connection closed with code: {code}")

    async def receive(self, text_data):
        # This method is not necessary for our specific use case, but we handle it just in case.
        pass

    @database_sync_to_async
    def get_latest_block(self) -> EthereumBlock:
        try:
            # Fetch the most recent block from the database
            return EthereumBlock.objects.latest('block_number')
        except EthereumBlock.DoesNotExist:
            return None

    async def send_latest_block(self):
        try:
            if self.channel_name:
                latest_block = await self.get_latest_block()

                if latest_block:
                    # Send the block details to the client
                    serializer = EthereumBlockSerializer(latest_block)
                    serialized = json.dumps(serializer.data)
                    await self.send(text_data=serialized)
                    print(f"Sent latest block: {latest_block.block_number}")
                else:
                    await self.send(text_data=json.dumps({
                        'error': 'No Ethereum block found in the database.'
                    }))
        except Exception as e:
            print(f"Error while sending block: {e}")

    async def send_periodic_updates(self):
        while True:
            # Get the latest block
            latest_block = await self.get_latest_block()

            # Only send updates if a new block is available and hasn't been sent yet
            if latest_block and latest_block.block_number != self.last_sent_block_number:
                # Serialize and send the new block to the client
                serializer = EthereumBlockSerializer(latest_block)
                serialized = json.dumps(serializer.data)
                await self.send(text_data=serialized)

                # Update the last sent block number
                self.last_sent_block_number = latest_block.block_number


    async def clean_up(self):
        # Graceful cleanup, in case the WebSocket connection closes unexpectedly
        print("Cleaning up WebSocket connection...")
        if hasattr(self, 'send_task'):
            self.send_task.cancel()
