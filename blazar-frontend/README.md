
# Blazar (blazar-frontend)

## Description

Frontend project for SciTARC's Blazar©.

## How to run

First, you'll need to install [docker](https://www.docker.com/) on your machine.

You also need [make](https://www.gnu.org/software/make/) to run commands (if you are in a unix environment, probably you have it)

Move .env.example file to .env (fill with the right environment data)

from terminal access the folder that you cloned the repository and ran this command:

```
make dev
```

To verify another make commands, see the output of `make help` command.

If everything runs well, you can access the application on `http://localhost:8080`

For DynamoDB administration, access `http://localhost:8001`

## How to run tests

To run all tests in normal mode:

```bash
npm run test
```

To run all tests in _watch_ mode:

```bash
npm run test:watch
```

To generate a code coverage report:

```bash
npm run test:coverage
```

To run all unit tests in _watch_ mode:

```bash
npm run test:unit
```
