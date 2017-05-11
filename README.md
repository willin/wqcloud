# WQCloud

比官方SDK更好用的腾讯云SDK。

> 已经疯狂得不能用代码行数（总计`82`行，包含空行）来衡量该项目了，代码 `src/index.js` 仅有 `1,711`字节（不含空格） 。

[![npm](https://img.shields.io/npm/v/wqcloud.svg?style=plastic)](https://npmjs.org/package/wqcloud) [![npm](https://img.shields.io/npm/dm/wqcloud.svg?style=plastic)](https://npmjs.org/package/wqcloud)
[![npm](https://img.shields.io/npm/dt/wqcloud.svg?style=plastic)](https://npmjs.org/package/wqcloud)

Minimum, Flexible, Scalable.

支持Lazy Require。

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [安装和使用](#%E5%AE%89%E8%A3%85%E5%92%8C%E4%BD%BF%E7%94%A8)
- [已支持的接口](#%E5%B7%B2%E6%94%AF%E6%8C%81%E7%9A%84%E6%8E%A5%E5%8F%A3)
  - [云服务器 CVM](#%E4%BA%91%E6%9C%8D%E5%8A%A1%E5%99%A8-cvm)
  - [云硬盘 CBS](#%E4%BA%91%E7%A1%AC%E7%9B%98-cbs)
  - [黑石物理服务器 BM](#%E9%BB%91%E7%9F%B3%E7%89%A9%E7%90%86%E6%9C%8D%E5%8A%A1%E5%99%A8-bm)
  - [弹性伸缩 SCALING](#%E5%BC%B9%E6%80%A7%E4%BC%B8%E7%BC%A9-scaling)
  - [负载均衡 LB](#%E8%B4%9F%E8%BD%BD%E5%9D%87%E8%A1%A1-lb)
  - [私有网络 VPC](#%E7%A7%81%E6%9C%89%E7%BD%91%E7%BB%9C-vpc)
  - [内容分发网络](#%E5%86%85%E5%AE%B9%E5%88%86%E5%8F%91%E7%BD%91%E7%BB%9C)
  - [数据库 CDB](#%E6%95%B0%E6%8D%AE%E5%BA%93-cdb)
  - [云解析 CNS](#%E4%BA%91%E8%A7%A3%E6%9E%90-cns)
  - [数据库 TDSQL](#%E6%95%B0%E6%8D%AE%E5%BA%93-tdsql)
  - [数据库 SQLSERVER](#%E6%95%B0%E6%8D%AE%E5%BA%93-sqlserver)
  - [弹性缓存 REDIS](#%E5%BC%B9%E6%80%A7%E7%BC%93%E5%AD%98-redis)
  - [弹性缓存 CMEM （Memcached）](#%E5%BC%B9%E6%80%A7%E7%BC%93%E5%AD%98-cmem-memcached)
  - [网络安全 DAYU](#%E7%BD%91%E7%BB%9C%E5%AE%89%E5%85%A8-dayu)
  - [天御业务安全防护 CSEC](#%E5%A4%A9%E5%BE%A1%E4%B8%9A%E5%8A%A1%E5%AE%89%E5%85%A8%E9%98%B2%E6%8A%A4-csec)
  - [云监控/自定义监控 MONITOR](#%E4%BA%91%E7%9B%91%E6%8E%A7%E8%87%AA%E5%AE%9A%E4%B9%89%E7%9B%91%E6%8E%A7-monitor)
  - [云搜 YUNSOU](#%E4%BA%91%E6%90%9C-yunsou)
  - [文智自然语言处理 WENZHI](#%E6%96%87%E6%99%BA%E8%87%AA%E7%84%B6%E8%AF%AD%E8%A8%80%E5%A4%84%E7%90%86-wenzhi)
  - [账号相关 TRADE](#%E8%B4%A6%E5%8F%B7%E7%9B%B8%E5%85%B3-trade)
  - [地域相关 CVM](#%E5%9C%B0%E5%9F%9F%E7%9B%B8%E5%85%B3-cvm)
- [CHANGELOG](#changelog)
  - [v2.0.2](#v202)
  - [v2.0.0](#v200)
  - [v1.0.0](#v100)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## 安装和使用

国际惯例：

```bash
npm install wqcloud --save
# Node.js 7.6.0之前的版本请安装 v2.x.x版本
npm install wqcloud@2.1.4 --save
```

公共参数：

```js
var options = {
  SecretId: '',
  SecretKey: '',
  // 不填，每次请求都会自动重新生成
  // Signature: '',
  Nonce: parseInt(Math.random() * 999999, 10),
  Timestamp: parseInt(new Date() / 1000, 10)
};
```

ES5:

```js
var WQCLOUD = require('wqcloud');
var trade = WALIYUN.TRADE(options);
trade.DescribeUserInfo().then(function(instances){
  // xxxx
});
```

ES7:

```js
import {TRADE} from 'wqcloud';
const trade = TRADE(options);
// Within Async Func
(async() => {
  const userInfo = await trade.DescribeUserInfo();
  // xxxx
})();
```

## 已支持的接口

### 云服务器 CVM

API文档参考：<https://www.qcloud.com/document/api/213/568>

查询可用区示例：

```js
const WQCLOUD = require('wqcloud');

const example = WQCLOUD.CVM({
  SecretId: 'xxxx',
  SecretKey: 'xxxx'
});

example.DescribeAvailabilityZones({
  Region: 'gz'
}).then((data) => {
  console.log(data);
});
```

### 云硬盘 CBS

API文档参考：<https://www.qcloud.com/document/api/362/2445>

查询价格示例：

```js
const example = WQCLOUD.CBS({
  SecretId: 'xxxx',
  SecretKey: 'xxxx'
});

example.InquiryStoragePrice({
  inquiryType: 'create',
  storageType: 'cloudBasic',
  storageSize: 100,
  goodsNum: 1,
  period: 1,
  payMode: 'prePay'
}).then((data) => {
  console.log(data);
});
```

### 黑石物理服务器 BM

API文档参考：<https://www.qcloud.com/document/api/386/6628>

查询可用区示例：

```js
const example = WQCLOUD.BM({
  SecretId: 'xxx',
  SecretKey: 'xxx'
});

example.DescribeRegions().then((data) => {
  console.log(data);
});
```

### 弹性伸缩 SCALING

API文档参考：<https://www.qcloud.com/document/api/377/3170>

查询弹性伸缩组示例：

```js
const example = WQCLOUD.SCALING({
  SecretId: 'xxxx',
  SecretKey: 'xxxx'
});

example.DescribeScalingGroup().then((data) => {
  console.log(data);
});
```

### 负载均衡 LB

API文档参考： <https://www.qcloud.com/document/api/214/888>

查询价格示例：

```js
const example = WQCLOUD.LB({
  SecretId: 'xxxx',
  SecretKey: 'xxxx'
});

example.InquiryLBPrice({
  loadBalancerType: 2
}).then((data) => {
  console.log(data);
});
```

### 私有网络 VPC

API文档参考： <https://www.qcloud.com/document/api/215/908>

查询私有网络列表示例：

```js
const example = WQCLOUD.VPC({
  SecretId: 'xxxx',
  SecretKey: 'xxxx'
});

example.DescribeVpcEx().then((data) => {
  console.log(data);
});
```

### 内容分发网络

API文档参考： <https://www.qcloud.com/document/api/228/1722>

查询所有域名信息示例：

```js
const example = WQCLOUD.CDN({
  SecretId: 'xxxx',
  SecretKey: 'xxxx'
});

example.DescribeCdnHosts().then((data) => {
  console.log(data);
});
```

### 数据库 CDB

API文档参考： <https://www.qcloud.com/document/api/236/1209>

### 云解析 CNS

即`DNSPOD`服务。

> 不得不说，DNSPOD是我见过最烂的服务商，客服电话永远打不通。交钱的是大爷，想要霸占别人域名只需要购买VIP服务即可，域名主人就别再想用DNSPOD的免费服务了。呵呵哒~

> 个人意见，强烈推荐参考。

API文档参考： <https://www.qcloud.com/document/api/302/4031>

### 数据库 TDSQL

API文档参考： <https://www.qcloud.com/document/api/237/2246>

### 数据库 SQLSERVER

API文档参考：<https://www.qcloud.com/document/api/238/6430>

### 弹性缓存 REDIS

API文档参考： <https://www.qcloud.com/document/api/239/1748>

### 弹性缓存 CMEM （Memcached）

API文档参考： <https://www.qcloud.com/document/api/241/1762>

### 网络安全 DAYU

API文档参考： <https://www.qcloud.com/document/api/297/2314>

### 天御业务安全防护 CSEC

API文档参考： <https://www.qcloud.com/document/api/295/1773>

### 云监控/自定义监控 MONITOR

API文档参考： <https://www.qcloud.com/document/api/397/1785>

### 云搜 YUNSOU

API文档参考： <https://www.qcloud.com/document/api/270/1989>

### 文智自然语言处理 WENZHI

API文档参考： <https://www.qcloud.com/document/api/271/2049>

### 账号相关 TRADE

API文档参考： <https://www.qcloud.com/document/api/378/4367>

获取账户余额示例：

```js
import {TRADE} from 'wqcloud';
// const TRADE = require('wqcloud').TRADE;

const trade = TRADE({
  SecretId: 'xxxxx',
  SecretKey: 'xxxx'
});
// Within Async Func
(async() => {
  const balance = await trade.describeAccountBalance();
  console.log(balance);
})();
```
### 地域相关 CVM

API文档参考： <https://www.qcloud.com/document/api/558/7758>


## CHANGELOG

### v3.0.2

2017-05-11

更新了签名算法，进一步优化代码，将代码行数缩减到82行（含空行）。

### v2.0.2

2017-01-06

从 `waliyun` 阿里云SDK修改适配到 QCloud

### v2.0.0

2016-09-06

* 使用元编程方式进行重构，减少重复代码和`Action`限制；
* 更新文档链接。

### v1.0.0

2016-05-16 解决了签名偶发错误的问题。

## License

MIT

通过支付宝捐赠：

![qr](https://cloud.githubusercontent.com/assets/1890238/15489630/fccbb9cc-2193-11e6-9fed-b93c59d6ef37.png)
