# Generated by Django 2.2.4 on 2019-09-12 14:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ('main', '0093_v360_personal_access_tokens'),
    ]

    operations = [
        migrations.AddField(
            model_name='job',
            name='webhook_credential',
            field=models.ForeignKey(
                blank=True,
                help_text='Personal Access Token for posting back the status to the service API',
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='jobs',
                to='main.Credential',
            ),
        ),
        migrations.AddField(
            model_name='job',
            name='webhook_guid',
            field=models.CharField(blank=True, help_text='Unique identifier of the event that triggered this webhook', max_length=128),
        ),
        migrations.AddField(
            model_name='job',
            name='webhook_service',
            field=models.CharField(
                blank=True, choices=[('github', 'GitHub'), ('gitlab', 'GitLab')], help_text='Service that webhook requests will be accepted from', max_length=16
            ),
        ),
        migrations.AddField(
            model_name='workflowjob',
            name='webhook_credential',
            field=models.ForeignKey(
                blank=True,
                help_text='Personal Access Token for posting back the status to the service API',
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='workflowjobs',
                to='main.Credential',
            ),
        ),
        migrations.AddField(
            model_name='workflowjob',
            name='webhook_guid',
            field=models.CharField(blank=True, help_text='Unique identifier of the event that triggered this webhook', max_length=128),
        ),
        migrations.AddField(
            model_name='workflowjob',
            name='webhook_service',
            field=models.CharField(
                blank=True, choices=[('github', 'GitHub'), ('gitlab', 'GitLab')], help_text='Service that webhook requests will be accepted from', max_length=16
            ),
        ),
    ]
