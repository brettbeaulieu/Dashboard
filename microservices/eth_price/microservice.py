import json
import os
import time
import threading
from dotenv import load_dotenv
import requests
import logging
from coinbase.rest import RESTClient
from coinbase.websocket import WSClient, WSClientConnectionClosedException

# Load environment variables once (instead of every time the task is run)
load_dotenv("./.env.local")

# Get INFURA project ID from environment
API_KEY = str(os.environ.get("COINBASE_KEY_NAME"))
SECRET_KEY = str(os.environ.get("COINBASE_PRIVATE_KEY"))
URI = "wss://ws-feed.exchange.coinbase.com"
SIGNATURE_PATH = "/users/self/verify"
channel = "level2"

# Initialize logging
logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.WARN, format="%(asctime)s - %(levelname)s - %(message)s"
)


def on_message(message):
    """Handle messages received from the WebSocket"""
    jsonified = json.loads(message)
    timestamp = jsonified["timestamp"]

    try:
        tickers = jsonified["events"][0]["tickers"]
        for ticker in tickers:
            # Send price update to the backend

            refined = {k: v for k, v in ticker.items() if k not in ["type"]}
            refined["timestamp"] = timestamp

            ws_response = requests.post(
                "http://backend:8000/api/coinbase/ticker/", json=refined, timeout=2000
            )
            if ws_response.status_code in [200, 201]:
                logger.info(f"Prices updated successfully.")
            else:
                logger.error(
                    f"Failed to update price for {ticker['product_id']}. Status code: {ws_response.status_code}"
                )
                logger.error(f"Response text: {ws_response.text}")
    except Exception as e:
        logger.error(f"Error processing message {e}")


def connect_and_subscribe(client: WSClient, product_ids: list[str]):
    try:
        client.open()
        client.subscribe(product_ids=product_ids, channels=["ticker"])
        client.run_forever_with_exception_check()
    except WSClientConnectionClosedException:
        logger.error(
            "Connection closed! Sleeping for 20 seconds before reconnecting..."
        )
        time.sleep(20)
        connect_and_subscribe(client, product_ids)


def price_listener(product_ids: list[str]):
    """Start the price listener in a separate thread"""
    client = WSClient(
        api_key=API_KEY, api_secret=SECRET_KEY, on_message=on_message, retry=False
    )
    connect_and_subscribe(client, product_ids)


def start_price_listener_thread(product_ids: list[str]):
    """Start the price listener as a background thread"""
    listener_thread = threading.Thread(target=price_listener, args=(product_ids,))
    listener_thread.daemon = (
        True  # This ensures the thread will exit when the main program exits
    )
    listener_thread.start()


def create_coinbase_products(product_ids: list[str]):
    client = RESTClient(
        api_key=API_KEY, api_secret=SECRET_KEY
    )  # Uses environment variables for API key and secret
    for product_id in product_ids:
        try:
            product = client.get_product(product_id=product_id)
            product_json = {
                "product_id": product["product_id"],
                "base_currency": product["base_name"],
                "quote_currency": product["quote_name"],
                "base_increment": product["base_increment"],
                "quote_increment": product["quote_increment"],
                "display_name": product["display_name"],
                "post_only": product["post_only"],
                "limit_only": product["limit_only"],
                "cancel_only": product["cancel_only"],
                "status": product["status"],
                "auction_mode": product["auction_mode"],
            }

            logger.info(f"Creating product {product_id}")

            response = requests.post(
                "http://backend:8000/api/coinbase/product/",
                json=product_json,
                timeout=2000,
            )
            if response.status_code in [200, 201]:
                logger.info("Product created successfully")
        except Exception as e:
            logger.error(f"Error fetching product {product_id}: {e}")
            continue


if __name__ == "__main__":

    product_ids = ["ETH-USD"]

    # wait until backend can be reached
    while True:
        try:
            response = requests.get(
                "http://backend:8000/api/coinbase/product", timeout=2000
            )
            if response.status_code == 200:
                break
        except requests.exceptions.ConnectionError:
            logger.info("Waiting for backend to be ready...")
            time.sleep(1)

    create_coinbase_products(product_ids)

    # Start monitoring price in a separate thread
    start_price_listener_thread(product_ids)

    # Main loop to keep the program running (as the listener runs in the background)
    while True:
        time.sleep(1)  # The main thread can keep running indefinitely
