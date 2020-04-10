// @flow
import lonlat from '@conveyal/lonlat'
import Leaflet from 'leaflet'
import debounce from 'lodash/debounce'
import get from 'lodash/get'
import React, {PureComponent} from 'react'
import {
  Map as LeafletMap,
  Marker,
  Popup,
  TileLayer,
  ZoomControl
} from 'react-leaflet'

import {NEIGHBORHOOD_ACTIVE_BOUNDS_STYLE} from '../constants'
import type {
  Coordinate,
  Location,
  LonLat,
  MapEvent
} from '../types'

import DrawNeighborhoodBounds from './draw-neighborhood-bounds'
import DrawRoute from './draw-route'
import VGrid from './vector-grid'

const TILE_URL = Leaflet.Browser.retina && process.env.LEAFLET_RETINA_URL
  ? process.env.LEAFLET_RETINA_URL
  : process.env.LEAFLET_TILE_URL

const LABEL_URL = Leaflet.Browser.retina && process.env.LABEL_RETINA_URL
  ? process.env.LABEL_RETINA_URL
  : process.env.LABEL_URL

const TILE_OPTIONS = {
  attribution: process.env.LEAFLET_ATTRIBUTION,
  tileSize: 512,
  zoomOffset: -1
}

const iconWidth = 20
const iconHeight = 20
const iconSize = [iconWidth, iconHeight]
const iconAnchor = [iconWidth / 2, iconHeight + 13] // height plus the pointer size
const iconHTML = '' // <div className="innerMarker"></div>'

const endIcon = Leaflet.divIcon({
  className: 'LeafletIcon End map__marker map__marker--end',
  html: iconHTML,
  iconAnchor,
  iconSize
})

const startIcon = Leaflet.divIcon({
  className: 'LeafletIcon Start map__marker map__marker--start',
  html: iconHTML,
  iconAnchor,
  iconSize
})

const otherIcon = Leaflet.divIcon({
  className: 'LeafletIcon Other map__marker map__marker--other',
  html: iconHTML,
  iconAnchor,
  iconSize
})

type Props = {
  centerCoordinates: Coordinate,
  clearStartAndEnd: () => void,
  drawIsochrones: Function[],
  drawOpportunityDatasets: Function[],
  drawRoute: any,
  end: null | Location,
  isLoading: boolean,
  pointsOfInterest: void | any, // FeatureCollection
  routableNeighborhoods: any,
  setEndPosition: LonLat => void,
  setStartPosition: LonLat => void,
  start: null | Location,
  updateEnd: () => void,
  updateMap: any => void,
  updateOrigin: () => void,
  updateStart: () => void,
  zoom: number
}

type State = {
  lastClickedLabel: null | string,
  lastClickedPosition: null | Coordinate,
  showSelectStartOrEnd: boolean,
}

/**
 *
 */
export default class Map extends PureComponent<Props, State> {
  constructor (props) {
    super(props)

    this.state = {
      data: dataListings
    }

    this.clickNeighborhood = this.clickNeighborhood.bind(this)
    this.hoverNeighborhood = this.hoverNeighborhood.bind(this)
  }

  state = {
    lastClickedLabel: null,
    lastClickedPosition: null,
    showSelectStartOrEnd: false
  }

  componentDidCatch (error) {
    console.error(error)
  }

  componentWillReceiveProps (nextProps) {
    const needToZoomOut = !nextProps.showDetails && this.props.showDetails
    const map = this.refs ? get(this.refs, 'map.leafletElement') : null

    if (needToZoomOut && nextProps.neighborhoodBoundsExtent) {
      map.fitBounds(nextProps.neighborhoodBoundsExtent)
    }
  }

  // Click on map marker for a neighborhood
  clickNeighborhood = (feature) => {
    // only go to routable neighborhood details
    if (feature.properties.routable) {
      this.props.setShowDetails(true)
      this.props.setActiveNeighborhood(feature.properties.id)
    } else {
      console.warn('clicked unroutable neighborhood ' + feature.properties.id)
    }
  }

  // Debounced version of setActiveNeighborhood used on hover
  debouncedSetActive = debounce(this.props.setActiveNeighborhood, 100)

  // Hover over neighborhood map bounds or marker
  hoverNeighborhood = (feature, event) => {
    if (this.props.showDetails || !feature || !feature.properties) return
    if (feature.properties.routable) {
      this.debouncedSetActive(feature.properties.id)
    }
  }

  /**
   * Reset state
   */
  _clearState () {
    this.setState({
      lastClickedLabel: null,
      lastClickedPosition: null,
      showSelectStartOrEnd: false
    })
  }

  _clearStartAndEnd = (): void => {
    this.props.clearStartAndEnd()
    this._clearState()
  }

  _onMapClick = (e: Leaflet.MouseEvent): void => {
    this.setState((previousState) => ({
      lastClickedPosition: e.latlng || e.target._latlng,
      showSelectStartOrEnd: !previousState.showSelectStartOrEnd
    }))
  }

  _setEnd = (): void => {
    const p = this.props
    const s = this.state
    if (s.lastClickedPosition) {
      const position = lonlat(s.lastClickedPosition)
      if (s.lastClickedLabel) p.updateEnd({label: s.lastClickedLabel, position})
      else p.setEndPosition(position)
    }
    this._clearState()
  }

  _setStart = (): void => {
    const p = this.props
    const s = this.state
    if (s.lastClickedPosition) {
      const position = lonlat(s.lastClickedPosition)
      if (s.lastClickedLabel) p.updateStart({label: s.lastClickedLabel, position})
      else p.setStartPosition(position)
    }
    this._clearState()
  }

  _setZoom = (e: MapEvent) => {
    const zoom = e.target._zoom
    this.props.updateMap({zoom})
  }

  _clickPoi = (feature) => {
    this.setState({
      lastClickedLabel: feature.properties.label,
      lastClickedPosition: lonlat.toLeaflet(feature.geometry.coordinates),
      showSelectStartOrEnd: true
    })
  }

  _key = 0
  _getKey () { return this._key++ }

