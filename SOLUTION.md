## Solution Notes
### Node Version - v10.16.0

### Query Signatures
## Search Incidents
`sortOrder` should be 'ASC' or 'DESC'. Default value is 'DESC'. This field is optional.<br>
`sortBy` should be 'CREATE' or 'UPDATE'. Default value is 'CREATE' i.e 'createdBy' field and this is an optional field<br>

`
query {
	search(page: 1, limit:2, filters: {},  sortOrder: "DESC", sortBy: "UPDATE") {
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
`

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






