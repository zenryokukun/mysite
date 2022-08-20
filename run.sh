#!/bin/bash

# This a startup script for blog web site.
# Run this at the root of the app directory.
# It will...
# export NODE_ENV
#  - compile React components
#  - run "genkidama" website using pm2
#  - run this blog site using pm2
#  - restart nginx

# Run this script as super-user.
# [usage] sudo ./run.sh

# root:

export NODE_ENV=production
cd ./client
npm run build
cd ../
pm2 start server.js
pm2 start ../website/server-genki.js
sudo service nginx restart 
