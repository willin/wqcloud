const debug = require('debug');
const crypto = require('crypto');
const request = require('request');

const getDefer = () => {
  const deferred = {};
  deferred.promise = new Promise((resolve, reject) => { deferred.resolve = resolve; deferred.reject = reject; });
  return deferred;
};

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
  const deferred = getDefer();

  params.Signature = signature;
  debug('wqcloud:common:params')(params);
  request({
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
  }, (err, res) => {
    if (err) {
      deferred.reject(err);
    }
    try {
      deferred.resolve(JSON.parse(res.body));
    } catch (e) {
      deferred.reject(err);
    }
  });

  return deferred.promise;
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
