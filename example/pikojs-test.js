var pikojs = require('../src/index');

var urlData = {
    hostname: "http://fillinyourhostnamehere", // protocol + hostname
    port: " ", // external forwarded router port
    username: " ", // username for gui login, default is usually 'pvserv'
    password: " " // password for gui login, default is usually 'pvwr'
};

var piko = new pikojs(urlData);
var pvdata; // actual object with the PV data

piko.getData() // getData returns a Promise
    .then(result => pvdata = result);

// simulate delay to avoid 'pvdata === undefined' for illustration 
setTimeout(() => console.log(pvdata), 4000);