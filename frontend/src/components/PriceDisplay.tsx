import React from "react";
import DirhamIcon from "./icons/DirhamIcon";

interface PriceDisplayProps {
  price: number;
  category: string;
  className?: string;
  iconClassName?: string;
  iconSize?: number | string;
}

const PriceDisplay = ({
  price,
  category,
  className = "",
  iconClassName = "w-4 h-4 inline-block mb-1",
  iconSize = 16,
}: PriceDisplayProps) => {
  const formattedPrice = price.toLocaleString();

  if (category === "rental") {
    return (
      <span className={className}>
        <DirhamIcon size={iconSize} className={iconClassName} />{" "}
        {formattedPrice} /yr
      </span>
    );
  }

  if (category === "off-plan") {
    return (
      <span className={className}>
        Starting from <DirhamIcon size={iconSize} className={iconClassName} />{" "}
        {formattedPrice}
      </span>
    );
  }

  return (
    <span className={className}>
      <DirhamIcon size={iconSize} className={iconClassName} /> {formattedPrice}
    </span>
  );
};

export default PriceDisplay;
