// @flow
// Returns true if `voucherNumber` is six to eight characters total,
// alphanumeric, and upper case.
export default function validateVoucherNumber(voucherNumber: string) {
  return /^[A-Z0-9]{6,8}$/.test(voucherNumber);
}
