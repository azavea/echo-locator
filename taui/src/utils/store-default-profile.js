// @flow
import Storage from '@aws-amplify/storage'

import {
  DEFAULT_ACCESSIBILITY_IMPORTANCE,
  DEFAULT_CRIME_IMPORTANCE,
  DEFAULT_SCHOOLS_IMPORTANCE
} from '../constants'
import type {AccountProfile} from '../types'

// Stores a profile with default settings to S3
// Returns the promise from the S3 operation
export default function storeDefaultProfile (voucher: string, key: string): Promise<any> {
  // Default profile
  const profile: AccountProfile = {
    destinations: [],
    favorites: [],
    hasVehicle: false,
    headOfHousehold: '',
    importanceAccessibility: DEFAULT_ACCESSIBILITY_IMPORTANCE,
    importanceSchools: DEFAULT_SCHOOLS_IMPORTANCE,
    importanceViolentCrime: DEFAULT_CRIME_IMPORTANCE,
    key: key,
    rooms: 0,
    useCommuterRail: true,
    voucherNumber: voucher
  }
  return Storage.put(key, JSON.stringify(profile))
}
