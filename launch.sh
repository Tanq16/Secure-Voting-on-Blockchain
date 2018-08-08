#!/usr/bin/env bash
nodemon server.js &
node_modules/.bin/ganache-cli -m "sorry tragic airport arrive tortoise notice toast mad error aware bleak chronic" &
cd Client
python ../https-server.py &
cd ..
node run.js
