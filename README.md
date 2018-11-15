## Description

Nodejs package to retrieve PV data from a Piko Kostal Inverter.

## Installation

  `npm i pikojs`

## Usage

    var pikojs = require('pikojs');

    var urlData = {
        hostname: "http://fillinyourhostnamehere", // protocol + hostname(or LAN IP)
        port: " ", // external forwarded router port (or '80' if accessed on LAN)
        username: " ", // username for gui login, default is usually 'pvserv'
        password: " " // password for gui login, default is usually 'pvwr'
    };

    var piko = new pikojs(urlData);
    var pvdata; // actual object with the PV data

    piko.getData() // getData returns a Promise
        .then(result => pvdata = result);  // store Data to an object for later use

    // simulate delay to avoid 'pvdata === undefined' for illustration 
    setTimeout(() => console.log(pvdata), 4000);

## Tested on

* Piko 10.1