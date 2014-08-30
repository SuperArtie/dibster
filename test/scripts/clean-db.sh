#!/bin/bash

if [ -z "$1" ] ; then
  echo "Enter a database name"
  exit 1
fi

<<<<<<< HEAD
mongoimport --jsonArray --drop --db $1 --collection bids --file ../../db/bids.json
=======
mongoimport --jsonArray --drop --db $1 --collection examples --file ../../db/example.json
mongoimport --jsonArray --drop --db $1 --collection users --file ../../db/users.json
mongoimport --jsonArray --drop --db $1 --collection items --file ../../db/items.json
>>>>>>> 446f2254d2b6ea6931fe82c9cfce835ab5324a2c

