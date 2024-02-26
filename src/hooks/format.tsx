
export const formatPercent = (number) => {
    const numericValue = BigInt(number);
  
    const intermediateValue = numericValue;
    let intermediateString = intermediateValue.toString();

    while (intermediateString.length < 3) {
      intermediateString = "0" + intermediateString;
    }

    const formattedPercent = intermediateString.slice(0, -2) + "." + intermediateString.slice(-2) + "%";
  
    return formattedPercent;
  };