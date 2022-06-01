// @flow
import { withTranslation } from "react-i18next";
import lonlat from "@conveyal/lonlat";
import find from "lodash/find";
import filter from "lodash/filter";
import memoize from "lodash/memoize";
import React from "react";
import Select from "react-virtualized-select";
import createFilterOptions from "react-select-fast-filter-options";

import { SELECT_STYLE, SELECT_WRAPPER_STYLE, SELECT_OPTION_HEIGHT } from "../constants";
import type { AccountAddress, AccountProfile, Location } from "../types";

type Props = {
  networks: any[],
  setActiveNetwork: (string) => void,
  updateOrigin: (Location) => void,
  userProfile: AccountProfile,
};

const createDestinationsFilter = memoize((o) =>
  createFilterOptions({
    options: o,
    labelKey: "label",
    valueKey: "position",
  })
);

const createNetworksFilter = memoize((o) =>
  createFilterOptions({
    options: o,
  })
);

class Form extends React.PureComponent<Props> {
  props: Props;

  constructor(props) {
    super(props);

    this.getProfileNetworks = this.getProfileNetworks.bind(this);
    this.setNetwork = this.setNetwork.bind(this);

    const { networks, userProfile } = props;

    const destination =
      userProfile && userProfile.destinations
        ? this.getPrimaryDestination(userProfile.destinations)
        : null;

    const useNetworks = this.getProfileNetworks(networks, userProfile);

    // TODO: Add networkKey for react-18next's use to the networks as they
    // come into the app in store.yml and config.json, rather than adding this
    // 3rd networkName value here (https://github.com/azavea/echo-locator/issues/411)
    this.state = {
      destination,
      network: useNetworks
        ? {
            label: useNetworks[0].name,
            value: useNetworks[0].url,
            networkName: useNetworks[0].name,
          }
        : null,
    };

    if (this.state.destination) {
      props.updateOrigin(this.state.destination);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps) {
      return;
    }
    if (
      !this.state.network &&
      nextProps.networks &&
      nextProps.networks.length &&
      nextProps.userProfile
    ) {
      this.setStateNetwork(nextProps.networks, nextProps.userProfile);
    }

    if (!this.state.destination && nextProps.userProfile && nextProps.userProfile.destinations) {
      const destinations = nextProps.userProfile.destinations;
      if (!destinations.length) {
        console.error("No profile destinations available");
      } else {
        // Set default destination to the primary profile destination
        const destination = this.getPrimaryDestination(destinations);
        if (destination) {
          this.setState({ destination });
          this.props.updateOrigin(destination);
        }
      }
    }
  }

  // Filter networks to list/use based on user profile setting
  // to use commuter rail/express bus or not.
  getProfileNetworks(networks, userProfile): any[] {
    const useCommuter =
      !userProfile || userProfile.useCommuterRail === undefined || !!userProfile.useCommuterRail;
    return networks ? filter(networks, (n) => !!n.commuter === useCommuter) : null;
  }

  getPrimaryDestination = (destinations) => {
    const destination = find(destinations, (d) => !!d.primary);
    if (!destination) {
      console.error("No primary destination set on profile");
      return;
    }
    const position = destination.location.position;
    return position.lat !== 0 && position.lon !== 0
      ? {
          label: destination.location.label,
          position,
          purpose: destination.purpose,
          value: position,
        }
      : null;
  };

  setStateNetwork = (networks, userProfile) => {
    const useNetworks = this.getProfileNetworks(networks, userProfile);
    const first = useNetworks[0];
    const network = { label: first.name, value: first.url, networkName: first.name };
    this.setState({ network });
    this.props.setActiveNetwork(network.label);
  };

  setNetwork = (option?: ReactSelectOption) => {
    this.setState({ network: option });
    if (option) {
      this.props.setActiveNetwork(option.networkName);
    }
  };

  render() {
    const { t, userProfile } = this.props;
    const { destination, network } = this.state;
    const destinations: Array<AccountAddress> = userProfile ? userProfile.destinations : [];
    const locations = destinations.map((d) => {
      return {
        label: d.location.label,
        position: d.location.position,
        value: d.purpose,
        purpose: d.purpose,
      };
    });
    const locationsWithLabels = locations.map((loc) => {
      // generate temporary, translated destination labels menu options
      return {
        ...loc,
        label: t(`TripPurpose.${loc.value}`) + ": " + loc.label,
        value: loc.position,
      };
    });
    const destinationFilterOptions = createDestinationsFilter(locationsWithLabels);
    const selectDestination = (option?: ReactSelectOption) => {
      // To make translations dynamic in Select value, reseparate label and purpose
      const loc = option && locations.find((loc) => loc.position === option.position);
      const destinationObj = option ? { ...loc, position: lonlat(option.position) } : null;
      this.setState({ destination: destinationObj });
      this.props.updateOrigin(destinationObj);
    };

    const useNetworks = this.getProfileNetworks(this.props.networks, userProfile);
    // generate temporary, translated network labels for menu options
    const networks = useNetworks.map((n) => ({
      label: t("Map.NetworkOptions." + n.name.split(" ").join("")),
      value: n.url,
      networkName: n.name,
    }));
    const networkFilterOptions = createNetworksFilter(networks);

    const setNetwork = this.setNetwork;

    return (
      <div className="map-sidebar__travel-form">
        <h2 className="map-sidebar__travel-form-heading">{t("Dock.FormHeading")}</h2>
        <div className="map-sidebar__field">
          <label className="map-sidebar__label">{t("Dock.LocationLabel")}</label>
          <Select
            className="map-sidebar__select"
            clearable={false}
            filterOptions={destinationFilterOptions}
            options={locationsWithLabels}
            optionHeight={SELECT_OPTION_HEIGHT}
            onChange={selectDestination}
            placeholder={t("Geocoding.StartPlaceholder")}
            style={SELECT_STYLE}
            wrapperStyle={SELECT_WRAPPER_STYLE}
            value={{
              ...destination,
              label: t(`TripPurpose.${destination.purpose}`) + ": " + destination.label,
            }}
          />
        </div>
        {!userProfile.hasVehicle && (
          <div className="map-sidebar__field">
            <label className="map-sidebar__label">{t("Dock.NetworkLabel")}</label>
            <Select
              className="map-sidebar__select"
              clearable={false}
              filterOptions={networkFilterOptions}
              options={networks}
              optionHeight={SELECT_OPTION_HEIGHT}
              onChange={(e) => setNetwork(e)}
              placeholder={t("Map.SelectNetwork")}
              style={SELECT_STYLE}
              wrapperStyle={SELECT_WRAPPER_STYLE}
              value={{
                ...network,
                label: t("Map.NetworkOptions." + network.networkName.split(" ").join("")),
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

export default withTranslation()(Form);
