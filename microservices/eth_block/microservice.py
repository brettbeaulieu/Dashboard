import os
import time
from datetime import datetime, timezone
from dotenv import load_dotenv
from hexbytes import HexBytes
import requests
from web3 import Web3
import logging

# Load environment variables once (instead of every time the task is run)
load_dotenv('./.env.local')

# Get INFURA project ID from environment
INFURA_PROJECT_ID = os.getenv("INFURA_PROJECT_ID")

# Initialize Web3 outside the task to avoid re-initializing it each time
INFURA_URL = f"https://mainnet.infura.io/v3/{INFURA_PROJECT_ID}"
web3 = Web3(Web3.HTTPProvider(INFURA_URL))

# Initialize logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.WARN, format='%(asctime)s - %(levelname)s - %(message)s')

# Initialize a global variable to track the last processed block hash
LAST_HASH = None

def decode_byte_string(byte_string: HexBytes) -> str:
    """Decode an Ethereum hash to a regular string."""
    return '0x' + byte_string.hex()

def fetch_latest_block():
    """Fetch and store the latest Ethereum block every 5 seconds."""
    global LAST_HASH  # Ensure we're using the global LAST_HASH variable
    
    while True:
        try:
            # Fetch the latest block using Web3
            latest_block = web3.eth.get_block('latest')

            if latest_block is None:
                logger.error("Failed to fetch the latest block data.")
                time.sleep(5)  # Sleep 5 seconds and retry
                continue

            # Process the block data
            block_hash = decode_byte_string(latest_block['hash'])
            block_number = latest_block['number']
            gas_limit = latest_block['gasLimit']
            gas_used = latest_block['gasUsed']
            miner = latest_block['miner']
            parent_hash = decode_byte_string(latest_block['parentHash'])
            timestamp = datetime.fromtimestamp(latest_block['timestamp'], timezone.utc)
            transaction_count = len(latest_block['transactions'])
            uncles = latest_block['uncles']

            logger.info(f'Block hash: {block_hash}, Block number: {block_number}')

            # Check for duplicate blocks by comparing hashes
            if LAST_HASH == block_hash:
                logger.info("Duplicate block detected. Skipping...")
                time.sleep(5)  # Wait before retrying
                continue

            # Update LAST_HASH with the current block hash to prevent duplicates in the next iteration
            LAST_HASH = block_hash

            # Post info to Django viewset endpoint
            response = requests.post(
                'http://backend:8000/api/eth/block/',
                json={
                    "block_hash": block_hash,
                    "block_number": block_number,
                    "gas_limit": gas_limit,
                    "gas_used": gas_used,
                    "miner": miner,
                    "parent_hash": parent_hash,
                    "timestamp": timestamp.isoformat(),
                    "transaction_count": transaction_count,
                    "uncles": uncles
                },
                timeout=2000
            )

            if response.status_code != 201:
                logger.error(f"Failed to store block {block_number}. Status code: {response.status_code}")
            else:
                logger.info(f"Successfully fetched and stored block {block_number}.")

        except Exception as e:
            logger.error(f"Error processing block: {e}")

        # Wait 5 seconds before fetching the next block
        time.sleep(5)


if __name__ == "__main__":

    # wait until backend can be reached
    while True:
        try:
            response = requests.get(
                "http://backend:8000/api/eth/block", timeout=2000
            )
            if response.status_code == 200:
                break
        except requests.exceptions.ConnectionError:
            print("Waiting for backend to be ready...")
            time.sleep(1)

    fetch_latest_block()
