import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Router} from "@angular/router";

import {Configuration} from '../sdk';
import {InlineResponse2001, UserControllerService, UserWithRelations as UserProfile} from '../sdk/';
import { UserSubscription } from '../models/userSubscription.model';

export type User = Partial<UserProfile & InlineResponse2001>;

@Injectable()
export class AccountService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(
        public userprofileApi: UserControllerService,
        public apiConf: Configuration,
        private router: Router,
    ) {
        const user: User = JSON.parse(localStorage.getItem('currentUser'));
        this.currentUserSubject = new BehaviorSubject<User>(user);
        this.currentUser = this.currentUserSubject.asObservable();
        if (user) this.apiConf.credentials['jwt'] = user.token;
    };

    public get currentUserValue() {
        return this.currentUserSubject.value;
    };

    public get currentUserSubscription(): UserSubscription {
        return JSON.parse(this.currentUserSubject.value.usersubscription);
    };

    public updateCurrentUser(user: User): void {
        let savedUser: User = {
            ...user,
            createdAt: user.createdAt || user.lastSuccessfulLoginAt,
            realm: user.realm || 'Untitled Hero'
        }
        localStorage.setItem('currentUser', JSON.stringify(savedUser));
        this.currentUserSubject.next(user);
    };

    public login(username: string, password: string): Observable<Promise<UserProfile>> {
        //Fedir: this is correct expected format of creadentals array. Goto ApiExplorer to see
        return this.userprofileApi.userControllerLogin({email: username, password: password})
            .pipe(map(async res => {

                const token = res.token;
                this.apiConf.credentials['jwt'] = token;

                const opts = [null, false, {httpHeaderAccept: 'text/plain'}] as any;
                const userId = await this.userprofileApi.userControllerWhoAmI(...opts).toPromise();
                const user = await this.userprofileApi.userControllerFindById(+userId).toPromise();

                if (user) {
                    const userRecord: User = {...user, token};
                    this.updateCurrentUser(userRecord);
                }
                //Fedir: this outputs returned user array (where id element is token than user element is profile returned)
                // console.log('logged user :', user);
                //Fedir: this outputs token id
                //console.log('user token :', user['id']);
                //Fedir: thisimmediately logs out user to prevent error 500 next time

                return user;
            }));
    };

    public logout(): void {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('originUser');
        delete this.apiConf.credentials['jwt'];
        this.currentUserSubject.next(null);
        this.router.navigateByUrl('/');
    };

    public register(
        email: string,
        password: string,
        username: string,
        location: string,
        picture: string,
        language_locale: string,
    ): Observable<any> {
        return this.userprofileApi.userControllerSignUp({
            email,
            password,
            username,
            location,
            picture,
            language_locale,
        }).pipe(map(
            user => user
        ));
    };
}
