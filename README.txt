A simple web server to read mangas. works on pc and on android p


I am using the mangadex api to download part of the mangas. you can find at https://api.mangadex.org.
I highly recommend that you check out their site at https://mangadex.org 



first-time setup:

!! For android, check instructions below !!

    1) Download the latest version of the program, since I usually uptate the code 2-3 times per day and some commits might not be completely functionnal.
    
    1.5) If there is a bug, make sure to check for the newest version and if it still doesn't work, please create an issue.
    
    2) Install nodejs on your computer from the nodejs website or install it by typing `sudo apt install nodejs && sudo apt install npm`in a command prompt (linux only)
    
    3) Open a command prompt. (windows users should use cmd)
    
    4) enter `cd path/to/the/projet/` in the terminal window (it should work on linux and windows).
    4.5) go to the project folder with your file manager and then right-click and select "open in terminal" (this won't work in windows 10)
    
    5) Once this is done, you will need to install the libraries for nodejs. 
    For this, type this: `npm i nodemon fs puppeteer express url axios body-parser semaphore request cheerio path https sanitize-filename`
    This will install all of the required libraries for the program to work

    6) start the server with `nodemon index.js` 

    7) finally, go to localhost:3000 to read the manga

    8) if you want to download mangas, on the bottom-left corner there is a link to a page where you can download mangas from mangadex and from manganato.

    9) after filling the form, you will be redirected to the homepage. if no new manga has appeared, wait untill the chaprers have finished downloading and then type `rs` to restart the server

    9.5) you can change the source from manganato or mangadex if you want (the language selector only works for mangadex)



For Android users:

    Not all of the functionnalities are availale on android, but the main ones do work on android
    
    1) download termux for android (you might need to download it from the f-droid store) Termux is a terminal emulator that can run nodejs servers.
    1.1)install node Js in termux with `pkg update && pkg install nodejs`

    2) go to the termux application folder with `cd /data/data/com.termux/files`

    3) clone this repository with `git clone git@github.com:alexou2/node-reader.git` and go in the repository with `cd node-reader`
    
    4) remove the package files with `rm package*` and initialize nodejs with `npm init` (press enter fir all the questions)
    
    5) install the dependancies with `npm i express axios fs sanitize-filename semaphore request ejs cheerio` 
    
    6) comment the first line of code in utilities/downloader.js by putting '//' before the line of code. 
    
    7) start the server with `node index.js`
    7.5) if you encounter a bug, it might be because there are dependancies that are missing. If this is the case, please make a bug report. 
    
    8) open your browser and type: localhost:3000 in the url search bar (don't search with google)
    
    9) add your manga and enjoy! (downloading from manganato is not suppoted on android)



list of commands (assuming that you are in the project folder in the terminal):

    starting server: `nodemon index.js`
    restarting server (after downloading a manga or after a crash): `rs`
    stop the server: do `ctrl + C` in the terminal




If you want to modify the code:

    javascript files:

        index.js : where the main program runs. The pages and the server are running from this file

        utilities/downloader : Uses puppeteer to download images from manganato.com (called by parser.js)

        utilities/parser : Gets the informations (name of the manga, links for the chapters, cover image and chapter name) from manganato.com and sends them to downloader.js

        utilities/mangadex : Uses the mangadex api to get and download the pages (does the equivalent as parser.js and downloader.js combined)
        
        utilities/jsonWriter : interacts with the json files for the manga 


    template files: 

        views/index.ejs : where the chapters are viewed (/manga/mangaName/chapterName)

        views/home.ejs : The homepage for the site (/)

DEPRICATED        views/add-manga.ejs : The form where you can fill in order to download mangas (/new)

        views/chapter-menu.ejs : The page where you get informations about the manga (in the future) and where you see the chapters (/manga/mangaName)

Cert generation:

cd ~/easyrsa
./easyrsa --subject-alt-name="DNS:hordeprix" build-server-full hordeprix nopass
cp private/hordeprix.key ~/Documents/test-mangaJs/cert/server.key
cp issued/hordeprix.crt ~/Documents/test-mangaJs/cert/server.crt