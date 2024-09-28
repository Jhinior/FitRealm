# views.py
from rest_framework import generics
from rest_framework.exceptions import ValidationError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer

class OrderListCreateAPIView(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(user=user)

class OrderDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]


class OrderItemListCreateView(generics.ListCreateAPIView):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

# RetrieveUpdateDestroyAPIView for retrieving, updating, or deleting a specific order item
class OrderItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer


class OrderItemsByOrderView(generics.ListCreateAPIView):
    serializer_class = OrderItemSerializer

    def get_queryset(self):
        order_id = self.kwargs['order_id']
        return OrderItem.objects.filter(order_id=order_id)

    def create(self, request, *args, **kwargs):
        order_id = self.kwargs['order_id']

        # If the request data is a list (multiple items)
        if isinstance(request.data, list):
            order_items = []
            for item in request.data:
                item['order'] = order_id  # Associate the item with the order
                serializer = self.get_serializer(data=item)
                serializer.is_valid(raise_exception=True)
                self.perform_create(serializer)
                order_items.append(serializer.data)
            return Response(order_items, status=status.HTTP_201_CREATED)

        # For single item creation
        else:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)