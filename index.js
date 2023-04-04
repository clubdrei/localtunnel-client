const localtunnel = require('localtunnel');
const util = require('node:util');

// Force console.* output into one line. This makes searching in Grafana a lot easier.
util.inspect.defaultOptions.breakLength = Infinity;
util.inspect.defaultOptions.compact = true;

// Keep process running:
// https://stackoverflow.com/a/47456805
setInterval(() => {
}, 1 << 30);

let tunnel = null;
let host = null;

async function run() {
  if (!process.env.hasOwnProperty('LOCALTUNNEL_HOST') || process.env.LOCALTUNNEL_HOST.trim().length === 0) {
    console.error(`ENV variable LOCALTUNNEL_HOST missing or invalid. Given value: ${process.env.LOCALTUNNEL_HOST}`);
    process.exit(1);
  }

  if (!process.env.hasOwnProperty('LOCALTUNNEL_SUBDOMAIN') || process.env.LOCALTUNNEL_SUBDOMAIN.trim().length === 0) {
    console.error(`ENV variable LOCALTUNNEL_SUBDOMAIN missing or invalid. Given value: ${process.env.LOCALTUNNEL_SUBDOMAIN}`);
    process.exit(1);
  }

  const config = {
    host: `https://${process.env.LOCALTUNNEL_HOST}`,
    local_host: process.env.LOCALTUNNEL_LOCAL_HOST || 'localhost',
    port: process.env.LOCALTUNNEL_PORT || 80,
    subdomain: process.env.LOCALTUNNEL_SUBDOMAIN,
  };

  console.log('Tunnel config', config);

  tunnel = await localtunnel(config);
  host = `https://${tunnel.clientId}.${process.env.LOCALTUNNEL_HOST}`;
  console.log(`Started tunnel for ${host}`);

  tunnel.on('request', (request) => {
    console.debug(`Request for tunnel ${host}`, request);
  });

  tunnel.on('error', (error) => {
    console.error(`Error in tunnel ${host}`, error);
  });

  tunnel.on('close', () => {
    console.debug(`Closed tunnel for ${host}`);
    process.exit(0);
  });
}

['SIGINT', 'SIGTERM'].forEach(function(signal) {
  process.on(signal, function() {
    console.debug(`Received signal ${signal}`)
    if (tunnel !== null) {
      tunnel.close();
      console.log(`Stopped tunnel for ${host}`);
      process.exit(0);
    }
  });
});

run();
