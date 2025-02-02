import { iDynamicTableFormConfig } from "../../shared/dynamic-table-form/models"

export const pnlRow = [
  {label: "Investment", value: "Investment"},
  {label: "Capex", value: "Capex"}
]


export const investmentAndCapexTableConfig: iDynamicTableFormConfig<string | number | boolean> = {
    controls: {
      category: {
        controlType: 'textInput',
        label: 'bp.inputTables.category',
        value: '',
        type: 'text',
        order: 1,
        width: 150,
      },
      pnlRow: {
        controlType: 'select',
        label: 'bp.inputTables.pnlRow',
        value: Object.keys(pnlRow)[0],
        options: pnlRow,
        order: 2,
        width: 150,
      },
      description: {
        controlType: 'textInput',
        label: 'bp.inputTables.description',
        value: '',
        type: 'text',
        order: 3,
        width: 250,
      },
      totalValuePrice: {
        controlType: 'numberInput',
        label: 'bp.inputTables.totalValuePrice',
        value: 10000,
        type: 'number',
        order: 4,
        width: 100,
      },
      ammortizationApplied: {
        controlType: 'checkbox',
        label: 'bp.inputTables.amortisationApplied',
        value: false,
        type: 'boolean',
        order: 5,
        width: 100
      },
      depreciationMonths: {
        controlType: 'numberInput',
        label: 'bp.inputTables.amortisationDepreciationMonths',
        value: 0,
        type: 'number',
        order: 6,
        width: 100,
      },
      vendor: {
        controlType: 'textInput',
        label: 'bp.inputTables.vendorSupplierName',
        value: '',
        type: 'text',
        order: 7,
        width: 150,
      },
      startMonth: {
        controlType: 'numberInput',
        label: 'bp.inputTables.startMonth',
        value: 1,
        type: 'number',
        order: 8,
        width: 100,
      },
      endMonth: {
        controlType: 'numberInput',
        label: 'bp.inputTables.endMonth',
        value: 99999,
        type: 'number',
        order: 9,
        width: 100,
      },
      comments: {
        controlType: 'textInput',
        label: 'bp.inputTables.comment',
        value: '',
        type: 'text',
        order: 10,
        width: 250,
      }
    }
}
