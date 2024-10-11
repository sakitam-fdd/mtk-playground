FROM node:20.18.0

# https://pptr.dev/troubleshooting#chrome-doesnt-launch-on-linux
RUN apt-get update && \
    apt-get install -y ca-certificates fonts-liberation libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils

RUN npm install -g pnpm@9.12.3 --registry=https://registry.npmmirror.com/

RUN node -v

WORKDIR /app

COPY . .

RUN pnpm i --registry=https://registry.npmmirror.com/

ADD . /app

CMD ["pnpm", "build:thumbnail"]
