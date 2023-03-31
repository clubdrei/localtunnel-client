# localtunnel-client

Docker image with [localtunnel](https://github.com/localtunnel/localtunnel)

## ENV variables

The ENV variables are mapped to options of the localtunnel client:  
https://github.com/localtunnel/server

- `LOCALTUNNEL_HOST` - URL for the upstream proxy server.
- `LOCALTUNNEL_SUBDOMAIN` - Request a specific subdomain on the proxy server. Note You may not actually receive this name depending on availability.
- `LOCALTUNNEL_LOCAL_HOST` - Proxy to this hostname instead of localhost. This will also cause the Host header to be re-written to this value in proxied requests.
- `LOCALTUNNEL_PORT` - The local port number to expose through localtunnel.


