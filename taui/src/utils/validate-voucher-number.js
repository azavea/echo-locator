// @flow
// Returns true if `voucherNumber` is six to eight characters total, numeric,
// with optionally two letters prefixed.
export default function validateVoucherNumber (voucherNumber: string) {
  return /^\d{8}$/.test(voucherNumber) || /^[A-Z]{2}\d{6}$/.test(voucherNumber)
}
