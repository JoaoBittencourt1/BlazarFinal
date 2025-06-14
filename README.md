# dependencias

- docker
- php
- symphony
- node/npm
- vue
- mongo

# frontend:

- cd blazar-frontend
- make dev
- docker compose up --build(dependendo do sistema pode ser necessario perimissao *sudo*)
- npm run dev

# backend

- cd blazar-backend
- composer install
- sudo apt install php8.3-mongodb
- docker compose start
- symfony server:start --port=1500

- symfony server:start --port=1500 --no-tls