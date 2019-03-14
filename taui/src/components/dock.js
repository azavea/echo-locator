// @flow
import Icon from '@conveyal/woonerf/components/icon'
import message from '@conveyal/woonerf/message'
import {PureComponent} from 'react'

type Props = {
  geocode: (string, Function) => void,
  reverseGeocode: (string, Function) => void,
  showSpinner: boolean
}

/**
 * Sidebar content.
 */
export default class Dock extends PureComponent<Props> {
  props: Props

  constructor (props) {
    super(props)

    this.state = {
      componentError: props.componentError
    }
  }

  render () {
    const {children, showSpinner} = this.props
    const {componentError} = this.state

    return <div className='Taui-Dock'>
      <div className='Taui-Dock-content'>
        <div className='title'>
          {showSpinner
            ? <Icon type='spinner' className='fa-spin' />
            : <Icon type='map' />}
          {' '}
          {message('Title')}
        </div>
        {componentError &&
          <div>
            <h1>Error</h1>
            <p>componentError.info}</p>
          </div>}
        {children}
      </div>
    </div>
  }
}