  /* eslint complexity: 0 */
  render () {
    const p = this.props
    const clickNeighborhood = this.clickNeighborhood
    const hoverNeighborhood = this.hoverNeighborhood
    const styleNeighborhood = this.styleNeighborhood

    // Index elements with keys to reset them when elements are added / removed
    this._key = 0
    let zIndex = 0
    const getZIndex = () => zIndex++

    return (
      p.routableNeighborhoods ? <LeafletMap
        bounds={p.neighborhoodBoundsExtent}
        center={p.centerCoordinates}
        className='Taui-Map map'
        onZoomend={this._setZoom}
        zoom={p.zoom}
        onClick={this._onMapClick}
        ref='map'
        zoomControl={false}
      >
        <ZoomControl position='topright' />
        <TileLayer
          {...TILE_OPTIONS}
          url={TILE_URL}
          zIndex={getZIndex()}
        />

        {LABEL_URL &&
          <TileLayer
            {...TILE_OPTIONS}
            key={`tile-layer-${this._getKey()}`}
            url={LABEL_URL}
            zIndex={getZIndex()}
          />}

        {p.showRoutes && p.drawRoute &&
          <DrawRoute
            {...p.drawRoute}
            activeNeighborhood={p.activeNeighborhood}
            key={`draw-routes-${p.drawRoute.id}-${this._getKey()}`}
            showDetails={p.showDetails}
            zIndex={getZIndex()}
          />}

        {!p.isLoading && p.routableNeighborhoods &&
          <DrawNeighborhoodBounds
            key={`start-${this._getKey()}`}
            clickNeighborhood={clickNeighborhood}
            hoverNeighborhood={hoverNeighborhood}
            neighborhoods={p.routableNeighborhoods}
            styleNeighborhood={styleNeighborhood}
            zIndex={getZIndex()}
          />}

        {!p.isLoading && p.activeNeighborhoodBounds &&
          <VGrid
            data={p.activeNeighborhoodBounds}
            interactive={false}
            key={`active-bounds-${p.activeNeighborhood}-${this._getKey()}`}
            vectorTileLayerStyles={
              {'sliced': NEIGHBORHOOD_ACTIVE_BOUNDS_STYLE}
            }
            zIndex={getZIndex()}
          />}

        {p.origin &&
          <Marker
            icon={startIcon}
            key={`start-${this._getKey()}`}
            position={p.origin.position}
            zIndex={getZIndex()}>
            <Popup>
              <span>{p.origin.label}</span>
            </Popup>
          </Marker>}

        {/*
          this.state.data.map((item, key) =>
            <Marker
              icon={otherIcon}
              key={`listings-${this._getKey()}`}
              position={[item.lat,item.lon]}
              zIndex={getZIndex()}>
            </Marker>
          )
        */}

        {
          p.showListings && p.activeNeighborhood === '02474' && this.state.data.map((item, key) =>
            <Marker
              key={`listings-${this._getKey()}`}
              position={[item.lat,item.lon]}
              zIndex={getZIndex()}>
            </Marker>
          )
        }



        {!p.showDetails && p.displayNeighborhoods && p.displayNeighborhoods.length &&
          p.displayNeighborhoods.map((n) =>
            <Marker
              icon={n.properties.id === p.activeNeighborhood ? endIcon : otherIcon}
              key={`n-${n.properties.id}-${this._getKey()}`}
              onClick={(e) => clickNeighborhood(n)}
              onHover={(e) => hoverNeighborhood(n)}
              position={lonlat.toLeaflet(n.geometry.coordinates)}
              zIndex={getZIndex()}
            />)
          }
      </LeafletMap> : null
    )
  }
  /* eslint complexity: 1 */
}


