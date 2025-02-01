import {RouterModule, Routes} from '@angular/router';

import {PagesComponent} from './pages.component';
import {SignUpComponent} from './sign-up/sign-up.component';
import {LoginComponent} from './login';
import {AddIdeaUnregisteredComponent} from './add-ideaunregistered/add-ideaunregistered.component';
import {AuthGuard} from '@shared/auth-guard/auth-guard';
import {ResetPasswordComponent} from './reset-password';
import {NotFoundPageComponent} from './not-found-page/not-found-page.component';
import {AdminToolsResolver, PostSingleResolver} from "@shared/services";
import {ViewAnalyticsComponent} from "@app/pages/view-analytics/view-analytics.component";


export const childRoutes: Routes = [
    {
        path: '',
        redirectTo: 'all-publicideas',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'sign-up',
        component: SignUpComponent
    },
    {
        path: 'reset-password',
        component: ResetPasswordComponent
    },
    {
        path: 'add-ideaunregistered',
        component: AddIdeaUnregisteredComponent
    },
    {
        path: '',
        component: PagesComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'profile',
                loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
                pathMatch: 'full'
            },
            {
                path: 'all-publicideas',
                loadChildren: () => import('./all-publicideas/all-publicideas.module').then(m => m.AllPublicideasModule),
                pathMatch: 'full'
            },
            {
                path: 'startups',
                loadChildren: () => import('./startups/startups.module').then(m => m.StartupsModule),
                pathMatch: 'full'
            },
            {
                path: 'my-items',
                loadChildren: () => import('./my-items/my-items.module').then(m => m.MyItemsModule),
                pathMatch: 'full'
            },
            {
                path: 'post/:postId',
                loadChildren: () => import('@app/pages/post-single/post-single.module').then(m => m.PostSingleModule),
                pathMatch: 'full',
                resolve: {data: PostSingleResolver},
            },
            {
                path: 'business-plan/:businessPlanId',
                loadChildren: () => import('@app/pages/post-single/post-single.module').then(m => m.PostSingleModule),
                pathMatch: 'full',
                resolve: {data: PostSingleResolver},
            },
            {
                path: 'my-expenses',
                loadChildren: () => import('./my-expenses/my-expenses.module').then(m => m.MyExpensesModule),
                pathMatch: 'full'
            },
            {
                path: 'edit-post/:id',
                loadChildren: () => import('./edit-create-post/edit-create-post.module').then(m => m.EditCreatePostModule),
                pathMatch: 'full'
            },
            {
                path: 'create-post',
                loadChildren: () => import('./edit-create-post/edit-create-post.module').then(m => m.EditCreatePostModule),
                pathMatch: 'full'
            },
            {
                path: 'create-businessplan',
                loadChildren: () => import('./edit-create-post/edit-create-post.module').then(m => m.EditCreatePostModule),
                pathMatch: 'full'
            },
            {
                path: 'edit-businessplan/:id',
                loadChildren: () => import('./edit-create-post/edit-create-post.module').then(m => m.EditCreatePostModule),
                pathMatch: 'full'
            },
            {
                path: 'view-analytics/:businessPlanId',
                component: ViewAnalyticsComponent,
                pathMatch: 'full'
            },
            {
                path: 'add-expense',
                loadChildren: () => import('./add-expense/add-expense.module').then(m => m.AddExpenseModule),
                pathMatch: 'full'
            },
            {
                path: 'my-teams',
                loadChildren: () => import('./my-teams/my-teams.module').then(m => m.MyTeamsModule),
                pathMatch: 'full'
            },
            {
                path: 'add-team',
                loadChildren: () => import('./edit-create-team/edit-create-team.module').then(m => m.EditCreateTeamModule),
                pathMatch: 'full'
            },
            {
                path: 'edit-expense/:id',
                loadChildren: () => import('./edit-expense/edit-expense.module').then(m => m.EditExpenseModule),
                pathMatch: 'full'
            },
            {
                path: 'edit-team/:id',
                loadChildren: () => import('./edit-create-team/edit-create-team.module').then(m => m.EditCreateTeamModule),
                pathMatch: 'full'
            },
            {
                path: 'admin-tools',
                loadChildren: () => import('./admin-tools/admin-tools.module').then(m => m.AdminToolsModule),
                pathMatch: 'full',
                resolve: {
                    isAdmin: AdminToolsResolver
                }
            },
            {
                path: 'notifications',
                loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsModule),
                pathMatch: 'full',
            },
            {
                path: 'contact-us',
                loadChildren: () => import('./contact-us/contact-us.module').then(m => m.ContactUsModule),
                pathMatch: 'full'
            },
        ]
    },
    {
        path: '**',
        redirectTo: 'error404',
        pathMatch: 'full'
    },
    {
        path: 'error404',
        component: NotFoundPageComponent,
    },
];

export const routing = RouterModule.forChild(childRoutes);
