# Slate backend test assignment (GraphQL)

This repository contains boilerplate for the backend test assignment.
The server uses `Express` and `apollo-server-express` to expose a GraphQL interface. `MongoDB` is used as a database with `mongoose` as ODM.

## Goal

Currently, if you run `npm start`, you will see an error since there are no definitions for Apollo Server. Your task is to create these definitions according to the requirements in [Test assignment](#test-assignment).

When you are done with the test, please send a link to your repo to your recruiter.  Thank you for your time and interest in Slate!

## Test assignment

Using the boilerplate in this repo, expose a GraphQL interface with the following features:

- Raise (create) an incident and assign it to a user with an `Engineer` role
- Assign the incident to a user
- Acknowledge the incident
- Resolve the incident
- Read details about a certain incident
- Delete an incident
- Index all incidents in the system
  - This includes filtering by fields, sorting by the date of creation and update and pagination
  
`Incident` and `User` models are defined for your convenience. There is no need to wire up the user management system.

## Evaluation

You should spend no more than **4 hours** on this test assignment.

Before you submit the link to your fork with a complete assignment, please make sure your repo contains:

- The code for exposing the GraphQL interface
- A Dockerfile with the code necessary to run your app as a docker container (currently empty)
- Edited `docker-compose.yaml` that includes the reference to your app's docker image along with `mongo`

You are allowed to:

- Add/delete any npm packages as you see fit
- Structure the code in any way you want
- Add any code formatters and linters
- Add configuration variables if needed

You are **not** allowed to:
- Change mongoose models

We will judge your work based on following criteria:
- Code quality, structure and readability
- Amount of boilerplate code
- Usage of new language and framework features to reduce the amount of code written
- Presence of code tests (not required, but is still a big bonus)
- Edge cases coverage (e.g. no user with an Engineer role in the DB)

## Start the development

Make sure you have Node.js v8+ installed.

For your convenience this repository also includes a `docker-compose.yaml` file, which has a mongodb server wired up to the app. `docker-compose up -d` runs in `prestart` hook before `npm start`. If you want to use your own DB setup instead, just delete `prestart` webhook from `package.json`.

Run `npm start` in the root folder of the project to start the development.


## Notes on Solution
#### Node Version - v10.16.0

### Couldn't manage unit test in the given time.
### Lint - extended Airbnb. There is unused React plugin used by airbnb, which I realized only later and leave it there in the configuration.

### Query/Mutation Signatures
## Search Incidents
`sortOrder` should be 'ASC' or 'DESC'. Default value is 'DESC'. This field is optional.<br>
`sortBy` should be 'CREATE' or 'UPDATE'. Default value is 'CREATE' i.e 'createdBy' field and this is an optional 
field<br>

```
query {
	search(page: 1, limit:10, filters: {},  sortOrder: "DESC", sortBy: "UPDATE") {
    docs {
      id
      title
      description
      status
      assignee {
        name
        role
      }
      createdAt
      updatedAt
    }
    pageInfo {
      hasNextPage
      nextPage
      hasPrevPage
      prevPage
      totalPages
    }
  }
}
```

## Create
Note if `assigneddId` is not passed, it will pick the first available Engineer. 
```
mutation {
  create(title: "Ticket #32", description: "First Ticket", assigneeId: "5d708dcf8993c38e04c3135a") {
    title
    description
    assignee {
      name
      role
    }
  }
}
```

## Acknowledge
```
mutation {
  acknowledge(id: "5d703ffe8937c082a41e8c22") {
    title
    description
    status
    assignee {
      name
      role
    }
  }
}
```

## Resolve
```
mutation {
  resolve(id: "5d703ffe8937c082a41e8c22") {
    title
    description
    status
    assignee {
      name
      role
    }
  }
}
```

## Delete
```
mutation {
  delete(id: "5d70413951cb3182b3337041")
}
```

## Read
```
query {
  incident(id: "5d708dffe6806c8e0ef03e3f") {
    title
    description
    status
    createdAt
    updatedAt
    assignee {
      name
      role
    }
  }
}
```
