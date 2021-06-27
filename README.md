#`Better use-experience with service-workers and PouchDB`

...getting started

```
pnpm install
pnpm run dev
```

While I used pnpm, npm 6 will probably work ok.

Running the frontend will work but you will be missing the backend syncing with CouchDB. It can be installed locally or use docker. Make sure you have a folder with read-write permissions at `~/couchdb/data`. Execute `./run_db.sh`. After the database starts, open `http://localhost:5984/_utils/` where you will need to create three databases: \_users, \_revisions, and dog-friends. Also enable CORS.
