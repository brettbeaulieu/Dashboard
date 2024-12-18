import asyncio
import json
import time
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import EthereumBlock

class EthereumBlockConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.block_data = []
        self.update_interval = 5  # Update every 5 seconds
        self.timer_task = None

    async def connect(self):
        await self.accept()
        # Start sending the latest blocks to the client periodically
        self.timer_task = asyncio.create_task(self.send_latest_block_periodically())

    async def disconnect(self, code):
        if self.timer_task:
            self.timer_task.cancel()
        print(f"WebSocket connection closed with code: {code}")

    async def receive(self, text_data):
        try:
            print(f"Received data: {text_data}")
            text_data_json = json.loads(text_data)
            message = text_data_json.get('message', None)

            if message == "get_latest_block":
                await self.send_latest_block()
            else:
                print(f"Unrecognized message: {message}")

        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            await self.send(text_data=json.dumps({
                'error': 'Invalid JSON data received.'
            }))
        except Exception as e:
            print(f"Unexpected error: {e}")
            await self.send(text_data=json.dumps({
                'error': 'An unexpected error occurred.'
            }))

    @sync_to_async
    def fetch_latest_block(self):
        try:
            # Fetch the most recent block from the database
            return EthereumBlock.objects.latest('block_number')
        except EthereumBlock.DoesNotExist:
            return None

    async def send_latest_block(self):
        try:
            if self.channel_name:
                latest_block = await self.fetch_latest_block()

                if latest_block:
                    # Send the block details to the client
                    await self.send(text_data=json.dumps({
                        'block_hash': latest_block.block_hash,
                        'block_number': latest_block.block_number,
                        'gas_limit': latest_block.gas_limit,
                        'gas_used': latest_block.gas_used,
                        'miner': latest_block.miner,
                        'parent_hash': latest_block.parent_hash,
                        'timestamp': latest_block.timestamp.isoformat(),
                        'transaction_count': latest_block.transaction_count,
                        'uncles': latest_block.uncles
                    }))
                    print(f"Sent latest block: {latest_block.block_number}")
                else:
                    await self.send(text_data=json.dumps({
                        'error': 'No Ethereum block found in the database.'
                    }))
            else:
                print("Cannot send block, channel_name not set.")
        except Exception as e:
            print(f"Error while sending block: {e}")

    async def send_latest_block_periodically(self):
        # Send the latest block periodically, every 5 seconds (for example)
        while True:
            await self.send_latest_block()
            # Wait for 5 seconds before sending the next block
            await asyncio.sleep(5)

    async def clean_up(self):
        # Graceful cleanup, in case the WebSocket connection closes unexpectedly
        print("Cleaning up WebSocket connection...")
        # Add logic to properly clean up any pending tasks or resources
