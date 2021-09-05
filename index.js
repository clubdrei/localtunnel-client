const localtunnel = require('localtunnel');

// Keep process running:
// https://stackoverflow.com/a/47456805
setInterval(() => {
}, 1 << 30);

let tunnel = null;
let host = null;

async function run() {
  tunnel = await localtunnel({
    host: `https://${process.env.LOCALTUNNEL_HOST}`,
    local_host: `${process.env.LOCALTUNNEL_LOCAL_HOST}`,
    port: `${process.env.LOCALTUNNEL_PORT}`,
    subdomain: `${process.env.LOCALHOST_SUBDOMAIN}`,
  });
  host = `https://${tunnel.clientId}.${process.env.LOCALTUNNEL_HOST}`;
  console.log(`Started tunnel for ${host}`);
  tunnel.on('close', () => {
    process.exit(0);
  });
}

['SIGINT', 'SIGTERM'].forEach(function(signal) {
  process.on(signal, function() {
    if (tunnel !== null) {
      tunnel.close();
      console.log(`Stopped tunnel for ${host}`);
      process.exit(0);
    }
  });
});

run();
