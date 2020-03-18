const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const {NodeClient} = require('hs-client');
const {Network} = require('hsd');
const network = Network.get('main');
const fs = require('fs');

const port = 5050;

const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: 'APIKEYGOESHERE'
};

const client = new NodeClient(clientOptions);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', async function(req, res) {
  if(!req.body.zone || !req.body.data || !req.body.path || !req.body.sig)
    res.send("?");
  else {
    let zone = req.body.zone.toLowerCase();
    let data = req.body.data;
    let path = req.body.path.toLowerCase();
    let sig = req.body.sig;
    let address;  // owner of zone address

    // Check if path is weird
    if(path.includes("..") ) {
      res.send("!#%!");
    }
    else {
      // Get domain
      result = await client.execute('getnameinfo', [ zone ]);
      if(!result.info || !result.info.owner || !result.info.owner.hash) {
        res.send("??");
      }
      else {
        // Get domain owner
        result = await client.getCoin(result.info.owner.hash, result.info.owner.index);
        if(!result.address) {
          res.send("???");
        }
        else {
          address=result.address;

          // Verify signature
          result = await client.execute('verifymessage', [ address, sig, data ]);
          if(!result) {
            res.send("????");
          }
          else {
            // Check if zone exists, if not create zone
            if(!fs.existsSync('wwwroot/'+zone)) {
              fs.mkdirSync('wwwroot/'+zone);
            }

            // Check if path exists, if not create path
            path_steps = path.split("/");
            path_buffer = "";
            for(i=0;i<path_steps.length-1;i++) {
              path_buffer+=path_steps[i] + "/";
              if(!fs.existsSync('wwwroot/'+zone+'/'+path_buffer))
                fs.mkdirSync('wwwroot/'+zone+'/'+path_buffer);
            }

            // Write File
            fs.writeFileSync("wwwroot/"+zone+"/"+path, Buffer.from(data,'base64').toString('ascii'));
            fs.writeFileSync("wwwroot/"+zone+"/"+path+".sig", sig);
            res.send("OK");
            console.log("Writing "+zone+"/"+path);
          }
        }
      }
    }
  }
});
app.listen(port, () => console.log(`Web server listening on port ${port}!`))

