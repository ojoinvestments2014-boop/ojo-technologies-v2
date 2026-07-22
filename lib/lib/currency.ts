// Prices are stored as whole Kenyan shillings and US cents.

export function formatKes(kes: number): string {
  return `KSh ${kes.toLocaleString('en-KE')}`
}

export function formatUsd(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

// Convenience for showing both currencies together.
export function formatDual(kes: number, cents: number): string {
  return `${formatKes(kes)} / ${formatUsd(cents)}`
}
