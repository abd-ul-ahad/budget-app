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
  
    const response = [];
    for (const month in incomeByMonth) {
      const avgIncome = incomeByMonth[month].total / incomeByMonth[month].count;
      response.push(avgIncome);
    }
  
    return response;
  }


  export function spendingByMonth(transactions: Array<any> | undefined) {
    const incomeByMonth: any = {};
    transactions?.forEach((transaction) => {
      if (transaction._data.category !== "#income") {
        const date = new Date(transaction._data.createdAt.seconds * 1000);
        const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;
        if (!incomeByMonth[yearMonth]) {
          incomeByMonth[yearMonth] = { total: 0, count: 0 };
        }
        incomeByMonth[yearMonth].total += transaction._data.amount;
        incomeByMonth[yearMonth].count++;
      }
    });
  
    const response = [];
    for (const month in incomeByMonth) {
      const avgIncome = incomeByMonth[month].total / incomeByMonth[month].count;
      response.push(avgIncome);
    }
  
    return response;
  }
  