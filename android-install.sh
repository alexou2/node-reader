#!/bin/bash

# installs nodejs
apt update
apt install git npm nodejs

# clones the project and goes in the directory
git clone https://github.com/alexou2/node-reader.git
cd node-reader

# deletes content of files wit modules that aren't supported on android
echo "" > utilities/downloader.js
echo "" > utilities/parser.js
npm i path fs axios ejs https request semaphore express body-parser sanitize-filename

# creates the run script, then runs it
cd ..
echo "cd node-reader && node index.js &" > manga-reader.sh
chmod +x manga-reader.sh

# 