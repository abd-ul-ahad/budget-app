import { Convert } from "easy-currencies";
import { useEffect, useState } from "react";
import getCurrencySymbol from "../utils/CurrencySymbols";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function RenderAmount({ amount }: { amount: number }) {
  const code = useSelector((state: RootState) => state.currency.code);
  const reloadState = useSelector((state: RootState) => state.reload);
  //
  const [text, setText] = useState<number>();
  useEffect(() => {
    (async () => {
      const convert = await Convert().from("GBP").fetch();
      const value = await convert.amount(amount).to(code);
      setText(value);
    })();
  }, [reloadState]);

  return text === undefined
    ? "0"
    : `${Number(text).toFixed(1)} ${getCurrencySymbol(code)}`;
}
