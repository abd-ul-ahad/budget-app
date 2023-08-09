export function incomeByMonth(transactions: Array<any> | undefined) {
  const incomeByMonth: any = {};

  transactions?.forEach((transaction) => {
    if (transaction._data.category === "#income") {
      const date = new Date(transaction._data.createdAt.seconds * 1000);
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
  const spendingByMonth: any = {};

  transactions?.forEach((transaction) => {
    if (transaction._data.category !== "#income") {
      const date = new Date(transaction._data.createdAt.seconds * 1000);
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
