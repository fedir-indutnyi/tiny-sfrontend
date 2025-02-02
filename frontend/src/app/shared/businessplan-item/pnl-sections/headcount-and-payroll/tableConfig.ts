import { iDynamicTableFormConfig } from "../../shared/dynamic-table-form/models"
import { plnSalary } from "./pln-salary"


export const headcountConfig: iDynamicTableFormConfig<string | number | boolean> = {
    controls: {
      jobTitle: {
        controlType: 'textInput',
        label: 'bp.headcount.jobTitle',
        value: '',
        type: 'text',
        order: 1,
      },
      generatesSales: {
        controlType: 'checkbox',
        label: 'bp.headcount.generatesSales',
        value: false,
        type: 'boolean',
        order: 2
      },
      numOfPeople: {
        controlType: 'numberInput',
        label: 'bp.headcount.numberOfPeople',
        value: 0,
        type: 'number',
        order: 3
      },
      beginningMonth: {
        controlType: 'numberInput',
        label: 'bp.headcount.beginningMonthNmb',
        value: 0,
        type: 'number',
        order: 4
      },
      endingMonth: {
        controlType: 'numberInput',
        label: 'bp.headcount.endingMonthNmb',
        value: 99999,
        type: 'number',
        order: 5
      },
      netSalary: {
        controlType: 'numberInput',
        label: 'bp.headcount.monthlyNetSalary',
        value: 0,
        type: 'number',
        order: 6
      },
      salaryPlnRow: {
        controlType: 'select',
        label: 'bp.headcount.monthlyNetSalaryPnlRow',
        value: Object.keys(plnSalary)[0],
        options: Object.entries(plnSalary).map(([key, value]) => ({label: value, value: key})),
        order: 7,
      },
      recruitmentCost: {
        controlType: 'numberInput',
        label: 'bp.headcount.recruitmentCost',
        value: 0,
        type: 'number',
        order: 8
      },
      monthOfService: {
        controlType: 'numberInput',
        label: 'bp.headcount.averageMonthsOfService',
        value: 99999,
        type: 'number',
        order: 9,
      },
      salaryTax: {
        controlType: 'percentInput',
        label: 'bp.headcount.salaryTax',
        value: 0,
        type: 'number',
        order: 10
      },
      extraPayments: {
        controlType: 'percentInput',
        label: 'bp.headcount.extraPayments',
        value: 0,
        type: 'number',
        order: 11,
      }
    }
}

export const payrollConfig: iDynamicTableFormConfig<string | number | boolean> = {
    controls: {
        plnRow: {
            controlType: 'select',
            label: 'bp.headcount.pnlRow"',
            value: Object.keys(plnSalary)[0],
            options: Object.entries(plnSalary).map(([key, value]) => ({label: value, value: key})),
            order: 1,
        },
        description: {
            controlType: 'textInput',
            label: 'bp.headcount.otherHeadcountExpenses',
            value: '',
            type: 'text',
            order: 2
        },
        monthlyPricePerEmployee: {
            controlType: 'numberInput',
            label: 'bp.headcount.monthlyPrice',
            value: 0,
            type: 'number',
            order: 3
        },
        staticMonthlyNumber: {
            controlType: 'numberInput',
            label: 'bp.headcount.staticMonthlyNumber',
            value: 0,
            type: 'number',
            order: 4
        },
        comment: {
            controlType: 'textInput',
            label: 'bp.headcount.comment',
            value: '',
            type: 'text',
            order: 5
        },
        vendorName: {
            controlType: 'textInput',
            label: 'bp.headcount.vendorSupplierName',
            value: '',
            type: 'text',
            order: 6
        },
        startMonth: {
            controlType: 'numberInput',
            label: 'bp.headcount.startMonth',
            value: 0,
            type: 'number',
            order: 7
          },
        endMonth: {
          controlType: 'numberInput',
          label: 'bp.headcount.endMonth',
          value: 99999,
          type: 'number',
          order: 8
        },
    }
}
