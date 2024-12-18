from rest_framework import serializers
from .models import EthereumBlock


class EthereumBlockSerializer(serializers.Serializer):
    block_hash = serializers.CharField(max_length=66)
    block_number = serializers.IntegerField()
    gas_limit = serializers.IntegerField(allow_null=True)
    gas_used = serializers.IntegerField(allow_null=True)
    miner = serializers.CharField(max_length=42, allow_null=True)
    parent_hash = serializers.CharField(max_length=66, allow_null=True)
    timestamp = serializers.DateTimeField()
    transaction_count = serializers.IntegerField()
    uncles = serializers.JSONField(allow_null=True)

    def update(self, instance, validated_data):
        instance.block_hash = validated_data.get("block_hash", instance.block_hash)
        instance.block_number = validated_data.get(
            "block_number", instance.block_number
        )
        instance.gas_limit = validated_data.get("gas_limit", instance.gas_limit)
        instance.gas_used = validated_data.get("gas_used", instance.gas_used)
        instance.miner = validated_data.get("miner", instance.miner)
        instance.parent_hash = validated_data.get("parent_hash", instance.parent_hash)
        instance.timestamp = validated_data.get("timestamp", instance.timestamp)
        instance.transaction_count = validated_data.get(
            "transaction_count", instance.transaction_count
        )
        instance.uncles = validated_data.get("uncles", instance.uncles)
        instance.save()
        return instance

    def create(self, validated_data):
        return EthereumBlock.objects.create(**validated_data)
