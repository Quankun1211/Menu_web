import { useNotification } from "../context/NotifycationContex";

export const lazyLoad = (importFunc: () => Promise<any>) => {
    return async () => {
        const module = await importFunc()
        return { Component: module.default }
    }
}

export const formatVND = (price: any) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);
};
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';

  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const formatStepTime = (dateString: string | undefined) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};
export const calcSale = (price: number, salePercent: number) => {
    return formatVND(price - (price * (salePercent / 100)))
}
export const calcSalePrice = (
  price: number,
  salePercent?: number | null
): number => {
  if (!salePercent || salePercent <= 0) return price

  return Math.round(price * (100 - salePercent) / 100)
}
export const formatDisplayQuantity = (quantity: any, unit: string | undefined) => {
  if (!unit) return quantity?.toString() || "";

  const normalizedUnit = unit.toLowerCase().trim();
  const num = Number(quantity);

  if (typeof quantity === 'string' && quantity.includes('/')) {
    return `${quantity} ${unit}`;
  }

  if ((normalizedUnit === 'kg' || normalizedUnit === 'kilogram') && num < 1 && num > 0) {
    return `${num * 1000} g`;
  }

  const unitMatch = unit.match(/(\d+(?:\.\d+)?)\s*(g|kg|ml|l)?/i);

  if (unitMatch && num > 0 && num < 1) {
    const baseValue = parseFloat(unitMatch[1]);
    const subUnit = unitMatch[2] || ""; 
    const calculatedValue = baseValue * num;

    const finalValue = calculatedValue < 1 
      ? calculatedValue.toFixed(2) 
      : parseFloat(calculatedValue.toFixed(1));

    const prefix = unit.replace(unitMatch[0], "").trim();

    if (prefix) {
      return `${finalValue}${subUnit}/${prefix}`;
    }
    return `${finalValue}${subUnit}`;
  }

  const hasNumberInUnit = /\d/.test(unit);
  if (hasNumberInUnit && (num >= 10 || num === 0)) {
    return unit;
  }

  const formattedNum = !isNaN(num) ? parseFloat(num.toFixed(3)) : quantity;
  return `${formattedNum} ${unit}`.trim();
};