const debug = require('debug');
const crypto = require('crypto');
const request = require('request');

/**
 * getDefer
 * @return {object} deferred
 */
const getDefer = () => {
  const deferred = {};
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
};

const escaper = str => encodeURIComponent(str)
  .replace(/\*/g, '%2A')
  .replace(/'/g, '%27')
  .replace(/\(/g, '%28')
  .replace(/\)/g, '%29')
  .replace(/\+/, '%2B');

const getSignature = (params, secret, host, method = 'post') => {
  const canoQuery = Object.keys(params).sort()
    .map(key => `${escaper(key)}=${escaper(params[key])}`)
    .join('&');
  const stringToSign = `${method.toUpperCase()}${host.replace(/https?:\/\//, '')}?${canoQuery}`;
  let signature = crypto.createHmac('sha1', `${secret}`);
  signature = signature.update(stringToSign).digest('base64');
  return method === 'post' ? signature : escaper(signature);
};

module.exports = (host, params = {}, timeout = 5000) => {
  let method = 'post';
  if (params.method) {
    method = params.method;
    delete params.method;
  }
  const secret = params.SecretKey;
  delete params.SecretKey;

  params.Nonce = parseInt(Math.random() * 999999, 10);
  params.Timestamp = parseInt(new Date() / 1000, 10);
  const signature = getSignature(params, secret, host, method);
  const deferred = getDefer();
  if (method === 'get') {
    const query = Object.keys(params).sort().map(key => `${escaper(key)}=${escaper(params[key])}`).join('&');
    const url = `${host}?${query}&Signature=${signature}`;
    debug('wqcloud:common:url')(url);
    request.get(url, {timeout: parseInt(timeout, 10)}, (err, res) => {
      if (err) {
        deferred.reject(err);
      }
      try {
        deferred.resolve(JSON.parse(res.body));
      } catch (e) {
        deferred.reject(err);
      }
    });
  } else {
    params.Signature = signature;
    debug('wqcloud:common:params')(params);
    request({
      method: method.toUpperCase(),
      url: host,
      headers: [
        {
          name: 'content-type',
          value: 'application/x-www-form-urlencoded'
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
  }
  return deferred.promise;
};
