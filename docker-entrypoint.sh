#!/bin/sh
set -e
node --experimental-specifier-resolution=node build/index.js --migrate
exec "$@"
