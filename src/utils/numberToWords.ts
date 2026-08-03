export function numberToWords(amount: number): string {

    const formatter = new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    });

    return `${formatter.format(amount)} Rupees Only`;
}