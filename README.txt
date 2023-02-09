a simple web server to read mangas 

You will need to install nodejs and run this comand:
`npm i nodemon fs puppeteer express url axios bodyParser semaphore request cheerio path`


I am using the mangaDex api to download part of thede mangas. you can find at https://api.mangaDex.org.


list of commands (assuming that you are in the project folder in a terminal):

    starting server: `nodemon index.js`
    restarting server (after downloading a manga): `rs`
    stop the server: do `ctrl + C` in the terminal