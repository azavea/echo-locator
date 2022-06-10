from rest_framework import serializers
from rest_framework_gis import serializers as gis_serializers

from .models import Neighborhood


class NeighborhoodSerializer(gis_serializers.GeoFeatureModelSerializer):
    # The Django 'id' field is not the same as the zipcode, but the frontend assumes that they are,
    # So for the purposes of this endpoint we need to remap "id" to contain the zipcode.
    id = serializers.SerializerMethodField(method_name="get_id")

    def get_id(self, obj):
        return obj.zipcode

    class Meta:
        model = Neighborhood
        exclude = ["boundary"]
        geo_field = "centroid"
        id_field = False


class NeighborhoodBoundsSerializer(gis_serializers.GeoFeatureModelSerializer):
    # The Django 'id' field is not the same as the zipcode, but the frontend assumes that they are,
    # So for the purposes of this endpoint we need to remap "id" to contain the zipcode.
    id = serializers.SerializerMethodField(method_name="get_id")

    def get_id(self, obj):
        return obj.zipcode

    class Meta:
        model = Neighborhood
        geo_field = "boundary"
        id_field = False
        fields = ["town", "zipcode", "id"]
