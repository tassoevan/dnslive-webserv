# dnslive webhosting server
## Quick and simple web hosting server for Handshake Naming System Top Level Domain Zones
Clients can just POST or use the [DNS Live webhost client](https://github.com/realrasengan/dnslive-webhost) to upload their files to this server.

They simply need to provide a signature of the file they wish to upload signed by the address and key associated with the domain/tld.

This should not be used for production quality websites/DNS but is great for personal use!  For more info see [dns.live](https://dns.live).

*** If you have a handshake resolver setup, visit [http://ix/](http://ix/) which is hosted using dnslive-cli at the DNS level and hosted using dnslive-webhost at the web level. ***

### Install
```
git clone https://github.com/realrasengan/dnslive-webserv
cd dnslive-webserv
npm install body-parser express hs-client hsd xmimetype
```

### Use
```
node webserv.js & && node webhost.js &
```
or add to crontab
```
* * * * * cd /path/to/webhost.js && node webhost.js >> webhost.log
* * * * * cd /path/to/webserv.js && node webserv.js >> webserv.log
```
If you want port 80 support, webserv.js needs to run as root (so put in root's crontab).
The crontab basically runs every minute and won't work if a server is already bound to port 80/5050.
You can also create an immortal or systemd file if you prefer.

### Other Things You'll Need to do
1. You need to create an apikey and run [hsd](https://github.com/handshake-org/hsd) with the apikey.
2. You'll need to put that apikey in webhost.js
3. You'll need to keep hsd running.

### Copyright
Copyright (c) The Handshake Community

MIT Licensed

