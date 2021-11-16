// @flow
import Auth from '@aws-amplify/auth'
import Storage from '@aws-amplify/storage'
import { withTranslation } from 'react-i18next'
import {PureComponent} from 'react'

import type {AccountProfile} from '../types'
import storeDefaultProfile from '../utils/store-default-profile'
import validateVoucherNumber from '../utils/validate-voucher-number'

/**
 * Search and select from accounts on S3.
 */
class SelectAccount extends PureComponent<Props> {
  state = {
    componentError: null,
    errorMessage: '',
    noResults: false,
    voucherNumber: ''
  }

  constructor (props) {
    super(props)

    this.changeVoucherNumber = this.changeVoucherNumber.bind(this)
    this.createAccount = this.createAccount.bind(this)
    this.selectAccount = this.selectAccount.bind(this)
    this.search = this.search.bind(this)
  }

  changeVoucherNumber (event) {
    this.setState({'voucherNumber': event.currentTarget.value})
    this.setState({errorMessage: '', noResults: false})
  }

  createAccount () {
    const search = this.search
    const voucher = this.state.voucherNumber.toUpperCase().replace(/\s+/g, '')
    const {t} = this.props

    if (!voucher) {
      this.setState({errorMessage: t('Accounts.MissingVoucherNumber')})
      return
    } else if (!validateVoucherNumber(voucher)) {
      this.setState({errorMessage: t('Accounts.InvalidVoucherNumber')})
      return
    } else {
      this.setState({errorMessage: ''})
    }

    storeDefaultProfile(voucher, voucher).then(result => {
      search() // Refresh results; will find and go to the new profile
    }).catch(err => {
      console.error('Failed to post new profile to S3')
      console.error(err)
      this.setState({errorMessage: t('Accounts.CreateError')})
    })
  }

  // given an s3 key, fetch the profile for that key and use it
  goToProfile (key: string) {
    const {t} = this.props
    Storage.get(key, {download: true, expires: 60}).then(result => {
      const text = result.Body.toString('utf-8')
      const profile: AccountProfile = JSON.parse(text)
      // Confirm key matches profile key
      if (key !== profile.key) {
        console.warn('Correcting profile key as counselor')
        profile.key = key
      }
      this.props.changeUserProfile(profile).then(didChange => {
        if (didChange) {
          // Skip profile page and go to map if profile exists and has destinations set
          const destination = profile && profile.destinations &&
            profile.destinations.length ? '/map' : '/profile'
          this.props.history.push({pathname: destination, state: {fromApp: true}})
        } else {
          // Failed to set profile (maybe due to voucher number mismatch; shouldn't get here)
          this.setState({errorMessage: t('Accounts.SelectError')})
        }
      })
    }).catch(err => {
      // If file not found, error message returned has `code` / `name`: NoSuchKey
      // and `message`: The specified key does not exist `statusCode`: 404
      // Should not happen, as key would not have been found by s3 list operation.
      if (err.code === 'NoSuchKey') {
        console.error('Failed to get key found on s3: ' + key)
        this.setState({noResults: true})
      } else {
        console.error(err.code)
        // This is an actual error.
        // `code`: CredentialsError will occur if attempting to access when not signed in
        // (should not happen)
        this.setState({errorMessage: t('Accounts.SelectError')})
        console.error('Failed to fetch account profile from S3 for key ' + key)
        console.error(err)
      }
    })
  }

  search () {
    const {t} = this.props
    // Capitalize and strip whitespace from voucher numbers to normalize
    const searchVoucher = this.state.voucherNumber.toUpperCase().replace(/\s+/g, '')
    if (!searchVoucher) {
      this.setState({errorMessage: t('Accounts.SearchError')})
      return
    } else if (!validateVoucherNumber(searchVoucher)) {
      this.setState({errorMessage: t('Accounts.InvalidVoucherNumber')})
      return
    } else {
      this.setState({errorMessage: ''})
    }
    this.selectAccount(searchVoucher)
  }

