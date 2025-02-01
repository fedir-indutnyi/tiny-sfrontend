## General Information

Note:
Important:
    "postinstall": "npx replace-in-file 'ng-apexcharts/node_modules/apexcharts/types/apexcharts' 'apexcharts' ./node_modules/ng-apexcharts/lib/chart/chart.component.d.ts && npx replace-in-file 'projects/apexcharts' 'apexcharts' ./node_modules/ng-apexcharts/lib/chart/chart.component.d.ts",
must be removed, once mainteiners fix module:
https://github.com/apexcharts/ng-apexcharts/issues/367

## Based on
Angular 18, Angular CLI, TypeScript, Scss, Bootstrap, Material, NG-ZORRO

## Demo

[Live Demo Sandbox](https://app-frontend-sbx.wlasnasprawa.com/) &

## Getting started

This project is running on: 
- Angular CLI: 18
- Angular: 18
- Node: 20
- Package Manager: npm 9

> Note: Make sure you do not have installed old node.js versions \
[HERE](https://nodejs.org/en/download/releases) you may verify node.js version releases with its npm versions

To get source code:
```
git clone https://github.com/fedir-indutnyi/sfrontend.git .
```

To install project at this version should be run following comands: 
```sh
npm install -g npm@10
npm install -g @angular/cli@18 --force
npm install --force
```

After all modules and packages are installed, can start the project with command:
```sh
npm run start  
OR
npm run start:sandbox
```
Project is running on `localhost:4200`

Run Docker Build for Frontend (proxy is optional)
For Building demo-image from the root of repo:
docker build -t sfrontend-devbox --build-arg NODE_ENV=sandbox . -f "./frontend/Dockerfile"

if proxy needed:
 --build-arg HTTP_PROXY=http://10.0.2.2:3128 --build-arg HTTPS_PROXY=http://10.0.2.2:3128 

docker save sfrontend-demo:latest > sfrontend-demo_latest.tar
docker load < sfrontend-demo_latest.tar

docker run -p 127.0.0.1:3000:3000/tcp --detach --expose 3000 sfrontend-demo 


## License
[MIT license](LICENSE)
