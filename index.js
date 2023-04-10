const localtunnel = require('localtunnel');
const util = require('node:util');
const { buildConfig } = require('./lib/config');

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
  const config = buildConfig();
  console.log('Tunnel config', config);

  tunnel = await localtunnel(config);
  host = `${config.protocol}://${tunnel.clientId}.${process.env.LOCALTUNNEL_HOST}`;
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
