import { Outlet } from "react-router";

import Menu from "src/components/Menu";

const Root = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* TODO: get compareCount from app store */}
            <Menu compareCount={0} />
            <div className="flex flex-1 flex-col items-center self-stretch gap-6 rounded-t-[16px] bg-white px-10 py-16">
                <Outlet />
            </div>
        </div>
    );
};

export default Root;
