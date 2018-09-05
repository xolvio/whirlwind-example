#!/bin/sh

cp serverless.yml ./node_modules/whirlwind/serverless.yml
cp scenarioProcessor.js ./node_modules/whirlwind/scenarioProcessor.js
cd ./node_modules/whirlwind
npm run deploy
git reset --hard origin/master
