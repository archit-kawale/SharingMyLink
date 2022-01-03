from django.db import models
import string
import random
import os



def generate_unique_code():
    length = 6

    # while True:
    code = ''.join(random.choices(string.ascii_uppercase, k=length))
        # if Room.objects.filter(code=code).count==0:
        #     break

    return code


def get_file_path(instance, filename):
    return os.path.join(str(instance.room), filename)


# Create your models here.
class Room(models.Model):
    code = models.CharField(max_length=8, unique=True)
    host = models.CharField(max_length=25, unique=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.code


class File(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    roomFile = models.FileField(upload_to = get_file_path)