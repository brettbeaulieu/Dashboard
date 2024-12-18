from rest_framework import viewsets
from rest_framework.response import Response
from .models import CoinbaseProduct, ProductTicker
from .serializers import CoinbaseProductSerializer, ProductTickerSerializer

# Create your views here.
class CoinbaseProductViewSet(viewsets.ModelViewSet):
    queryset = CoinbaseProduct.objects.all()
    serializer_class = CoinbaseProductSerializer

    def create(self, request, *args, **kwargs):
        # Custom logic for create, similar to update_or_create
        product_id = request.data.get("product_id")
        if not product_id:
            return Response({"error": "product_id is required"}, status=400)

        product_data = request.data
        product, created = CoinbaseProduct.objects.update_or_create(
            product_id=product_id, defaults=product_data
        )

        if created:
            return Response(self.get_serializer(product).data, status=201)
        else:
            return Response(self.get_serializer(product).data, status=200)

class ProductTickerViewSet(viewsets.ModelViewSet):
    queryset = ProductTicker.objects.all()
    serializer_class = ProductTickerSerializer

