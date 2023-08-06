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
    }
  });

  return { incomeBalance, outcomeBalance, currentBalance };
};
