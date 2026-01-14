import type { BasePatternExtractor } from "../../extracter/patterns/base-pattern-extractor";
import { dateRegexWithOutPMAM, extractDateFromText, getBefore, getFloat, getTax, getWordAfter } from "../../util";
import type { IInvestmentLog, Investment, InvestmentType, Vat } from "./core";
import { getSymbol, getType, sumVat } from "./util";
export class SellInvestmentLog implements IInvestmentLog {
  constructor(private words: string, private extractor: BasePatternExtractor) { }
  toJson(): Investment {
    const [orderDetail, dateDetail] = this.words
      .replace(/[\u0E00-\u0E7F]/g, "")
      .split(/(?=\Submission Date)/g);
    if (!orderDetail) throw new Error("no order detail data");
    if (!dateDetail) throw new Error("no date data");
    const [submissionDate, completionDate] = this.extractor
      .extract(dateDetail)
      .map((x) => extractDateFromText(x, dateRegexWithOutPMAM));
    if (!submissionDate) throw new Error("no submission date");
    if (!completionDate) throw new Error("no completion date");
    const price = getFloat(getWordAfter(orderDetail, "Total Credit", 2));
    const executedPrice = getFloat(getWordAfter(orderDetail, "Executed", 7));
    const shares = getFloat(getBefore(orderDetail, "Shares", 1));
    const stockAmount = getFloat(getBefore(orderDetail, "Amount", 3));
    const vat: Vat = {
      commissionFee: getTax(orderDetail, "Commission"),
      secFee: getTax(orderDetail, "SEC"),
      tafFee: getTax(orderDetail, "TAF"),
      vat7: getTax(orderDetail, "VAT 7%"),
    };
    const allVatPrice = sumVat(vat);
    const diffPrice = stockAmount - price;
    const diffVat = diffPrice - allVatPrice;
    return {
      kind: "slip",
      type: getType(this.words) as InvestmentType,
      symbol: getSymbol(this.words)!,
      stockAmount,
      allVatPrice,
      executedPrice,
      completionDate,
      diffVat,
      vat,
      vatExecuted: diffPrice,
      value: price,
      shares,
      submissionDate,
    };
  }
}
