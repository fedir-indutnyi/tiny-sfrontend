import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { IBusinessplanRootObject } from '@app/interfaces';
import { IdeastartuplistWithRelations } from '@app/shared/sdk';
import { IdeastartuplistControllerService } from '@app/shared/sdk/api/ideastartuplistController.service';
import {NzCardModule} from "ng-zorro-antd/card";
import {TranslateModule} from "@ngx-translate/core";
import { PlateComponent } from '../plate/plate.component';
import { AnaliticsTableRow } from './analitics-table.interface';


@Component({
  selector: 'app-main-assumptions',
  standalone: true,
  imports: [NzCardModule, TranslateModule, PlateComponent],
  templateUrl: './main-assumptions.component.html',
  styleUrl: './main-assumptions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MainAssumptionsComponent implements OnInit {
  @Input() ideaId: number;
  public plan: IBusinessplanRootObject;

  public portfolioTableHeaders = ["Brand", "Cost", "Price", "UOM", "Total Units", "Customers", "	Orders/ Month Per Customer"];
  public portfolioTableData: AnaliticsTableRow[];
  
  public seasonalityTableHeaders = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  public seasonalityTableData: AnaliticsTableRow[];

  public headcountTableHeaders =  ["Number Of People", "Beginning MonthNmb", "Ending MonthNmb", "Monthly Net Salary", "Average months of service"];
  public headcountTableData: AnaliticsTableRow[];

  public discountTableHeaders =  ["Static Monthly Number", "+ Percent Of Gross Sales", "Start Month", "End Month"];
  public discountTableData: AnaliticsTableRow[];

  public otherCogsTableHeaders =  ["Static Monthly Number", "Percentage", "Vendor", "Start Month", "End Month"];
  public otherCogsTableData: AnaliticsTableRow[];

  public investmentsTableHeaders =  ["Total Value Price", "Amortisation / Depreciation, Months", "Start Month", "End Month"];
  public investmentsTableData: AnaliticsTableRow[];

  public marketingTableHeaders =  ["Static Monthly Number", "Percentage", "Vendor", "Start Month", "End Month"];
  public marketingTableData: AnaliticsTableRow[];

  public operatingExpencesTableHeaders =  ["Static Monthly Number", "Percentage", "Vendor", "Start Month", "End Month"];
  public operatingExpencesTableData: AnaliticsTableRow[];
  
  public rndTableHeaders =  ["Static Monthly Number", "Percentage", "Vendor", "Start Month", "End Month"];
  public rndTableData: AnaliticsTableRow[];

  public otherIncomeAndLossTableHeaders =  ["Static Monthly Number", "Percentage", "Vendor", "Start Month", "End Month"];
  public otherIncomeAndLossTableData: AnaliticsTableRow[];

  constructor(private ideaService: IdeastartuplistControllerService, 
    private cdr: ChangeDetectorRef){
  }

  ngOnInit(): void {
    this.ideaService.ideastartuplistControllerFindById(this.ideaId).subscribe((idea) => {
      this.plan = JSON.parse(idea.ideabusinessplansetup);
      this.portfolioTableData = this.generatePortfolioAnalitics();
      this.seasonalityTableData = this.generateSeasonalityAnalitics();
      this.headcountTableData = this.generateHeadcountAnalitics();
      this.discountTableData = this.generateDiscountAnalitics();
      this.otherCogsTableData = this.generateOtherCogsAnalitics();
      this.investmentsTableData = this.generateInvestmentsAnalitics();
      this.marketingTableData = this.generateMarketingAnalitics();
      this.operatingExpencesTableData = this.generateOperatingExpencesAnalitics();
      this.rndTableData = this.generateRndAnalitics();
      this.otherIncomeAndLossTableData = this.generateOtherIncomeAndLossAnalitics();
      this.cdr.detectChanges();
    })
  }


  generatePortfolioAnalitics(): AnaliticsTableRow[] {
    let tableData: AnaliticsTableRow[] = [];
    this.plan.portfolio.productsServices.forEach((product, index) => {
      if(index == 0) {
        return;
      }
      let row = [];
      row.push(product.brand);
      row.push(product.cost);
      row.push(product.price);
      row.push(product.UOM);
      row.push(product.totalUnits);
      row.push(product.customers);
      row.push(product.ordersMonthPerCustomer);
      tableData.push({title: product.name.split("##")[1], values: row});
    });
    return tableData;
  }

  generateSeasonalityAnalitics(): AnaliticsTableRow[] {
    let tableData: AnaliticsTableRow[] = [];
    this.plan.seasonality.forEach((season: any, index) => {
      let row = [];
      season.seasonalityIndex.forEach((value) => {
        row.push(value * 1.0);
      });
      tableData.push({title: season.name.split("##")[1], values: row});
    });
    return tableData;
  }

  generateHeadcountAnalitics(): AnaliticsTableRow[] {
    let tableData: AnaliticsTableRow[] = [];
    this.plan.headcountAndPayroll.headcount.forEach((head) => {
      let row = [];
      row.push(head.numOfPeople);
      row.push(head.beginningMonth);
      row.push(head.endingMonth);
      row.push(head.netSalary);
      row.push(head.monthOfService);
      tableData.push({title: head.jobTitle, values: row});
    });
    return tableData;
  }

  generateDiscountAnalitics(): AnaliticsTableRow[] {
    let tableData: AnaliticsTableRow[] = [];
    this.plan.discountsAndReturns.forEach((discount, index) => {
      let row = [];
      row.push(discount.staticMonthlyNumber);
      row.push(discount.percentage);
      row.push(discount.startMonth);
      row.push(discount.endMonth);
      tableData.push({title: discount.description, values: row});
      
    });
    return tableData;
  }

  generateOtherCogsAnalitics(): AnaliticsTableRow[] {
    let tableData: AnaliticsTableRow[] = [];
    this.plan.cogs.forEach((cog) => {
      let row = [];
      row.push(cog.staticMonthlyNumber);
      row.push(cog.percentage);
      row.push(cog.vendor);
      row.push(cog.startMonth);
      row.push(cog.endMonth);
      tableData.push({title: cog.description, values: row});
      
    });
    return tableData;
  }

  generateInvestmentsAnalitics(): AnaliticsTableRow[] {
    let tableData: AnaliticsTableRow[] = [];
    this.plan.investmentAndCapex.forEach((investment) => {
      let row = [];
      row.push(investment.totalValuePrice);
      row.push(investment.depreciationMonths);
      row.push(investment.startMonth);
      row.push(investment.endMonth);
      tableData.push({title: investment.description, values: row});
    });
    return tableData;
  }

  generateMarketingAnalitics(): AnaliticsTableRow[] {
    let tableData: AnaliticsTableRow[] = [];
    this.plan.marketing.forEach((marketing) => {
      let row = [];
      row.push(marketing.staticMonthlyNumber);
      row.push(marketing.percentage);
      row.push(marketing.vendor);
      row.push(marketing.startMonth);
      row.push(marketing.endMonth);
      tableData.push({title: marketing.description, values: row});
      
    });
    return tableData;
  }

  generateOperatingExpencesAnalitics(): AnaliticsTableRow[] {
    let tableData: AnaliticsTableRow[] = [];
    this.plan.opex.forEach((opex) => {
      let row = [];
      row.push(opex.staticMonthlyNumber);
      row.push(opex.percentage);
      row.push(opex.vendor);
      row.push(opex.startMonth);
      row.push(opex.endMonth);
      tableData.push({title: opex.description, values: row});
      
    });
    return tableData;
  }

  generateRndAnalitics(): AnaliticsTableRow[] {
    let tableData: AnaliticsTableRow[] = [];
    this.plan.rnd.forEach((rnd) => {
      let row = [];
      row.push(rnd.staticMonthlyNumber);
      row.push(rnd.percentage);
      row.push(rnd.vendor);
      row.push(rnd.startMonth);
      row.push(rnd.endMonth);
      tableData.push({title: rnd.description, values: row});
      
    });
    return tableData;
  }

  generateOtherIncomeAndLossAnalitics(): AnaliticsTableRow[] {
    let tableData: AnaliticsTableRow[] = [];
    this.plan.otherOperatingIncomeLoss.forEach((otherOperatingIncomeLoss) => {
      let row = [];
      row.push(otherOperatingIncomeLoss.staticMonthlyNumber);
      row.push(otherOperatingIncomeLoss.percentage);
      row.push(otherOperatingIncomeLoss.vendor);
      row.push(otherOperatingIncomeLoss.startMonth);
      row.push(otherOperatingIncomeLoss.endMonth);
      tableData.push({title: otherOperatingIncomeLoss.description, values: row});
      
    });
    return tableData;
  }

}
