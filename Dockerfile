	FROM node:0.12.4

	RUN mkdir -p /usr/src/app
	WORKDIR /usr/src/app

	COPY . /usr/src/app
	RUN npm install -g bower && npm install && bower install --allow-root

	EXPOSE 1999

	CMD [ "node", "index.js" ]
