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
  

