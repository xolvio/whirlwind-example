#!/bin/sh

cp serverless.yml ./node_modules/whirlwind/serverless.yml
cp serverless.yml ./node_modules/whirlwind/serverless.yml
cd ./node_modules/whirlwind
npm run deploy
git reset --hard origin/master
