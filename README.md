用于还原windows上微信加密后的图片

## 使用方法1-命令行

```
npm i wechat-pc-images-restore -g

wechat-pc-images-restore start -i 加密的图片路径<必填> -o 转换后的图片路径[选填]
```

## 使用方法2-node

```
git clone git@github.com:TNT-Likely/wechat-pc-image-restore.git
npm i
修改index.js中的input和output路径
node index.js
```