# views.py
from rest_framework import generics, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer
from rest_framework.permissions import AllowAny
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import generics
from rest_framework.permissions import AllowAny
from login.models import User
from .serializers import OrderSerializer, OrderItemSerializer, UserSerializer, OrderItemSerializer2

class OrderListViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

# class OrderListCreateView(generics.ListCreateAPIView):
#     permission_classes = [AllowAny]
#     queryset = Order.objects.all()
#     serializer_class = OrderSerializer

# class OrderListCreateAPIView(generics.ListCreateAPIView):
#     queryset = Order.objects.all()
#     serializer_class = OrderSerializer
#     permission_classes = [IsAuthenticated]

#     def perform_create(self, serializer):
#         user = self.request.user
#         serializer.save(user=user)


class OrderDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]


class OrderItemListCreateView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

    def perform_create(self, serializer):
        order_item = serializer.save()
        order = order_item.order
        user_email = order.email

        # Include payment status in the email message
        payment_status = "Paid" if order_item.payment else "Not Paid"
        send_mail(
            subject="Order Item Confirmation",
            message=(
                f"Your order for {order_item.quantity} x {order_item.product.name} "
                f"has been placed successfully.\n\n"
                f"Payment Status: {payment_status}"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user_email],
            fail_silently=False,
        )
# RetrieveUpdateDestroyAPIView for retrieving, updating, or deleting a specific order item


class OrderItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [AllowAny]
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

    def perform_update(self, serializer):
        order_item = serializer.save()
        order = order_item.order
        user_email = order.email
        payment_status = "Paid" if order_item.payment else "Not Paid"

        # Send email notification with updated payment status
        send_mail(
            subject="Order Item Updated",
            message=(
                f"The payment status for your order of {order_item.quantity} x {order_item.product.name} "
                f"has been updated.\n\n"
                f"New Payment Status: {payment_status}"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user_email],
            fail_silently=False,
        )


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



class UserOrderListView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'user_id'
    
    def get_queryset(self):
        return User.objects.prefetch_related('orders__items').all()

class OrderListByUserView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = OrderSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Order.objects.filter(user_id=user_id)

class OrderItemListByUserView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = OrderItemSerializer2

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return OrderItem.objects.filter(order__user_id=user_id)