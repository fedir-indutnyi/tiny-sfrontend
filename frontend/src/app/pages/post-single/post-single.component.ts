import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, Validators} from "@angular/forms";
import {map} from "rxjs/operators";
import {NzModalService} from "ng-zorro-antd/modal";
import {NzMessageService} from "ng-zorro-antd/message";
import {throwError} from "rxjs";

import {
    CommentsControllerService,
    CommentsWithRelations,
    IdeastartuplistControllerService,
    IdeastartuplistWithRelations,
    PnldataControllerService,
    UserteamrelationWithRelations,
} from '@shared/sdk';
import {convertPlaceholderPathToUrl} from "@app/utils/dynamic-path";
import {BusinessplanService} from "@businessplan-item/businessplan.service";
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { AccountService } from '@app/shared/account/account.service';

@Component({
    selector: 'app-idea-comments',
    templateUrl: 'post-single.component.html',
    styleUrls: ['post-single.component.scss'],
})
export class PostSingleComponent implements OnInit {
    protected readonly convertPlaceholderPathToUrl = convertPlaceholderPathToUrl;
    comments: CommentsWithRelations[];
    ideaId: string;
    currentUserId: string;
    commenttext: FormControl<string> = new FormControl('', [Validators.required]);
    noAvatar: string = 'assets/images/no-avatar.png';
    post: IdeastartuplistWithRelations;
    businessPlans: IdeastartuplistWithRelations[] | null;
    teams: UserteamrelationWithRelations[];
    isAccess: boolean = false;
    isPnlDataPost: boolean = false;
    isPnlDataGet: boolean = false;
    isNeedCalculate: boolean | null;
    isLocalDraft: boolean;
    c: CommentsWithRelations
    isUploadModalVisible = false;
    planDownloadUrl: string = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private commentsService: CommentsControllerService,
        private ideaService: IdeastartuplistControllerService,
        private modal: NzModalService,
        private messagesService: NzMessageService,
        private businessplanService: BusinessplanService,
        private pnlDataService: PnldataControllerService,
        private serviceIdea: IdeastartuplistControllerService,
        private userService: AccountService
    ) {
        this.ideaId = this.route.snapshot.paramMap.get('postId') || this.route.snapshot.paramMap.get('businessPlanId');
    };

    ngOnInit(): void {
        this.getData();
        this.isLocalDraft = !!this.businessplanService.getLocalDraftById(this.post.id);
    };

    getData(): void {
        this.route.data.pipe(
            map(value => value['data'] as any))
            .subscribe(value => {
                if (value) {
                    this.post = value['post'];
                    this.businessPlans = value['businessPlans'];
                    this.isAccess = value['isAccess'];
                    this.currentUserId = value['currentUserId'];
                }
                this.checkIsNeedCalculate();
                this.getComments();
            })
    };

    getComments(): void {
        this.commentsService.commentsControllerFind(
            JSON.stringify({
                include: ['userprofile'],
                order: 'id DESC',
                limit: 1000,
                skip: 0,
                where: {
                    ideaid: this.ideaId,
                }
            }) as any
        ).subscribe({
            next: (resp) => {
                this.comments = resp;
            }, error: err => console.log(err)
        });
    };

    saveComment(e): void {
        e.preventDefault()
        const commentObj = {
            commenttext: this.commenttext.value || null,
            ideaid: +this.ideaId,
            userprofileId: +this.currentUserId,
        };
        this.commentsService.commentsControllerCreate(commentObj).subscribe({
            next: () => {
                this.commenttext.setValue('');
                this.getComments();
                console.log('Comment added');
            },
            error: err => console.log(err)
        });
    };

    onReply(commentData: CommentsWithRelations): void {
        this.commenttext.setValue(
            `Reply to ${commentData.userprofile.username},\n${commentData?.createdAt?.split('.')[0].split('T').join(' ')} ✉\n`
        );
        const element = document.getElementById('textarea');
        if (element) {
            element.scrollIntoView({behavior: "smooth", block: "center"})
        }
    };

    onDeleteComment(id: number): void {
        this.commentsService.commentsControllerUpdateById(id, {isdeleted: 1}).subscribe({
            next: () => {
                this.comments = this.comments.map(value => {
                    return value.id === id ? {...value, isdeleted: 1} : value;
                });
                console.log('Comment deleted');
            },
            error: err => console.log(err)
        });
    };

    goToPlan(id: number): void {
        this.router.navigate([`/business-plan/${id}`])
    };

    deletePost(): void {
        this.modal.warning({
            nzTitle: '<b>Do you really want to delete this post?</b>',
            nzContent: 'After removing this post you will not be able to recover it back.',
            nzOkText: 'Yes',
            nzCancelText: 'No',
            nzOkType: 'primary',
            nzOnOk: () => {
                this.ideaService.ideastartuplistControllerUpdateById(this.post.id, {isdeleted: 1}).subscribe({
                    next: () => {
                        this.pnlDataService.pnldataControllerUpdateAll(
                            JSON.stringify({
                                and: [
                                    {ideaid: this.post.id, isdeleted: 0}
                                ],
                            }) as any,
                            {isdeleted: 3}
                        ).subscribe(
                            {
                                next: (value) => {
                                    this.router.navigate(['/my-items'])
                                    this.messagesService.success(`${this.post.recordtype.toUpperCase()} DELETED`);
                                }, error: (err) => console.error(err)
                            }
                        );

                    }, error: e => {
                        this.messagesService.error(e.error.error.message);
                        console.log(e);
                    }
                });
            }
        });
    };

    onClonePlan(businessPlan: IdeastartuplistWithRelations): void {
        this.modal.warning({
            nzTitle: '<b>Do you really want to clone this Business Plan?</b>',
            nzContent: 'Business Plan has been cloned with title:<br>' + businessPlan.ideatitle + '(clone)',
            nzOkText: 'Yes',
            nzCancelText: 'No',
            nzOkType: 'primary',
            nzOnOk: () => {
                const keysForDelete = ['id', 'createdAt', 'updatedAt', 'create', 'createdByProfile', 'comments']

                Object.keys(businessPlan).forEach((key) => {
                    if (businessPlan[key] === null || keysForDelete.includes(key)) {
                        delete businessPlan[key];
                    }
                });

                const clone = {
                    ...businessPlan,
                    ideatitle: businessPlan.ideatitle + '(clone)',
                    createdbyid: +this.currentUserId,
                };
                delete clone.id && clone.createdAt && clone.updatedAt && clone.comments;
                this.ideaService.ideastartuplistControllerCreate(clone).subscribe({
                    next: () => {
                        this.messagesService.success(`Business Plan has been cloned with title: ${businessPlan.ideatitle + '(clone)'}`)
                        this.router.navigate([`/post/${this.post.parentcode}`])
                    }, error: (e) => {
                        this.messagesService.error(e.error.error.message)
                        console.log(e);
                    }
                });
            }
        })
    };

    onPlanCreate(): void {
        this.router.navigate(['/create-businessplan'], {
            queryParams: {
                postId: this.post.id,
                postName: this.post.ideatitle
            }
        });
    };

    goBack(): void {
        window.history.back();
    };

    onPnlDataPost(): void {
        this.isPnlDataPost = true;
    };

    onPnlDataGet(): void {
        this.isPnlDataGet = true;
    };

    checkIsNeedCalculate(): void {
        this.isNeedCalculate = this.post.ideabusinessplansetup_draft === null ? null : this.post.ideabusinessplansetup_draft !== this.post.ideabusinessplansetup;
    };

    nzOnCancel(): void {
        this.isPnlDataPost = false;
        this.isPnlDataGet = false;
        location.reload();
    };

    onDiscardDraft(): void {
        this.ideaService.ideastartuplistControllerUpdateById(
            this.post.id,
            {
                ideabusinessplansetup_draft: this.post.ideabusinessplansetup,
            }
        ).subscribe({
            next: (value) => {
                location.reload();
            }, error: (err) => {
                throwError(err);
            }
        });
    };

    formatStringDate(date: string): string{
        return date.slice(0, -5).replace("T", " at ")
    }

    showUploadModal(): void {
      this.isUploadModalVisible = true;
    }

    downloadPlan(): void {
        let planFile = new Blob([JSON.stringify(this.post)], {type: 'text/json'});
        this.planDownloadUrl = window.URL.createObjectURL(planFile);
        const virtualDownloadLink = document.createElement("a");
        virtualDownloadLink.href = this.planDownloadUrl;
        virtualDownloadLink.download = this.post.ideatitle + "-business-plan.json"; 
        virtualDownloadLink.click();
    }

    handleUploadOk(): void {
      this.isUploadModalVisible = false;
    }

    handleUploadCancel(): void {
      this.isUploadModalVisible = false;
    }

    handleFileUpload( { file, fileList }: NzUploadChangeParam ): void { 
        const status = file.status;
        if (status !== 'uploading') {
          console.log(file);
          file.originFileObj.text().then((text) => {
            let ideaPostUploaded: IdeastartuplistWithRelations = this.preparePostForCreation(JSON.parse(text))
            this.serviceIdea.ideastartuplistControllerCreate(ideaPostUploaded).subscribe({
                next: (value) => {
                    this.messagesService.success(`${file.name} file uploaded successfully.`);
                    this.router.navigate([`/edit-businessplan/${value.id}`])
                }, error: (e) => {
                    this.messagesService.error("There is an error in the JSON file")
                    console.warn(e);
                },
            });
        })
        }
    }

    preparePostForCreation(idea: IdeastartuplistWithRelations): IdeastartuplistWithRelations {
        return {
            recordtype: idea.recordtype,
            ideatitle: idea.ideatitle,
            location: idea.location,
            ideadescription: idea.ideadescription,
            image: idea.image,
            ispublic: idea.ispublic,
            commentsDisabled: idea.commentsDisabled,
            settingsIndustry: idea.settingsIndustry,
            settingsCategory: idea.settingsCategory,
            createdbyid: this.userService.currentUserValue.id,
            parentcode: +this.ideaId,
            ideabusinessplansetup_draft: idea.ideabusinessplansetup_draft
        }
    }
}

