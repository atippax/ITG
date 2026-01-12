import { IncomeDividendLog } from "./income-dividend";
import { TaxDividendLog } from "./tax-dividend";

export function getDividendParser(text: string) {
  const type = text!.includes("Withholding Tax") ? "Tax" : "Income";
  if (type == 'Income')
    return new IncomeDividendLog(text);
  if (type == 'Tax')
    return new TaxDividendLog(text);
  throw Error("no type");
}
