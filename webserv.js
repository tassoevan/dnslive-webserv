const xm = require('xmimetype');
const fs = require('fs');
const express = require('express');
const app = express();
const port = 80;

app.get('/*', async function(req, res) {
  let hostname = req.headers.host.toLowerCase();
  let url = req.url.toLowerCase();

  // Check if hostname folder exists
  let wwwroot = 'wwwroot/'+hostname;
  if (!fs.existsSync(wwwroot)) {
    res.status(404).send('<html><head><title>404 Not Found</title></head><body>The domain could not be found.</body></html>');
  }
  else {
    // Check if path exists
    if (!fs.existsSync(wwwroot+url) || (wwwroot+url).includes("..")) {
      res.status(404).send('<html><head><title>404 Not Found</title></head><body>The file could not be found.</body></html>');
    }
    else {
      // Check if path is a dir
      if(fs.lstatSync(wwwroot+url).isDirectory()) {
        // if path is a dir and index.html exists, output index.html
        if(fs.existsSync(wwwroot+url+"/index.html")) {
          res.header("Content-Type","text/html");
          res.send(fs.readFileSync(wwwroot+url+"/index.html"));
          console.log("Serving "+wwwroot+url+"/index.html");
        }
        // else, output dir list
        else {
          let dir = fs.readdirSync(wwwroot+url);
          let buffer = '<ul>';

          for(i=0;i<dir.length;i++) {
            buffer+="<li><a href="+dir[i]+">"+dir[i]+"</a></li>";
          }
          buffer += "</ul>";
          res.send('<html><head><title>Directory Listing for '+url+'</title></head><body>'+buffer+'</body></html>');
          console.log("Serving Directory for "+wwwroot+url);
        }
      }
      // else, output file
      else {
        mime = xm.mimetypeOf(wwwroot+url);
        res.header("Content-Type",mime);
        res.send(fs.readFileSync(wwwroot+url));
        console.log("Serving "+wwwroot+url);
      }
    }
  }
});

app.listen(port, () => console.log(`Web server listening on port ${port}!`))
