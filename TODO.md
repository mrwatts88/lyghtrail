# TODO

#### APIs

- [ ] validate inputs
- [x] update task
    - when completing, move due_next forward by frequency (possible into future by n frequency increments)
- [x] refactor to use one table
    - only need title, frequency, and due_next
    - when fetching get all now >= due_next
- [x] use auto-incremented ids instead of using title
- [x] add process
- [x] get all processes
- [x] delete process
- [x] Get all due tasks


#### Client

- [ ] nav between settings and about
- [x] Get all due tasks
- [x] update due task (complete task)
- [x] nav between due tasks and settings
- [x] Delete process
- [x] Get all processes
- [x] Add process
    - title, number, unit, due next

#### Infra
- [ ] Heroku deploy node, react, and postgres  
- [ ] Create tables in Heroku Postgres
