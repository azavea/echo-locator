// @flow
import Icon from "@conveyal/woonerf/components/icon";
import { useTranslation } from "react-i18next";

import { getTier } from "../utils/scaling";

export default function RentalUnitsMeter({ totalMapc, town, value, id }) {
  const NUM_ICONS = 5;
  const AVERAGE_VALUE = 3;
  const { t } = useTranslation();

  if (value > NUM_ICONS || value < 0) {
    console.warn("Rental unit meter count out of range");
    if (value < 0) {
      value = 0;
    } else {
      value = NUM_ICONS;
    }
  }

  const unfilledCount = NUM_ICONS - value;
  const tier = getTier(value, "rental");

  const filledIcons = [];
  for (let i = 0; i < value; i++) {
    filledIcons.push(
      <span key={i} className={`rental-units-meter__icon rental-units-meter__icon--${tier}`}>
        <Icon type="home" />
      </span>
    );
  }

  const unfilledIcons = [];
  for (let i = 0; i < unfilledCount; i++) {
    unfilledIcons.push(
      <span key={i} className="rental-units-meter__icon">
        <Icon type="home" />
      </span>
    );
  }

  const averageRelation =
    value > AVERAGE_VALUE
      ? t("Tooltips.AboveAverage")
      : value < AVERAGE_VALUE
      ? t("Tooltips.BelowAverage")
      : t("Tooltips.Average");
  const tooltip = t("Tooltips.RentalUnits", {
    averageRelation,
    town,
    totalMapc: totalMapc ? totalMapc.toLocaleString() : t("UnknownValue"),
  });

  return (
    <div className="rental-units-meter" data-tip={tooltip} data-for={`tooltip-${id}`}>
      {filledIcons}
      {unfilledIcons}
    </div>
  );
}
