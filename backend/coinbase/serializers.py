from rest_framework import serializers
from .models import CoinbaseProduct, ProductTicker


class CoinbaseProductSerializer(serializers.Serializer):
    product_id = serializers.CharField(max_length=100)
    base_currency = serializers.CharField(max_length=10)
    quote_currency = serializers.CharField(max_length=10)
    base_increment = serializers.DecimalField(max_digits=20, decimal_places=10)
    quote_increment = serializers.DecimalField(max_digits=20, decimal_places=10)
    display_name = serializers.CharField(max_length=100)
    post_only = serializers.BooleanField()
    limit_only = serializers.BooleanField()
    cancel_only = serializers.BooleanField()
    status = serializers.CharField(max_length=20)
    auction_mode = serializers.BooleanField()

    def update(self, instance, validated_data):
        instance.product_id = validated_data.get("product_id", instance.product_id)
        instance.base_currency = validated_data.get(
            "base_currency", instance.base_currency
        )
        instance.quote_currency = validated_data.get(
            "quote_currency", instance.quote_currency
        )
        instance.base_increment = validated_data.get(
            "base_increment", instance.base_increment
        )
        instance.quote_increment = validated_data.get(
            "quote_increment", instance.quote_increment
        )
        instance.display_name = validated_data.get(
            "display_name", instance.display_name
        )
        instance.min_market_funds = validated_data.get(
            "min_market_funds", instance.min_market_funds
        )
        instance.margin_enabled = validated_data.get(
            "margin_enabled", instance.margin_enabled
        )
        instance.post_only = validated_data.get("post_only", instance.post_only)
        instance.limit_only = validated_data.get("limit_only", instance.limit_only)
        instance.cancel_only = validated_data.get("cancel_only", instance.cancel_only)
        instance.status = validated_data.get("status", instance.status)
        instance.status_message = validated_data.get(
            "status_message", instance.status_message
        )
        instance.auction_mode = validated_data.get(
            "auction_mode", instance.auction_mode
        )
        instance.save()
        return instance

    def create(self, validated_data):
        return CoinbaseProduct.objects.create(**validated_data)


class ProductTickerSerializer(serializers.Serializer):
    timestamp = serializers.DateTimeField()
    product_id = serializers.CharField(max_length=100)
    price = serializers.DecimalField(max_digits=20, decimal_places=10)
    volume_24_h = serializers.DecimalField(max_digits=20, decimal_places=10)
    low_24_h = serializers.DecimalField(max_digits=20, decimal_places=10)
    high_24_h = serializers.DecimalField(max_digits=20, decimal_places=10)
    low_52_w = serializers.DecimalField(max_digits=20, decimal_places=10)
    high_52_w = serializers.DecimalField(max_digits=20, decimal_places=10)
    price_percent_chg_24_h = serializers.DecimalField(max_digits=20, decimal_places=16)
    best_bid = serializers.DecimalField(max_digits=20, decimal_places=10)
    best_ask = serializers.DecimalField(max_digits=20, decimal_places=10)
    best_bid_quantity = serializers.DecimalField(max_digits=20, decimal_places=10)
    best_ask_quantity = serializers.DecimalField(max_digits=20, decimal_places=10)

    def update(self, instance, validated_data):
        instance.timestamp = validated_data.get("timestamp", instance.timestamp)
        instance.product_id = validated_data.get("product_id", instance.product_id)
        instance.price = validated_data.get("price", instance.price)
        instance.volume_24_h = validated_data.get("volume_24_h", instance.volume_24_h)
        instance.low_24_h = validated_data.get("low_24_h", instance.low_24_h)
        instance.high_24_h = validated_data.get("high_24_h", instance.high_24_h)
        instance.low_52_w = validated_data.get("low_52_w", instance.low_52_w)
        instance.high_52_w = validated_data.get("high_52_w", instance.high_52_w)
        instance.price_percent_chg_24_h = validated_data.get(
            "price_percent_chg_24_h", instance.price_percent_chg_24_h
        )
        instance.best_bid = validated_data.get("best_bid", instance.best_bid)
        instance.best_ask = validated_data.get("best_ask", instance.best_ask)
        instance.best_bid_quantity = validated_data.get(
            "best_bid_quantity", instance.best_bid_quantity
        )
        instance.best_ask_quantity = validated_data.get(
            "best_ask_quantity", instance.best_ask_quantity
        )
        instance.save()
        return instance

    def create(self, validated_data):
        return ProductTicker.objects.create(**validated_data)
