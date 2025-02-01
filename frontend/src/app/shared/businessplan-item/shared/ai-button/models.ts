//Textes to ask for AI
export const AIPrompts = {
    businessPlanDetails: 
    `Hello, I would like to open a  ##category## in  ##address##. Kind of business - ##itemType##, description: ##description##. I am calculating a business plan. Can you please try to estimate for me following indicators, and pesent me them in table with 3 columns - number from list below, name of indicator from list below, estimated value, comment - how estimation was collected:
    1. currency - default value = ##currency##;
    2. Current Yearly Inflation rate;
    3. Suggested Yearly Price Increase for small Business of that kind.
    4. Total Montly crowd passing through residental street, applicable for such business, not far from city center. You can also base this estimation on daily numbers;
    5. What is a number of visitors plus people who visiting business of that kind;
    6. What is estimamted conversion rate from visitors to customers. 
    7. Total monthly customers = <number 5> * <number 6>;`,
    portfolio:
    `Now lets estimate and consolidate typical Portfolio tsv table (tab separated values). of product and services provided by such kind of a business (address: ##address##  .. ##category## .  ##description##). 
    List might be increased by your suggestion, but not long - up to 25 products services. 
    As columns - please put to table estimates in following columns next to each product:
    Service / Product name - is typical most popular services provided by such business;
    Cost Price of single service or product (if it is haircut - estimated total cost of materials for single haircut) - normally it can be obtained from typical margin of such service;
    Price-list price of servoce / Product - is our actual price that we are going to priovide a service;
    Each N Customer who buys such product or service - for example haircut is normally taken by each 10th customer, but we need to estimate this number for current location and typical business. This column is hard to estimate, but please give try;
    Monthly % Conversion Customer That Buys - calculated = 1/<Each N Customer who buys>
    Units of Products or services per customer - is an average number of products in check, suggesting that some customers might buy 2 or more products.`,
    seasonalityByBrand:
    `Now, for selected type of business (address: ##address##  .. ##category## .  ##description##), lets estimate a typical seasonality impact on sales for listed above Portfolio by Product in the table, where First column - is a name of the product from Portfolio (in previous answer), and columns January - December with typical persentages of seasonality impact. Consider 100% as no impact, less than 100% - sales decresing, over 100% - sales increasing due to seasonality. Average per all months in each row should be close to 100% due to the fact that some monthes ususally have decrease, but some have increase. Consider Geographic address and typical Kind of a business from previous answers (Strasbourg, Beauty salon of average size). Also take into consideration high seasonal sales - December (New Year), etc. `,
    acceleration:
    `Now please estimate or suggest typical time frimes for such kind of business to stabilize ((address: ##address##  .. ##category## .  ##description##)). Please estimate following factors in a short table - factor, value, comment:
    a. What is an estimated % of sales of similar stable business can be expected at first month of opening ?
    b. How many months in Strasbourg it takes for such a beauty salon of 120 squre meters to stabilize business from montjh of opening?
    c. Which trend better suits such kind of business - linear or logariphmic?
    d. What can be potential growth in 10 years from fully stabilized business?`,
    attritionChurnRate:
    `Now lets estimate Churn Rate and attrition for typical business of that kind (address: ##address##  .. ##category## .  ##description##). Please estimate a table with following factors:
    a. What is a % of Churn rate (Customer loss) on a first month of opening?
    b. What is a % of Churn rate (Customer loss) for a stabilized successfull business of that kind (beauty salon)?
    c. What is an expected % of Churn rate (Customer loss) after ten years when we have many loyal customers?`,
    discountsAndReturns:
    `What is a typical list of discounts and rebates for typical business of that kind (address: ##address##  .. ##category## .  ##description##)? Please provide short table (up to 3) with few typical discounts, rebates, loyalty programs - and estimate a typical values for business of that kind. Please try to estimate % value of total gross sales that typically applied in industry in selected area.`,
    otherMonthlyCogs:
    `What is a typical Other Cost of Goods that can be associated with such kind of business (address: ##address##  .. ##category## .  ##description##) other than Cost already connected to services, for example - Shampagne for Customers, or Customs Clearance fee, basically - any cost, which cannot be linked to volume of services. This is Not OPEX or Capex. Data should be in ##currency##. Please provide examples in following table: Name of Other Cost, static montly number, % of net sales .`,
    fixedAssetsAndInitialCapex:
    `Please suggest typical Capex, or first time investment for typical business of that kind (address: ##address##  .. ##category## .  ##description##). Data needs to be estimated as average, not range. Also please make sure not to forget typical capex like - Renovation, Initial Marketing, Rent Deposit, Registration Fees, Initital Accounting, and add up to 10 suggested. Please estimate following table in ##currency##:
    Name of Capex Item | Value Price | Ammortisation / Depreciation, Months. `,
    advertisingAndPromo:
    `Please provide typical monthly spent for Marketing, Advertising and Promotion. For business of that kind (address: ##address##  .. ##category## .  ##description##). Data needs to be estimated as average, not range. Please estimate and collect following information in a table in ##currency## with following columns:
    PnlRow (Marketing, Advertising or Promo)
    description (For example SMM, Facebook, Instagram, Video Shooting and Production)
    Monthly Price
    Or typical % of net sales value .`,
    headCountNumbersVSDreamTeam:
    `Please provide a typical headcount hiring process for business of that kind (address: ##address##  .. ##category## .  ##description##). To begin with - suggest typical yearly Salary increase. Data needs to be estimated as average, not range. Then after please estimate data in ##currency## in a table with following columns:
    Business title (including  Director);
    Number of people hired;
    Monthly Net Salary (if Monthly fixed);
    Net Salary % of Net Sales (if working as % of Net sales);
    Recruitment Cost;
    Average Service Time in Months;
    Salary Taxes (Gross to Net);
    Extra Pays, %`,
    opex:
    `Plese provide a typical opex (Operating expenses) values for similar kind of businss (address: ##address##  .. ##category## .  ##description##). 
    Also please make sure not to forget typical opex like - Rent, Renovation & Fixes, Utilities, Internet, Phone, Security Alarm, Travel if applicable, Cleaning, Accounting, Insurances, Licenses/Fees/Permits, Legal and Professional Fees, Office Expenses & Supplies, Software, and so on.
    Please estiamte and consolidate that data in ##currency## in a following table with columns:
    Opex Expense Name;
    Static Monthly Number;
    Or if % of Net sales;`,
    
}