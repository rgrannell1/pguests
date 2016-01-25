
FROM ubuntu:15.10

RUN apt-get update && apt-get install --yes \
	npm                \
	curl               \
	git                \
	dieharder          \
	libcairo2-dev      \
	libjpeg8-dev       \
	libpango1.0-dev    \
	libgif-dev         \
	build-essential    \
	g++                \
	build-essential && \
	rm -rf /var/lib/apt/lists/*





RUN ln -s /usr/bin/nodejs /usr/bin/node

RUN npm cache clean -f
RUN npm install -g \
	n






RUN n stable





COPY . /src

WORKDIR /src
RUN npm link && npm install -g

CMD ["bash", "test/install-test.sh"]
