from django.db import models

# Create your models here.
class CoinbaseProduct(models.Model):
    product_id = models.CharField(max_length=100, unique=True)  # Unique product ID
    base_currency = models.CharField(max_length=10)  # Base currency (e.g., BTC, ETH)
    quote_currency = models.CharField(max_length=10)  # Quote currency (e.g., USD, USDC)
    base_increment = models.DecimalField(max_digits=20, decimal_places=10)  # Base increment
    quote_increment = models.DecimalField(max_digits=20, decimal_places=10)  # Quote increment
    display_name = models.CharField(max_length=100)  # Display name for the product
    post_only = models.BooleanField()  # Whether posting is allowed
    limit_only = models.BooleanField()  # Whether limiting is allowed
    cancel_only = models.BooleanField()  # Whether canceling is allowed
    status = models.CharField(max_length=20)  # Status of the product
    auction_mode = models.BooleanField()  # Whether auction mode is enabled

    def __str__(self):
        return f"{self.base_currency}/{self.quote_currency} - {self.product_id}"

class ProductTicker(models.Model):
    timestamp = models.DateTimeField()  # Timestamp of the trade
    product_id = models.CharField(max_length=100)  # Product ID
    price = models.DecimalField(max_digits=20, decimal_places=10)  # Price of the trade
    volume_24_h = models.DecimalField(max_digits=20, decimal_places=10)  # Volume of the trade
    low_24_h = models.DecimalField(max_digits=20, decimal_places=10)  # Low price of the day
    high_24_h = models.DecimalField(max_digits=20, decimal_places=10)  # High price of the day
    low_52_w = models.DecimalField(max_digits=20, decimal_places=10)  # Low price of the year
    high_52_w = models.DecimalField(max_digits=20, decimal_places=10)  # High price of the year
    price_percent_chg_24_h = models.DecimalField(max_digits=20, decimal_places=16)  # Price change percentage in the last 24 hours
    best_bid = models.DecimalField(max_digits=20, decimal_places=10)  # Bid price
    best_ask = models.DecimalField(max_digits=20, decimal_places=10)  # Ask price
    best_bid_quantity = models.DecimalField(max_digits=20, decimal_places=10)  # Bid quantity
    best_ask_quantity = models.DecimalField(max_digits=20, decimal_places=10)  # Ask quantity