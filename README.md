# Graphql starter multiple type authentication

## Usage

```
docker-compose build
docker-compose up -d
```

### Url
localhost:9001

You can modify port in docker-compose.yaml file


## Mutations

#### Create user mutation
```
mutation createUser ($input: CreateUserRequest) {
  createUser(input: $input) {
    _id
    name
  }
}
```
#### Create user mutation variables

```
{
  "input": {
    "name": "My name",
    "email": "user@mail.com",
    "password": "asdasd"
  }
}
```

#### Create client mutation
```
mutation createClient ($input: CreateClientRequest) {
  createClient (input: $input) {
    _id
    name
  }
}
```
#### Create client mutation variables

```
{
  "input": {
    "name": "My name",
    "email": "client@mail.com",
    "password": "asdasd"
  }
}
```

#### Authenticate mutation
```
mutation authentication ($input: AuthenticationRequest) {
  authenticate (input:$input) {
    expiresIn
    token
  }
}
```

#### Authenticate mutation variables for user
```
{
  "input": {
    "username": "user@mail.com",
    "password": "asdasd",
    "type": "user"
  }
}
```

#### Authenticate mutation variables for client
```
{
  "input": {
    "username": "client@mail.com",
    "password": "asdasd",
    "type": "client"
  }
}
```