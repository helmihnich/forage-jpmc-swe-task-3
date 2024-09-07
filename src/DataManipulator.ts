import { ServerRespond } from './DataStreamer';

export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
  timestamp: Date,
}

export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    // Constants for bounds
    const RATIO_THRESHOLD = 0.05;
    const upperBound = 1 + RATIO_THRESHOLD;
    const lowerBound = 1 - RATIO_THRESHOLD;

    // Destructure the server responses for easier reference
    const [abcRespond, defRespond] = serverRespond;

    // Calculate prices
    const priceABC = (abcRespond.top_ask.price + abcRespond.top_bid.price) / 2;
    const priceDEF = (defRespond.top_ask.price + defRespond.top_bid.price) / 2;
    const ratio = priceABC / priceDEF;

    // Return the Row object with trigger alert if the ratio is out of bounds
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp: abcRespond.timestamp > defRespond.timestamp ? abcRespond.timestamp : defRespond.timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,
    };
  }
}
