/**
 * Converts a string into a valid C symbol
 * @param inputSymbol Preferred name for symbol
 * @returns valid C symbol
 */
export const toValidSymbol = (inputSymbol: string) => {
  const symbol = String(inputSymbol)
    .toLowerCase()
    // Strip anything but alphanumeric
    .replace(/[^a-z0-9_]/g, "_")
    // Squash repeating underscores
    .replace(/[_]+/, "_")
    // Limit to 27 chars to leave room for _NNN postfix while keeping within C's 31 unique char limit
    .substring(0, 27);
  if (symbol.match(/^\d/)) {
    // Starts with a number
    return `_${symbol}`;
  }
  return symbol;
};

/**
 * Generates the next unique symbol given a preferred name and an array of existing symbols.
 * When symbol already exists will append an incrementing numeric value
 * @param inputSymbol Preferred name for symbol
 * @param existingSymbols Array of existing symbols
 * @returns unique C symbol
 */
export const genSymbol = (inputSymbol: string, existingSymbols: string[]) => {
  const initialSymbol = toValidSymbol(inputSymbol);
  let symbol = initialSymbol;
  let count = 0;
  while (existingSymbols.includes(symbol)) {
    symbol = `${initialSymbol.replace(/_[0-9]+/, "")}_${count++}`;
  }
  return symbol;
};
