import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {lastValueFrom, Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Quill} from 'quill';
import * as $ from 'jquery';
import {NzMessageService} from "ng-zorro-antd/message";
import {Store} from "@ngrx/store";

import {FilesControllerService, IdeastartuplistControllerService, IdeastartuplistWithRelations} from '@shared/sdk';
import {AccountService} from '@shared/account/account.service';
import {BusinessPlanItemActions} from '@businessplan-item/store/index';
import {BusinessplanService} from "@businessplan-item/businessplan.service";
import {convertPlaceholderPathToUrl} from '@app/utils/dynamic-path';
import {industryData} from "../../../assets/config/bussines-plan/industry";
import {initialDraft} from "../../../assets/config/bussines-plan/initialDraft";

@Component({
    selector: 'edit-post',
    templateUrl: 'edit-create-post.component.html',
    styleUrls: ['edit-create-post.component.scss']
})
export class EditCreatePostComponent {
    editor: Quill;
    idea: IdeastartuplistWithRelations;
    form: FormGroup;
    isBusinessPlan: boolean = false;
    parentcode: number;
    parenName: string;
    industryArr: Array<{
        industry: string,
        category?: Array<string>
    }> = industryData;
    categories: Array<string>;
    isCancel: boolean = false;
    convertToUrl = convertPlaceholderPathToUrl;
    private _postData$: Subscription;

    @Input() businessplanHeaderAndData = {
        businessplanHeader: [{}],
        IdeaheaderDraftBusinessPlan: {
            businessplanSetting: [{}],
            portfolio: [{}],
        },
        IdeaheaderFinalBusinessPlan: {
            businessplanSetting: [{}],
            portfolio: [{}],
        },
        PnlRowsInDatabase: {
            businessplanSetting: [{}],
            portfolio: [{}],
        },
    };

    constructor(
        private serviceIdea: IdeastartuplistControllerService,
        private account: AccountService,
        private router: Router,
        private uploadService: FilesControllerService,
        private route: ActivatedRoute,
        private messagesService: NzMessageService,
        private _store: Store,
        private businessplanService: BusinessplanService,
    ) {
        this._initForm();
    };

    ngOnInit(): void {
        $.getJSON('https://api.ipdata.co?api-key=936da9b290951b86b73241dd1384c085fd89562269ffe301e50b0a39&fields=city,country_name', function (data) {
            $('#locationInput').val(data['country_name'] + ', ' + data['city']);
        });
        this.routeType();
        this.getIdea();
        this.setParams();
    };

    getIdea(): void {
        this._postData$ = this.route.data.subscribe({
            next: ({postData}) => {
                if (!postData) return
                this.idea = {
                    ...postData,
                    ideadescription: convertPlaceholderPathToUrl(postData.ideadescription),
                } as IdeastartuplistWithRelations;
                if (this.idea?.recordtype === 'businessplan') {
                    this.isBusinessPlan = true;
                }
                this._initForm();
                this.industryArr && this.industryChange(this.idea.settingsIndustry)
                this.form.setValue(
                    {
                        recordtype: this.idea.recordtype,
                        ideatitle: this.idea.ideatitle || '',
                        location: this.idea.location || '',
                        ideadescription: this.idea.ideadescription || '',
                        image: this.idea.image || '',
                        ispublic: this.idea.ispublic || false,
                        commentsDisabled: this.idea.commentsDisabled || false,
                        settingsIndustry: this.idea.settingsIndustry || '',
                        settingsCategory: this.idea.settingsCategory || '',
                    }
                );
            },
            complete: () => {
            },
            error: (err) => console.log(err)
        });
    };

    routeType(): void {
        const url = this.router.url.split('?')[0];
        if (url === '/create-businessplan') {
            this.isBusinessPlan = true;
            this.form.get('recordtype').setValue('businessplan')
        }
    };

    _initForm(): void {
        this.form = new FormGroup({
            recordtype: new FormControl('', [Validators.required]),
            ideatitle: new FormControl('', [Validators.required, Validators.minLength(3)]),
            location: new FormControl('', [Validators.required, Validators.minLength(3)]),
            ideadescription: new FormControl('', [Validators.required, Validators.minLength(12)]),
            image: new FormControl(''),
            ispublic: new FormControl(false),
            commentsDisabled: new FormControl(true),
            settingsIndustry: new FormControl('', this.isBusinessPlan && Validators.required),
            settingsCategory: new FormControl('', this.isBusinessPlan && Validators.required),
        });
    };

    onEditorCreated(quill: Quill): void {
        const toolbar = quill.getModule('toolbar');
        toolbar.addHandler('image', this.imageHandler.bind(this));
        this.editor = quill;
    };

