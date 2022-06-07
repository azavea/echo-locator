from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Neighborhood
from .serializers import NeighborhoodBoundsSerializer, NeighborhoodSerializer


class ListNeighborhoods(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        neighborhoods = Neighborhood.objects.all()
        serializer = NeighborhoodSerializer(neighborhoods, many=True)
        return Response(serializer.data)


class ListNeighborhoodBounds(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        neighborhoods = Neighborhood.objects.all()
        serializer = NeighborhoodBoundsSerializer(neighborhoods, many=True)
        return Response(serializer.data)
