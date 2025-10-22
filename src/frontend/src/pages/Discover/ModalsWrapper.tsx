import EditFiltersModal from "src/components/EditFiltersModal";
import EditTripsModal from "src/components/EditTripsModal";
import NeighborhoodDetail from "../NeighborhoodDetail";

const ModalsWrapper = ({ isMobile }: { isMobile?: boolean }) => (
    <>
        <NeighborhoodDetail isMobile={isMobile} />
        <EditFiltersModal isMobile={isMobile} />
        <EditTripsModal />
    </>
);

export default ModalsWrapper;
