import { EnvConfiguration, EnvService } from '@app/shared/services/env.service';
import { environment } from '../../environments/environment';
import { inject } from '@angular/core';


export class EnvSettings {
    private envConfig: EnvConfiguration;
    public basePath: string = environment.baseUrl;
    public envname: string = environment.envname;
    public production: boolean = environment.production;
    public baseUrl: string = environment.baseUrl;
    public fileDynamicPlaceholder: string = environment.fileDynamicPlaceholder;
    public fileDynamicPlaceholderUrl: string = environment.fileDynamicPlaceholderUrl;
    public autologinTestUser: boolean = environment.autologinTestUser;
    public autologinTestUserCredentials: {username?: string, password?: string} = environment.autologinTestUserCredentials;


    public constructor(){
        inject(EnvService).configurationPromise.then((config) => {
            if (config){
                this.basePath = config?.baseUrl;
                this.envname = config?.envname;
                this.production = config?.production;
                this.baseUrl = config?.baseUrl;
                this.fileDynamicPlaceholder = config?.fileDynamicPlaceholder;
                this.fileDynamicPlaceholderUrl = config?.fileDynamicPlaceholderUrl;
                this.autologinTestUser = config?.autologinTestUser;
                this.autologinTestUserCredentials = config?.autologinTestUserCredentials;
            }
        });
    }

}
