# uni-use-cache
- uni-app 获取缓存数据，修改数据会自动更新缓存（默认为异步获取缓存数据）


## Install 
```bash
pnpm add uni-use-cache
```
```bash
yarn add uni-use-cache
```
```bash
npm install uni-use-cache
```

## Usage
```typescript
import useCache from 'uni-use-cache'
const data = useCache('key', ref())
const data1 = useCache('key1', ref(), true)
const data2 = useCache('key2', reactive({}))
```