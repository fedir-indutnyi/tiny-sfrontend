import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-expenses-modal',
  templateUrl: './expenses-modal.component.html',
  styleUrls: ['./expenses-modal.component.scss'],
})
export class ExpensesModalComponent implements OnInit {
  tranasctionType = 'Money';
  @ViewChild('input') input: ElementRef;
  totalValueofmoney = 0;
  currencyType = 'USD';
  price: number;
  amount = 1;
  uom = 'each';

  teamMembers = [];
  moneyDonated = false;

  distance = 0;

  vendor: string;

  description: string;

  mielageUom = 'km';
  milegaeConsumption = 0;

  carName = '';
  mileageMoney: any;
  mileageDonation = false;
  pricePerLiterOrWatt = 0;
  priceOfEnergy: number;
  uomOfEnergy = 'liter';
  daysselected: number;
  starttime: any;
  endtime: any;
  hours: any;
  totalHours: any;
  hourlyRate: number;
  //totalEnergy ;
  eneryUom = 'kW';
  enerySupplier = '';
  //thingAmount = 1;
  //thingUom = "each";
  //totalThingAmount;
  estimatedThingValue;
  cryptoAmount;
  cryptoUom;
  cryptoSupplier;
  cryptoTotal;
  totalDonation;
  crpytoConversionPrice;

  constructor(
    private diloagRef: MatDialogRef<ExpensesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any = {}) {
  }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser'));

    // console.log(this.data);

    if (user) {
      const obj = {
        userid: user.id,
        username: user.username,
        displayas: user.username,
        email: user.username,
      };
      this.teamMembers.push(obj);
      const newUser = JSON.parse(user.personalcontacts);
      newUser.forEach((element) => {
        const obj = {
          userid: element.userid,
          username: element.username,
          displayas: element.displayas,
          email: element.email,
        };
        this.teamMembers.push(obj);
      });
    } else {
      this.teamMembers = [];
    }

    if (this.data.currency) {
      this.currencyType = this.data.currency;
    }

    if (this.data.description) {
      this.description = this.data.description;
    }

    if (this.data.valueofmoney) {
      this.totalValueofmoney = this.data.valueofmoney;
    }

    if (this.data.uom) {
      this.uom = this.data.uom;
    }

    if (this.data.quantity) {
      this.amount = this.data.quantity;
    }

