/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  data.result = generateAggregatedSalesData(data.seasonality, data.dateList, data.crowd);
  postMessage(data);

});

const generateAggregatedSalesData = (seasonality, dateList, crowd): any[] => {
  const productPivotDataSource = [];
  let productData = [];
  seasonality.forEach((product, index) => {
    const seasonalityIndex = product.seasonalityIndex;
    if (!seasonalityIndex) return;

    productData = dateList.map((period, index) => {
      const month = new Date(period).getUTCMonth();
      return {
        pnlrow: 'Monthly Targeted Audience',
        itemcode: product.productId.toString(),
        itemname: product.name,
        factdate: period + '-01T00:00:00Z',
        description:product.name,
        factvalue: seasonalityIndex[month] * crowd,
        currency: 'QTY',
      };
    });

    productPivotDataSource.push(...productData);
  });

  return productPivotDataSource;
}
