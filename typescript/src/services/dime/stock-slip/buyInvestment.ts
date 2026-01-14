import type { BasePatternExtractor } from "../../extracter/patterns/base-pattern-extractor";
import {
  dateRegexWithOutPMAM,
  extractDateFromText,
  getBefore,
  getFloat,
  getTax,
  getWordAfter,
  tryGetFloat,
} from "../../util";
import type { IInvestmentLog, Investment, InvestmentType, Vat } from "./core";
import { getSymbol, getType, sumVat } from "./util";


export class BuyInvestmentLog implements IInvestmentLog {
  constructor(private words: string, private extractor: BasePatternExtractor) {
    // console.log(words);
  }
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
    const [executedPrice, shares] = getWordAfter(orderDetail, "Shares", 8)
      .split(" ")
      .map(tryGetFloat)
      .filter((x) => x != undefined);
    if (!executedPrice) throw new Error("not found Execute Price");
    if (!shares) throw new Error("not found shares");
    const stockAmount = getFloat(getBefore(orderDetail, "Amount", 3));
    const vat: Vat = {
      commissionFee: getTax(orderDetail, "Commission"),
      secFee: getTax(orderDetail, "SEC"),
      tafFee: getTax(orderDetail, "TAF"),
      vat7: getTax(orderDetail, "VAT 7%"),
    };
    const allVatPrice = sumVat(vat);
    const diffPrice = 0;
    const diffVat = diffPrice - allVatPrice;
    return {
      kind: "slip",
      type: getType(this.words) as InvestmentType,
      symbol: getSymbol(this.words)!,
      stockAmount: stockAmount,
      allVatPrice,
      executedPrice,
      completionDate,
      vat,
      vatExecuted: diffPrice,
      diffVat,
      value: stockAmount,
      shares,
      submissionDate,
    };
  }
}
