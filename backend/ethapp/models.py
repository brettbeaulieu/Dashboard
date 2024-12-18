from django.db import models

class EthereumBlock(models.Model):
    block_hash = models.CharField(max_length=256, unique=True)  # Unique block hash
    block_number = models.BigIntegerField(unique=True)  # Ethereum block number
    gas_limit = models.BigIntegerField(null=True, blank=True)  # Gas limit for the block (optional)
    gas_used = models.BigIntegerField(null=True, blank=True)  # Total gas used in the block (optional)
    miner = models.CharField(max_length=42, null=True, blank=True)  # Address of the miner (optional)
    parent_hash = models.CharField(max_length=256, null=True, blank=True)  # Hash of the parent block (optional)
    timestamp = models.DateTimeField()  # Timestamp when the block was mined
    transaction_count = models.IntegerField()  # Number of transactions in the block
    uncles = models.JSONField(null=True, blank=True)  # Uncle block hashes (optional)

    def __str__(self):
        return f"Block {self.block_number} - {self.timestamp}"

    class Meta:
        ordering = ['-block_number']  # Order by block number
