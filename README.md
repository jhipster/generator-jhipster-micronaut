> ## 🛠 Blueprint In Active Development
>
> This project is a [Micronaut](https://micronaut.io) blueprint for [JHipster](https://jhipster.tech).
> While we are working to create a complete experience, there are likely some gaps.
> Please [let us know](https://github.com/jhipster/generator-jhipster-micronaut/issues) if you encounter issues.

## Installing and Using the Active Development Version

This currently active development branch is based on the latest production release of JHipster - v8.0.0

As a pre-requisite, you must have Node 18 installed, along with the bundled version of NPM.

1. Start by installing JHipster v8.0.0 with

```
npm install -g generator-jhipster
```

2. Then install this in-development blueprint by

```
git clone https://github.com/jhipster/generator-jhipster-micronaut.git
cd generator-jhipster-micronaut
git checkout micronaut-4
npm link generator-jhipster
npm install
npm link
```

3. Next you can create a new application with the development version of this blueprint by executing:

```
mkdir my-project
cd my-project
npm link "generator-jhipster-micronaut"
mhipster --skip-jhipster-dependencies
```

This will execute the mhipster CLI tool that walks you through a series of steps to generate the code for your application.

Alternatively, you can generate an application based on one of the samples in https://github.com/jhipster/jdl-samples

For example, to generate a default gradle-based application, execute:

```
mkdir my-jdl-project
cd my-jdl-project
npm link "generator-jhipster-micronaut"
mhipster jdl default-gradle --skip-jhipster-dependencies
```

You will re-execute the commands in step 3 for any new application that you would like to generate with this in-development version.

# Greetings, Micronaut Hipster!

![Tests](https://github.com/jhipster/generator-jhipster-micronaut/workflows/Generator%20Lint%20/%20Tests/badge.svg)
![Sample Projects](https://github.com/jhipster/generator-jhipster-micronaut/workflows/Verify%20Sample%20Projects/badge.svg)

<img src="https://raw.githubusercontent.com/jhipster/jhipster-artwork/master/family/jhipster_family_member_4.png" alt="JHipster Micronaut Family Member"
width=200
style="max-width:50%;">

This project generates a Micronaut based JHipster application 😎.
It is based on JHipster Blueprint 🔵, and intends to replace the Spring Boot portions of the server with [Micronaut](https://micronaut.io) equivalents.

## Installation and Usage

1. Install MHipster
   - `npm install -g generator-jhipster-micronaut`
2. Create a new folder for your application
3. Start MHipster
   - `mhipster`

Alternatively, if you already have JHipster installed, you can use this blueprint with:

```
$ jhipster --blueprints micronaut
```

## Using Docker

Download the Dockerfile:

```bash
mkdir docker
cd docker
wget https://github.com/jhipster/generator-jhipster-micronaut/raw/main/docker/Dockerfile
```

Build the Docker images:

```bash
docker build -t jhipster-generator-micronaut:latest .
```

Make a folder where you want to generate the Service:

```bash
mkdir service
cd service
```

Run the generator from image to generate service:

```bash
docker run -it --rm -v $PWD:/home/jhipster/app jhipster-generator-micronaut
```

Run and attach interactive shell to the generator docker container to work from inside the running container:

```bash
docker run -it --rm -v $PWD:/home/jhipster/app jhipster-generator-micronaut /bin/bash
```

## Currently supported options

- Monolith projects
- Microservice projects
- JWT or OAuth 2.0 Authentication
- SQL Database Support
  - MySQL
  - MariaDB
  - PostgreSQL
  - H2
- Ehcache
- Caffeine Cache
- Redis Cache
- Maven or Gradle Build System
- Angular or React Client
- Cypress Tests
- Heroku Deployment

## Compatibility

| Micronaut Blueprint | Micronaut | JHipster |
| ------------------- | --------- | -------- |
| 3.0.0               | 4.2.0     | 8.0.0    |
| 2.0.0               | 3.10.1    | 7.9.3    |
| 1.0.2               | 2.4.4     | 6.10.5   |
| 0.8.0               | 2.3.0     | 6.10.5   |

## ❤️ for community

Interested in contributing?
Check out our [contributing guide](https://github.com/jhipster/generator-jhipster-micronaut/blob/main/CONTRIBUTING.md) to get started.
