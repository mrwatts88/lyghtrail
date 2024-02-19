# TODO

#### APIs

- [ ] validate and sanitize inputs
- [ ] authorize requests
- [x] change client request url
- [x] add user id to DB records and use in requests/queries
- [x] build react app into server public folder and serve static files
- [x] update task
    - when completing, move due_next forward by frequency (possible into future by n frequency increments)
- [x] refactor to use one table
    - only need title, frequency, and due_next
    - when fetching get all now >= due_next
- [x] use auto-incremented ids instead of using title
- [x] add process
- [x] get all processes
- [x] delete process
- [x] get all due tasks
- [x] after adding a task, 'days' doesn't get put into state
- [x] after adding a task, date doesn't repopulate
- [x] auth (sign in/up)


#### Client

- [ ] nav between settings and about
- [x] signed out page (marketing/landing)
- [x] Get all due tasks
- [x] update due task (complete task)
- [x] nav between due tasks and settings
- [x] Delete process
- [x] Get all processes
- [x] Add process
    - title, number, unit, due next

#### Infra
- [ ] set up DNS
- [x] add production stage (with db)
- [x] Heroku deploy node, react, and postgres
- [x] Create tables in Heroku Postgres
