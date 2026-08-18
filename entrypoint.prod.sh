#!/bin/sh
set -e
#!/bin/bash

python manage.py makemigrations
python manage.py migrate --noinput
python manage.py collectstatic --clear --noinput

python create_superuser.py

gunicorn --workers=4 \
         --timeout=600 \
         --bind=0.0.0.0:8000 \
         backend.wsgi:application