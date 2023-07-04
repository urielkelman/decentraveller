FROM node:14
RUN apt-get update && apt-get install -y protobuf-c-compiler libprotobuf-c-dev protobuf-compiler libprotobuf-dev:amd64 gcc build-essential bsdmainutils python git-core asciidoc make htop git curl supervisor cgroup-bin libapparmor-dev libseccomp-dev libprotobuf-dev libprotobuf-c-dev protobuf-c-compiler protobuf-compiler python-protobuf libnl-3-dev libcap-dev libaio-dev apparmor libnet1-dev

RUN cd /var/tmp \
  && git clone https://github.com/xemul/criu.git criu \
  && cd criu \
  && make clean \
  && make \
  && make install
COPY . /app
WORKDIR /app
RUN yarn install
RUN yarn hardhat compile