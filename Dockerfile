# Nodeの公式イメージを使う
FROM node:20

# 作業ディレクトリ作成
WORKDIR /app

# package.jsonを先にコピー
COPY package*.json ./

# 依存インストール
RUN npm install

# 残りのファイルをコピー
COPY . .

# ポート公開
EXPOSE 3000

# 起動コマンド
CMD ["node", "app.js"]