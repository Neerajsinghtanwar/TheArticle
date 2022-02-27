# Generated by Django 3.2.12 on 2022-02-27 08:38

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('object_id', models.PositiveIntegerField()),
                ('text', models.CharField(max_length=500)),
                ('msg', models.CharField(max_length=500, null=True)),
                ('slug', models.SlugField(null=True)),
                ('timeStamp', models.DateTimeField(default=datetime.datetime.now)),
                ('seen', models.BooleanField(default=False)),
                ('image_url', models.CharField(max_length=200, null=True)),
                ('content_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype')),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.blogger')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
