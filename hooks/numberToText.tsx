export default function numberToText(theNumber: number): string {
  if (theNumber === undefined || theNumber <= 0) {
    return "";
  }

  const units = ["", "هزار", "میلیون", "میلیارد"];
  const parts: string[] = [];
  let num = Math.floor(theNumber);

  for (let i = 0; i < units.length && num > 0; i++) {
    const part = num % 1000;
    if (part !== 0) {
      parts.unshift(`${part} ${units[i]}`.trim());
    }
    num = Math.floor(num / 1000);
  }

  return parts.join(" و ") + " تومان";
}
