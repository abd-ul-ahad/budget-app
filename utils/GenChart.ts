export function incomeByMonth(transactions: Array<any> | undefined) {
  const currentYear = new Date().getFullYear(); // Get the current year
  const incomeByMonth: any = {};

  transactions?.forEach((transaction) => {
    const date = new Date(transaction._data.createdAt.seconds * 1000);
    if (
      date.getFullYear() === currentYear &&
      transaction._data.category === "#income"
    ) {
      const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;
      if (!incomeByMonth[yearMonth]) {
        incomeByMonth[yearMonth] = { total: 0, count: 0 };
      }
      incomeByMonth[yearMonth].total += transaction._data.amount;
      incomeByMonth[yearMonth].count++;
    }
  });

  const response = new Array(12).fill(0); // Initialize array with 0 values for each month

  for (const month in incomeByMonth) {
    const monthIndex = parseInt(month.split("-")[1]) - 1; // Extract month index
    response[monthIndex] = incomeByMonth[month].total; // Store total income in the corresponding month index
  }

  return response;
}

export function spendingByMonth(transactions: Array<any> | undefined) {
  const currentYear = new Date().getFullYear(); // Get the current year
  const spendingByMonth: any = {};

  transactions?.forEach((transaction) => {
    const date = new Date(transaction._data.createdAt.seconds * 1000);
    if (
      date.getFullYear() === currentYear &&
      transaction._data.category !== "#income"
    ) {
      const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;
      if (!spendingByMonth[yearMonth]) {
        spendingByMonth[yearMonth] = { total: 0, count: 0 };
      }
      spendingByMonth[yearMonth].total += transaction._data.amount;
      spendingByMonth[yearMonth].count++;
    }
  });

  const response = new Array(12).fill(0); // Initialize array with 0 values for each month

  for (const month in spendingByMonth) {
    const monthIndex = parseInt(month.split("-")[1]) - 1; // Extract month index
    const avgSpending =
      spendingByMonth[month].total / spendingByMonth[month].count;
    response[monthIndex] = avgSpending; // Store average spending in the corresponding month index
  }

  return response;
}

//yearly
export function incomeByYear(transactions: Array<any> | undefined) {
  if (!transactions || transactions.length === 0) {
    return {
      data: [],
      years: [],
    };
  }

  const firstTransactionDate = new Date(
    transactions[0]._data.createdAt.seconds * 1000
  );
  const currentYear = new Date().getFullYear(); // Get the current year

  const incomeDataByYear: any = {};
  const years: any = [];

  transactions.forEach((transaction: any) => {
    const date = new Date(transaction._data.createdAt.seconds * 1000);
    const year = date.getFullYear();

    if (transaction._data.category === "#income") {
      if (!incomeDataByYear[year]) {
        incomeDataByYear[year] = 0;
        years.push(year);
      }
      incomeDataByYear[year] += transaction._data.amount;
    }
  });

  const data = years.map((year: any) => incomeDataByYear[year] || 0);

  return {
    data: data,
    years: years,
  };
}

export function spendingByYear(transactions: Array<any> | undefined) {
  if (!transactions || transactions.length === 0) {
    return {
      data: [],
      years: [],
    };
  }

  const firstTransactionDate = new Date(
    transactions[0]._data.createdAt.seconds * 1000
  );
  const currentYear = new Date().getFullYear(); // Get the current year

  const spendingDataByYear: any = {};
  const years: any = [];

  transactions.forEach((transaction) => {
    const date = new Date(transaction._data.createdAt.seconds * 1000);
    const year = date.getFullYear();

    if (year === currentYear && transaction._data.category !== "#income") {
      if (!spendingDataByYear[year]) {
        spendingDataByYear[year] = 0;
        years.push(year);
      }
      spendingDataByYear[year] += transaction._data.amount;
    }
  });

  const data = years.map((year: any) => spendingDataByYear[year] || 0);

  return {
    data: data,
    years: years,
  };
}
