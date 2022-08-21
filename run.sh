#!/bin/bash

# This a startup script for blog web site.
# Run this at the root of the app directory.
# NODE_ENV is already set to "production" on my server.

cd ./client
npm run build
cd ../
pm2 restart server