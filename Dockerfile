# 使用官方 Node.js 镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /usr/src/app

# 复制依赖文件
COPY package*.json ./
RUN npm install

# 复制项目文件
COPY . .

# 暴露默认端口
EXPOSE 3000

# 启动项目
CMD ["npm", "run", "dev"]