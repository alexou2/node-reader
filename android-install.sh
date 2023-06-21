#!/bin/bash

# installs nodejs
echo "updating packages..."
apt update
pkg install git nodejs

# clones the project and goes in the directory
echo "cloning repository..."
git clone https://github.com/alexou2/node-reader.git
cd node-reader

# deletes content of files wit modules that aren't supported on android
echo "applying android fixes..."
rm package.json package-lock.json
echo "" >utilities/downloader.js
echo "" >utilities/parser.js
echo "installing dependancies..."
npm i path fs axios ejs https request semaphore express body-parser sanitize-filename

# creates the run script, then runs it
echo "creating script..."
cd ..
echo -e "cd node-reader" >manga-reader.sh
echo "node index.js" >> manga-reader.sh
chmod +x manga-reader.sh

# tells user that script has finished
echo "Finished installing."
echo -e "You will now be able to run the server script with \033[0;34m ./manga-reader.sh \033[0m"

# promps the user if they want to run the script
read -p "Do you want to run the server script? [Y/n] " run_scr
if [[ $run_scr == "y" ]] || [[ -z $run_scr ]]; then
    echo "the script is now running"
    echo "./manga-reader.sh"
     ./manga-reader.sh &
fi
