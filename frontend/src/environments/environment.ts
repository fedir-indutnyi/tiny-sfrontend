// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  envname:'example file',
  production: false,
  ImportantNoticeEnabled:true,
  baseUrl: 'https://splatform-backend-sandbox.herokuapp.com',
  fileDynamicPlaceholder: '##sPlatformFileStorage##/',
  fileDynamicPlaceholderUrl: 'https://splatform-backend-sandbox.herokuapp.com/files/',
  autologinTestUser: true,
  autologinTestUserCredentials: {username:'john@doe.com', password:'opensesame' },
  environmentBadgeLabel: "exm",
  environmentBadgeDisplay: true
  // or dev
  //baseUrl: 'http://localhost:8081'

};

