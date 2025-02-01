export const InitialState = {
  aboutVisitorsCustomers: {
    pnlRow: "aboutVisitorsCustomers",
    applicable: true,
    totalMonthlyCrowd: null,
    paidTraffic: null,
    totalMonthlyVisitors: null,
    costPerVisitor: null,
    monthlyConversionUser: null,
    monthlyConversionUserThatBuys: null,
    totalMonthlyCustomers: null,
    comment: null,
    sheetData: [['Targeted Audience/Unregistered/Crowd -->'], ['Targeted Audience/Registered/Offline Visitors -->'], [], [], [], [], [], [], [], []],
    pnlData: []
  },
  businessplanSetting: {
    pnlRow: "Business Plan Generic Settings",
    address: null,
    category: null,
    currency: null,
    endPeriod: null,
    itemType: null,
    nameOfPlan: null,
    periods: null,
    startPeriod: null,
    typeOfData: null,
    UOM: 'EACH',
    yearlyInflationRate: 0.0,
    yearlyPriceIncrease: 0.0,
    yearlySalaryIncrease: 0.0,
    pnlData: [],
    description: "",
    isInflation: false,
    inflationHistory: {
      yearlyInflationRate: 0,
      yearlyPriceIncrease: 0,
      yearlySalaryIncrease: 0,
    },
    consumersList: [
      "bp.details.consumersList.clients",
      "bp.details.consumersList.people",
      "bp.details.consumersList.users",
      "bp.details.consumersList.students",
      "bp.details.consumersList.children",
      "bp.details.consumersList.consumers",
      "bp.details.consumersList.buyers",
      "bp.details.consumersList.passengers",
      "bp.details.consumersList.travelers",
    ],
    actualConsumer: "bp.details.consumersList.clients"
  },
  portfolio: {
    pnlRow:"Portfolio",
    pnlData: [],
    applicable:true,
    splitByProducts:true,
    productsServices: [],
  },
  advancedInflationSettings:{
    plnRow:"Advanced Inflation Settings",
    inflationMultipliers: [],
    inflationSettingsPivotData: [],
    yearList: [],
    yearlyValues: [],
  },
  costPrices: [
    {
      id: new Date().getTime(),
      itemname: 'Product 1',
      factdate: String(new Date().getFullYear()),
      factvalue: 0
    },
  ],
  prices: [
    {
      id: new Date().getTime(),
      itemname: 'Product 1',
      factdate: String(new Date().getFullYear()),
      factvalue: 0
    },
  ],
  productsSeasonality: [],
  acceleration: {
    pnlRow: "Acceleration",
    trendType: null,
    trendData: [],
    trendSettings:{
      months:[],
      growths: []
    }
  },
  headcountAndPayroll: {
    tableData: {
      headcount: [],
      payroll: [],
    },
    pivotData: {
      numberOfEmployees: [],
      headcountExpenses: [],
      recruitmentCost: [],
      salaryTax: [],
      extraPayments: [],
      otherHeadcountCost: []
    }
  },
  investmentAndCapex:{
    tableData: [],
    pivotData: {
      assetsAvaliabilityPivotData: [],
      montlyCapexInvestmentPivotData: [],
      assetsDepriciationPivotData: [],
      inventoryIncreasePivotData: [],
    },
    exportData: []
  },
  capex: [],
  discountsAndReturns: [],
  cogs: [],
  opex:[],
  rnd:[],
  operatingIncomeLoss:[],
  marketing:[],
  investmentsRequired: {
    safetyPillow: 0.1,
    investmentsRequiredPivotData: [],
    investmentsRequiredExportData: []
  },
  netSale:{
    monthsShift:0
  },
}
