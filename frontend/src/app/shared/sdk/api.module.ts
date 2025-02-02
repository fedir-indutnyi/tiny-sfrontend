import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { CommentsControllerService } from './api/commentsController.service';
import { CommentsUserControllerService } from './api/commentsUserController.service';
import { FilesControllerService } from './api/filesController.service';
import { IdeastartuplistCommentsControllerService } from './api/ideastartuplistCommentsController.service';
import { IdeastartuplistControllerService } from './api/ideastartuplistController.service';
import { IdeastartuplistUserControllerService } from './api/ideastartuplistUserController.service';
import { MdmpnlrowsControllerService } from './api/mdmpnlrowsController.service';
import { NotificationsControllerService } from './api/notificationsController.service';
import { PingControllerService } from './api/pingController.service';
import { PlantemplatesControllerService } from './api/plantemplatesController.service';
import { PnldataControllerService } from './api/pnldataController.service';
import { TrashbinControllerService } from './api/trashbinController.service';
import { UserCommentsControllerService } from './api/userCommentsController.service';
import { UserContactsControllerService } from './api/userContactsController.service';
import { UserControllerService } from './api/userController.service';
import { UserOwnTeamsControllerService } from './api/userOwnTeamsController.service';
import { UserTeamMembersControllerService } from './api/userTeamMembersController.service';
import { UserTeamsControllerService } from './api/userTeamsController.service';
import { UsercontactControllerService } from './api/usercontactController.service';
import { UserloginControllerService } from './api/userloginController.service';
import { UserteamControllerService } from './api/userteamController.service';
import { UserteamrelationControllerService } from './api/userteamrelationController.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: []
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<ApiModule> {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
