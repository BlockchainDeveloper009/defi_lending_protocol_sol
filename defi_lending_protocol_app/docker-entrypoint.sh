#!/bin/bash
export NODE_OPTIONS=--openssl-legacy-provider

if [ "$IS_PRODUCTION" = "true" ]; then
  npm run build
else
  npm run start
fi

