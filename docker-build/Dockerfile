###################### 1st stage, build ###########################################

ARG SPLATFORMA_NODE_IMAGE=node:20-alpine
FROM $SPLATFORMA_NODE_IMAGE as build

ARG DEBUG=false
ARG PROJECT_NAME
ARG NODE_ENV

# Set NODE_OPTIONS globally (by default this parameter is set to 2048 which might result to build failure)
ENV NODE_OPTIONS=--max-old-space-size=4096

#This is if npm fails to install modules
RUN npm config set maxsockets=3

# specify container directory
WORKDIR /usr/app

# Copy package.json files & scripts:
COPY scripts/ /scripts/
COPY ${PROJECT_NAME}/ /usr/app/

# Install app dependencies:
RUN chmod +x /scripts/*.sh && /scripts/01_install_packages.sh

###################### 2nd stage (compiled, built) ###########################################
ARG SPLATFORMA_NODE_IMAGE=21-alpine
FROM $SPLATFORMA_NODE_IMAGE

ARG DEBUG=false

ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /usr/app

# Get app dependencies into final image
COPY --from=build /usr/app/index.js .
COPY --from=build /usr/app/public public/
COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init

RUN npm install express@4.17.1

COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]