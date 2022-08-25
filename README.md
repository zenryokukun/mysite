# Blog Site
Just a memo...
## フォルダ構成
- admin_client  
メンテ用
- blogs  
ブログ用page.md,画像
- client  
 React client
- content  
 リンク先ページのクライアント側
- route  
 ExpressのRouter  
他は、リンク先ページ・メンテページのサーバ側処理
- svr
  メインページのサーバ処理の部品。db処理や入力チェックとか。

## .gitignoreしているコンフィグファイル等
- /svr/dbinfo.json
- route/genki_src/conf/conf.json

## command
- root  
nodemon server.js    # run express server  
- /client  
npm start            # run React app  
npm run build        # compile React appV

