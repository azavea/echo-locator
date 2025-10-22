import EditFiltersModal from "components/EditFiltersModal";
import EditTripsModal from "components/EditTripsModal";
import SearchModal from "components/SearchModal";
import NeighborhoodDetail from "../NeighborhoodDetail";

const ModalsWrapper = ({ isMobile }: { isMobile?: boolean }) => (
    <>
        <NeighborhoodDetail isMobile={isMobile} />
        <SearchModal isMobile={isMobile} />
        <EditFiltersModal isMobile={isMobile} />
        <EditTripsModal isMobile={isMobile} />
    </>
);

export default ModalsWrapper;
