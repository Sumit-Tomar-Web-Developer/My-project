// utils/taxDistribution.js (can be in same file)
// export const calculateRatio = (taxObj = {}) => {
//   const total = Number(taxObj?.TaxTotal ?? 0);
//   const ratio = {};
//   if (total <= 0) return ratio;
//   for (const key in taxObj) {
//     if (key === "TaxTotal" || key === "NetTotal") continue;
//     const val = Number(taxObj[key] ?? 0);
//     if (val <= 0) continue;
//     ratio[key] = val / total;
//   }
//   return ratio;
// };

// export const distributeTaxPayment = (pending = {}, current = {}, amountEntered) => {
//   let amount = Number(amountEntered);
//   if (!amount || amount <= 0) {
//     return { error: "Invalid amount", pendingPaid: {}, currentPaid: {}, advance: 0, misc: 0, message: "" };
//   }

//   const result = {
//     pendingPaid: {},
//     currentPaid: {},
//     advance: 0,
//     misc: 0,
//     message: "",
//     pendingCleared: false,
//     currentCleared: false,
//   };

//   const pendingTotal = Number(pending?.TaxTotal ?? 0);
//   const currentTotal = Number(current?.TaxTotal ?? 0);
//   const pendingRatio = calculateRatio(pending);
//   const currentRatio = calculateRatio(current);

//   // CASE A: payment less than pending (partial pending)
//   if (amount < pendingTotal) {
//     for (const key in pendingRatio) {
//       result.pendingPaid[key] = parseFloat((amount * pendingRatio[key]).toFixed(2));
//     }
//     result.pendingPaid.TaxTotal = amount;
//     result.pendingPaid.NetTotal = amount;
//     result.message = "Partial Pending Payment";
//     return result;
//   }

//   // pay full pending (if exists)
//   if (pendingTotal > 0) {
//     for (const key in pendingRatio) {
//       result.pendingPaid[key] = Number(pending[key] ?? 0);
//     }
//     result.pendingPaid.TaxTotal = pendingTotal;
//     result.pendingPaid.NetTotal = pendingTotal;
//   }
//   amount -= pendingTotal;
//   result.pendingCleared = pendingTotal > 0 && (amount >= 0);

//   // Now handle current
//   if (amount <= currentTotal) {
//     // partial current
//     for (const key in currentRatio) {
//       result.currentPaid[key] = parseFloat((amount * currentRatio[key]).toFixed(2));
//     }
//     result.currentPaid.TaxTotal = amount;
//     result.currentPaid.NetTotal = amount;
//     result.message = result.pendingTotal > 0 ? "Pending Cleared + Partial Current" : "Partial Current Payment";
//     return result;
//   }

//   // clear current
//   if (currentTotal > 0) {
//     for (const key in currentRatio) {
//       result.currentPaid[key] = Number(current[key] ?? 0);
//     }
//     result.currentPaid.TaxTotal = currentTotal;
//     result.currentPaid.NetTotal = currentTotal;
//   }
//   amount -= currentTotal;
//   result.currentCleared = currentTotal > 0 && (amount >= 0);

//   // amount > 0 => advance/misc
//   if (amount > 0) {
//     result.advance = parseFloat(amount.toFixed(2));
//     result.misc = result.advance; // save to MiscellaneousFee by your rule
//     result.message = "Pending + Current Cleared, Advance added to Misc.";
//   } else {
//     result.message = "Pending + Current Cleared";
//   }

//   return result;
// };

// utils/taxDistribution.js
export const calculateRatio = (taxObj = {}) => {
  const total = Number(taxObj?.TaxTotal ?? 0);
  const ratio = {};
  if (total <= 0) return ratio;
  for (const key in taxObj) {
    if (key === "TaxTotal" || key === "NetTotal") continue;
    const val = Number(taxObj[key] ?? 0);
    if (val <= 0) continue;
    ratio[key] = val / total;
  }
  return ratio;
};

/**
 * Distribute a payment amount across pending + current taxes with these rules:
 * - If amount < pendingTotal => allocate proportionally to pending only (partial pending)
 * - Otherwise pay full pending first, then allocate remainder to current (partial or full)
 * - If after clearing pending+current there's leftover => advance/misc
 *
 * Returns:
 * {
 *   pendingPaid: { PropertyTax: x, ... , TaxTotal, NetTotal },
 *   currentPaid: { ... },
 *   advance: number,
 *   misc: number,
 *   message: string,
 *   pendingCleared: boolean,
 *   currentCleared: boolean
 * }
 */
export const distributeTaxPayment = (pending = {}, current = {}, amountEntered) => {
  let amount = Number(amountEntered);
  if (!amount || amount <= 0) {
    return { error: "Invalid amount", pendingPaid: {}, currentPaid: {}, advance: 0, misc: 0, message: "" };
  }

  const result = {
    pendingPaid: {},
    currentPaid: {},
    advance: 0,
    misc: 0,
    message: "",
    pendingCleared: false,
    currentCleared: false,
  };

  const pendingTotal = Number(pending?.TaxTotal ?? 0);
  const currentTotal = Number(current?.TaxTotal ?? 0);
  const pendingRatio = calculateRatio(pending);
  const currentRatio = calculateRatio(current);

  // CASE 1: amount < pendingTotal -> partial pending only
  if (amount > 0 && pendingTotal > 0 && amount < pendingTotal) {
    for (const key in pendingRatio) {
      result.pendingPaid[key] = parseFloat((amount * pendingRatio[key]).toFixed(2));
    }
    result.pendingPaid.TaxTotal = parseFloat(amount.toFixed(2));
    result.pendingPaid.NetTotal = parseFloat(amount.toFixed(2));
    result.message = "Partial Pending Payment";
    return result;
  }

  // Pay full pending (if exists)
  if (pendingTotal > 0) {
    for (const key in pendingRatio) {
      result.pendingPaid[key] = Number(pending[key] ?? 0);
    }
    result.pendingPaid.TaxTotal = pendingTotal;
    result.pendingPaid.NetTotal = pendingTotal;
  }
  amount = parseFloat((amount - pendingTotal).toFixed(2)); // remaining after pending
  result.pendingCleared = pendingTotal > 0 && (amount >= 0);

  // Now allocate to current
  if (amount > 0 && currentTotal > 0 && amount < currentTotal) {
    // partial current
    for (const key in currentRatio) {
      result.currentPaid[key] = parseFloat((amount * currentRatio[key]).toFixed(2));
    }
    result.currentPaid.TaxTotal = parseFloat(amount.toFixed(2));
    result.currentPaid.NetTotal = parseFloat(amount.toFixed(2));
    result.message = result.pendingCleared ? "Pending Cleared + Partial Current" : "Partial Current Payment";
    return result;
  }

  // Pay full current (if exists)
  if (currentTotal > 0) {
    for (const key in currentRatio) {
      result.currentPaid[key] = Number(current[key] ?? 0);
    }
    result.currentPaid.TaxTotal = currentTotal;
    result.currentPaid.NetTotal = currentTotal;
  }
  amount = parseFloat((amount - currentTotal).toFixed(2));
  result.currentCleared = currentTotal > 0 && (amount >= 0);

  // If leftover -> advance / misc
  if (amount > 0) {
    result.advance = parseFloat(amount.toFixed(2));
    result.misc = parseFloat(amount.toFixed(2)); // per your rule save to MiscellaneousFee
    result.message = "Pending + Current Cleared, Advance added to Misc.";
  } else {
    result.message = "Pending + Current Cleared";
  }

  return result;
};
