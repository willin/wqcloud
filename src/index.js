import request from './request';

const SDKS = ['bm', 'cdn', 'cdb', 'cvm', 'cbs', 'csec', 'dayu', 'lb', 'monitor', 'scaling', 'sqlserver', 'redis', 'cmem', 'trade', 'tdsql', 'vpc', 'wenzhi', 'yunsou'];

const DEFAULTS = {
  SecretId: '',
  // Signature: '',
  Region: 'gz',
  Nonce: parseInt(Math.random() * 999999, 10),
  Timestamp: parseInt(new Date() / 1000, 10)
};

const lazyLoad = service => (options) => {
  /* eslint global-require:0 */
  const settings = {
    api: `https://${service}.api.qcloud.com/v2/index.php`,
    actions: {}
  };
  return new Proxy({}, {
    get: (target, property) =>
      (opts) => {
        const action = property.toLowerCase();

        let params = Object.assign({}, DEFAULTS, options);
        params = Object.assign({Action: property}, params, opts);
        params.method = settings.actions[action] || 'post';

        return request(settings.api, params);
      }
  });
};

SDKS.forEach((item) => {
  exports[item.toUpperCase()] = lazyLoad(item);
});
