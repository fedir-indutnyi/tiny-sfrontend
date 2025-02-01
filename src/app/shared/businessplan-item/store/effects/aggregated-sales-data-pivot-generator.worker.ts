/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  data.result = generateAggregatedSalesDataPivot(data.seasonality, data.dateList, data.crowd);
  postMessage(data);

});

const generateAggregatedSalesDataPivot = (seasonality, dateList, crowd): any[] => {
  const productPivotDataSource = [];
  let productData = [];
  seasonality.forEach((product, index) => {
    const seasonalityIndex = product.seasonalityIndex;
    if (!seasonalityIndex) return;

    productData = dateList.map((period, index) => {
      const month = new Date(period).getUTCMonth();
      return {
        title: product.name,
        date: period,
        year: new Date(period).getUTCFullYear(),
        amount: seasonalityIndex[month] * crowd,
      };
    });

    productPivotDataSource.push(...productData);
  });

  return productPivotDataSource;
}
