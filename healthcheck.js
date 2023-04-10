const { Console } = require('console');
const fs = require('fs');
const { buildConfig } = require('./lib/config');

// Write health check console output to docker logs (https://stackoverflow.com/a/68929795)
const out = fs.createWriteStream('/proc/1/fd/1');
const console = new Console(out);

if (!process.env.LOCALTUNNEL_HEALTHCHECK_PATH) {
    // No healthcheck path given, stop healthcheck
    process.exit(0);
}

const config = buildConfig();
const healthcheckUrl = `${config.clientUrl}${process.env.LOCALTUNNEL_HEALTHCHECK_PATH}`;

fetch(healthcheckUrl)
    .then((response) => {
        if (!response.ok) {
            console.error(`[healthcheck.js] Failed with status code ${response.status}. Url: ${healthcheckUrl}`);
            stopContainer();
            process.exit(1);
        }
        console.debug(`[healthcheck.js] Success. Url: ${healthcheckUrl}`);
        process.exit(0);
    })
    .catch((error) => {
        console.error(`[healthcheck.js] Failed with exception. Url: ${healthcheckUrl}`, error);
        stopContainer();
        process.exit(1);
    });

/**
 * Docker doesn't restart unhealthy containers, so we just kill the current container & let docker handle the restart
 * https://github.com/moby/moby/issues/28400
 */
function stopContainer() {
    process.kill(1);
}
