A simple web server to read mangas 


I am using the mangadex api to download part of the mangas. you can find at https://api.mangadex.org.
I highly recommend that you check out their site at https://mangadex.org 



first-time setup:

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


list of commands (assuming that you are in the project folder in the terminal):

    starting server: `nodemon index.js`
    restarting server (after downloading a manga or after a crash): `rs`
    stop the server: do `ctrl + C` in the terminal




If you want to modify the code:

    javascript files:

        index.js : where the main program runs. The pages and the server are running from this file

        utilities/downloader : Uses puppeteer to download images from manganato.com (called by parser.js)

        utilities/parser : Gets the informations (name of the manga, links for the chapters, cover image and chapter name) from manganato.com and sends them to downloader.js

        utilities/mangadex : Uses the mangadex api to get and download the pages (does the same thing as parser.js and downloader.js combined)


    template files: 

        views/index.ejs : where the chapters are viewed (/manga/mangaName/chapterName)

        views/home.ejs : The homepage for the site (/)

        views/add-manga.ejs : The form where you can fill in order to download mangas (/new)

        views/chapter-menu.ejs : The page where you get informations about the manga (in the future) and where you see the chapters (/manga/mangaName)


