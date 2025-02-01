export const initialDraft =
    {
      "lastmodified": new Date().getTime(),
      "businessplanSetting": {
        "pnlRow": "Business Plan Generic Settings",
        "address": null,
        "category": null,
        "currency": "EUR",
        "endPeriod": new Date(new Date().getFullYear() + 1, 11, 31).toISOString(),
        "itemType": null,
        "nameOfPlan": "Business plan Name (Optimistic, Realistic)",
        "periods": 12,
        "startPeriod": new Date(new Date().getFullYear() + 1, 0, 1).toISOString(),
        "typeOfData": null,
        "UOM": "EACH",
        "yearlyInflationRate": 0,
        "yearlyPriceIncrease": 0,
        "yearlySalaryIncrease": 0,
        "pnlData": [],
        "description": "",
        "isInflation": false,
        "inflationHistory": {
          "yearlyInflationRate": 0,
          "yearlyPriceIncrease": 0,
          "yearlySalaryIncrease": 0
        }
      },
      "aboutVisitorsCustomers": {
        "pnlRow": "aboutVisitorsCustomers",
        "applicable": true,
        "totalMonthlyCrowd": 10000,
        "paidTraffic": 0,
        "totalMonthlyVisitors": 2000,
        "costPerVisitor": 0,
        "monthlyConversionUser": null,
        "monthlyConversionUserThatBuys": 0.3,
        "totalMonthlyCustomers": 600,
        "comment": null,
        "pnlData": []
      },
      "portfolio": {
        "applicable": true,
        "splitByProducts": true,
        "pnlRow": "Portfolio",
        "pnlData": [],
        "productsServices":[
            {
              "id":0,
              "brand": "All Brands",
              "name": "Total Product",
              "cost": null,
              "price": null,
              "productMarkup": null,
              "productMargin": null,
              "eachNCustomerBuys":1,
              "monthlyConversionUserThatBuys":100,
              "customers":600,
              "ordersMonthPerCustomer":1,
              "totalUnits":750,
              "estimatedFailedOrders":0.01,
              "standardDiscount":0,
              "onFirstInitialStock":false,
              "totalAssetValue": null,
              "beginningMonths":1,
              "yearlyInflationRate":0,
              "yearlyPriceIncrease":0,
              "UOM": "",
              "overrideFromBusinessDetails":false,
              "numberOfMonthsForInitialStock":0.5
            },
            {
              "id":1708626417683,
              "brand": "All Brands",
              "name": "All Brands##Product 1",
              "cost":2,
              "price":10,
              "productMarkup":400,
              "productMargin":80,
              "eachNCustomerBuys":2,
              "absoluteCountValues":300,
              "monthlyConversionUserThatBuys":0.5,
              "customers":300,
              "itemsPerOrder": 1,
              "ordersMonthPerCustomer":1.5,
              "totalUnits":450,
              "estimatedFailedOrders":0.01,
              "standardDiscount":0,
              "onFirstInitialStock":false,
              "ammortizationApplied":false,
              "totalAssetValue":0,
              "beginningMonths":1,
              "ammortisationMonths": null,
              "endingMonth":999,
              "yearlyInflationRate":0,
              "yearlyPriceIncrease":0,
              "UOM": "EACH",
              "overrideFromBusinessDetails":false,
              "numberOfMonthsForInitialStock":0
            },
            {
              "id":1708626422996,
              "brand": "All Brands",
              "name": "All Brands##Product 2",
              "cost":0.4,
              "price":0.5,
              "productMarkup":25,
              "productMargin":20,
              "eachNCustomerBuys":2,
              "absoluteCountValues":300,
              "monthlyConversionUserThatBuys":0.5,
              "customers":300,
              "itemsPerOrder": 1,
              "ordersMonthPerCustomer":1,
              "totalUnits":300,
              "estimatedFailedOrders":0.01,
              "standardDiscount":0,
              "onFirstInitialStock":false,
              "ammortizationApplied":false,
              "totalAssetValue":0,
              "beginningMonths":1,
              "ammortisationMonths": null,
              "endingMonth":999,
              "yearlyInflationRate":0,
              "yearlyPriceIncrease":0,
              "UOM": "EACH",
              "overrideFromBusinessDetails":false,
              "numberOfMonthsForInitialStock":0
            }
        ],
        "customerCalculationMethod": "procent"
      },
      "advancedInflationSettings": {
        "plnRow": "Advanced Inflation Settings",
        "inflationMultipliers":[
            1
        ],
        "inflationSettingsPivotData":[
            {
              "productId":1708626417683,
              "name": "All Brands##Product 1",
              "year": (new Date().getFullYear() + 1).toString(),
              "inflationForProduct":0,
              "priceForProduct":0,
              "inflationAccumulatedForProduct":1,
              "priceAccumulatedForProduct":1
            },
            {
              "productId":1708626422996,
              "name": "All Brands##Product 2",
              "year": (new Date().getFullYear() + 1).toString(),
              "inflationForProduct":0,
              "priceForProduct":0,
              "inflationAccumulatedForProduct":1,
              "priceAccumulatedForProduct":1
            }
        ],
        "yearList":[
          (new Date().getFullYear() + 1).toString()
        ],
        "yearlyValues":[
            {
              "yearlyInflationRate":0,
              "yearlyPriceIncrease":0,
              "yearlySalaryIncrease":0
            }
        ]
      },
      "seasonality":[
        {
            "productId":0,
            "name": "Total Product",
            "seasonalityIndex":[
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1
            ]
        },
        {
            "productId":1708626417683,
            "name": "All Brands##Product 1",
            "seasonalityIndex":[
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1
            ]
        },
        {
            "productId":1708626422996,
            "name": "All Brands##Product 2",
            "seasonalityIndex":[
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              1
            ]
        }
      ],
      "acceleration": {
        "trendData":[
            0.3,
            0.364,
            0.427,
            0.491,
            0.554,
            0.618,
            0.682,
            0.745,
            0.809,
            0.872,
            0.936,
            1
        ],
        "trendType": "Linear",
        "trendSettings": {
            "months":[
              1,
              12,
              36
            ],
            "growths":[
              0.3,
              1,
              1.1
            ]
        }
      },
      "discountsAndReturns":[
        {
            "pnlRow": "discount",
            "description": "Regular Discount",
            "staticMonthlyNumber":0,
            "percentage":0.01,
            "startMonth":1,
            "endMonth":999,
            "comment": ""
        }
      ],
      netSale:{
        monthsShift:0
      },
      "cogs":[
        {
            "pnlRow": "otherCogs",
            "description": "Royalty",
            "staticMonthlyNumber":1,
            "percentage":0.04,
            "vendor": "Vendor for Royalty",
            "startMonth":1,
            "endMonth":999,
            "comment": ""
        },
        {
            "pnlRow": "otherCogs",
            "description": "Customs Clearance",
            "staticMonthlyNumber":100,
            "percentage":0,
            "vendor": "Vendor for Customs Clearance",
            "startMonth":1,
            "endMonth":999,
            "comment": ""
        },
        {
            "pnlRow": "cogs",
            "description": "Bank Terminal cost",
            "staticMonthlyNumber":0,
            "percentage":0.005,
            "vendor": "Vendor for Bank Terminal cost",
            "startMonth":1,
            "endMonth":999,
            "comment": ""
        }
      ],
      "opex":[
        {
            "pnlRow": "Operating Expenses",
            "description": "Rent",
            "staticMonthlyNumber":600,
            "percentage":0,
            "vendor": "Vendor of Rent",
            "startMonth":1,
            "endMonth":999,
            "comment": ""
        },
        {
            "pnlRow": "Operating Expenses",
            "description": "Electricity",
            "staticMonthlyNumber":50,
            "percentage":0,
            "vendor": "Vendor for Electricity",
            "startMonth":1,
            "endMonth":999,
            "comment": ""
        },
        {
            "pnlRow": "Operating Expenses",
            "description": "Repairs",
            "staticMonthlyNumber":100,
            "percentage":0,
            "vendor": "Vendor for Repairs",
            "startMonth":1,
            "endMonth":999,
            "comment": ""
        },
        {
            "pnlRow": "Operating Expenses",
            "description": "Utilities",
            "staticMonthlyNumber":30,
            "percentage":0,
            "vendor": "Vendor for Utilities",
            "startMonth":1,
            "endMonth":999,
            "comment": ""
        },
        {
            "pnlRow": "Operating Expenses",
            "description": "Internet",
            "staticMonthlyNumber":10,
            "percentage":0,
            "vendor": "Vendor for Internet",
            "startMonth":1,
            "endMonth":999,
            "comment": ""
        },
        {
            "pnlRow": "Operating Expenses",
            "description": "Fuel/Petrol",
            "staticMonthlyNumber":55,
            "percentage":0,
            "vendor": "Vendor for Fuel/Petrol",
            "startMonth":1,
            "endMonth":999,
            "comment": ""
        },
        {
            "pnlRow": "Operating Expenses",
            "description": "Telephone",
            "staticMonthlyNumber":8,
            "percentage":0,
            "vendor": "Vendor for Telephone",
            "startMonth":1,
            "endMonth":999,
            "comment": ""
        }
      ],
      "rnd":[

      ],
      "otherOperatingIncomeLoss":[

      ],
      "marketing":[
        {
            "description": "Google Ads",
            "staticMonthlyNumber":10,
            "startMonth":1,
            "endMonth":999,
            "pnlRow": "Marketing",
            "percentage":0,
            "vendor": "Vendor for Google Ads",
            "comment": ""
        },
        {
            "description": "Banner",
            "staticMonthlyNumber":10,
            "startMonth":1,
            "endMonth":999,
            "pnlRow": "Advertising",
            "percentage":0,
            "vendor": "Vendor for Banner",
            "comment": ""
        }
      ],
      "headcountAndPayroll": {
        "headcount":[
            {
              "jobTitle": "Employee",
              "generatesSales": true,
              "numOfPeople":1,
              "beginningMonth":1,
              "endingMonth":99999,
              "netSalary":100,
              "salaryPlnRow": "Headcount Expenses",
              "recruitmentCost":100,
              "monthOfService":99999,
              "salaryTax":0.3,
              "extraPayments":0.01
            }
        ],
        "payroll":[
            {
              "plnRow": "Headcount Expenses",
              "description": "Medical Insurance",
              "monthlyPricePerEmployee":10,
              "staticMonthlyNumber":0,
              "comment": "",
              "vendorName": "",
              "startMonth":0,
              "endMonth":99999
            }
        ]
      },
      "investmentAndCapex":[
        {
            "category": "Money",
            "pnlRow": "Investment",
            "description": "Initial deposit",
            "totalValuePrice":1000,
            "ammortizationApplied":false,
            "depreciationMonths":9999,
            "vendor": "",
            "startMonth":1,
            "endMonth":99999,
            "comments": "Own Money"
        },
        {
            "category": "",
            "pnlRow": "Capex",
            "description": "Car",
            "totalValuePrice":3000,
            "ammortizationApplied": true,
            "depreciationMonths":60,
            "vendor": "",
            "startMonth":1,
            "endMonth":99999,
            "comments": "Own Money"
        },
        {
            "category": "",
            "pnlRow": "Capex",
            "description": "Computer",
            "totalValuePrice":250,
            "ammortizationApplied": true,
            "depreciationMonths":24,
            "vendor": "",
            "startMonth":1,
            "endMonth":99999,
            "comments": "Own Money"
        },
        {
            "category": "",
            "pnlRow": "Capex",
            "description": "Equipment",
            "totalValuePrice":10000,
            "ammortizationApplied":false,
            "depreciationMonths":0,
            "vendor": "",
            "startMonth":1,
            "endMonth":99999,
            "comments": "Own Money"
        }
      ],
      "safetyPillow": 0.1,
      "postId": ""
    }
