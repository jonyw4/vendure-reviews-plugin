# Vendure Reviews Plugin
![Publish](https://github.com/jonyw4/vendure-reviews-plugin/workflows/Publish/badge.svg?branch=master)
![Build & Test](https://github.com/jonyw4/vendure-reviews-plugin/workflows/Build%20&%20Test/badge.svg)
[![codecov](https://codecov.io/gh/jonyw4/vendure-reviews-plugin/branch/master/graph/badge.svg)](https://codecov.io/gh/jonyw4/vendure-reviews-plugin)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

⭐ Multiple plugins for [Vendure](https://github.com/vendure-ecommerce/vendure) to review about Products, Order and Company

## 🌟 Features
- Ability to customer create review of the Company using with [NPS](https://en.wikipedia.org/wiki/Net_Promoter)
- Manage the state of reviews approving every changes by the customer
- On every change of state its dispatch a new Event, so you can extend the features of this package to send email or something like that

## Todo
- Admin UI
- Products Review
- Order Review

## ⚙️ Install
### 1. Install and configure Vendure
[Here](https://www.vendure.io/docs/getting-started/) you can find out how to install

### 2. Install the package
```bash
npm install vendure-reviews-plugin --save
```

### 3. Add the plugin in Vendure configuration
```typescript
import { ReviewsStorePlugin } from 'vendure-reviews-plugin';
const config: VendureConfig = {
  ...
  plugins: [
    ReviewsStorePlugin
  ]
}
```

## 📚 How to use?
If you want to use queries and mutation of this package [you can see the all on this file](https://github.com/jonyw4/vendure-reviews-plugin/blob/master/src/api/schema/shop.ts)

## ❗️ License
MIT 