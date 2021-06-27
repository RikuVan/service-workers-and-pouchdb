#!/bin/bash
docker run --rm -p 5984:5984 --name couchdb --volume ~/couchdb/data:/opt/couchdb/data --env COUCHDB_USER=admin --env COUCHDB_PASSWORD=password apache/couchdb:3.1.1