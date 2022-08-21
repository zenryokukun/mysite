#!/bin/bash

# This a startup script for blog web site.
# Run this at the root of the app directory.

# This script assumes...
# 1.NODE_ENV is already set to "production" on my server.
# 2.express app `server` is running using pm2.

cd ./client
npm run build
cd ../
pm2 stop server
pm2 restart server