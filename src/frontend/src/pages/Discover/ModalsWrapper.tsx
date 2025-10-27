import EditFiltersModal from "components/EditFiltersModal";
import EditTripsModal from "components/EditTripsModal";
import EditUserProfileWizard from "components/EditWizard/EditUserProfileWizard";
import SearchModal from "components/SearchModal";
import EditTripsWizard from "src/components/EditWizard/EditTripsWizard";
import NeighborhoodDetail from "../NeighborhoodDetail";

const ModalsWrapper = ({ isMobile }: { isMobile?: boolean }) => (
    <>
        <NeighborhoodDetail isMobile={isMobile} />
        <SearchModal isMobile={isMobile} />
        <EditFiltersModal isMobile={isMobile} />
        <EditTripsModal isMobile={isMobile} />
        <EditUserProfileWizard />
        <EditTripsWizard />
    </>
);

export default ModalsWrapper;
