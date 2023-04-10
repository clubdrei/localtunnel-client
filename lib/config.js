const { isTrue } = require('./utility');

function buildConfig() {
    if (!process.env.hasOwnProperty('LOCALTUNNEL_HOST') || process.env.LOCALTUNNEL_HOST.trim().length === 0) {
        console.error(`ENV variable LOCALTUNNEL_HOST missing or invalid. Given value: ${process.env.LOCALTUNNEL_HOST}`);
        process.exit(1);
    }

    if (!process.env.hasOwnProperty('LOCALTUNNEL_SUBDOMAIN') || process.env.LOCALTUNNEL_SUBDOMAIN.trim().length === 0) {
        console.error(`ENV variable LOCALTUNNEL_SUBDOMAIN missing or invalid. Given value: ${process.env.LOCALTUNNEL_SUBDOMAIN}`);
        process.exit(1);
    }

    let protocol = 'https';
    if (process.env.hasOwnProperty('LOCALTUNNEL_SECURE') && !isTrue(process.env.LOCALTUNNEL_SECURE)) {
        protocol = 'http';
    }

    return {
        protocol,
        host: `${protocol}://${process.env.LOCALTUNNEL_HOST}`,
        local_host: process.env.LOCALTUNNEL_LOCAL_HOST || 'localhost',
        port: process.env.LOCALTUNNEL_PORT || 80,
        subdomain: process.env.LOCALTUNNEL_SUBDOMAIN,
        clientUrl: `${protocol}://${process.env.LOCALTUNNEL_SUBDOMAIN}.${process.env.LOCALTUNNEL_HOST}`
    };
}

module.exports = { buildConfig };
