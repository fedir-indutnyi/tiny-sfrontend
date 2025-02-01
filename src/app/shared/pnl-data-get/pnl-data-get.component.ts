import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';
import {NzRadioModule} from "ng-zorro-antd/radio";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzSwitchModule} from "ng-zorro-antd/switch";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzButtonModule} from "ng-zorro-antd/button";

import {
    IdeastartuplistWithRelations,
    Pnldata,
    PnldataControllerService,
    PnldataFilter1,
    PnldataWithRelations
} from "@shared/sdk";
import {ClipboardService} from "@shared/services/clipboard.service";

@Component({
    selector: 'app-pnl-data-get',
    standalone: true,
    imports: [CommonModule, NzRadioModule, FormsModule, NzSwitchModule, ReactiveFormsModule, NzButtonModule],
    templateUrl: './pnl-data-get.component.html',
    styleUrls: ['./pnl-data-get.component.scss'],
})
export class PnlDataGetComponent {
    form: FormGroup;
    isBtnDisabled: boolean = false;
    downloadErr: { err: boolean, message: string | null };
    isDone: boolean | null = null;
    pnlData: Pnldata[];

    @Input() businessPlan: IdeastartuplistWithRelations;

    constructor(private pnlService: PnldataControllerService,
                private messagesService: NzMessageService,
                private clipboardService: ClipboardService,
    ) {
        this._initForm()
    };

    _initForm(): void {
        this.form = new FormGroup({
            extensionType: new FormControl('tsv', [Validators.required]),
            decimalSeparator: new FormControl(true, [Validators.required]),
        });
        this.form.valueChanges.subscribe(() => {
            this.isBtnDisabled = false;
            this.isDone = null;
        });
    };

    onPnlData() {
        this.isDone = null;
        this.isBtnDisabled = true;

        const filter: PnldataFilter1 = {
            where: {
                and: [
                    {
                        or: [
                            {
                                isdeleted: 0
                            },
                            {
                                isdeleted: null
                            }
                        ]
                    },
                    {
                        ideaid: this.businessPlan.id
                    }
                ]
            },
            fields: {
                factdate: true,
                itemcode: true,
                ideaid: true,
                createdbyid: true,
                factvalue: true,
                currency: true,
                uom: true,
                description: true,
                pnlrow: true,
                itemname: true,
                updatedAt: true,
            },
            include: [{
                relation: "mdmPnlRowRecord",
                scope: {
                    offset: 0,
                    limit: 100,
                    skip: 0,
                    fields: {
                        level0: true,
                        level1: true,
                        level2: true,
                        level3: true,
                        level4: true,
                    }
                },

            }]
        };

        !this.pnlData ?
            this.pnlService.pnldataControllerFind(JSON.stringify(filter) as any)
                .subscribe({
                    next: (value) => {
                        this.pnlData = value
                        this.chooseExtension(value, false);
                    },
                    error: (err) => {
                        this.downloadErr = {err: true, message: err.error.error.message}
                        console.log(err)
                    },
                    complete: () => {
                        (!this.downloadErr?.err) && (this.isDone = true);
                    },
                })
            : this.chooseExtension(this.pnlData, true)
    };

    chooseExtension(value: Pnldata[], isLocalPnlData: boolean): void {
        const delimiter = this.form.get('decimalSeparator').value === true ? ',' : '.';
        switch (this.form.get('extensionType').value) {
            case 'csv':
                this.csvExt(value, delimiter)
                break;
            case 'tsv':
                this.tsvExt(value, delimiter)
                break;
            case 'xlsx':
                this.xlsxExt(value, delimiter)
                break;
            case 'clipboard':
                this.copyToClipboard(value, delimiter)
                break
            default:
                this.downloadErr = {err: true, message: 'Extension type error. Contact support'}
        }
        (!this.downloadErr?.err && isLocalPnlData) && (this.isDone = true);
    };

    csvExt(pnlJson: Pnldata[], decimalSeparator: string): void {
        try {
            pnlJson = this.replaceDelimiter(pnlJson, decimalSeparator)
            const csv = Papa.unparse(pnlJson, {delimiter: ';', quotes: true});

            const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `${this.businessPlan.ideatitle}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            this.isDone = false;
            console.log(e);
        }
    };

    tsvExt(pnlJson: Pnldata[], decimalSeparator: string): void {
        try {
            pnlJson = this.replaceDelimiter(pnlJson, decimalSeparator)
            const tsv = Papa.unparse(pnlJson, {
                header: true,
                delimiter: '\t',
            });

            const blob = new Blob([tsv], {type: 'text/plain;charset=utf-8;'});
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${this.businessPlan.ideatitle}.tsv`; // Зміна назви файлу в залежності від роздільника
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (e) {
            this.isDone = false;
            console.log(e)
        }
    };

    xlsxExt(pnlJson: Pnldata[], decimalSeparator: string = '.'): void {
        try {
            pnlJson = this.replaceDelimiter(pnlJson, decimalSeparator)
            const worksheet = XLSX.utils.json_to_sheet(pnlJson);

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
            XLSX.writeFile(workbook, `${this.businessPlan.ideatitle}.xlsx`);
        } catch (e) {
            this.isDone = false;
            console.log(e);
        }
    };

    copyToClipboard(pnlJson: Pnldata[], decimalSeparator: string): void {
        try {
            pnlJson = this.replaceDelimiter(pnlJson, decimalSeparator)
            const tsv = Papa.unparse(pnlJson, {
                header: true,
                delimiter: '\t',
                quotes: true
            });
            this.clipboardService.put(tsv);
            this.messagesService.success('The data has been successfully copied to the clipboard');
        } catch (err) {
            this.isDone = false;
            this.messagesService.error('Error copying to clipboard:', err);
        }
    };

    replaceDelimiter(pnlJson: Array<PnldataWithRelations>, decimalSeparator: string): Pnldata[] {
        return pnlJson.map((item) => {
            item.updatedAt = item?.updatedAt.split('T')[0] || '';
            item.factdate = item?.factdate.split('T')[0] || '';
            let newItem = {...item};
            Object.keys(newItem).forEach((key) => {
                if (typeof newItem[key] === 'number') {
                    let stringValue = newItem[key].toString();
                    if (decimalSeparator === ',') {
                        stringValue = stringValue.replace('.', ',');
                    } else if (decimalSeparator === '.') {
                        stringValue = stringValue.replace(',', '.');
                    }
                    newItem[key] = stringValue;
                }
            });

            newItem = {
                ...newItem,
                ...newItem.mdmPnlRowRecord
            };

            delete newItem.mdmPnlRowRecord;
            return newItem;
        });
    };
}