const dataListings = [{"property_id":"4170286274","listing_id":"585174405","prop_type":"apartment","last_update":"2020-04-05T08:21:00.000Z","address":"39 Hospital Rd in Brattle, Arlington, 02474","prop_status":"for_rent","list_date":"2015-12-18T13:58:00Z","is_showcase":true,"has_specials":false,"price":"$0/mo","beds":"S-3","baths":"1-3","sqft":"591+ sq ft","name":"Arlington 360","photo":"https://ar.rdcpix.com/62dc7be8af2ebb38c72919f7dcff9efac-f3801595429o.jpg","short_price":"$0/mo","photo_count":102,"products":["enhanced","management_other_listings","management_company_logo","management_company_name","management_company_website","_COMMUNITY_RENTAL","_COMMUNITY_RENTAL","_COMMUNITY_RENTAL","_COMMUNITY_RENTAL","_COMMUNITY_RENTAL"],"lat":42.42433,"lon":-71.16171,"community_id":"1320253","has_leadform":true,"source":"community","page_no":1,"rank":1,"list_tracking":"type|property|data|prop_id|4170286274|list_id|585174405|comm_id|1320253|page|rank|list_branding|listing_agent|listing_office|property_status|product_code|advantage_code^1|1|0|1|3K2|E8|0^^$0|1|2|$3|4|5|6|7|8|9|H|A|I|B|$C|J|D|K]|E|L|F|M|G|N]]"},{"property_id":"3015792235","listing_id":"585161713","prop_type":"apartment","last_update":"2020-04-05T08:21:00.000Z","address":"438 Massachusetts Ave in Arlington Center, Arlington, 02474","prop_status":"for_rent","price_raw":2300,"list_date":"2015-12-18T13:58:00Z","is_showcase":true,"has_specials":false,"price":"$2,300+/mo","beds":"1-2","baths":"1-2","sqft":"795+ sq ft","name":"The Legacy at Arlington Center","photo":"https://ar.rdcpix.com/1737498896/42462343915a3a07b996123d404b379ac-f0o.jpg","short_price":"$2,300+/mo","photo_count":71,"products":["enhanced","management_other_listings","management_company_logo","management_company_name","management_company_website","_COMMUNITY_RENTAL","_COMMUNITY_RENTAL","_COMMUNITY_RENTAL","_COMMUNITY_RENTAL","_COMMUNITY_RENTAL"],"lat":42.41394,"lon":-71.15135,"community_id":"1303993","pet_policy":"Dogs & Cats OK","has_leadform":true,"source":"community","page_no":1,"rank":2,"list_tracking":"type|property|data|prop_id|3015792235|list_id|585161713|comm_id|1303993|page|rank|list_branding|listing_agent|listing_office|property_status|product_code|advantage_code^1|2|0|1|3K2|E8|0^^$0|1|2|$3|4|5|6|7|8|9|H|A|I|B|$C|J|D|K]|E|L|F|M|G|N]]"},{"property_id":"9631370599","listing_id":"2704780478","prop_type":"apartment","last_update":"2020-04-05T08:21:00.000Z","address":"0 Brattle Dr Apt 12, Arlington, 02474","prop_status":"for_rent","price_raw":1400,"list_date":"2019-10-02T03:42:00Z","is_showcase":true,"has_specials":false,"price":"$1,400+/mo","beds":"S-2","baths":"1","sqft":"374+ sq ft","name":"Brattle Drive Apartments","photo":"https://ar.rdcpix.com/946123049/7d7891f45fe9b99b56679f7c0205720dc-f0o.jpg","short_price":"$1,400+/mo","photo_count":13,"products":["enhanced","management_other_listings","management_company_logo","management_company_name","management_company_website","_COMMUNITY_RENTAL","_COMMUNITY_RENTAL","_COMMUNITY_RENTAL","_COMMUNITY_RENTAL","_COMMUNITY_RENTAL"],"lat":42.4204124564575,"lon":-71.1567140532529,"community_id":"2073817","pet_policy":"Dogs & Cats OK","has_leadform":true,"source":"community","page_no":1,"rank":3,"list_tracking":"type|property|data|prop_id|9631370599|list_id|2704780478|comm_id|2073817|page|rank|list_branding|listing_agent|listing_office|property_status|product_code|advantage_code^1|3|0|1|3K2|E8|0^^$0|1|2|$3|4|5|6|7|8|9|H|A|I|B|$C|J|D|K]|E|L|F|M|G|N]]"},{"property_id":"3417998693","listing_id":"2914245570","prop_type":"apartment","last_update":"2020-04-06T04:55:13.52Z","address":"18 Hamilton Rd Apt 106 in East Arlington, Arlington, 02474","prop_status":"for_rent","price_raw":1750,"is_showcase":true,"has_specials":false,"price":"$1,750/mo","beds":"S","baths":"1","sqft":"360 sq ft","name":" ","photo":"https://ar.rdcpix.com/3b6cc3cb32507a6ca892db1f1ea76ad2c-f84658063o.jpg","short_price":"$1,750/mo","photo_count":7,"products":["enhanced","management_other_listings","management_company_logo","management_company_name","management_company_website","_COMMUNITY_RENTAL","_COMMUNITY_RENTAL","_COMMUNITY_RENTAL","_COMMUNITY_RENTAL","_COMMUNITY_RENTAL"],"lat":42.406503,"lon":-71.148317,"community_id":"2170834","has_leadform":true,"source":"community","page_no":1,"rank":4,"list_tracking":"type|property|data|prop_id|3417998693|list_id|2914245570|comm_id|2170834|page|rank|list_branding|listing_agent|listing_office|property_status|product_code|advantage_code^1|4|0|0|3K2|E8|0^^$0|1|2|$3|4|5|6|7|8|9|H|A|I|B|$C|J|D|K]|E|L|F|M|G|N]]"},{"property_id":"9592664957","listing_id":"2912676089","prop_type":"apartment","last_update":"2020-04-06T20:24:30.000Z","address":"4 Brattle Dr Apt 26 in Brattle, Arlington, 02474","prop_status":"for_rent","price_raw":1750,"is_showcase":false,"has_specials":false,"price":"$1,750/mo","beds":"S","baths":"1","sqft":"sq ft N/A","photo":"https://ap.rdcpix.com/da729c9e2b93fd2650676b276ac6b420l-m2878355682s.jpg","short_price":"$1,750/mo","baths_full":1,"photo_count":7,"products":["_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL"],"lat":42.422239,"lon":-71.166463,"has_leadform":true,"source":"unit_rental","page_no":1,"rank":5,"list_tracking":"type|property|data|prop_id|9592664957|list_id|2912676089|page|rank|list_branding|listing_agent|listing_office|property_status|product_code|advantage_code^1|5|0|1|3YA|W|0^^$0|1|2|$3|4|5|6|7|F|8|G|9|$A|H|B|I]|C|J|D|K|E|L]]"},{"property_id":"9205580614","listing_id":"2914160645","prop_type":"apartment","last_update":"2020-04-06T20:24:30.000Z","address":"333 Massachusetts Ave Apt 8 in East Arlington, Arlington, 02474","prop_status":"for_rent","price_raw":1950,"is_showcase":false,"has_specials":false,"price":"$1,950/mo","beds":"1","baths":"1","sqft":"sq ft N/A","photo":"https://ap.rdcpix.com/9cd4ee1281553bc531a02eedf11d7eadl-m520089210s.jpg","short_price":"$1,950/mo","baths_full":1,"photo_count":4,"products":["_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL"],"lat":42.410703,"lon":-71.147519,"has_leadform":true,"source":"unit_rental","page_no":1,"rank":6,"list_tracking":"type|property|data|prop_id|9205580614|list_id|2914160645|page|rank|list_branding|listing_agent|listing_office|property_status|product_code|advantage_code^1|6|0|1|3YA|W|0^^$0|1|2|$3|4|5|6|7|F|8|G|9|$A|H|B|I]|C|J|D|K|E|L]]"},{"property_id":"3699841016","listing_id":"2914975826","prop_type":"apartment","last_update":"2020-04-06T20:08:37.000Z","address":"122 Decatur St Unit 5F in East Arlington, Arlington, 02474","prop_status":"for_rent","price_raw":1895,"sqft_raw":800,"is_showcase":false,"has_specials":false,"price":"$1,895/mo","beds":"2","baths":"1","sqft":"800 sq ft","photo":"https://ap.rdcpix.com/8badd52d18e3ad039c5bce04bcffd92dl-m1983873042s.jpg","short_price":"$1,895/mo","baths_full":1,"photo_count":31,"products":["_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL"],"lat":42.41428,"lon":-71.137662,"has_leadform":true,"source":"unit_rental","page_no":1,"rank":7,"list_tracking":"type|property|data|prop_id|3699841016|list_id|2914975826|page|rank|list_branding|listing_agent|listing_office|property_status|product_code|advantage_code^1|7|0|1|3YA|W|0^^$0|1|2|$3|4|5|6|7|F|8|G|9|$A|H|B|I]|C|J|D|K|E|L]]"},{"property_id":"4619042753","listing_id":"2915014848","prop_type":"condo","last_update":"2020-04-05T12:34:00.000Z","address":"12 Pond Ln Apt 40 in Arlington Center, Arlington, 02474","prop_status":"for_rent","price_raw":2050,"sqft_raw":884,"list_date":"2020-04-05T16:35:23Z","is_showcase":false,"has_specials":false,"price":"$2,050/mo","beds":"2","baths":"1","sqft":"884 sq ft","lot_size":"9,999 sq ft lot","photo":"https://ap.rdcpix.com/22c4603f6e7d63bba620986e38a335c4l-m918773857s.jpg","short_price":"$2,050/mo","price_reduced":false,"baths_full":1,"photo_count":26,"products":["core.agent","basic_opt_in"],"lat":42.41201,"lon":-71.15002,"is_new_listing":true,"has_leadform":true,"source":"mls","page_no":1,"rank":8,"list_tracking":"type|property|data|prop_id|4619042753|list_id|2915014848|page|rank|list_branding|listing_agent|listing_office|advertiser_id|agent|office|property_status|product_code|advantage_code^1|8|0|1|1A088|N35A|76|2|1^^$0|1|2|$3|4|5|6|7|I|8|J|9|$A|K|B|L]|C|$D|M|E|N]|F|O|G|P|H|Q]]"},{"property_id":"4579144227","listing_id":"2914298115","prop_type":"single_family","last_update":"2020-03-21T03:05:00.000Z","address":"42 Old Mystic St in Morningside, Arlington, 02474","prop_status":"for_rent","price_raw":5500,"sqft_raw":3569,"list_date":"2020-03-17T18:31:29Z","is_showcase":false,"has_specials":false,"price":"$5,500/mo","beds":"5","baths":"4","sqft":"3,569 sq ft","lot_size":"9,429 sq ft lot","photo":"https://ap.rdcpix.com/02bf563fb592a95b52c66067fee93cd6l-w2927459573s.jpg","short_price":"$5,500/mo","price_reduced":false,"baths_half":1,"baths_full":3,"photo_count":24,"products":["core.agent","core.broker"],"lat":42.430769,"lon":-71.155224,"has_leadform":true,"source":"mls","page_no":1,"rank":9,"list_tracking":"type|property|data|prop_id|4579144227|list_id|2914298115|page|rank|list_branding|listing_agent|listing_office|advertiser_id|agent|office|property_status|product_code|advantage_code^1|9|0|1|5FN|2HCH|3CY|0|5^^$0|1|2|$3|4|5|6|7|I|8|J|9|$A|K|B|L]|C|$D|M|E|N]|F|O|G|P|H|Q]]"},{"property_id":"9206140164","listing_id":"2914141088","prop_type":"condo","last_update":"2020-03-16T03:05:00.000Z","address":"8 Cornell St Unit 10 in East Arlington, Arlington, 02474","prop_status":"for_rent","price_raw":2850,"sqft_raw":912,"list_date":"2020-03-12T20:23:12Z","is_showcase":false,"has_specials":false,"price":"$2,850/mo","beds":"2","baths":"1","sqft":"912 sq ft","lot_size":"4,500 sq ft lot","photo":"https://ap.rdcpix.com/f26aad4ba4d007a278ea1dfb454236b7l-m1495131820s.jpg","short_price":"$2,850/mo","price_reduced":false,"baths_full":1,"photo_count":22,"products":["core.agent","basic_opt_in"],"lat":42.412996,"lon":-71.141268,"has_leadform":true,"source":"mls","page_no":1,"rank":10,"list_tracking":"type|property|data|prop_id|9206140164|list_id|2914141088|page|rank|list_branding|listing_agent|listing_office|advertiser_id|agent|property_status|product_code|advantage_code^1|A|0|1|ZKPX|3CY|2|1^^$0|1|2|$3|4|5|6|7|H|8|I|9|$A|J|B|K]|C|$D|L]|E|M|F|N|G|O]]"},{"property_id":"3419320304","listing_id":"2866486900","prop_type":"townhome","last_update":"2020-04-04T03:05:00.000Z","address":"86 Summer St Apt 13 in Arlington Center, Arlington, 02474","prop_status":"for_rent","price_raw":3000,"sqft_raw":2166,"list_date":"2019-12-20T19:04:08Z","is_showcase":false,"has_specials":false,"price":"$3,000/mo","beds":"3","baths":"3","sqft":"2,166 sq ft","lot_size":"9,999 sq ft lot","photo":"https://ap.rdcpix.com/1e008ddc5b00f324e726a2c175ce8ec5l-m833216948s.jpg","short_price":"$3,000/mo","price_reduced":true,"price_reduced_date":"2020-03-31T20:39:28.34Z","baths_half":1,"baths_full":2,"photo_count":21,"products":["core.agent","basic_opt_in"],"lat":42.418812,"lon":-71.157245,"has_leadform":true,"source":"mls","page_no":1,"rank":11,"list_tracking":"type|property|data|prop_id|3419320304|list_id|2866486900|page|rank|list_branding|listing_agent|listing_office|advertiser_id|agent|office|property_status|product_code|advantage_code^1|B|0|1|1WQLL|1RH7E|3CY|2|1^^$0|1|2|$3|4|5|6|7|I|8|J|9|$A|K|B|L]|C|$D|M|E|N]|F|O|G|P|H|Q]]"},{"property_id":"9048803090","listing_id":"2914251915","prop_type":"townhome","last_update":"2020-03-20T03:05:00.000Z","address":"38 Hayes St Unit 2 in Arlington Center, Arlington, 02474","prop_status":"for_rent","price_raw":2800,"sqft_raw":1200,"list_date":"2020-03-16T14:39:30Z","is_showcase":false,"has_specials":false,"price":"$2,800/mo","beds":"2","baths":"1","sqft":"1,200 sq ft","lot_size":"0.23 acres","photo":"https://ap.rdcpix.com/a31848ca1fbf728b3ece69d510e013ebl-w3367419136s.jpg","short_price":"$2,800/mo","price_reduced":false,"baths_full":1,"photo_count":18,"products":["core.agent","core.broker"],"lat":42.42148,"lon":-71.145472,"has_leadform":true,"source":"mls","page_no":1,"rank":12,"list_tracking":"type|property|data|prop_id|9048803090|list_id|2914251915|page|rank|list_branding|listing_agent|listing_office|advertiser_id|agent|office|property_status|product_code|advantage_code^1|C|0|1|YTRD|4NH|3CY|0|5^^$0|1|2|$3|4|5|6|7|I|8|J|9|$A|K|B|L]|C|$D|M|E|N]|F|O|G|P|H|Q]]"},{"property_id":"4109273703","listing_id":"2913085160","prop_type":"condo","last_update":"2020-04-05T11:11:00.000Z","address":"9 Colonial Village Dr Apt 5 in Arlington Heights, Arlington, 02474","prop_status":"for_rent","price_raw":1700,"sqft_raw":662,"list_date":"2020-02-16T14:23:28Z","is_showcase":false,"has_specials":false,"price":"$1,700/mo","beds":"1","baths":"1","sqft":"662 sq ft","photo":"https://ap.rdcpix.com/64d6b04357c6a6aa887ce171489837d9l-m98595747s.jpg","short_price":"$1,700/mo","price_reduced":true,"price_reduced_date":"2020-04-05T15:14:21.571Z","baths_full":1,"photo_count":16,"products":["core.agent","core.broker"],"lat":42.426328,"lon":-71.186213,"has_leadform":true,"source":"mls","page_no":1,"rank":13,"list_tracking":"type|property|data|prop_id|4109273703|list_id|2913085160|page|rank|list_branding|listing_agent|listing_office|advertiser_id|agent|office|property_status|product_code|advantage_code^1|D|0|1|1ZVAJ|1S8ZE|76|0|5^^$0|1|2|$3|4|5|6|7|I|8|J|9|$A|K|B|L]|C|$D|M|E|N]|F|O|G|P|H|Q]]"},{"property_id":"9009050995","listing_id":"2913865491","prop_type":"townhome","last_update":"2020-03-23T03:05:00.000Z","address":"Arlington Heights, Arlington, 02474","prop_status":"for_rent","price_raw":2700,"sqft_raw":3000,"list_date":"2020-03-05T18:12:03Z","is_showcase":false,"has_specials":false,"price":"$2,700/mo","beds":"3","baths":"1","sqft":"3,000 sq ft","lot_size":"6,011 sq ft lot","photo":"https://ap.rdcpix.com/44105523cb3b47df6a80e3c224799265l-m3470912591s.jpg","short_price":"$2,700/mo","price_reduced":true,"price_reduced_date":"2020-03-19T15:03:18.828Z","baths_full":1,"photo_count":16,"products":["basic_opt_in"],"lat":42.431461,"lon":-71.184324,"has_leadform":true,"source":"mls","page_no":1,"rank":14,"list_tracking":"type|property|data|prop_id|9009050995|list_id|2913865491|page|rank|list_branding|listing_agent|listing_office|property_status|product_code|advantage_code^1|E|0|1|3CY|2|0^^$0|1|2|$3|4|5|6|7|F|8|G|9|$A|H|B|I]|C|J|D|K|E|L]]"},{"property_id":"9345117489","listing_id":"2912924125","prop_type":"other","last_update":"2020-04-01T11:04:00.000Z","address":"385 Massachusetts Ave in Arlington Center, Arlington, 02474","prop_status":"for_rent","price_raw":1700,"is_showcase":false,"has_specials":false,"price":"$1,700+/mo","beds":"S-2","baths":"1","sqft":"476+ sq ft","name":"Mass Ave Apartments, 385","photo":"https://ar.rdcpix.com/b9d29c01048628f5b7203feb7dfd1cc6c-f2894284790o.jpg","short_price":"$1,700+/mo","photo_count":15,"products":["basic","_COMMUNITY_RENTAL","_COMMUNITY_RENTAL","_COMMUNITY_RENTAL","_COMMUNITY_RENTAL","_COMMUNITY_RENTAL"],"lat":42.412885,"lon":-71.148761,"community_id":"2148585","pet_policy":"Dogs & Cats OK","has_leadform":true,"source":"community","page_no":1,"rank":15,"list_tracking":"type|property|data|prop_id|9345117489|list_id|2912924125|comm_id|2148585|page|rank|list_branding|listing_agent|listing_office|property_status|product_code|advantage_code^1|F|0|1|3K2|W|0^^$0|1|2|$3|4|5|6|7|8|9|H|A|I|B|$C|J|D|K]|E|L|F|M|G|N]]"},{"property_id":"4348050932","listing_id":"2914208393","prop_type":"condo","last_update":"2020-03-21T15:40:00.000Z","address":"22 Chandler St Unit 2 in East Arlington, Arlington, 02474","prop_status":"for_rent","price_raw":2300,"list_date":"2020-03-14T05:55:02Z","is_showcase":false,"has_specials":false,"price":"$2,300/mo","beds":"2","baths":"1","sqft":"sq ft N/A","photo":"https://ap.rdcpix.com/21de2a97691f014de0958f40b989e35cl-m2055261175s.jpg","short_price":"$2,300/mo","price_reduced":false,"baths_full":1,"photo_count":15,"products":["core.agent","basic_opt_in"],"lat":42.40492,"lon":-71.142638,"has_leadform":true,"source":"mls","page_no":1,"rank":16,"list_tracking":"type|property|data|prop_id|4348050932|list_id|2914208393|page|rank|list_branding|listing_agent|listing_office|advertiser_id|agent|property_status|product_code|advantage_code^1|G|0|1|H771|3CY|2|1^^$0|1|2|$3|4|5|6|7|H|8|I|9|$A|J|B|K]|C|$D|L]|E|M|F|N|G|O]]"},{"property_id":"4323202038","listing_id":"2435947683","prop_type":"condo","last_update":"2020-04-03T03:05:00.000Z","address":"48 Cleveland St Unit 2 in East Arlington, Arlington, 02474","prop_status":"for_rent","price_raw":4500,"sqft_raw":1800,"list_date":"2019-06-26T20:02:59Z","is_showcase":false,"has_specials":false,"price":"$4,500/mo","beds":"5","baths":"1","sqft":"1,800 sq ft","lot_size":"5,194 sq ft lot","photo":"https://ap.rdcpix.com/2dfd0c55278afbe0870a8a7a3c240f14l-m2544291979s.jpg","short_price":"$4,500/mo","price_reduced":false,"baths_full":1,"photo_count":13,"products":["core.agent","basic_opt_in"],"lat":42.407333,"lon":-71.139574,"has_leadform":true,"source":"mls","page_no":1,"rank":17,"list_tracking":"type|property|data|prop_id|4323202038|list_id|2435947683|page|rank|list_branding|listing_agent|listing_office|advertiser_id|agent|property_status|product_code|advantage_code^1|H|0|1|1XBGQ|3CY|2|1^^$0|1|2|$3|4|5|6|7|H|8|I|9|$A|J|B|K]|C|$D|L]|E|M|F|N|G|O]]"},{"property_id":"3100030292","listing_id":"2914605502","prop_type":"condo","last_update":"2020-03-29T03:05:00.000Z","address":"167 Mystic St in Arlington Center, Arlington, 02474","prop_status":"for_rent","price_raw":2400,"sqft_raw":99999,"list_date":"2020-03-25T22:27:55Z","is_showcase":false,"has_specials":false,"price":"$2,400/mo","beds":"2","baths":"1","sqft":"99,999 sq ft","lot_size":"2,296 acres","photo":"https://ap.rdcpix.com/775d5bbfc097ad0edcb36bb7f678712bl-m1075370663s.jpg","short_price":"$2,400/mo","price_reduced":false,"baths_full":1,"photo_count":12,"products":["core.agent","basic_opt_in"],"lat":42.420797,"lon":-71.153413,"is_new_listing":true,"pet_policy":"Dogs & Cats OK","has_leadform":true,"source":"mls","page_no":1,"rank":18,"list_tracking":"type|property|data|prop_id|3100030292|list_id|2914605502|page|rank|list_branding|listing_agent|listing_office|advertiser_id|agent|office|property_status|product_code|advantage_code^1|I|0|1|1PDNU|FHRI|3CY|2|1^^$0|1|2|$3|4|5|6|7|I|8|J|9|$A|K|B|L]|C|$D|M|E|N]|F|O|G|P|H|Q]]"},{"property_id":"9109805626","listing_id":"2913185709","prop_type":"condo","last_update":"2020-03-28T03:05:00.000Z","address":"37 Harlow St Unit 2 in East Arlington, Arlington, 02474","prop_status":"for_rent","price_raw":2900,"sqft_raw":2000,"list_date":"2020-02-19T20:52:17Z","is_showcase":false,"has_specials":false,"price":"$2,900/mo","beds":"4","baths":"2","sqft":"2,000 sq ft","lot_size":"6,000 sq ft lot","photo":"https://ap.rdcpix.com/83a6ff358bc769188f61d9ac75ba7c9el-m1077148498s.jpg","short_price":"$2,900/mo","price_reduced":false,"baths_full":2,"photo_count":12,"products":["core.agent","basic_opt_in"],"lat":42.408753,"lon":-71.143598,"has_leadform":true,"source":"mls","page_no":1,"rank":19,"list_tracking":"type|property|data|prop_id|9109805626|list_id|2913185709|page|rank|list_branding|listing_agent|listing_office|advertiser_id|agent|property_status|product_code|advantage_code^1|J|0|1|CR4G|3CY|2|1^^$0|1|2|$3|4|5|6|7|H|8|I|9|$A|J|B|K]|C|$D|L]|E|M|F|N|G|O]]"},{"property_id":"3897676304","listing_id":"2912906709","prop_type":"townhome","last_update":"2020-02-28T21:56:03.000Z","address":"457 Summer St in Arlington Heights, Arlington, 02474","prop_status":"for_rent","price_raw":2500,"sqft_raw":1042,"list_date":"2020-02-11T16:45:30Z","is_showcase":false,"has_specials":false,"price":"$2,500/mo","beds":"3","baths":"1","sqft":"1,042 sq ft","lot_size":"6,098 sq ft lot","photo":"https://ap.rdcpix.com/7a043841c5e220798574dac1ce1f45eel-m1030479267s.jpg","short_price":"$2,500/mo","price_reduced":true,"price_reduced_date":"2020-02-28T17:53:49.791Z","baths_full":1,"photo_count":12,"products":["core.agent","basic_opt_in"],"lat":42.426882,"lon":-71.173524,"has_leadform":true,"source":"mls","page_no":1,"rank":20,"list_tracking":"type|property|data|prop_id|3897676304|list_id|2912906709|page|rank|list_branding|listing_agent|listing_office|advertiser_id|agent|property_status|product_code|advantage_code^1|K|0|1|27CKX|3CY|2|1^^$0|1|2|$3|4|5|6|7|H|8|I|9|$A|J|B|K]|C|$D|L]|E|M|F|N|G|O]]"},{"property_id":"3450457329","listing_id":"2913889476","prop_type":"condo","last_update":"2020-03-09T03:05:00.000Z","address":"18 Arizona Ter Apt 4 in East Arlington, Arlington, 02474","prop_status":"for_rent","price_raw":1600,"sqft_raw":590,"list_date":"2020-03-06T01:15:22Z","is_showcase":false,"has_specials":false,"price":"$1,600/mo","beds":"1","baths":"1","sqft":"590 sq ft","lot_size":"2.30 acres","photo":"https://ap.rdcpix.com/1dd7c6b574dda841bb8ce8ec4599d0d0l-w1721704646s.jpg","short_price":"$1,600/mo","price_reduced":false,"baths_full":1,"photo_count":11,"products":["core.agent","core.broker"],"lat":42.413777,"lon":-71.133616,"has_leadform":true,"source":"mls","page_no":1,"rank":21,"list_tracking":"type|property|data|prop_id|3450457329|list_id|2913889476|page|rank|list_branding|listing_agent|listing_office|advertiser_id|agent|office|property_status|product_code|advantage_code^1|L|0|1|12UA3|53B|3CY|0|5^^$0|1|2|$3|4|5|6|7|I|8|J|9|$A|K|B|L]|C|$D|M|E|N]|F|O|G|P|H|Q]]"},{"property_id":"9355308187","listing_id":"2914975820","prop_type":"apartment","last_update":"2020-04-06T20:08:37.000Z","address":"Arlington Center, Arlington, 02474","prop_status":"for_rent","price_raw":2400,"is_showcase":false,"has_specials":false,"price":"$2,400/mo","beds":"2","baths":"1","sqft":"sq ft N/A","photo":"https://ap.rdcpix.com/8a1e287c8a28af467f517dfd5fd8a617l-m1266123728s.jpg","short_price":"$2,400/mo","baths_full":1,"photo_count":9,"products":["_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL"],"lat":42.4210535,"lon":-71.1533692,"pet_policy":"Dogs & Cats OK","has_leadform":true,"source":"unit_rental","page_no":1,"rank":22,"list_tracking":"type|property|data|prop_id|9355308187|list_id|2914975820|page|rank|list_branding|listing_agent|listing_office|property_status|product_code|advantage_code^1|M|0|1|3YA|W|0^^$0|1|2|$3|4|5|6|7|F|8|G|9|$A|H|B|I]|C|J|D|K|E|L]]"},{"property_id":"4825120172","listing_id":"2914973485","prop_type":"condo","last_update":"2020-04-04T19:16:00.000Z","address":"75 Windsor St Unit 1 in East Arlington, Arlington, 02474","prop_status":"for_rent","price_raw":2600,"sqft_raw":1084,"list_date":"2020-04-04T22:00:24Z","is_showcase":false,"has_specials":false,"price":"$2,600/mo","beds":"2","baths":"1","sqft":"1,084 sq ft","photo":"https://ap.rdcpix.com/168787150f940e9964395301ea73db4fl-m3201967585s.jpg","short_price":"$2,600/mo","price_reduced":false,"baths_full":1,"photo_count":9,"products":["core.agent","core.broker"],"lat":42.405759,"lon":-71.137145,"is_new_listing":true,"has_leadform":true,"source":"mls","page_no":1,"rank":23,"list_tracking":"type|property|data|prop_id|4825120172|list_id|2914973485|page|rank|list_branding|listing_agent|listing_office|advertiser_id|agent|office|property_status|product_code|advantage_code^1|N|0|1|1STZY|1PEF0|76|0|5^^$0|1|2|$3|4|5|6|7|I|8|J|9|$A|K|B|L]|C|$D|M|E|N]|F|O|G|P|H|Q]]"},{"property_id":"3297654369","listing_id":"2913144298","prop_type":"condo","last_update":"2020-04-03T03:05:00.000Z","address":"1 Colonial Village Dr Apt 10 in Arlington Heights, Arlington, 02474","prop_status":"for_rent","price_raw":1850,"sqft_raw":665,"list_date":"2020-02-18T20:43:46Z","is_showcase":false,"has_specials":false,"price":"$1,850/mo","beds":"2","baths":"1","sqft":"665 sq ft","lot_size":"9,999 sq ft lot","photo":"https://ap.rdcpix.com/5ff06c03357898e2ccf93958551e36eal-m1332341161s.jpg","short_price":"$1,850/mo","price_reduced":true,"price_reduced_date":"2020-03-31T01:58:37.634Z","baths_full":1,"photo_count":9,"products":["core.agent","basic_opt_in"],"lat":42.426328,"lon":-71.186212,"has_leadform":true,"source":"mls","page_no":1,"rank":24,"list_tracking":"type|property|data|prop_id|3297654369|list_id|2913144298|page|rank|list_branding|listing_agent|listing_office|advertiser_id|agent|property_status|product_code|advantage_code^1|O|0|1|MYP|3CY|2|1^^$0|1|2|$3|4|5|6|7|H|8|I|9|$A|J|B|K]|C|$D|L]|E|M|F|N|G|O]]"},{"property_id":"9379481635","listing_id":"2914692346","prop_type":"condo","last_update":"2020-03-31T03:05:00.000Z","address":"East Arlington, Arlington, 02474","prop_status":"for_rent","price_raw":2000,"sqft_raw":1195,"list_date":"2020-03-27T22:04:05Z","is_showcase":false,"has_specials":false,"price":"$2,000/mo","beds":"2","baths":"1","sqft":"1,195 sq ft","photo":"https://ap.rdcpix.com/0029b8b6f4856640b0292779881ccc84l-m3139074145s.jpg","short_price":"$2,000/mo","price_reduced":false,"baths_full":1,"photo_count":9,"products":["core.agent","basic_opt_in"],"lat":42.413938,"lon":-71.140826,"is_new_listing":true,"has_leadform":true,"source":"mls","page_no":1,"rank":25,"list_tracking":"type|property|data|prop_id|9379481635|list_id|2914692346|page|rank|list_branding|listing_agent|listing_office|advertiser_id|agent|office|property_status|product_code|advantage_code^1|P|0|1|1QO4R|1QO4O|3CY|2|1^^$0|1|2|$3|4|5|6|7|I|8|J|9|$A|K|B|L]|C|$D|M|E|N]|F|O|G|P|H|Q]]"},{"property_id":"3779502209","listing_id":"2914299235","prop_type":"condo","last_update":"2020-03-21T03:05:00.000Z","address":"East Arlington, Arlington, 02474","prop_status":"for_rent","price_raw":2800,"sqft_raw":1100,"list_date":"2020-03-17T18:55:13Z","is_showcase":false,"has_specials":false,"price":"$2,800/mo","beds":"2","baths":"1","sqft":"1,100 sq ft","photo":"https://ap.rdcpix.com/a6661cf0321e5ff26f8acbd490885f8cl-m824771539s.jpg","short_price":"$2,800/mo","price_reduced":false,"baths_full":1,"photo_count":9,"products":["core.agent","basic_opt_in"],"lat":42.402078,"lon":-71.141162,"has_leadform":true,"source":"mls","page_no":1,"rank":26,"list_tracking":"type|property|data|prop_id|3779502209|list_id|2914299235|page|rank|list_branding|listing_agent|listing_office|advertiser_id|agent|office|property_status|product_code|advantage_code^1|Q|0|1|1QO4R|1QO4O|3CY|2|1^^$0|1|2|$3|4|5|6|7|I|8|J|9|$A|K|B|L]|C|$D|M|E|N]|F|O|G|P|H|Q]]"},{"property_id":"9631740883","listing_id":"2914221930","prop_type":"condo","last_update":"2020-04-06T12:26:00.000Z","address":"Arlington Center, Arlington, 02474","prop_status":"for_rent","price_raw":2000,"sqft_raw":900,"list_date":"2020-03-14T20:07:04Z","is_showcase":false,"has_specials":false,"price":"$2,000/mo","beds":"3","baths":"1","sqft":"900 sq ft","lot_size":"5,599 sq ft lot","photo":"https://ap.rdcpix.com/8bcaeffb5ff5023800c2a1e9b020c0b1l-m2761280012s.jpg","short_price":"$2,000/mo","price_reduced":true,"price_reduced_date":"2020-04-06T16:36:06.646Z","baths_full":1,"photo_count":8,"products":["core.agent","basic_opt_in"],"lat":42.412499,"lon":-71.148165,"has_leadform":true,"source":"mls","page_no":1,"rank":27,"list_tracking":"type|property|data|prop_id|9631740883|list_id|2914221930|page|rank|list_branding|listing_agent|listing_office|advertiser_id|agent|property_status|product_code|advantage_code^1|R|0|1|NNQK|76|2|1^^$0|1|2|$3|4|5|6|7|H|8|I|9|$A|J|B|K]|C|$D|L]|E|M|F|N|G|O]]"},{"property_id":"3715796034","listing_id":"2914906732","prop_type":"condo","last_update":"2020-04-06T03:05:00.000Z","address":"174 Summer St Apt 19 in Arlington Center, Arlington, 02474","prop_status":"for_rent","price_raw":2100,"sqft_raw":99999,"list_date":"2020-04-02T17:52:25Z","is_showcase":false,"has_specials":false,"price":"$2,100/mo","beds":"1","baths":"1","sqft":"99,999 sq ft","lot_size":"2,296 acres","photo":"https://ap.rdcpix.com/bcfa6aa49dd86989947c152cd021b0fbl-m882862244s.jpg","short_price":"$2,100/mo","price_reduced":false,"baths_full":1,"photo_count":8,"products":["core.agent","basic_opt_in"],"lat":42.4214,"lon":-71.162367,"is_new_listing":true,"has_leadform":true,"source":"mls","page_no":1,"rank":28,"list_tracking":"type|property|data|prop_id|3715796034|list_id|2914906732|page|rank|list_branding|listing_agent|listing_office|advertiser_id|agent|property_status|product_code|advantage_code^1|S|0|1|12WD9|3CY|2|1^^$0|1|2|$3|4|5|6|7|H|8|I|9|$A|J|B|K]|C|$D|L]|E|M|F|N|G|O]]"},{"property_id":"9293399842","listing_id":"2914115148","prop_type":"condo","last_update":"2020-04-05T03:05:00.000Z","address":"1 Wyman St Apt 3 in Arlington Center, Arlington, 02474","prop_status":"for_rent","price_raw":1850,"sqft_raw":650,"list_date":"2020-03-12T13:00:20Z","is_showcase":false,"has_specials":false,"price":"$1,850/mo","beds":"1","baths":"1","sqft":"650 sq ft","photo":"https://ap.rdcpix.com/7b8473649fb5cc9924349f9bf9dda19el-m3308825796s.jpg","short_price":"$1,850/mo","price_reduced":false,"baths_full":1,"photo_count":8,"products":["core.agent","core.broker"],"lat":42.411693,"lon":-71.148094,"has_leadform":true,"source":"mls","page_no":1,"rank":29,"list_tracking":"type|property|data|prop_id|9293399842|list_id|2914115148|page|rank|list_branding|listing_agent|listing_office|advertiser_id|agent|office|property_status|product_code|advantage_code^1|T|0|1|EDBS|HK|3CY|0|5^^$0|1|2|$3|4|5|6|7|I|8|J|9|$A|K|B|L]|C|$D|M|E|N]|F|O|G|P|H|Q]]"},{"property_id":"9380434126","listing_id":"2914362003","prop_type":"apartment","last_update":"2020-03-19T12:14:36.000Z","address":"12 Brattle Dr Apt 4 in Brattle, Arlington, 02474","prop_status":"for_rent","price_raw":1895,"is_showcase":false,"has_specials":false,"price":"$1,895/mo","beds":"1","baths":"1","sqft":"sq ft N/A","photo":"https://ap.rdcpix.com/2d5410cd7f9b9cfa1673912ebbada9cdl-m2878355682s.jpg","short_price":"$1,895/mo","baths_full":1,"photo_count":7,"products":["_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL"],"lat":42.421983,"lon":-71.166149,"has_leadform":true,"source":"unit_rental","page_no":1,"rank":30,"list_tracking":"type|property|data|prop_id|9380434126|list_id|2914362003|page|rank|list_branding|listing_agent|listing_office|property_status|product_code|advantage_code^1|U|0|1|3YA|W|0^^$0|1|2|$3|4|5|6|7|F|8|G|9|$A|H|B|I]|C|J|D|K|E|L]]"},{"property_id":"3425625185","listing_id":"2914362009","prop_type":"apartment","last_update":"2020-03-19T12:14:36.000Z","address":"12 Brattle Dr Apt 3 in Brattle, Arlington, 02474","prop_status":"for_rent","price_raw":1800,"is_showcase":false,"has_specials":false,"price":"$1,800/mo","beds":"1","baths":"1","sqft":"sq ft N/A","photo":"https://ap.rdcpix.com/443b2c4218b7914ac3a37e949c5dbcd7l-m2878355682s.jpg","short_price":"$1,800/mo","baths_full":1,"photo_count":7,"products":["_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL"],"lat":42.421983,"lon":-71.166149,"has_leadform":true,"source":"unit_rental","page_no":1,"rank":31,"list_tracking":"type|property|data|prop_id|3425625185|list_id|2914362009|page|rank|list_branding|listing_agent|listing_office|property_status|product_code|advantage_code^1|V|0|1|3YA|W|0^^$0|1|2|$3|4|5|6|7|F|8|G|9|$A|H|B|I]|C|J|D|K|E|L]]"},{"property_id":"4763950650","listing_id":"608029821","prop_type":"apartment","last_update":"2020-03-13T04:37:19.000Z","address":"4 Brattle Dr Apt 28 in Brattle, Arlington, 02474","prop_status":"for_rent","price_raw":1700,"is_showcase":false,"has_specials":false,"price":"$1,700/mo","beds":"S","baths":"1","sqft":"sq ft N/A","photo":"https://ap.rdcpix.com/8d09ff29d92415de00793c7749b75d87l-m2878355682s.jpg","short_price":"$1,700/mo","baths_full":1,"photo_count":7,"products":["_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL"],"lat":42.422239,"lon":-71.166463,"has_leadform":true,"source":"unit_rental","page_no":1,"rank":32,"list_tracking":"type|property|data|prop_id|4763950650|list_id|608029821|page|rank|list_branding|listing_agent|listing_office|property_status|product_code|advantage_code^1|W|0|1|3YA|W|0^^$0|1|2|$3|4|5|6|7|F|8|G|9|$A|H|B|I]|C|J|D|K|E|L]]"},{"property_id":"9100413909","listing_id":"589811389","prop_type":"apartment","last_update":"2020-03-13T04:37:19.000Z","address":"7 Brattle Dr Apt 6 in Brattle, Arlington, 02474","prop_status":"for_rent","price_raw":1975,"is_showcase":false,"has_specials":false,"price":"$1,975/mo","beds":"1","baths":"1","sqft":"sq ft N/A","photo":"https://ap.rdcpix.com/5c5dcf37093a06ea0e3eb2d66a8ec75cl-m2878355682s.jpg","short_price":"$1,975/mo","baths_full":1,"photo_count":7,"products":["_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL"],"lat":42.421639,"lon":-71.166464,"has_leadform":true,"source":"unit_rental","page_no":1,"rank":33,"list_tracking":"type|property|data|prop_id|9100413909|list_id|589811389|page|rank|list_branding|listing_agent|listing_office|property_status|product_code|advantage_code^1|X|0|1|3YA|W|0^^$0|1|2|$3|4|5|6|7|F|8|G|9|$A|H|B|I]|C|J|D|K|E|L]]"},{"property_id":"9933990746","listing_id":"2913584766","prop_type":"apartment","last_update":"2020-02-27T08:42:04.000Z","address":"1 Brattle Dr Apt 2 in Brattle, Arlington, 02474","prop_status":"for_rent","price_raw":1900,"is_showcase":false,"has_specials":false,"price":"$1,900/mo","beds":"1","baths":"1","sqft":"sq ft N/A","photo":"https://ap.rdcpix.com/340422f3f79c74074558e0650766d95bl-m2878355682s.jpg","short_price":"$1,900/mo","baths_full":1,"photo_count":7,"products":["_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL"],"lat":42.4221,"lon":-71.166921,"has_leadform":true,"source":"unit_rental","page_no":1,"rank":34,"list_tracking":"type|property|data|prop_id|9933990746|list_id|2913584766|page|rank|list_branding|listing_agent|listing_office|property_status|product_code|advantage_code^1|Y|0|1|3YA|W|0^^$0|1|2|$3|4|5|6|7|F|8|G|9|$A|H|B|I]|C|J|D|K|E|L]]"},{"property_id":"9310785283","listing_id":"2913014412","prop_type":"apartment","last_update":"2020-02-14T00:13:27.000Z","address":"2 Brattle Dr Apt 10 in Brattle, Arlington, 02474","prop_status":"for_rent","price_raw":1950,"is_showcase":false,"has_specials":false,"price":"$1,950/mo","beds":"1","baths":"1","sqft":"sq ft N/A","photo":"https://ap.rdcpix.com/35c6f3334dc8a439ec16da04e6fb005fl-m2878355682s.jpg","short_price":"$1,950/mo","baths_full":1,"photo_count":7,"products":["_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL"],"lat":42.422239,"lon":-71.166463,"has_leadform":true,"source":"unit_rental","page_no":1,"rank":35,"list_tracking":"type|property|data|prop_id|9310785283|list_id|2913014412|page|rank|list_branding|listing_agent|listing_office|property_status|product_code|advantage_code^1|Z|0|1|3YA|W|0^^$0|1|2|$3|4|5|6|7|F|8|G|9|$A|H|B|I]|C|J|D|K|E|L]]"},{"property_id":"9121843068","listing_id":"2912929834","prop_type":"other","last_update":"2020-04-02T11:04:00.000Z","address":"333 Massachusetts Ave in East Arlington, Arlington, 02474","prop_status":"for_rent","price_raw":1950,"is_showcase":false,"has_specials":false,"price":"$1,950/mo","beds":"1","baths":"1","sqft":"650 sq ft","name":"Mass Ave 333-allen Street Apartments","photo":"https://ar.rdcpix.com/36fcc9df00f942557fc7b311391d54e4c-f1378576389o.jpg","short_price":"$1,950/mo","photo_count":4,"products":["basic","_COMMUNITY_RENTAL","_COMMUNITY_RENTAL","_COMMUNITY_RENTAL","_COMMUNITY_RENTAL","_COMMUNITY_RENTAL"],"lat":42.410789,"lon":-71.14738,"community_id":"2148584","pet_policy":"Dogs & Cats OK","has_leadform":true,"source":"community","page_no":1,"rank":36,"list_tracking":"type|property|data|prop_id|9121843068|list_id|2912929834|comm_id|2148584|page|rank|list_branding|listing_agent|listing_office|property_status|product_code|advantage_code^1|10|0|1|3K2|W|0^^$0|1|2|$3|4|5|6|7|8|9|H|A|I|B|$C|J|D|K]|E|L|F|M|G|N]]"},{"property_id":"9165331326","listing_id":"605180309","prop_type":"apartment","last_update":"2020-03-13T04:37:19.000Z","address":"11 Allen St Apt 8 in East Arlington, Arlington, 02474","prop_status":"for_rent","price_raw":1975,"is_showcase":false,"has_specials":false,"price":"$1,975/mo","beds":"1","baths":"1","sqft":"sq ft N/A","photo":"https://ap.rdcpix.com/98b602d475b33e5fd7f2556b81fa929cl-m520089210s.jpg","short_price":"$1,975/mo","baths_full":1,"photo_count":4,"products":["_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL"],"lat":42.410949,"lon":-71.147275,"has_leadform":true,"source":"unit_rental","page_no":1,"rank":37,"list_tracking":"type|property|data|prop_id|9165331326|list_id|605180309|page|rank|list_branding|listing_agent|listing_office|property_status|product_code|advantage_code^1|11|0|1|3YA|W|0^^$0|1|2|$3|4|5|6|7|F|8|G|9|$A|H|B|I]|C|J|D|K|E|L]]"},{"property_id":"4603363786","listing_id":"593679213","prop_type":"apartment","last_update":"2018-09-06T09:26:00.000Z","address":"32-34 Park Ave Ext in Arlington Heights, Arlington, 02474","prop_status":"for_rent","price_raw":2195,"list_date":"2016-09-15T02:07:00Z","is_showcase":false,"has_specials":false,"price":"$2,195/mo","beds":"2","baths":"1","sqft":"1,200 sq ft","name":"32-34 Park Ave Ext","photo":"https://ar.rdcpix.com/2029166223/de36d817895d9407a774df06c05f9028c-f0o.jpg","short_price":"$2,195/mo","photo_count":2,"products":["basic","_COMMUNITY_RENTAL","_COMMUNITY_RENTAL","_COMMUNITY_RENTAL","_COMMUNITY_RENTAL","_COMMUNITY_RENTAL"],"lat":42.427301,"lon":-71.180919,"community_id":"1468373","pet_policy":"Dogs & Cats OK","has_leadform":true,"source":"community","page_no":1,"rank":38,"list_tracking":"type|property|data|prop_id|4603363786|list_id|593679213|comm_id|1468373|page|rank|list_branding|listing_agent|listing_office|property_status|product_code|advantage_code^1|12|0|1|3K2|W|0^^$0|1|2|$3|4|5|6|7|8|9|H|A|I|B|$C|J|D|K]|E|L|F|M|G|N]]"},{"property_id":"3068580620","listing_id":"2914389510","prop_type":"condo","last_update":"2020-03-23T03:05:00.000Z","address":"16 Amherst St Unit 16 in East Arlington, Arlington, 02474","prop_status":"for_rent","price_raw":2850,"sqft_raw":1071,"list_date":"2020-03-19T21:39:12Z","is_showcase":false,"has_specials":false,"price":"$2,850/mo","beds":"2","baths":"1","sqft":"1,071 sq ft","lot_size":"4,500 sq ft lot","photo":"https://ap.rdcpix.com/bf9beac0e8d067f735fb8c0c37640057l-m2242485775s.jpg","short_price":"$2,850/mo","price_reduced":false,"baths_full":1,"photo_count":17,"products":["core.agent","basic_opt_in"],"lat":42.412171,"lon":-71.142513,"has_leadform":true,"source":"mls","page_no":1,"rank":39,"list_tracking":"type|property|data|prop_id|3068580620|list_id|2914389510|page|rank|list_branding|listing_agent|listing_office|advertiser_id|agent|office|property_status|product_code|advantage_code^1|13|0|1|1LW2Y|1QYUU|3CY|2|1^^$0|1|2|$3|4|5|6|7|I|8|J|9|$A|K|B|L]|C|$D|M|E|N]|F|O|G|P|H|Q]]"},{"property_id":"9273677121","listing_id":"2914859286","prop_type":"apartment","last_update":"2020-04-01T10:19:45.000Z","address":"385 Massachusetts Ave Apt 27 in Arlington Center, Arlington, 02474","prop_status":"for_rent","price_raw":2150,"is_showcase":false,"has_specials":false,"price":"$2,150/mo","beds":"1","baths":"1","sqft":"sq ft N/A","short_price":"$2,150/mo","baths_full":1,"photo_count":0,"products":["_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL","_UNIT_RENTAL"],"lat":42.412885,"lon":-71.148761,"has_leadform":true,"source":"unit_rental","page_no":1,"rank":40,"list_tracking":"type|property|data|prop_id|9273677121|list_id|2914859286|page|rank|list_branding|listing_agent|listing_office|property_status|product_code|advantage_code^1|14|0|1|3YA|W|0^^$0|1|2|$3|4|5|6|7|F|8|G|9|$A|H|B|I]|C|J|D|K|E|L]]"}]