    if (this.data.itemtovalue) {
      const data = JSON.parse(this.data.itemtovalue);

      if (data.transactiontype) {
        this.tranasctionType = data.transactiontype;
      } else {
        this.tranasctionType = 'Money';
      }

      if (data.value) {
        this.totalValueofmoney = data.value;
      } else {
        this.totalValueofmoney = 0;
      }

      if (data.currency) {
        this.currencyType = data.currency;
      } else {
        this.currencyType = 'USD';
      }

      if (data.amount) {
        this.amount = data.amount;
      }

      if (data.uom) {
        this.uom = data.uom;
      }

      if (data.price) {
        this.price = data.price - +this.uom;
      }
    }
  }

  onTabChanged(title) {
    this.tranasctionType = title;
  }

  closeDialog() {
    this.diloagRef.close();
  }

  onContactSelect(event) {
    this.vendor = event.value;
  }

  submit() {
    let id = 0; //didnt understand this block
    if (this.totalValueofmoney) {
      id = 1;
    } else {
      id = 0;
    }
    let itemtovalue: any = {
      transactiontype: this.tranasctionType,
      value: this.totalValueofmoney,
      currency: this.currencyType,
      amount: this.amount,
      uom: this.uom,
      price: this.price + this.uom,
      donatedforever: id, //hm, strange
    };
    itemtovalue = JSON.stringify(itemtovalue);
    const obj = {
      valueofmoney: this.totalValueofmoney,
      currency: this.currencyType,
      uom: this.uom,
      quantity: this.amount,
      vendorid: 0,
      itemtovalue,
      vendorname: this.vendor,
      isdonation: true,
      description: this.description,
    };

    this.diloagRef.close(obj);
  }

  onHoursSubmit() {
    let id = 0;
    if (this.mileageDonation) {
      id = 1;
    } else {
      id = 0;
    }
    let itemtovalue: any = {
      transactiontype: this.tranasctionType.toLocaleLowerCase(),
      startdatetime: this.starttime,
      enddatetime: this.endtime,
      hours: this.totalHours,
      hourlyrate: this.hourlyRate + 'USD/hh',
      donatedforever: id,
    };
    // console.log(itemtovalue);

    itemtovalue = JSON.stringify(itemtovalue);
    const obj = {
      valueofmoney: this.totalHours,
      currency: this.currencyType,
      uom: 'hh',
      quantity: Number(this.hours),
      itemtovalue,
      isdonation: true,
    };

    // this.diloagRef.close(obj);
  }

  // onEnergySubmit() {
  //   let id = 0;
  //   if (this.mileageDonation) {
  //     id = 1;
  //   } else {
  //     id = 0;
  //   }
  //   let itemtovalue: any = {
  //     transactiontype: this.tranasctionType.toLocaleLowerCase(),
  //     value: this.totalEnergy,
  //     uom: this.eneryUom,
  //     amount: this.amount,
  //     price: this.price + this.eneryUom + "/" + this.currencyType,
  //     currency: this.currencyType,
  //     donatedforever: id,
  //   };
  //   itemtovalue = JSON.stringify(itemtovalue);
  //   const obj = {
  //     valueofmoney: this.totalEnergy,
  //     currency: this.currencyType,
  //     uom: this.eneryUom,
  //     quantity: this.amount,
  //     vendorid: 0,
  //     itemtovalue,
  //     vendorname: this.enerySupplier,
  //     isdonation: true,
  //   };
  //   this.diloagRef.close(obj);
  // }

  // onThingSubmit() {
  //   let id = 0;
  //   if (!this.mileageDonation) {
  //     id = 1;
  //   } else {
  //     id = 0;
  //   }
  //   let itemtovalue: any = {
  //     transactiontype: this.tranasctionType.toLocaleLowerCase(),
  //     value: this.estimatedThingValue,
  //     uom: this.thingUom,
  //     amount: this.thingAmount,
  //     estimatedpricevalue: this.totalThingAmount + "USD/kW",
  //     currency: this.currencyType,
  //     donatedforever: id,
  //   };
  //   itemtovalue = JSON.stringify(itemtovalue);
  //   const obj = {
  //     valueofmoney: this.estimatedThingValue,
  //     currency: this.currencyType,
  //     uom: this.thingUom,
  //     quantity: this.thingAmount,
  //     vendorid: 0,
  //     itemtovalue,
  //     vendorname: this.vendor,
  //     isdonation: true,
  //   };
  //   this.diloagRef.close(obj);
  // }

  // onCryptoSubmit() {
  //   let id = 0;
  //   if (this.mileageDonation) {
  //     id = 1;
  //   } else {
  //     id = 0;
  //   }
  //   let itemtovalue: any = {
  //     transactiontype: this.tranasctionType.toLocaleLowerCase(),
  //     value: this.cryptoTotal,
  //     uom: this.cryptoUom,
  //     amount: this.cryptoAmount,
  //     price:
  //       this.crpytoConversionPrice + `${this.currencyType}/${this.cryptoUom}`,
  //     currency: this.currencyType,
  //     donatedforever: id,
  //   };
  //   itemtovalue = JSON.stringify(itemtovalue);
  //   const obj = {
  //     valueofmoney: Number(this.cryptoTotal),
  //     currency: this.currencyType,
  //     uom: this.cryptoUom,
  //     quantity: this.cryptoAmount,
  //     vendorid: 0,
  //     itemtovalue,
  //     vendorname: this.cryptoSupplier,
  //     isdonation: true,
  //   };
  //   this.diloagRef.close(obj);
  // }

  // onDonationSumbit() {
  //   let id = 0;
  //   if (this.mileageDonation) {
  //     id = 1;
  //   } else {
  //     id = 0;
  //   }
  //   let itemtovalue: any = {
  //     transactiontype: this.tranasctionType.toLocaleLowerCase(),
  //     value: this.totalDonation,
  //     currency: this.currencyType,
  //     donatedforever: id,
  //   };
  //   itemtovalue = JSON.stringify(itemtovalue);
  //   const obj = {
  //     valueofmoney: this.totalDonation,
  //     currency: this.currencyType,
  //     uom: "",
  //     quantity: 0,
  //     vendorid: 0,
  //     itemtovalue,
  //     vendorname: this.vendor,
  //     isdonation: true,
  //     description:this.description
  //   };
  //   this.diloagRef.close(obj);
  // }
  onDateChange() {
    let date = this.input.nativeElement.value.split(',');
    let newdate: Date = date[0];
    newdate = new Date(newdate);
    date[1] = date[1].slice(0, 6);
    const a = date[1].split(':');
    const minutes = +a[0] * 60 + +a[1];
    this.endtime = new Date(newdate.getTime() + minutes * 60000);
  }

  onStartDateChange() {
    let date = this.input.nativeElement.value.split(',');
    let newdate: any = date[0];
    newdate = new Date(newdate);
    const a = date[1]?.split(':');
    const minutes = +a[0] * 60 + +a[1];
    this.starttime = new Date(newdate.getTime() + minutes * 60000);
  }
}
