import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzFormModule} from "ng-zorro-antd/form";
import {NzCardModule} from "ng-zorro-antd/card";

import {
    ColumnWithDataLabelsComponent
} from "@shared/charts-and-graphs/charts-and-graphs-models/column-with-data-labels/column-with-data-labels.component";
import {
    LineWithDataLabelsComponent
} from "@shared/charts-and-graphs/charts-and-graphs-models/line-with-data-labels/line-with-data-labels.component";
import {SimplePieComponent} from "@shared/charts-and-graphs/charts-and-graphs-models/simple-pie/simple-pie.component";
import {PlateComponent} from "@shared/charts-and-graphs/charts-and-graphs-models/plate/plate.component";
import { MainAssumptionsComponent } from './charts-and-graphs-models/main-assumptions/main-assumptions.component';
import {Pnldata, PnldataControllerService, PnldataFilter1} from "@shared/sdk";
import * as _ from "lodash";
import {WebdatarocksPivotModule} from "@webdatarocks/ngx-webdatarocks";

@Component({
    selector: 'app-charts-and-graphs',
    standalone: true,
    imports: [CommonModule, ColumnWithDataLabelsComponent, LineWithDataLabelsComponent, SimplePieComponent, PlateComponent, NzFormModule, NzCardModule, WebdatarocksPivotModule, MainAssumptionsComponent],
    templateUrl: './charts-and-graphs.component.html',
    styleUrls: ['./charts-and-graphs.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush
})


export class ChartsAndGraphsComponent implements OnInit, AfterViewInit {
    @Input() businessPlanId: string;
    pnlData: Pnldata[];
    netSalesItems: { itemname: string, totalFactvalue: number }[] = [];
    operatingProfitEbitSum: string = '  . . .  ';
    operatingProfitEbitSumNum: number;
    totalInvestmentRequiredSum: string = '  . . .  ';
    summarizedNetSalesByPeriod: { factdate: string, totalFactvalue: number }[] = [];
    summarizedNetSalesByYear: { factdate: string, totalFactvalue: number }[] = [];
    summarizedGrossProfitByPeriod: { factdate: string, totalFactvalue: number }[] = [];
    summarizedOperatingProfitByPeriod: { factdate: string, totalFactvalue: number }[] = [];
    summarizedOperatingProfitByYear: { factdate: string, totalFactvalue: number }[] = [];
    summarizedCogsByYear: { factdate: string, totalFactvalue: number }[] = [];
    summarizedMarketingByYear: { factdate: string, totalFactvalue: number }[] = [];
    summarizedStandardOpexByYear: { factdate: string, totalFactvalue: number }[] = [];
    summarizedHeadcountAndPayrollByYear: { factdate: string, totalFactvalue: number }[] = [];
    summarizedOtherIncomeLossByYear: { factdate: string, totalFactvalue: number }[] = [];
    summarizedRndByYear: { factdate: string, totalFactvalue: number }[] = [];
    summarizedFixedAssetsDepreciationYear: { factdate: string, totalFactvalue: number }[] = [];
    summarizedOperatingProfitMarginByYear: { factdate: string, totalFactvalue: number }[] = [];
    summarizedGrossProfitByYear: { factdate: string, totalFactvalue: number }[] = [];
    summarizedVolumeByYear: { factdate: string, totalFactvalue: number }[] = [];
    summarizedGrossMarginByPeriod: { factdate: string, totalFactvalue: number }[] = [];
    summarizedGrossMarginByYear: { factdate: string, totalFactvalue: number }[] = [];
    chartOptionsColumnTitleEl1: string;
    chartOptionsColumnEl1: any;
    chartOptionsColumnTitleEl2: string;
    titleEl3: string;
    titleEl5: string;
    titleEl6: string;
    titleEl7: string;
    titleEl8: string;
    chartOptionsEl2: any;
    chartOptionsEl4: any;
    chartOptionsEl7: any;
    titleEl4: any;
    totalNetSales: number;
    totalGrossProfit: number;
    totalVolume: number;
    monthlyCustomersMaxFactValue: number;
    totalMonthlyCustomers: number;
    totalAverageCustomers: number;
    totalInvestmentAndCapex: number;
    rowDataEl5: { title: string; values: number[] }[];
    rowDataEl8: { title: string; values: number[] }[];
    yearsEl5: number[] = [];
    yearsEl8: number[] = [];
    colors = [
        "#008FFB",
        "#00E396",
        "#FEB019",
        "#FF4560",
        "#775DD0",
        "#00D9E9",
        "#FF66C3"
    ];

    gridStyle = {
        width: '33.3%',
        textAlign: 'center',

    };

    formattedNumber(number: number): string {
        return number?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }

    ////////plate////////

    // getColumnsConfig2(): { type: 'text' | 'numeric'; title: string; width?: number, minWidth?: number }[] {
    //     return [
    //         {type: 'text', title: ' ', width: 200, minWidth: 100},
    //         {type: 'numeric', title: '2024', width: 120, minWidth: 80},
    //         {type: 'numeric', title: '2025', width: 120, minWidth: 80},
    //         {type: 'numeric', title: '2026', width: 120, minWidth: 80},
    //         {type: 'numeric', title: '2027', width: 120, minWidth: 80},
    //         {type: 'numeric', title: '2028', width: 120, minWidth: 80},
    //         {type: 'numeric', title: 'Total', width: 120, minWidth: 80}
    //     ];
    // }
    //
    // setStyle2 = {
    //     'G5': 'background-color: lightblue;',
    //     'G8': 'background-color: blue; font-weight: bold;',
    // };
    //
    // generateData2() {
    //     return [
    //         ['Monthly Target Audience, Crowd, Views', 800, 1200, 1500, 1800, 2100, 0],
    //         ['Monthly Users-Visitors', 40000, 60000, 75000, 90000, 105000, 0],
    //         ['Max Monthly Customers', 15, 18, 21, 24, 27, 0],
    //         ['Sum Monthly Cheques/Customers', 18000, 22000, 26000, 30000, 35000, 0],
    //         ['Average Cheque', 30, 35, 40, 45, 50, 0],
    //         ['Monthly Existing Loyal', 8000, 10000, 12000, 14000, 16000, 0],
    //         ['Customers', 15, 18, 21, 24, 27, 0],
    //         ['Monthly New Customers', 10, 12, 15, 17, 20, 0]
    //     ].map(row => {
    //         const total = row.slice(1, -1).reduce((acc, value) => +acc + +value, 0);
    //         row[row.length - 1] = total;
    //         return row;
    //     });
    // };


    calculateColumnSum3(table: any, colIndex: number) {
        let sum = 0;
        const rows = table.getData();
        rows.forEach(row => {
            sum += +row[colIndex];
        });
        return sum;
    }

    //
    calculateTotals3(table: any) {
        // console.log(table, 666666)
        // const totalVolume = this.calculateColumnSum3(table, 1);
        // const totalRevenue = this.calculateColumnSum3(table, 2);
        // const totalGrossProfit = this.calculateColumnSum3(table, 3);
        // const averageMargin = this.calculateAverageMargin3(table, 4);
        //
        //
        // // Додаємо рядок загальних підсумків
        // table.insertRow(-1);
        // const totalRow = table.getRow(-1);
        // totalRow.setValue(0, 'Total');
        // totalRow.setValue(1, totalVolume);
        // totalRow.setValue(2, totalRevenue);
        // totalRow.setValue(3, totalGrossProfit);
        // totalRow.setValue(4, averageMargin);
    }


    calculateAverageMargin3(table: any, colIndex: number) {
        const rows = table.getData();
        let sum = 0;
        let count = 0;
        rows.forEach(row => {
            if (row[colIndex] !== undefined && row[colIndex] !== '') {
                sum += parseFloat(row[colIndex]);
                count++;
            }
        });
        return (sum / count)?.toFixed(1) + '%';
    }

    getColumnsConfig3(): { type: 'text' | 'numeric'; title: string; width?: number }[] {
        return [
            {type: 'text', title: 'ProductCategoryBrand', width: 200},
            {type: 'numeric', title: 'Volume', width: 130},
            {type: 'numeric', title: 'Net Sales Revenue', width: 130},
            {type: 'numeric', title: 'Gross Profit', width: 130},
            {type: 'numeric', title: 'Gross Margin, %', width: 130}
        ];
    }

    generateData3() {
        return [
            ['Travel', 1739, 946019, 143839, 15.2],
            ['Travel#', '', '', '', ''],
            ['Travel##Тур', 948, 900971, 142258, 15.8],
            ['Travel##Авіабілет', 790, 45049, 1581, 3.5],
            ['Accomodation', 6086, 602465, 115625, 19.2],
            ['Accomodation#', '', '', '', ''],
            ['Accomodation##Оренда житла', 6086, 602465, 115625, 19.2],
            ['Rent', 790, 39516, 7903, 20.0],
            ['Rent#', '', '', '', ''],
            ['Rent##Оренда Авто', 790, 39516, 7903, 20.0],
            ['Insurance', 26344, 263442, 26344, 10.0],
            ['Insurance#', '', '', '', ''],
            ['Insurance##Страхівка', 26344, 263442, 26344, 10.0],
            ['', '', '', '', ''],
            ['Total', 34959, 1851443, 293711, 15.9]
        ];
    }

    tableTitle3 = 'Gross Margin By Brand'


    // getColumnsConfig4(): { type: 'text' | 'numeric'; title: string; width?: number, minWidth?: number }[] {
    //     return [
    //         {type: 'text', title: ' ', width: 200, minWidth: 100},
    //         {type: 'numeric', title: '2024', width: 120, minWidth: 80},
    //         {type: 'numeric', title: '2025', width: 120, minWidth: 80},
    //         {type: 'numeric', title: '2026', width: 120, minWidth: 80},
    //         {type: 'numeric', title: '2027', width: 120, minWidth: 80},
    //         {type: 'numeric', title: '2028', width: 120, minWidth: 80},
    //         {type: 'numeric', title: 'Total', width: 120, minWidth: 80}
    //     ];
    // }
    //
    // setStyle4 = {
    //     '0*': 'text-align: left; background-color: lightblue;'
    // };
    //
    // generateData4() {
    //     return [
    //         ['Volume', 5231, 12479, 13150, 12682, 12100, 0],
    //         ['Net Sales Revenue', 539333, 1285532, 1355867, 1307855, 1355886, 0],
    //         ['Cogs, Fees', -384034, -915368, -965450, -931025, -933556, 0],
    //         ['Marketing, Advertising, Promo', -6000, -6000, -6000, -5500, -4900, 0],
    //         ['Standard Opex', -70000, -79000, -79658, -64589, -74555, 0],
    //         ['Headcount Opex', -130000, -149000, -149658, -134589, -134555, 0],
    //         ['Other Operating Income Loss', 0, 0, 0, 0, 0, 0],
    //         ['RnD & Education', 0, 0, 0, 0, 0, 0],
    //         ['EBIDTA', -52598, 142899, 136523, 168207, 169999, 0],
    //         ['Operating profit EBIT', -66286, 139215, 161255, 163586, 168965, 0],
    //         // ['Operating profit Matgin - EBIT to Net Sales, %', '12.3%', '10.8%', '11.9%', '12.3%', '12.7%', '8.9%'],
    //         ['Operating profit Matgin - EBIT to Net Sales, %', 12.3, 10.8, 11.9, 12.3, 12.7, 8.9],
    //         ['Cumulative Operating Profit', -66283, 72985, 234869, 401866, 568896, 0],
    //         ['Investments & CAPEX', -128568, -2811, -1946, -1102, -907, 0],
    //     ].map(row => {
    //         const total = row.slice(1, -1).reduce((acc, value) => +acc + +value, 0);
    //         row[row.length - 1] = total;
    //         return row;
    //     });
    // };


    getColumnsConfig5(): { type: 'text' | 'numeric'; title: string; width?: number, minWidth?: number }[] {
        return [
            {type: 'text', title: 'Product Category Brand', width: 200, minWidth: 100},
            {type: 'numeric', title: '2024', width: 120, minWidth: 80},
            {type: 'numeric', title: '2025', width: 120, minWidth: 80},
            {type: 'numeric', title: '2026', width: 120, minWidth: 80},
            {type: 'numeric', title: '2027', width: 120, minWidth: 80},
            {type: 'numeric', title: '2028', width: 120, minWidth: 80},
            {type: 'numeric', title: 'Total', width: 120, minWidth: 80}
        ];
    }

    setStyle5 = {
        '0*': 'text-align: left; background-color: lightblue;'
    };

    generateData5() {
        const data = [
            ['Negative EBIDTA', -152598, -42899, 6523, 4207, 999, 630],
            ['Office equipment', -8956, 0, 0, 0, 0, 0],
            ['Website & Mobile App Development', 9890, 0, 0, 0, 0, 0],
            ['Vehicle Purchase', -9000, -120, 0, 0, 0, 0],
            ['Safety Pillow for Investments', -6250, -142, -120, -98, -80, -52],
            ['Initial Branding', -5800, 0, 0, 0, 0, 0],
            ['Renovation', -3800, 20, 15, 9, 5, 2],
            ['Rent Deposit', -3800, 30, 25, 15, 8, 8],
            ['Equipment', -2100, 125, 55, 20, 20, 20],
            ['Legalisation', -2100, 15, 15, 15, 15, 15],
            ['Furniture', -1500, 10, 10, 8, 8, 8],
            ['Rent Deposit non Returnable', -999, 0, 0, 0, 0, 0],
            ['Initial Stock for Insurance#', 12, 12, 12, 12, 12, 11],
            ['Initial Stock for Fleet#', 12, 12, 12, 12, 12, 11],
            ['Initial Stock for Travel#', 84, 84, 84, 84, 84, 77],
        ];

        const dataWithRowTotals = data.map(row => {
            const total = row.slice(1, -1).reduce((acc, value) => +acc + +value, 0);
            row[row.length - 1] = total;
            return row;
        });

        // Додаємо рядок "Total" для підрахунку по стовпцях
        const columnTotals = ['Total'].concat(
            dataWithRowTotals[0].slice(1).map((_, colIndex) => {
                return dataWithRowTotals.reduce((sum, row) => sum + Number(row[colIndex + 1]), 0).toString();
            })
        );

        dataWithRowTotals.push(columnTotals);

        return dataWithRowTotals;
    }

    tableTitle5 = 'Investments detailed split'


//////////line/////////////////


    dates() {

        const maximumMonthlyVisitors = [
            // 2024 (Large Growth)
            [0, 150, 250, 320, 290, 330, 350, 380, 400, 430, 480, 500], // 2024
            // 2025 (Moderate Growth)
            [560, 600, 580, 550, 630, 700, 780, 830, 850, 860, 900, 920],  // 2025
            // 2026 (Moderate Growth)
            [930, 830, 730, 750, 780, 830, 850, 870, 800, 990, 1000, 1100],  // 2026
            // 2027 (Moderate Growth)
            [930, 830, 730, 750, 780, 830, 850, 870, 800, 990, 1000, 1100],  // 2027
            // 2028 (Moderate Growth)
            [930, 830, 730, 750, 780, 830, 850, 870, 800, 990, 1000, 1100],  // 2028
        ];

        const dates = [];

        let timestamp = new Date(2024, 0, 1).getTime(); // Start from January 2024
        for (let year = 0; year < 5; year++) {
            for (let month = 0; month < 12; month++) {
                dates.push([timestamp, maximumMonthlyVisitors[year][month]]);
                timestamp += 30 * 24 * 60 * 60 * 1000; // Increment by roughly one month
            }

        }
        return dates
    }


    chartOptionsTitle3 = 'Maximum Monthly Visitors/Users'
    initChartData3 = {
        series: [
            {
                name: "Monthly Visitors/Users",
                data: this.dates()
            }
        ],
        chart: {
            type: "area",
            stacked: false,
            height: 350,
            zoom: {
                type: "x",
                enabled: true,
                autoScaleYaxis: true
            },
            toolbar: {
                autoSelected: "zoom"
            }
        },
        dataLabels: {
            enabled: false
        },
        markers: {
            size: 0
        },
        title: {
            text: "Visitors/Users",
            align: "left"
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: 0.5,
                opacityTo: 0,
                stops: [0, 90, 100]
            }
        },
        yaxis: {
            labels: {},
            title: {
                text: "Monthly Visitors/Users"
            }
        },
        xaxis: {
            type: "datetime"
        },
        tooltip: {
            shared: false,
            y: {
                formatter: function (val) {
                    return (val / 1000000)?.toFixed(0);
                }
            }
        },
    }

    ////////columns////////////


    chartOptionsColumnNegativeTitle = 'Investments Required';
    chartOptionsColumnNegative = {
        series: [
            {
                name: "Investments & CAPEX",
                data: [
                    -39000,
                    -14000,
                    -13000,
                    -11000,
                    -10000,
                ]
            }
        ],
        chart: {
            type: "bar",
            height: 350
        },
        plotOptions: {
            bar: {
                colors: {
                    ranges: [
                        {
                            from: -100,
                            to: -46,
                            color: "#F15B46"
                        },
                        {
                            from: -45,
                            to: 0,
                            color: "#FEB019"
                        }
                    ]
                },
                columnWidth: "80%"
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                if (typeof val === 'number') {
                    return val?.toFixed(0); // Return the number formatted as a string
                }
                return val.toString(); // Convert any other type (string or array) to a string
            },
            offsetY: -6, // Adjust the position of the label if needed
            style: {
                fontSize: '12px',
                colors: ['#fff'] // Set label color
            }
        },
        yaxis: {
            title: {
                text: "Investments & CAPEX"
            },
            labels: {
                formatter: function (y) {
                    return y?.toFixed(0);
                }
            }
        },
        xaxis: {
            type: "category",
            categories: [
                "2024",
                "2025",
                "2026",
                "2027",
                "2028"
            ],
            labels: {
                rotate: -90
            }
        }
    };
    columnMarketingBudgetTitle = 'Marketing Spent';
    chartOptionsColumnMarketingBudget = {
        series: [
            {
                name: "Investments & CAPEX",
                data: [5300, 5300, 5300, 5200, 5000]
            }
        ],
        chart: {
            type: "bar",
            height: 350,
            toolbar: {
                show: true,
                tools: {
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
                },
                autoSelected: 'zoom'
            }
        },
        plotOptions: {
            bar: {
                colors: {
                    ranges: [
                        {
                            from: -100,
                            to: -46,
                            color: "#F15B46"
                        },
                        {
                            from: -45,
                            to: 0,
                            color: "#FEB019"
                        }
                    ]
                },
                columnWidth: "80%"
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val?.toFixed(0);
            },
            offsetY: -6,
            style: {
                fontSize: '12px',
                colors: ['#fff']
            }
        },
        yaxis: {
            title: {
                text: "Marketing Budget"
            },
            labels: {
                formatter: function (y) {
                    return y?.toFixed(0);
                }
            }
        },
        xaxis: {
            type: "category",
            categories: ["2024", "2025", "2026", "2027", "2028"],
            labels: {
                rotate: -90
            }
        }
    };


    columnExpensesByYearTitle = 'Total Expenses by Year';
    chartOptionsColumnExpensesByYear = {
        series: [
            {
                name: "Investments & CAPEX",
                data: [
                    0.59,
                    1.14,
                    1.19,
                    1.14,
                    1.15,
                ]
            }
        ],
        chart: {
            type: "bar",
            height: 350
        },
        plotOptions: {
            bar: {
                colors: {
                    ranges: [
                        {
                            from: -100,
                            to: -46,
                            color: "#F15B46"
                        },
                        {
                            from: -45,
                            to: 0,
                            color: "#FEB019"
                        }
                    ]
                },
                columnWidth: "80%"
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                if (typeof val === 'number') {
                    return val?.toFixed(2) + 'М'; // Форматування до сотих і додавання "М"
                }
                return val.toString() + 'М'; // Для інших типів
            },
            offsetY: -6,
            style: {
                fontSize: '12px',
                colors: ['#fff']
            }
        },
        yaxis: {
            title: {
                text: "Expenses (M)"
            },
            labels: {
                formatter: function (y) {
                    return y?.toFixed(2) + 'М'; // Форматування до сотих і додавання "М"
                }
            }
        },
        xaxis: {
            type: "category",
            categories: [
                "2024",
                "2025",
                "2026",
                "2027",
                "2028"
            ],
            labels: {
                rotate: -90
            }
        }
    };

    vendorTitle = 'Expenses by Vendor Name'
    chartOptionsVendor = {
        series: [
            {
                name: "Expenses",
                data: this.makeData()
            }
        ],
        chart: {
            id: "barYear",
            height: 600,
            width: "100%",
            type: "bar",
        },
        plotOptions: {
            bar: {
                distributed: true,
                horizontal: true,
                barHeight: "75%",
                dataLabels: {
                    position: "top"
                }
            }
        },
        dataLabels: {
            enabled: true,
            textAnchor: "start",
            style: {
                colors: ["#000"]
            },
            formatter: function (val, opt) {
                return opt.w.globals.series[opt.seriesIndex][opt.dataPointIndex]?.toFixed(2) + "M";
            },
            offsetX: 0,
            dropShadow: {
                enabled: true
            }
        },
        colors: this.colors,
        states: {
            normal: {
                filter: {
                    type: "desaturate"
                }
            },
            active: {
                allowMultipleDataPointsSelection: true,
                filter: {
                    type: "darken",
                    value: 1
                }
            }
        },
        tooltip: {
            x: {
                show: false
            },
            y: {
                title: {
                    formatter: function (val, opts) {
                        return opts.w.globals.labels[opts.dataPointIndex];
                    }
                }
            }
        },
        title: {
            text: "Expenses by VendorName",
            offsetX: 15
        },
        yaxis: {
            labels: {
                show: true
            }
        }
    }

    public makeData(): any {
        var dataSeries = [
            {x: "Travel##Corporate", y: 1.35},
            {x: "Travel##Mid-budget", y: 0.57},
            {x: "Travel##Low-Budget", y: 0.43},
            {x: "Insurance##Travel", y: 0.27},
            {x: "Director-Manager", y: 0.26},
            {x: "Agent Headcount", y: 0.26},
            {x: "Travel##Adventure", y: 0.18},
            {x: "Travel##Local Expenses", y: 0.11},
            {x: "Travel##Vip tours", y: 0.10},
            {x: "IT & Software", y: 0.09},
            {x: "Different partnerships", y: 0.09},
            {x: "Travel##Luxury", y: 0.07},
            {x: "Office Rent", y: 0.07},
            {x: "Miscellaneous", y: 0.05},
            {x: "Cleaning lady", y: 0.03},
            {x: "Business Trips", y: 0.02},
            {x: "Travel Costs", y: 0.02},
            {x: "Fleet##Car Rental", y: 0.02},
            {x: "Insurance Headcount", y: 0.01},
            {x: "Advertising Marketing", y: 0.01},
            {x: "Fuel, transport, taxi", y: 0.01},
            {x: "Electricity", y: 0.00},
            {x: "Facebook Marketing", y: 0.00},
            {x: "Google Marketing", y: 0.00},
            {x: "Instagram Marketing", y: 0.00},
            {x: "Other maintenance", y: 0.00},
            {x: "Water Operating", y: 0.00},
            {x: "Software licence", y: 0.00},
        ];

        return dataSeries;
    }


    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


    constructor(private pnlService: PnldataControllerService) {
    }

    ngOnInit(): void {
        this.getPnlData()
    }

    getPnlData() {
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
                        ideaid: this.businessPlanId
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

        this.pnlService.pnldataControllerFind(JSON.stringify(filter) as any)
            .subscribe({
                next: (value) => {
                    value = value.map(item => {
                        return {...item, period: item.factdate?.slice(0, 7), yearly: item.factdate?.slice(0, 4)};
                    })
                    this.pnlData = value
                },
                complete: () => this.transformPnlData(),
            })

    }

    /////////////////////////////////////////globalFilterYear
    globalFilterYear() {
        // this.pnlData.slice()
    };


    //==================================Calculation=========================================


    transformPnlData() {
        let netSalesFull = _.filter(this.pnlData, {
            mdmPnlRowRecord: {
                level3: "1111. Net Sales Revenue"
            }
        })

        let operatingProfitEbitFull = _.filter(this.pnlData, {
            mdmPnlRowRecord: {
                level0: "1. EBIT-Operating Profit"
            }
        })

        let volumeFull = _.filter(this.pnlData, {
            mdmPnlRowRecord: {
                level0: "2.Volume of Services"
            }
        })

        let totalInvestmentRequiredSum = _.filter(this.pnlData, {
            mdmPnlRowRecord: {
                level0: "4. Investment & CAPEX"
            }
        })

        let grossProfitFull = _.filter(this.pnlData, {
            mdmPnlRowRecord: {
                level2: "111.Gross Profit"
            }
        });

        let monthlyCustomersFull = _.filter(this.pnlData, {
            mdmPnlRowRecord: {
                level2: "Monthly Customers",
            },
            itemname: "Total Product"
        })

        let investmentAndCapexFull = _.filter(this.pnlData, {
            mdmPnlRowRecord: {
                level0: "4. Investment & CAPEX",
            },
        })

        let cogsFull = _.filter(this.pnlData, {
            mdmPnlRowRecord: {
                level3: "1112.Cogs & Fees",
            },
        })

        let marketingFull = _.filter(this.pnlData, {
            mdmPnlRowRecord: {
                level2: "112. Marketing",
            },
        })

        let standardOpexFull = _.filter(this.pnlData, {
            mdmPnlRowRecord: {
                level2: "123. Standard Opex",
            },
        })

        let headcountAndPayrollFull = _.filter(this.pnlData, {
            mdmPnlRowRecord: {
                level2: "124. Headcount & Payroll",
            },
        })

        let otherIncomeLossFull = _.filter(this.pnlData, {
            mdmPnlRowRecord: {
                level2: "125.Other Income & Loss",
            },
        })

        let rndFull = _.filter(this.pnlData, {
            mdmPnlRowRecord: {
                level2: "141.RnD,Education,Healthcare",
            },
        })

        let fixedAssetsDepreciationFull = _.filter(this.pnlData, {
            mdmPnlRowRecord: {
                level2: "151.Fixed Assets Depreciation",
            },
        })


        //---------------------- Profit Ebit --------------------------------
//todo need to simplify
        const operatingProfitEbit = _.sumBy(operatingProfitEbitFull, 'factvalue');
        this.operatingProfitEbitSumNum = _.sumBy(operatingProfitEbitFull, 'factvalue');
        this.operatingProfitEbitSum = operatingProfitEbit >= 1000000 ? (operatingProfitEbit / 1000000)?.toFixed(1) + 'M' :
            operatingProfitEbit >= 1000 ? (operatingProfitEbit / 1000)?.toFixed(1) + 'K' : operatingProfitEbit?.toFixed(2);


        const totalInvestmentRequired = _.sumBy(totalInvestmentRequiredSum, 'factvalue');
        this.totalInvestmentRequiredSum = totalInvestmentRequired >= 1000000 ? (totalInvestmentRequired / 1000000)?.toFixed(1) + 'M' :
            totalInvestmentRequired >= 1000 ? (totalInvestmentRequired / 1000)?.toFixed(1) + 'K' : totalInvestmentRequired?.toFixed(2);


        // const netSalesPickItemnameAndFactValue = _.map(netSalesFull, item => _.pick(item, ['itemname', 'factvalue']));
        //-----------------------NET SALES--------------------------------

        const netSalesGroupByProduct = _.groupBy(netSalesFull, 'itemname')
        this.netSalesItems = _.map(netSalesGroupByProduct, (items, product) => {
            const totalFactvalue = _.sumBy(items, 'factvalue');
            return {itemname: product, totalFactvalue};
        });
        // console.log(netSalesPickPeriodAndFactValue, 777)
        const netSalesGroupByPeriod = _.groupBy(netSalesFull, 'period')
        this.summarizedNetSalesByPeriod = _.map(netSalesGroupByPeriod, (items, date) => {
            const totalFactvalue = _.sumBy(items, 'factvalue');
            return {factdate: date, totalFactvalue};
        });

        this.totalNetSales = _.sumBy(this.summarizedNetSalesByPeriod, 'totalFactvalue')

        const netSalesGroupByYear = _.groupBy(netSalesFull, 'yearly')
        this.summarizedNetSalesByYear = _.map(netSalesGroupByYear, (items, date) => {
            const totalFactvalue = _.sumBy(items, 'factvalue');
            return {factdate: date, totalFactvalue};
        });


        //-----------------------GROSS PROFIT--------------------------------
        const grossProfitGroupByPeriod = _.groupBy(grossProfitFull, 'period')
        this.summarizedGrossProfitByPeriod = _.map(grossProfitGroupByPeriod, (items, date) => {
            const totalFactvalue = _.sumBy(items, 'factvalue');
            return {factdate: date, totalFactvalue};
        });

        this.totalGrossProfit = _.sumBy(this.summarizedGrossProfitByPeriod, 'totalFactvalue')

        const grossProfitGroupByYear = _.groupBy(grossProfitFull, 'yearly')
        this.summarizedGrossProfitByYear = _.map(grossProfitGroupByYear, (items, date) => {
            const totalFactvalue = _.sumBy(items, 'factvalue');
            return {factdate: date, totalFactvalue};
        });


        const mergedByPeriod = _.unionBy(this.summarizedGrossProfitByPeriod, this.summarizedNetSalesByPeriod, 'factdate');
        const mergedByYear = _.unionBy(this.summarizedGrossProfitByYear, this.summarizedNetSalesByYear, 'factdate');
        const mergedByYearOperatingProfitToNetSales = _.unionBy(this.summarizedOperatingProfitByYear, this.summarizedNetSalesByYear, 'factdate');

        //-----------------------GROSS MARGIN--------------------------------

        this.summarizedGrossMarginByPeriod = mergedByPeriod.map(entry => {
            const value1 = _.find(this.summarizedNetSalesByPeriod, {factdate: entry.factdate})?.totalFactvalue || 0;
            const value2 = _.find(this.summarizedGrossProfitByPeriod, {factdate: entry.factdate})?.totalFactvalue || 0;
            return {
                factdate: entry.factdate,
                totalFactvalue: value2 / value1,
            };
        });


        this.summarizedGrossMarginByYear = mergedByYear.map(entry => {
            const value1 = _.find(this.summarizedNetSalesByYear, {factdate: entry.factdate})?.totalFactvalue || 0;
            const value2 = _.find(this.summarizedGrossProfitByYear, {factdate: entry.factdate})?.totalFactvalue || 0;
            return {
                factdate: entry.factdate,
                totalFactvalue: value2 / value1,
            };
        });


        //-----------------------VOLUME--------------------------------
        this.totalVolume = _.sumBy(volumeFull, 'factvalue');
        const grossVolumeByYear = _.groupBy(volumeFull, 'yearly')
        this.summarizedVolumeByYear = _.map(grossVolumeByYear, (items, date) => {
            const totalFactvalue = _.sumBy(items, 'factvalue');
            return {factdate: date, totalFactvalue};
        });


        //-----------------------Monthly Customers--------------------------------
        const monthlyCustomersMaxPnl = _.maxBy(monthlyCustomersFull, 'factvalue') as Pnldata
        this.monthlyCustomersMaxFactValue = monthlyCustomersMaxPnl.factvalue;
        this.totalMonthlyCustomers = _.sumBy(monthlyCustomersFull, 'factvalue');
        this.totalAverageCustomers = _.meanBy(monthlyCustomersFull, 'factvalue');

        //-----------------------Monthly Customers--------------------------------
        this.totalInvestmentAndCapex = _.sumBy(investmentAndCapexFull, 'factvalue');

        //-----------------------Operating PROFIT--------------------------------
        const operatingProfitGroupByPeriod = _.groupBy(operatingProfitEbitFull, 'period')
        this.summarizedOperatingProfitByPeriod = _.map(operatingProfitGroupByPeriod, (items, date) => {
            const totalFactvalue = _.sumBy(items, 'factvalue');
            return {factdate: date, totalFactvalue};
        });

        const operatingProfitGroupByYear = _.groupBy(operatingProfitEbitFull, 'yearly')
        this.summarizedOperatingProfitByYear = _.map(operatingProfitGroupByYear, (items, date) => {
            const totalFactvalue = _.sumBy(items, 'factvalue');
            return {factdate: date, totalFactvalue};
        });


        this.summarizedOperatingProfitMarginByYear = mergedByYearOperatingProfitToNetSales.map(entry => {
            const value1 = _.find(this.summarizedOperatingProfitByYear, {factdate: entry.factdate})?.totalFactvalue || 0;
            const value2 = _.find(this.summarizedNetSalesByYear, {factdate: entry.factdate})?.totalFactvalue || 0;
            return {
                factdate: entry.factdate,
                totalFactvalue: value2 / value1,
            };
        });

        //-----------------------Cogs--------------------------------
        const cogsByYear = _.groupBy(cogsFull, 'yearly')
        this.summarizedCogsByYear = _.map(cogsByYear, (items, date) => {
            const totalFactvalue = _.sumBy(items, 'factvalue');
            return {factdate: date, totalFactvalue};
        });

        //-----------------------Marketing--------------------------------
        const marketingByYear = _.groupBy(marketingFull, 'yearly')
        this.summarizedMarketingByYear = _.map(marketingByYear, (items, date) => {
            const totalFactvalue = _.sumBy(items, 'factvalue');
            return {factdate: date, totalFactvalue};
        });
        //-----------------------StandardOpex--------------------------------

        const standardOpexByYear = _.groupBy(standardOpexFull, 'yearly')
        this.summarizedStandardOpexByYear = _.map(standardOpexByYear, (items, date) => {
            const totalFactvalue = _.sumBy(items, 'factvalue');
            return {factdate: date, totalFactvalue};
        });

        //-----------------------HeadcountAndPayroll--------------------------------

        const headcountAndPayrollByYear = _.groupBy(headcountAndPayrollFull, 'yearly')
        this.summarizedHeadcountAndPayrollByYear = _.map(headcountAndPayrollByYear, (items, date) => {
            const totalFactvalue = _.sumBy(items, 'factvalue');
            return {factdate: date, totalFactvalue};
        });

        //-----------------------OtherIncomeLossByYear--------------------------------

        const otherIncomeLossByYear = _.groupBy(otherIncomeLossFull, 'yearly')
        this.summarizedOtherIncomeLossByYear = _.map(otherIncomeLossByYear, (items, date) => {
            const totalFactvalue = _.sumBy(items, 'factvalue');
            return {factdate: date, totalFactvalue};
        });

        //-----------------------RndByYear--------------------------------

        const rndByYear = _.groupBy(rndFull, 'yearly')
        this.summarizedRndByYear = _.map(rndByYear, (items, date) => {
            const totalFactvalue = _.sumBy(items, 'factvalue');
            return {factdate: date, totalFactvalue};
        });

        //-----------------------OtherIncomeLossByYear--------------------------------

        const fixedAssetsDepreciationYear = _.groupBy(fixedAssetsDepreciationFull, 'yearly')
        this.summarizedFixedAssetsDepreciationYear = _.map(fixedAssetsDepreciationYear, (items, date) => {
            const totalFactvalue = _.sumBy(items, 'factvalue');
            return {factdate: date, totalFactvalue};
        });


        this.insertData()
    }


    insertData() {
        ////////////////////////////// El1 //////////////////////////////
        this.el1Data()

        ////////////////////////////// El2 //////////////////////////////


        this.chartOptionsColumnTitleEl2 = 'Net Sales Revenue by Product Category Brand'
        this.chartOptionsEl2 = {
            series: this.netSalesItems.map(value => value.totalFactvalue),
            chart: {
                width: 480,
                type: "pie"
            },
            labels: this.netSalesItems.map(value => value.itemname),
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: "bottom"
                        }
                    }
                }
            ]
        };
        ////////////////////////////// El3 //////////////////////////////
        this.titleEl3 = 'Main indicators'

        ////////////////////////////// El4 //////////////////////////////
        this.titleEl4 = 'Operating Profit EBIT and Cumulative Operating Profit by Year'
        const normalData = this.summarizedOperatingProfitByPeriod.map(value => parseFloat(value.totalFactvalue?.toFixed(2)));
        const cumulativeData = normalData.reduce((acc, curr, index) => {
            acc.push((acc[index - 1] || 0) + curr);
            return acc;
        }, []);
        this.chartOptionsEl4 = {
            series: [
                {
                    name: "Operating Profit EBIT",
                    data: normalData,
                },
                {
                    name: "Cumulative Operating Profit",
                    data: cumulativeData
                }
            ],
            chart: {
                height: 350,
                type: "line",
                dropShadow: {
                    enabled: true,
                    color: "#000",
                    top: 18,
                    left: 7,
                    blur: 10,
                    opacity: 0.2
                },
                toolbar: {
                    show: false
                }
            },
            colors: ["#77B6EA", "#545454"],
            stroke: {
                curve: "smooth"
            },
            title: {
                text: "Operating Profit Over Time",
                align: "left"
            },
            grid: {
                borderColor: "#e7e7e7",
                row: {
                    colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                    opacity: 0.5
                }
            },
            markers: {
                size: 1
            },
            xaxis: {
                // categories: [
                //     "Jan 2024", "Feb 2024", "Mar 2024", "Apr 2024", "May 2024", "Jun 2024", "Jul 2024", "Aug 2024", "Sep 2024", "Oct 2024", "Nov 2024", "Dec 2024",
                //     "Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025", "Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025",
                //     "Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026", "May 2026", "Jun 2026", "Jul 2026", "Aug 2026", "Sep 2026", "Oct 2026", "Nov 2026", "Dec 2026",
                //     "Jan 2027", "Feb 2027", "Mar 2027", "Apr 2027", "May 2027", "Jun 2027", "Jul 2027", "Aug 2027", "Sep 2027", "Oct 2027", "Nov 2027", "Dec 2027",
                //     "Jan 2028", "Feb 2028", "Mar 2028", "Apr 2028", "May 2028", "Jun 2028", "Jul 2028", "Aug 2028", "Sep 2028", "Oct 2028", "Nov 2028", "Dec 2028"
                // ],
                title: {
                    text: "Month"
                }
            },
            yaxis: {
                title: {
                    text: "Operating Profit"
                }
            },
            legend: {
                position: "top",
                horizontalAlign: "right",
                floating: true,
                offsetY: -25,
                offsetX: -5
            }
        };

        ////////////////////////////// El5 ////////////////////////////// plate
        //volume
        this.titleEl5 = 'Net Sales vs Operating Profit';
        this.summarizedVolumeByYear.map(value => this.yearsEl5.push(+value.factdate));
        const volumeObj: { title: string, values: number[] } = {
            title: 'Volume',
            values: this.summarizedVolumeByYear.map(value => Math.floor(value.totalFactvalue))
        };
        const netSalesObj: { title: string, values: number[] } = {
            title: 'Net Sales Revenue',
            values: this.summarizedNetSalesByYear.map(value => Math.floor(value.totalFactvalue))
        };

        const grossProfitObj: { title: string, values: number[] } = {
            title: 'Gross Profit',
            values: this.summarizedGrossProfitByYear.map(value => Math.floor(value.totalFactvalue))
        };

        const grossMarginObj: { title: string, values: number[] } = {
            title: 'Gross Margin',
            values: this.summarizedGrossMarginByYear.map(value => Number(value.totalFactvalue.toFixed(2)))
        };

        const operatingProfitEBITObj: { title: string, values: number[] } = {
            title: 'Operating Profit EBIT',
            values: this.summarizedOperatingProfitByPeriod.map(value => Number(value.totalFactvalue.toFixed(2)))
        };

        const operatingProfitMarginObj: { title: string, values: number[] } = {
            title: 'Operating Profit Margin',
            values: this.summarizedOperatingProfitMarginByYear.map(value => Number(value.totalFactvalue.toFixed(2)))
        };


        this.rowDataEl5 = [volumeObj, netSalesObj, grossProfitObj, grossMarginObj, operatingProfitEBITObj, operatingProfitMarginObj]

        ////////////////////////////// El6 ////////////////////////////// plate
        this.titleEl6 = 'Visitors to Customers conversion'
        //......
        ////////////////////////////// El6 ////////////////////////////// plate
        //...
        ////////////////////////////// El7 //////////////////////////////
        this.titleEl7 = 'Sales vs Expenses'
        const mergedByYearOperatingProfitToNetSales = _.unionBy(this.summarizedNetSalesByPeriod, this.summarizedOperatingProfitByPeriod, 'factdate');

        const expenses = mergedByYearOperatingProfitToNetSales.map(entry => {
            const value1 = _.find(this.summarizedNetSalesByPeriod, {factdate: entry.factdate})?.totalFactvalue || 0;
            const value2 = _.find(this.summarizedOperatingProfitByPeriod, {factdate: entry.factdate})?.totalFactvalue || 0;
            return {
                factdate: entry.factdate,
                totalFactvalue: value1 - value2,
            };
        });


        this.chartOptionsEl7 = {
            series: [
                {
                    name: "Net Sales Revenue",
                    data: this.summarizedNetSalesByPeriod.map(value => parseFloat(value.totalFactvalue?.toFixed(2))),
                    color: "#1E90FF"  // Синій колір для лінії
                },
                {
                    name: "Expenses (Cogs + Marketing + Standard Opex + Other Income Loss + RnD)",
                    data: expenses.map(value => parseFloat(value.totalFactvalue?.toFixed(2))),
                    color: "#FF6347"  // Червоний колір для лінії
                }
            ]
            ,

            chart: {
                height: 350,
                type: "line",
                dropShadow: {
                    enabled: true,
                    color: "#000",
                    top: 18,
                    left: 7,
                    blur: 10,
                    opacity: 0.2
                },
                toolbar: {
                    show: true,
                    tools: {
                        zoom: true,
                        zoomin: true,
                        zoomout: true,
                        pan: true,
                        reset: true
                    },
                    autoSelected: 'zoom'
                }
            },
            colors: ["#77B6EA", "#545454"],
            stroke: {
                curve: "smooth"
            },
            title: {
                text: "Operating Profit Over Time",
                align: "left"
            },
            grid: {
                borderColor: "#e7e7e7",
                row: {
                    colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                    opacity: 0.5
                }
            },
            markers: {
                size: 1
            },
            xaxis: {
                categories: expenses.map(value => value.factdate),
                title: {
                    text: "Month"
                }
            },
            yaxis: {
                title: {
                    text: "Net Sales Revenue"
                }
            },
            legend: {
                position: "top",
                horizontalAlign: "right",
                floating: true,
                offsetY: -25,
                offsetX: -5
            }
        };

        ////////////////////////////// El8 //////////////////////////////plate
        this.titleEl8 = 'Detailed Pnl and Investments required'

        this.summarizedVolumeByYear.map(value => this.yearsEl8.push(+value.factdate));


        const cogsObj: { title: string, values: number[] } = {
            title: 'Cogs',
            values: this.summarizedCogsByYear.map(value => Number(value.totalFactvalue.toFixed(2)))
        };

        const marketingObj: { title: string, values: number[] } = {
            title: 'Marketing',
            values: this.summarizedCogsByYear.map(value => Number(value.totalFactvalue.toFixed(2)))
        };

        const standardOpexObj: { title: string, values: number[] } = {
            title: 'Standard Opex',
            values: this.summarizedStandardOpexByYear.map(value => Number(value.totalFactvalue.toFixed(2)))
        };

        const headcountAndPayrollObj: { title: string, values: number[] } = {
            title: 'Headcount And Payroll',
            values: this.summarizedHeadcountAndPayrollByYear.map(value => Number(value.totalFactvalue.toFixed(2)))
        };

        const otherIncomeLossObj: { title: string, values: number[] } = {
            title: 'Other Income Loss',
            values: this.summarizedOtherIncomeLossByYear.map(value => Number(value.totalFactvalue.toFixed(2)))
        };

        const rndObj: { title: string, values: number[] } = {
            title: 'RnD',
            values: this.summarizedRndByYear.map(value => Number(value.totalFactvalue.toFixed(2)))
        };

        const fixedAssetsDepreciationObj: { title: string, values: number[] } = {
            title: 'Fixed Assets Depreciation',
            values: this.summarizedFixedAssetsDepreciationYear.map(value => Number(value.totalFactvalue.toFixed(2)))
        };

        ///todo EBIDTA = Ebit Operating Profit - 151.Fixed Assets Depreciation
        ///todo investmant & capex by year


        this.rowDataEl8 = [volumeObj, netSalesObj, cogsObj, marketingObj, standardOpexObj, headcountAndPayrollObj, otherIncomeLossObj, rndObj, fixedAssetsDepreciationObj, operatingProfitEBITObj]


    }


    ////////////////////////////////////////////////////////////////////
    el1Data(isMonthly: boolean = false) {
        const netSales = isMonthly ? this.summarizedNetSalesByPeriod : this.summarizedNetSalesByYear;
        const grossProfit = isMonthly ? this.summarizedGrossProfitByPeriod : this.summarizedGrossProfitByYear;
        const grossMargin = isMonthly ? this.summarizedGrossMarginByPeriod : this.summarizedGrossMarginByYear;
        this.chartOptionsColumnTitleEl1 = 'Net Sales Revenue, Gross Profit and Gross Margin, % by Year'

        this.chartOptionsColumnEl1 = {
            series: [
                {
                    name: "Net Sales Revenue",
                    type: "column",
                    data: netSales.map(value => parseFloat(value.totalFactvalue?.toFixed(2)))
                },
                {
                    name: "Gross Profit",
                    type: "column",
                    data: grossProfit.map(value => parseFloat(value.totalFactvalue?.toFixed(2)))
                },
                {
                    name: "Gross Margin",
                    type: "line",
                    data: grossMargin.map(value => parseFloat(value.totalFactvalue?.toFixed(2)))
                }
            ],
            chart: {
                height: 350,
                type: "line",
                stacked: false // Вимикаємо складання колон
            },
            stroke: {
                width: [0, 0, 4] // Встановлюємо товщину для кожного типу серії
            },
            dataLabels: {
                enabledOnSeries: [0, 1], // Увімкнені мітки для стовпців
                enabled: true,
                formatter: function (val: number) {
                    return val >= 1000000 ? (val / 1000000)?.toFixed(1) + 'M' :
                        val >= 1000 ? (val / 1000)?.toFixed(1) + 'K' : val?.toFixed(2);
                }
            },
            labels: netSales.map(value => new Date(value.factdate).getTime()),
            xaxis: {
                type: "datetime"
            },
            yaxis: [
                {
                    title: {
                        text: "Net Sales Revenue"
                    },
                    max: Math.max(...netSales.map(value => value.totalFactvalue),
                        ...grossProfit.map(value => value.totalFactvalue)) * 1.2,
                    labels: {
                        formatter: (val) => val >= 1000000 ? (val / 1000000)?.toFixed(1) + 'M' :
                            val >= 1000 ? (val / 1000)?.toFixed(1) + 'K' : val?.toFixed(2)
                    }
                },
                {
                    opposite: true,
                    title: {
                        text: "Gross Profit"
                    },
                    max: Math.max(...netSales.map(value => value.totalFactvalue),
                        ...grossProfit.map(value => value.totalFactvalue)) * 1.2,
                    labels: {
                        formatter: (val) => val >= 1000000 ? (val / 1000000)?.toFixed(1) + 'M' :
                            val >= 1000 ? (val / 1000)?.toFixed(1) + 'K' : val?.toFixed(2)
                    }
                },
                {
                    opposite: true,
                    title: {
                        text: "Gross Margin (%)"
                    },
                    max: Math.max(...grossMargin.map(value => value.totalFactvalue)) * 1.2,
                    labels: {
                        formatter: (val) => val?.toFixed(2) + '%'
                    }
                }
            ],
            tooltip: {
                shared: true,
                intersect: false
            }
        };


    }

    ngAfterViewInit(): void {

    }

    protected readonly Math = Math;
}
