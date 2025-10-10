import EditFiltersModal from "src/components/EditFiltersModal";
import NeighborhoodDetail from "../NeighborhoodDetail";
import EditTripsModal from "src/components/EditTripsModal";

const ModalsWrapper = ({ isMobile }: { isMobile?: boolean }) => (
    <>
        <NeighborhoodDetail isMobile={isMobile} />
        <EditFiltersModal />
        <EditTripsModal />
    </>
);

export default ModalsWrapper;
