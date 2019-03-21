// @flow
import message from '@conveyal/woonerf/message'

export default function NeighborhoodDetails ({neighborhood}) {
  if (!neighborhood) {
    return null
  }

  console.log('Show details for neighborhood:')
  console.log(neighborhood)

  return (
    <div className='Card'>
      <h2>Hello details</h2>
    </div>
  )
}
