# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ('main', '0011_v322_encrypt_survey_passwords'),
    ]

    operations = [
        # This list is intentionally empty.
        # Tower 3.2 included several data migrations that are no longer
        # necessary (this list is now empty because Tower 3.2 is past EOL and
        # cannot be directly upgraded to modern versions of Tower)
    ]
