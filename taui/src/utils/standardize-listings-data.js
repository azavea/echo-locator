// @flow

export default function standardizeListingsData (fn: Function): Function {
  return function (...args: [any, 'BHA' | 'Realtor']) {
    const [data, type] = args
    switch (type) {
      case 'BHA':
        return fn({
          photos: data.photos,
          rent: data.Rent,
          beds: data['Bedroom Type'] === 'Studio' ? data['Bedroom Type'] : `${data['Bedroom Type']} Bed`,
          address: data['Apartment Number'] ? `${data.address.line} #${data['Apartment Number']}` : data.address,
          url: data.rdc_web_url,
          lat: data.lat,
          lon: data.lon
        })
      case 'Realtor':
        return fn({
          photos: data.photos,
          rent: data.price,
          beds: `${data.beds} Bed`,
          address: data.address.line,
          url: data.rdc_web_url,
          lat: data.address.lat,
          lon: data.address.lon
        })
    }
  }
}
