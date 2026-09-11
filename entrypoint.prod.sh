#!/bin/bash
set -e

python manage.py migrate --noinput
python manage.py collectstatic --noinput

python create_superuser.py

exec gunicorn \
    --workers=4 \
    --timeout=600 \
    --bind=0.0.0.0:8000 \
    --access-logfile - \
    --error-logfile - \
    backend.wsgi:application
