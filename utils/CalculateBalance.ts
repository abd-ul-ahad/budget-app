import { useSelector } from "react-redux";
import { useFirestore } from "../firebase/useFirestore";
import { RootState } from "../store";

export const CalculateBalance = async () => {
  const user = useSelector((state: RootState) => state.user);
  const { getDocument: getTransactionDocument } = useFirestore(
    "transactions",
    user.uid!
  );
  const { getDocument: getPlanDocument } = useFirestore("plans", user.uid!);

  let incomeBalance = 0;
  let outcomeBalance = 0;
  let currentBalance = 0;

  const d = await getTransactionDocument();
  const plans = await getPlanDocument();

  d?.forEach((doc: any) => {
    if (doc._data.category === "#income") {
      incomeBalance += parseInt(doc._data.amount);
    } else {
      if (doc._data.plan !== "#income") {
        outcomeBalance += parseInt(doc._data.amount);
      }
    }
  });

  currentBalance = incomeBalance - outcomeBalance;

  plans?.forEach((plan: any) => {
    currentBalance -= parseInt(plan._data.budgetAmount);
    outcomeBalance += parseInt(plan._data.budgetAmount);
  });

  return { incomeBalance, outcomeBalance, currentBalance };
};

export function calculatePercentageIncrease(
  initialIncome: number,
  increaseAmount: number
) {
  const percentageIncrease = (increaseAmount / initialIncome) * 100;

  return percentageIncrease;
}

export function calculatePercentageSpent(
  totalIncome: number,
  spentAmount: number
) {
  // Calculate the percentage spent
  const percentageSpent = (spentAmount / totalIncome) * 100;

  return percentageSpent;
}
