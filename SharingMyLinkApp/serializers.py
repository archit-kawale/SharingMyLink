from rest_framework import serializers
from .models import Room

class RoomSerializers(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields =  ('id', 'code', 'host', 'created_at')