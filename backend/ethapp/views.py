from rest_framework import viewsets
from .models import EthereumBlock
from .serializers import EthereumBlockSerializer


class EthereumBlockViewSet(viewsets.ModelViewSet):
    queryset = EthereumBlock.objects.all()
    serializer_class = EthereumBlockSerializer
