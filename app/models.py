from django.db import models


# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=50)
    pass


class Message(models.Model):
    date = models.DateTimeField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    geo = models.CharField(max_length=50)
    video = models.FileField(upload_to="videos/")
    audio = models.FileField(upload_to="audios/")
    file = models.FileField(upload_to="files/")
    img = models.ImageField(upload_to="images/")
    pin = models.BooleanField()
    pass
