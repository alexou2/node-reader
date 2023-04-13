const os = require('os');


module.exports = {

    splitArgs: function (args) {
        args.splice(0, 2)
        // var args = process.argv
        args = args.join(' ')
        // console.log(args)
        return args
    },

    // uses the arguments to use options
    getArgs: function (args) {
        args = this.splitArgs(args)
        // console.log(args);
        args = args.split('--')

        const finalArg = args[1]
        args = args[0]

        // boolean to enable lan access from other devices
        let lan = false;

        // argument for enabing lan access
        if (args.includes('lan') || finalArg == ('lan')) {
            console.log('LAN access enabled')
            console.log(`Your Hostname is: ${os.hostname}`)
            lan = true;
        } else {
            console.log('Access will only be possible from localhost')
        }
        // argument for help
        if (args.includes('h') || finalArg == 'help' || finalArg == 'h') {
            this.showHelp()
        }
        return lan
    },

    showHelp: function () {
        console.log(`

\x1b[1m Help------------------- \x1b[0m
     \x1b[1m DESCRIPTION \x1b[0m
        A simple nodejs server accessible from localhost or fron the LAN

\x1b[1m ARGUMENTS \x1b[0m

    \x1b[1m -lan, --lan \x1b[0m
                Enables lan access for other computers on the same network. Be sure to allow port 3000 to be accessible from your LAN.
        
       
    \x1b[1m -help, --help \x1b[0m         
                Shows this help menu and quits the program. 
                console.log('\x1b[1m%s\x1b[0m', 'This text is bold');

        `)
        process.kill(process.pid)
    }
}