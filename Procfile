release: python3 manage.py migrate
web: gunicorn BlogApp.asgi:application -w 2 -k uvicorn.workers.UvicornWorker
celery: celery -A BlogApp worker -l INFO
celerybeat: celery -A BlogApp beat -l INFO
