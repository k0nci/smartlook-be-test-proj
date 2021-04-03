#!/bin/sh
set -e

exec node "${SERVICE_NAME}/bin/www.js"
