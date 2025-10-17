import SearchIcon from "assets/icons/search.svg?react";
import Button from "components/base/Button/Button";

const MapSearch = () => (
    <Button
        variant="unstyled"
        size="small"
        className="bg-white box-border rounded-lg px-2 py-3 w-[29px] h-[29px] outline-2 outline-gray-300"
        onPress={() => {}}
    >
        <SearchIcon className="stroke-1 stroke-gray-700" />
    </Button>
);

export default MapSearch;