  selectAccount (voucher: string) {
    const {t} = this.props
    Auth.currentSession().then(data => {
      if (data && data.idToken && data.idToken.payload) {
        const groups = data.idToken.payload['cognito:groups']
        if (groups && groups.length > 0 && groups.indexOf('counselors') > -1) {
          console.log('user is a counselor')
          Storage.list(voucher).then(s3list => {
            console.log('found possible profile search results for voucher:')
            console.log(s3list)
            if (!s3list || s3list.length === 0) {
              this.setState({noResults: true})
            } else if (s3list.length === 1) {
              // Exactly one result, as expected. Ensure it is an exact match.
              const key = s3list[0].key
              if (key.split('_')[0] === voucher) {
                this.goToProfile(key)
              } else {
                this.setState({noResults: true})
              }
            } else {
              // s3list.length > 1
              // Attempt to handle multiple matches
              // Might happen if search overlapped another voucher, as length can vary
              // (i.e., searched for '123456' but found '12345678')
              // Might also happen if a counselor edited a previously-opened profile
              // after the client for that profile logged in for the first time,
              // which should be unusual but not impossible.
              console.log('Found more than one profile for voucher ' + voucher)
              var useKey = ''
              var clientMatches = 0
              var counselorMatch = false
              for (var i = 0; i < s3list.length; i++) {
                const key = s3list[i].key
                const splitKey = key.split('_')
                // Ensure it is an exact match
                if (splitKey[0] !== voucher) {
                  console.log('Found an inexact match for voucher, ignoring')
                  continue
                }
                if (splitKey.length === 1) {
                  console.log('Found a counselor-created profile')
                  counselorMatch = true
                  if (!useKey) {
                    useKey = key // use counselor-created profile, if nothing else matches
                  }
                } else if (splitKey.length === 2) {
                  console.log('Found a client-owned profile')
                  clientMatches += 1
                  useKey = key
                }
              }

              // Should not find more than one client-owned profile for a given voucher number.
              // Log it if it happens.
              if (clientMatches > 1) {
                console.error('Found ' + clientMatches + ' client profiles; should only have one')
              } else if (clientMatches > 0 && counselorMatch) {
                // In this case, the counselor-created profile should be deleted
                // and the client profile used instead.
                console.warn('Found both a client and a counselor-created profile; delete counselor-created copy')
                // Note this happens asynchronously from loading the client copy
                Storage.remove(voucher).then(result => {
                  console.log('Succeeded in removing counselor-created profile copy')
                }).catch(err => {
                  console.error('Failed to delete counselor-created profile copy')
                  console.error(err)
                })
              }

              if (useKey) {
                console.log('Going to load profile for key ' + useKey)
                this.goToProfile(useKey)
              } else {
                console.log('Found no useable matches, although there were results')
                this.setState({noResults: true})
              }
            }
          }).catch(err => {
            this.setState({errorMessage: t('Accounts.SelectError')})
            console.error('Failed to fetch s3 contents that match voucher ' + voucher)
            console.error(err)
          })
        } else {
          // Should not happen, as clients do not have access to this search page
          // and should have their profile retrieved automatically.
          // But if a client does get here and they search for themselves, go to their profile.
          // (S3 permissions will prevent them from loading anyone else's).
          console.warn('not a counselor, attempt to go directly to profile')
          Auth.currentUserInfo().then(data => {
            this.goToProfile(`${voucher}_${data.id}`)
          }).catch(err => {
            console.error(err)
          })
        }
      }
    }).catch(err => {
      console.error(err)
    })
  }

  render () {
    const changeVoucherNumber = this.changeVoucherNumber
    const createAccount = this.createAccount

    const state = this.state
    const {t} = this.props

    const search = (e) => {
      e.preventDefault()
      this.search()
    }

    return (
      <div className='form-screen'>
        <h2 className='form-screen__heading'>{t('Accounts.Title')}</h2>
        <div className='form-screen__main'>
          <div className='account-search'>
            <form onSubmit={search}>
              <div className='account-search__main'>
                <div className='account-search__field'>
                  <label
                    className='account-search__label'
                    htmlFor='voucher'>
                    {t('Accounts.Voucher')}
                  </label>
                  <input
                    className='account-search__input'
                    id='voucher'
                    type='text'
                    autoComplete='off'
                    onChange={changeVoucherNumber}
                    value={state.voucherNumber}
                  />
                </div>
                <button
                  className='account-search__button account-search__button--search'>
                  {t('Accounts.Search')}
                </button>
              </div>
            </form>
            {state.errorMessage &&
              <p className='account-search__error'>{state.errorMessage}</p>
            }
            {state.noResults && <div className='account-search__no-results'>
              <h2 className='account-search__no-results-heading'>{t('Accounts.NoResults')}</h2>
              <button
                className='account-search__button account-search__button--create'
                type='button'
                onClick={createAccount}>
                {t('Accounts.Create')}
              </button>
            </div>}
          </div>
        </div>
      </div>
    )
  }
}

export default withTranslation()(SelectAccount)
