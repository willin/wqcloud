const debug = require('debug');
const crypto = require('crypto');
const request = require('request');
const { promisify } = require('util');

const req = promisify(request);

const getSignature = (params, secret, host) => {
  const canoQuery = Object.keys(params).sort()
    .map(key => `${(key.indexOf('_') ? key.replace(/_/g, '.') : key)}=${params[key]}`)
    .join('&');
  const stringToSign = `POST${host.replace(/https?:\/\//, '')}?${canoQuery}`;
  let signature = crypto.createHmac('sha1', `${secret}`);
  signature = signature.update(stringToSign).digest('base64');
  return signature;
};

const makeRequest = (host, params = {}, timeout = 5000) => {
  const secret = params.SecretKey;
  delete params.SecretKey;

  params.Nonce = parseInt(Math.random() * 999999, 10);
  params.Timestamp = parseInt(new Date() / 1000, 10);
  const signature = getSignature(params, secret, host);

  params.Signature = signature;
  debug('wqcloud:common:params')(params);
  return req({
    method: 'POST',
    url: host,
    headers: [
      {
        name: 'content-type',
        value: 'application/x-www-from-urlencoded'
      }
    ],
    timeout: parseInt(timeout, 10),
    form: params
  }).then(res => JSON.parse(res.body));
};

const DEFAULTS = {
  SecretId: '',
  // Signature: '',
  Region: 'gz',
  Nonce: parseInt(Math.random() * 999999, 10),
  Timestamp: parseInt(new Date() / 1000, 10)
};

const lazyLoad = service => (options) => {
  const settings = {
    api: `https://${service}.api.qcloud.com/v2/index.php`
  };
  return new Proxy({}, {
    get: (target, property) =>
      (opts) => {
        let params = Object.assign({}, DEFAULTS, options);
        params = Object.assign({ Action: property }, params, opts);
        return makeRequest(settings.api, params);
      }
  });
};

module.exports = new Proxy({}, {
  get: (target, property) => lazyLoad(property.toLowerCase())
});
