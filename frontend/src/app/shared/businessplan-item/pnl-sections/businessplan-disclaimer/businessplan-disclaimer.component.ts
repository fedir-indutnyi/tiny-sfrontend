import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { glossaryDataDescription } from "./glossary-models";
import { CommonModule } from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-businessplan-disclaimer',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './businessplan-disclaimer.component.html',
  styleUrls: ['./businessplan-disclaimer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BusinessplanDisclaimerComponent implements OnInit {
  glossaryData = glossaryDataDescription;


  constructor() {}

  ngOnInit(): void {}
}