    imageHandler(): void {
        const Imageinput = document.createElement('input');
        Imageinput.setAttribute('type', 'file');
        Imageinput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
        Imageinput.classList.add('ql-image');
        Imageinput.addEventListener('change', async e => {
            const files = (e.target as HTMLInputElement).files;
            if (!files[0]) return;
            const data = await lastValueFrom(this.uploadService.filesControllerUpload(files[0]));
            const path = convertPlaceholderPathToUrl(data.path);
            this.pushImageToEditor(path);
        });
        Imageinput.click();
    };

    async onFileChange(e): Promise<void> {
        const input: HTMLInputElement = e.target as HTMLInputElement;
        const file: File = input.files[0];
        const data = await lastValueFrom(this.uploadService.filesControllerUpload(file));
        this.form.patchValue({image: data.path});
    };

    pushImageToEditor(imageURL: string): void {
        const selection = this.editor.getSelection(true);
        this.editor.insertEmbed(selection.index, 'image', imageURL);
        this.editor.setSelection({...selection, index: selection.index + 1});
    };

    createPost(): void {
        const post: IdeastartuplistWithRelations = {
            ...this.form.value,
            createdbyid: this.account.currentUserValue.id,
            parentcode: this.parentcode ? +this.parentcode : 0,
        };
        this.isBusinessPlan && (post.ideabusinessplansetup_draft = JSON.stringify(initialDraft))

        this.serviceIdea.ideastartuplistControllerCreate(post).subscribe({
            next: (value) => {
                this.messagesService.success(`${this.capitalize(this.form.get('recordtype').value)} has been created`)
                this.idea = value;
                this.isBusinessPlan
                    ? this.router.navigate([`/edit-businessplan/${value.id}`])
                    : this.router.navigate([`/post/${value.id}`]);
            }, error: (e) => {
                this.messagesService.error(e.error.error.message)
                console.warn(e);
            }, complete: () => {
                this.serviceIdea.ideastartuplistControllerCreate({
                    ...post,
                    isdeleted: 2,
                    revisionCode: this.idea.id.toString()
                }).subscribe();

            }
        });
    };

    savePost(): void {
        const {settingsCategory, settingsIndustry, ...rest} = this.form.value;
        const post = {
            ...rest,
            ...(this.isBusinessPlan && {settingsCategory, settingsIndustry}),
        };

        this.serviceIdea.ideastartuplistControllerUpdateById(
            this.idea.id,
            post
        ).subscribe({
            next: () => {
                this.isBusinessPlan && this._store.dispatch(BusinessPlanItemActions.saveData());
                this.messagesService.success(`${this.capitalize(this.form.get('recordtype').value)} has been edited`)
                this.isBusinessPlan
                    ? this.router.navigate([`/business-plan/${this.idea.id}`])
                    : this.router.navigate([`/post/${this.idea.id}`]);
            }, error: (e) => {
                this.messagesService.error(e.error.error.message)
                console.warn(e);
            }, complete: () => {
                const draft = this.businessplanService.getLocalDraftById(this.idea.id)
                this.serviceIdea.ideastartuplistControllerCreate({
                    ...post,
                    isdeleted: 2,
                    createdbyid: this.account.currentUserValue.id,
                    ideabusinessplansetup_draft: (draft && this.isBusinessPlan) ? JSON.stringify(draft) : '',
                    parentcode: this.idea.parentcode,
                    revisionCode: this.idea.id.toString(),
                }).subscribe();
            }
        });
    };

    setParams(): void {
        this.route.queryParams.subscribe(params => {
            if (params['postId']) this.parentcode = params['postId']
            if (params['postName']) this.parenName = params['postName']
        });
    };

    nzTitle(): string {
        if (this.idea) return 'Edit category';
        if (this.isBusinessPlan) return `Create Business Plan for ${this.parenName}`
        else return 'Create category';
    };

    capitalize(value: string): string {
        return value.charAt(0).toUpperCase() + value.slice(1);
    };

    onRemoveImage(): void {
        this.form.patchValue({image: ''});
    };

    addIndustry(input: HTMLInputElement): void {
        this.form.get('settingsCategory').setValue('')
        this.industryArr.unshift({industry: input.value})
    };

    addCategory(input: HTMLInputElement): void {
        this.categories.unshift(input.value)
    };

    industryChange(industry: string): void {
        this.form.get('settingsCategory').setValue('')
        this.categories = this.industryArr.find(value => value.industry === industry)?.category || [];
    };

    onCancel():void {
        this.isBusinessPlan
            ? this.router.navigate([`/business-plan/${this.idea.id}`])
            : this.router.navigate([`/post/${this.idea.id}`]);
    }
}


