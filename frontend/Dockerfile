###################### SPLATFORMA Frontend MULTISTAGE IMAGE #######################
# default values:
ARG DEBUG=false
ARG K8S_PORT=3000
ARG NODE_ENV=sandbox
###################### 1st stage, build ###########################################

# base image
FROM node:22 as buildimage

ARG NODE_ENV

# Set NODE_OPTIONS globally (by default this parameter is set to 2048 which might result to build failure)
ENV NODE_OPTIONS=--max-old-space-size=4096
#This is if npm fails to install modules
RUN npm config set maxsockets=2

# RUN apt-get update
# install apt init
# RUN apk add dumb-init

# specify container directory
WORKDIR /usr/app

# installing gloabal npm of latest version and global angular
RUN npm install -g npm@11.0.0

RUN npm install -g @angular/cli@18 --force; 


# Copy application files that are used to install modules
COPY frontend/package*.json .

# installing npm modules
RUN npm install --force; 

# RUN npm install --production #dont use this as build will not succeed

# copy all remaining application files # add app
COPY frontend/. .

# run tests
# RUN ng test --watch=false
# RUN ng e2e --port 4202

# Compile Build Locally # generate build
# RUN npm cache clean --force
# RUN sudo apt update && apt install build-essential 
RUN npm run build:${NODE_ENV}-build

# Temporary part to make process working (can be deleted once Compiled part below working):
# RUN cd builds/${NODE_ENV}-build
# RUN npm install --force; 

# expose port for debugging
# EXPOSE ${K8S_PORT}
# CMD [ "node", "index.js" ]

###################### 2nd stage (compiled, built) ###########################################
FROM node:22-alpine
ARG K8S_PORT=3000
ARG NODE_ENV

# USER node
WORKDIR /usr/app

# copy artifact build from the 'build environment'
# somewhy this doesnt work need to be fixed
# COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=buildimage /usr/app/builds/${NODE_ENV}-build .
COPY --from=buildimage /usr/app/builds/${NODE_ENV}-build/package.json .
COPY --from=buildimage /usr/app/builds/${NODE_ENV}-build/. .

RUN npm install --force; 

# expose port
EXPOSE ${K8S_PORT}

# run nginx
# CMD ["nginx", "-g", "daemon off;"]

# Execute newly built container
# This command will be overridden if used command option in compose or kubernetes
CMD [ "node", "index.js" ]
# ENTRYPOINT ["/docker-entrypoint.sh"]



########################### production image ########################################################
# this part is not ready yet
#################
### prodnginx ###
#################

# base image
# FROM nginx:1.16.0-alpine


# copy artifact build from the 'build environment'
# COPY --from=compiledimage /usr/app /usr/share/nginx/html

# expose port 80
# EXPOSE 80
# EXPOSE ${K8S_PORT}

# run nginx
# CMD ["nginx", "-g", "daemon off;"]
