# FROM golang:1.19-alpine3.15 AS plugin-builder
# WORKDIR /builder
# COPY ./go-plugins/go.mod /builder/go.mod
# COPY ./go-plugins/go.sum /builder/go.sum
# COPY ./go-plugins/*.go /builder
# RUN go build -o /builder/go-custom-auth


FROM kong:3.5.0

# Install the js-pluginserver
USER root
RUN apt update
RUN apt install -y nodejs npm python3 make g++ vim
RUN apt clean
RUN npm i --unsafe -g kong-pdk@0.5.5

# Install the python-pluginserver
# RUN apt install -y python3 python3-pip python3-dev musl-dev libffi-dev gcc g++ file make && PYTHONWARNINGS=ignore pip3 install kong-pdk requests

# Install lua script
# COPY ./lua-plugins/lua-custom-auth /tmp/lua-custom-auth
# WORKDIR /tmp/lua-custom-auth
# RUN luarocks make

# Install lua plugin with luarocks
# COPY ./lua-plugins/custom-auth/kong-plugin-custom-auth-0.1.0-1.all.rock /tmp/kong-plugin-custom-auth-0.1.0-1.all.rock
# RUN luarocks install /tmp/kong-plugin-custom-auth-0.1.0-1.all.rock

# COPY --from=plugin-builder /builder/go-custom-auth /kong/go-plugins/go-custom-auth
COPY ./js-plugins/js-custom-auth /usr/local/kong/js-plugins/js-custom-auth
WORKDIR /usr/local/kong/js-plugins/js-custom-auth
RUN npm i

ENV term xterm
