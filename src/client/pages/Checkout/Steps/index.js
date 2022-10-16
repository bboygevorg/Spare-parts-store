import Auth from "./Auth";
import DeliveryAddress from "./DeliveryAddress";
import DeliveryType from "./DeliveryType";
import Summary from "./Summary";
import Payment from "./Payment";
import BillingAddress from "./BillingAddress";

export const stepsComponent = {
  Auth,
  DeliveryAddress,
  DeliveryType,
  BillingAddress,
  Payment,
  Summary,
};

export const courierSteps = {
  Auth,
  BillingAddress,
  Payment,
  Summary
}