
# <-------------------------------------------AWS Deployement------------------------------------>

### Install packages.....
sudo apt update

sudo apt install python3-venv libpq-dev postgresql postgresql-contrib nginx curl

sudo apt install supervisor


##<--------------Setup Database PostgreSQL-------------->

### Open PostgreSQL.....
sudo -u postgres psql

### Create Database.....
CREATE DATABASE the_article_db;

### Create User and Password.....
CREATE USER postgresuser WITH PASSWORD 'password123';

### Other settings.....
ALTER ROLE postgresuser SET client_encoding TO 'utf8';

ALTER ROLE postgresuser SET default_transaction_isolation TO 'read committed';

ALTER ROLE postgresuser SET timezone TO 'Asia/Kolkata';

### Give your new user access to administer your new database.....
GRANT ALL PRIVILEGES ON DATABASE the_article_db TO postgresuser;


##<------------------------Setup Project------------------------->

### Clone Repositary.....
git clone https://github.com/Neerajsinghtanwar/TheArticle.git

cd TheArticle/

### Change Branch.....
git checkout production

cd

### Create Virtual environment.....
python3 -m venv venv

---OR---

virtualenv venv

### Activate Virtual environment.....
source venv/bin/activate

### Install Requirements.....
pip install -r requirements.txt

cd TheArticle/

### Run Commands.....
python3 manage.py makemigrations

python3 manage.py migrate

python3 manage.py collectstatic

### Test on localhost.....
gunicorn --bind 0.0.0.0:8000 myproject.asgi -w 4 -k BlogApp.workers.UvicornWorker

---OR---

uvicorn BlogApp.asgi:application --host 0.0.0.0 --port 8000

---OR---

python3 manage.py runserver 0.0.0.0:8000


## <-----------------Setup Gunicorn/Uvicorn----------------->

pip install gunicorn uvicorn psycopg2-binary

### Create gunicorn.socket.....
sudo nano /etc/systemd/system/gunicorn.socket

    [Unit]
    Description=gunicorn socket
    
    [Socket]
    ListenStream=/run/gunicorn.sock
    
    [Install]
    WantedBy=sockets.target

### Create gunicorn.service.....
sudo nano /etc/systemd/system/gunicorn.service

    [Unit]
    Description=gunicorn daemon
    Requires=gunicorn.socket
    After=network.target
    
    [Service]
    User=ubuntu
    Group=www-data
    WorkingDirectory=/home/ubuntu/TheArticle
    ExecStart=/home/ubuntu/venv/bin/gunicorn \
              --access-logfile - \
              -k uvicorn.workers.UvicornWorker \
              --workers 3 \
              --bind unix:/run/gunicorn.sock \
              BlogApp.asgi:application
    
    [Install]
    WantedBy=multi-user.target

### Start and Enable gunicorn.socket.....
sudo systemctl start gunicorn.socket

sudo systemctl enable gunicorn.socket

### Check Status of gunicorn.socket.....
sudo systemctl status gunicorn.socket

### Others.....
sudo journalctl -u gunicorn.socket

sudo systemctl status gunicorn

curl --unix-socket /run/gunicorn.sock localhost

sudo systemctl status gunicorn

sudo journalctl -u gunicorn

sudo systemctl daemon-reload

sudo systemctl restart gunicorn


## <-------------------------Setup Nginx-------------------------->

sudo nano /etc/nginx/sites-available/BlogApp

    server {
        listen 80;
        server_name 'your_ip_address';
    
        location = /favicon.ico { access_log off; log_not_found off; }
    
    
        location / {
                proxy_pass http://unix:/run/gunicorn.sock;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
    
                proxy_redirect     off;
                proxy_set_header   Host $host;
                proxy_set_header   X-Real-IP $remote_addr;
                proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header   X-Forwarded-Host $server_name;

### Enable the file.....
sudo ln -s /etc/nginx/sites-available/BlogApp /etc/nginx/sites-enabled

### Test Nginx configuration.....
sudo nginx -t

### Restart Nginx.....
sudo systemctl restart nginx

### Deleting port 8000 and Allowing port 80.....
sudo ufw delete allow 8000

sudo ufw allow 'Nginx Full'


## <-------------Setup Celery With Supervisor------------->

### Celery-worker.....
sudo nano /etc/supervisor/conf.d/TheArticles-celery-worker.conf

    [program:The_Articles_celery_worker]
    user=ubuntu
    directory=/home/ubuntu/TheArticle
    command=/home/ubuntu/venv/bin/celery -A BlogApp worker -l INFO
    
    autostart=true
    autorestart=true
    stdout_logfile=/home/ubuntu/TheArticle/celery-worker.log
    stderr_logfile=/home/ubuntu/TheArticle/celery-worker.err.log"

## Celery-beat.....
sudo nano /etc/supervisor/conf.d/TheArticles-celery-beat.conf

    [program:The_Articles_celery_beat]
    user=ubuntu
    directory=/home/ubuntu/TheArticle
    command=/home/ubuntu/venv/bin/celery -A BlogApp beat -l INFO
    
    autostart=true
    autorestart=true
    stdout_logfile=/home/ubuntu/TheArticle/celery-beat.log
    stderr_logfile=/home/ubuntu/TheArticle/celery-beat.err.log"

## Run commands.....
sudo supervisorctl reread

sudo supervisorctl update

sudo supervisorctl status The_Articles_celery_worker

sudo supervisorctl status The_Articles_celery_beat

sudo supervisorctl restart The_Articles_celery_worker

sudo supervisorctl restart The_Articles_celery_beat






# <------------------------------------IMPORTANT NOTE------------------------------------>
### If you perform any changes in code, then allways run these commands.....
sudo systemctl restart gunicorn

sudo systemctl daemon-reload

sudo systemctl restart gunicorn.socket gunicorn.service

sudo nginx -t && sudo systemctl restart nginx

sudo supervisorctl restart The_Articles_celery_worker

sudo supervisorctl restart The_Articles_celery_beat





# <------------------------------------For more help checkout this page------------------------------------>
"https://www.digitalocean.com/community/tutorials/how-to-set-up-an-asgi-django-app-with-postgres-nginx-and-uvicorn-on-ubuntu-20-04"
