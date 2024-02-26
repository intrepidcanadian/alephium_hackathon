export const formatAccumulatedInterest = (number) => {

  if (number === undefined || number === null) {
    console.error('Invalid input: number is undefined or null');
    return '0.00000'; 
  }

    try {
      const scaledValue = Number(BigInt(number)) / Number(10n ** 18n);
      const numericValue = scaledValue / 100;
      return numericValue.toFixed(5);
    } catch (error) {
      console.error('Error converting number to BigInt:', error);
      return 'Error'; 
    }
  };
  