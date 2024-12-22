# Ethereum Dashboard

This is a full-stack Ethereum Dashboard application built with Next.js and Django. The project is designed to be quickly buildable using Docker Compose and run through Docker.

## Table of Contents

- [Getting Started](#getting-started)
  - [Environment Variables](#environment-variables)
  - [Docker Integration](#docker-integration)
  - [Scripts](#scripts)

## Getting Started

First, ensure you have Docker installed on your machine.

## Environment Variables

The project uses environment variables to manage configuration. Copy 
```
.env.template
```
 to 
```
.env
```
 and fill in the values.

```plaintext
# Host domain; e.g. HOST_DOMAIN=example.com
HOST_DOMAIN=

# Frontend env vars - auth
AUTH_SECRET=
POSTGRES1_USER=
POSTGRES1_PASS=

# Backend env vars - django
DJANGO_SECRET_KEY=
POSTGRES2_USER=
POSTGRES2_PASS=

# Metamask developer eth block retrieval service
INFURA_PROJECT_ID=

# Coinbase price retrieval service
COINBASE_KEY_NAME=
COINBASE_PRIVATE_KEY=
```

## Docker Integration

The project is designed for painless setup using Docker Compose. To build and run the project, use the following command:

```bash
docker-compose up --build
```

This will build the Docker images and start the containers for the frontend, backend, and other services defined in docker-compose.yaml.
Open [http://localhost:3000](http://localhost:3000) with your browser to visit the frontend.


## Scripts

- `dev`: Runs the development server.
- `build`: Builds the application for production.
- `start`: Starts the production server.
- `lint`: Runs ESLint to check for linting errors.
