# ProductiveMaster

ProductiveMaster is a web application created to improve my productivity. The backend is made in Django REST Framework and the frontend in React with MUI. In the production environment, the application uses the PostgreSQL database, in the development SQLite.


# Development

## Requirements
- NodeJS (version 19.0.0 or later)
- Python (version 3.9 or later) and pip


Clone this repo and navigate into it
  ```
  git clone https://github.com/maxidragon/ProductiveMaster
  cd ProductiveMaster
  ```
## Setup backend

- Navigate into backend directory
```
cd backend
```

- Create and activate virtual enviroment
```
python -m venv venv
source venv/bin/activate
```

- Install dependencies
```
pip install -r requirements.txt
```
- For production version or if you want to be able to send emails from app (password reset or other) you have to create .env file in /backend directory
```
DEBUG=False 
PGDATABASE=your_database_name
PGUSER=your_pg_user
PGPASSWORD=your_db_password
PGHOST=your_pg_host
PGPORT=your_pg_port
SECRET_KEY=your_secret
EMAIL_HOST=your_smtp_host
EMAIL_PORT=your_smtp_port
EMAIL_USER=your_email_user
EMAIL_HOST_PASSWORD=your_email_password
FRONTEND_URL=your_frontend_url
```

- Run migrations & setup dev database
```
python manage.py migrate
```

- Run backend server
```
python manage.py runserver
```

The server will be accessible at localhost:8000

## Setup frontend

- Navigate into frontend directory
```
cd frontend
```

- Install dependencies
```
npm install
```

- Run frontend server
```
npm start
```
The server will be accessible at localhost:3000

## Tests

- Backend tests (you must have activated virtual environment and be in backend directory)
```
python manage.py test
```

- Frontend tests (you must be in frontend directory)
```
npm test
```
  

