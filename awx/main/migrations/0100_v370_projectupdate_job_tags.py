# Generated by Django 2.2.4 on 2019-11-01 18:46

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('main', '0099_v361_license_cleanup'),
    ]

    operations = [
        migrations.AddField(
            model_name='projectupdate',
            name='job_tags',
            field=models.CharField(blank=True, default='', help_text='Parts of the project update playbook that will be run.', max_length=1024),
        ),
    ]
