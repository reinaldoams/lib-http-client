/**
 * HTTP Client related functions.
 *
 * @example
 * var httpClientLib = require('/lib/http-client');
 *
 * @module http-client
 */

function checkRequired(params, name) {
    if (params[name] === undefined) {
        throw "Parameter '" + name + "' is required";
    }
}

/**
 * @typedef Response
 * @type Object
 * @property {number} status HTTP status code returned.
 * @property {string} message HTTP status message returned.
 * @property {object} headers HTTP headers of the response.
 * @property {string} contentType Content type of the response.
 * @property {string} body Body of the response as string. Null if the response content-type is not of type text.
 * @property {*} bodyStream Body of the response as a stream object.
 */

/**
 * Sends an HTTP request and returns the response received from the remote server.
 * The request is sent synchronously, the execution blocks until the response is received.
 *
 * @example-ref examples/http-client/request.js
 * @example-ref examples/http-client/multipart.js
 * @example-ref examples/http-client/basicauth.js
 * @example-ref examples/http-client/proxy.js
 *
 * @param {object} params JSON parameters.
 * @param {string} params.url URL to which the request is sent.
 * @param {string} [params.method=GET] The HTTP method to use for the request (e.g. "POST", "GET", "HEAD", "PUT", "DELETE").
 * @param {object} [params.queryParams] Query parameters to be sent with the request.
 * @param {object} [params.params] Body form parameters. Will be encoded according to `application/x-www-form-urlencoded`.
 * For "GET" and "HEAD" request methods params are added to query string, but only if `params.queryParams` is not provided.
 * @param {object} [params.headers] HTTP headers, an object where the keys are header names and the values the header values.
 * @param {number} [params.disableHttp2=false] Disable use of HTTP/2 protocol. For insecure HTTP connections HTTP/2 is always disabled.
 * @param {number} [params.connectionTimeout=10000] The timeout on establishing the connection, in milliseconds.
 * @param {number} [params.readTimeout=10000] The timeout on waiting to receive data, in milliseconds.
 * @param {string|*} [params.body] Body content to send with the request, usually for POST or PUT requests. It can be of type string or stream.
 * @param {string} [params.contentType] Content type of the request. Only applicable for requests with body or multipart.
 * @param {object[]} [params.multipart] Multipart form data to send with the request, an array of part objects. Each part object contains
 * 'name', 'value', and optionally 'fileName' and 'contentType' properties. Where 'value' can be either a string or a Stream object.
 * @param {object} [params.auth] Settings for basic authentication.
 * @param {string} [params.auth.user] User name for basic authentication.
 * @param {string} [params.auth.password] Password for basic authentication.
 * @param {object} [params.proxy] Proxy settings.
 * @param {string} [params.proxy.host] Proxy host name to use.
 * @param {number} [params.proxy.port] Proxy port to use.
 * @param {string} [params.proxy.user] User name for proxy authentication.
 * @param {string} [params.proxy.password] Password for proxy authentication.
 * @param {boolean} [params.followRedirects] If set to false redirect responses (status=3xx) will not trigger a new internal request, and the function will return directly with the 3xx status.
 * If true, redirects will be handled internally. Default is to handle redirects internally, but don't redirect from https to http.
 * @param {*} [params.certificates] Stream of PEM encoded certificates. Replaces the host platform's certificate authorities with custom set.
 * @param {*} [params.clientCertificate] Stream is interpreted as PEM encoded certificate: Private key (in PKCS #8 format) and the client certificate concatenated.
 *
 * NOTE: is neither `params.certificates` nor `params.clientCertificate` are provided, default JVM TrustStore and KeyStore are used.
 *
 * @return {Response} response HTTP response received.
 */
exports.request = function (params) {

    var bean = __.newBean('com.enonic.lib.http.client.HttpRequestHandler');

    checkRequired(params, 'url');

    bean.setUrl(__.nullOrValue(params.url));
    bean.setParams(__.nullOrValue(params.params));
    bean.setQueryParams(__.nullOrValue(params.queryParams));
    bean.setMethod(__.nullOrValue(params.method));
    bean.setHeaders(__.nullOrValue(params.headers));
    bean.setDisableHttp2(params.disableHttp2 === true);
    bean.setConnectionTimeout(__.nullOrValue(params.connectionTimeout));
    bean.setReadTimeout(__.nullOrValue(params.readTimeout));
    bean.setBody(__.nullOrValue(params.body));
    bean.setContentType(__.nullOrValue(params.contentType));
    bean.setMultipart(__.nullOrValue(params.multipart));
    bean.setFollowRedirects(__.nullOrValue(params.followRedirects));
    if (params.proxy) {
        bean.setProxyHost(__.nullOrValue(params.proxy.host));
        bean.setProxyPort(__.nullOrValue(params.proxy.port));
        bean.setProxyUser(__.nullOrValue(params.proxy.user));
        bean.setProxyPassword(__.nullOrValue(params.proxy.password));
    }
    if (params.auth) {
        bean.setAuthUser(__.nullOrValue(params.auth.user));
        bean.setAuthPassword(__.nullOrValue(params.auth.password));
    }
    bean.setCertificates(__.nullOrValue(params.certificates));

    bean.setClientCertificate(__.nullOrValue(params.clientCertificate));

    return __.toNativeObject(bean.request());
};
