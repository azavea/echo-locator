import Button from "components/base/Button/Button";
import {
    Places,
    UserProfileSubheader,
    UserProfileSubheaderMobile,
} from "components/UserProfileSubheader";
import CompareFavoritesButton from "components/CompareFavoritesButton";
import SelectLanguageButtons, {
    Languages,
} from "components/SelectLanguageButtons";
import Meter from "components/base/Meter/Meter";
import Range from "components/base/Range/Range";
import NeighborhoodCard from "components/NeighborhoodCard/NeighborhoodCard";

import ArrowLeftIcon from "assets/icons/arrow-left.svg?react";
import ArrowRightIcon from "assets/icons/arrow-right.svg?react";
import StarIcon from "assets/icons/star.svg?react";

const neighborhood = {
    name: "Brookline",
    zip: "02446",
};

const image = {
    imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/0/08/Washington_and_Harvard_Streets%2C_Brookline_Village_MA.jpg",
};

const tags = {
    isTopTen: true,
    hasECC: true,
};

const stats = {
    schools: { label: "Schools", value: 25, showCategory: true },
    safety: { label: "Safety", value: 75, showCategory: true },
    commute: {
        label: "Commute",
        start: 10,
        end: 25,
    },
};

const cardFull = {
    ...neighborhood,
    ...image,
    ...tags,
    stats,
};

const cardNoImageNoTag = {
    ...neighborhood,
    stats,
};

const cardImageOnly = {
    ...neighborhood,
    ...image,
};

const cardNoImage = {
    ...neighborhood,
    ...tags,
    stats,
};

const noop = () => {};

const Components = () => {
    return (
        <div className=" max-w-4xl mx-auto space-y-8">
            <header className="space-y-2">
                <h1 className="text-4xl font-bold text-gray-900">Components</h1>
                <p className="text-gray-600">
                    A showcase of reusable components built with React Aria and
                    a custom theme using Tailwind CSS.
                </p>
            </header>

            {/* Section for Buttons */}
            <section className="p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h2 className="text-3xl font-medium text-gray-800 mb-8 pb-4 border-b">
                    Buttons
                </h2>

                <div className="space-y-8">
                    <div>
                        <h3 className="text-xl text-gray-800 mb-2">Small</h3>
                        <div className="flex flex-column flex-wrap items-center gap-4">
                            <Button variant="primary" size="small">
                                Primary
                            </Button>
                            <Button variant="secondary" size="small">
                                Secondary
                            </Button>
                            <Button variant="outline" size="small">
                                Outline
                            </Button>
                            <Button
                                variant="outline"
                                size="small"
                                leftIcon={
                                    <ArrowLeftIcon className="font-normal h-[14px] w-[14px] text-black" />
                                }
                            />
                            <Button isDisabled size="small">
                                Disabled
                            </Button>
                            <Button
                                variant="outline"
                                size="small"
                                rightIcon={
                                    <ArrowRightIcon className="font-normal h-[14px] w-[14px] text-black" />
                                }
                            >
                                Next
                            </Button>
                            <Button
                                variant="orange"
                                size="small"
                                leftIcon={
                                    <StarIcon className="font-normal h-[14px] w-[14px] fill fill-orange-800" />
                                }
                            >
                                Add to favorites
                            </Button>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl text-gray-800 mb-2">Medium</h3>
                        <div className="flex flex-column flex-wrap items-center gap-4">
                            <Button variant="primary">Primary</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="outline">Outline</Button>
                            <Button
                                variant="outline"
                                leftIcon={
                                    <ArrowLeftIcon className="font-normal h-[14px] w-[14px] text-black" />
                                }
                            />
                            <Button isDisabled>Disabled</Button>
                            <Button
                                variant="outline"
                                rightIcon={
                                    <ArrowRightIcon className="font-normal h-[14px] w-[14px] text-black" />
                                }
                            >
                                Next
                            </Button>
                            <Button
                                variant="orange"
                                leftIcon={
                                    <StarIcon className="font-normal h-[14px] w-[14px] fill fill-orange-800" />
                                }
                            >
                                Add to favorites
                            </Button>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl text-gray-800 mb-2">Large</h3>
                        <div className="flex flex-column flex-wrap items-center gap-4">
                            <Button variant="primary" size="large">
                                Primary
                            </Button>
                            <Button variant="secondary" size="large">
                                Secondary
                            </Button>
                            <Button variant="outline" size="large">
                                Outline
                            </Button>
                            <Button
                                variant="outline"
                                size="large"
                                leftIcon={
                                    <ArrowLeftIcon className="font-normal h-[14px] w-[14px] text-black" />
                                }
                            />
                            <Button isDisabled size="large">
                                Disabled
                            </Button>
                            <Button
                                variant="outline"
                                size="large"
                                rightIcon={
                                    <ArrowRightIcon className="font-normal h-[14px] w-[14px] text-black" />
                                }
                            >
                                Next
                            </Button>
                            <Button
                                variant="orange"
                                size="large"
                                leftIcon={
                                    <StarIcon className="font-normal h-[14px] w-[14px] fill fill-orange-800" />
                                }
                            >
                                Add to favorites
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section for Button Group */}
            <section className="p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h2 className="text-3xl font-medium text-gray-800 mb-8 pb-4 border-b">
                    Button group
                </h2>
                <div className="space-y-8">
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xl text-gray-800 mb-2">Small</h3>
                        <div>
                            <CompareFavoritesButton size="small" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xl text-gray-800 mb-2">Medium</h3>
                        <div>
                            <CompareFavoritesButton />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xl text-gray-800 mb-2">Large</h3>
                        <div>
                            <CompareFavoritesButton size="large" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Section for User profile sub header */}
            <section className="p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h2 className="text-3xl font-medium text-gray-800 mb-8 pb-4 border-b">
                    User profile subheader
                </h2>
                <div className="space-y-8">
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xl text-gray-800 mb-2">Small</h3>
                        <UserProfileSubheaderMobile
                            size="small"
                            mode="transit"
                            place={Places.Work}
                            display="map"
                        />
                        <UserProfileSubheader
                            size="small"
                            mode="transit"
                            place={Places.Work}
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xl text-gray-800 mb-2">Medium</h3>
                        <UserProfileSubheaderMobile
                            size="medium"
                            mode="car"
                            place={Places.Daycare}
                            display="list"
                        />
                        <UserProfileSubheader
                            size="medium"
                            mode="car"
                            place={Places.Daycare}
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xl text-gray-800 mb-2">Large</h3>
                        <UserProfileSubheaderMobile
                            size="large"
                            mode="car"
                            place={Places.Doctor}
                            display="map"
                        />
                        <UserProfileSubheader
                            size="large"
                            mode="transit"
                            place={Places.Doctor}
                        />
                    </div>
                </div>
            </section>

            {/* Button group section */}
            <section className="p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h2 className="text-3xl font-medium text-gray-800 mb-8 pb-4 border-b">
                    Radio Button Group
                </h2>
                <div className="space-y-8">
                    <div className="flex flex-col gap-4 w-[272px]">
                        <SelectLanguageButtons language={Languages.EN} />
                    </div>
                </div>
            </section>

            {/* Bar chart section */}
            <section className="p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h2 className="text-3xl font-medium text-gray-800 mb-8 pb-4 border-b">
                    Bar charts
                </h2>
                <div className="flex space-y-8 gap-13">
                    <div className="flex flex-col items-start gap-8 w-13">
                        <h3 className="text-xl text-gray-800 mb-2">Criteria</h3>
                        <Meter label="Schools" value={10} />
                        <Meter label="Schools" value={25} />
                        <Meter label="Schools" value={50} />
                        <Meter label="Schools" value={75} />
                        <Meter label="Schools" value={90} />
                    </div>
                    <div className="flex flex-col items-start gap-8 w-13">
                        <h3 className="text-xl text-gray-800 mb-2">Criteria</h3>
                        <Meter label="Schools" value={10} showCategory />
                        <Meter label="Schools" value={25} showCategory />
                        <Meter label="Schools" value={50} showCategory />
                        <Meter label="Schools" value={75} showCategory />
                        <Meter label="Schools" value={90} showCategory />
                    </div>
                    <div className="flex flex-col items-start gap-8 w-13">
                        <h3 className="text-xl text-gray-800 mb-2">Car</h3>
                        <Range label="Commute" start={0} end={0} />
                        <Range label="Commute" start={60} end={60} />
                        <Range label="Commute" start={119} end={119} />
                        <Range label="Commute" start={120} end={120} />
                        <Range label="Commute" start={130} end={130} />
                    </div>
                    <div className="flex flex-col items-start gap-8 w-13">
                        <h3 className="text-xl text-gray-800 mb-2">Transit</h3>
                        <Range label="Commute" start={0} end={20} />
                        <Range label="Commute" start={30} end={60} />
                        <Range label="Commute" start={58} end={60} />
                        <Range label="Commute" start={80} end={150} />
                        <Range label="Commute" start={100} end={130} />
                        <Range label="Commute" start={110} end={120} />
                        <Range label="Commute" start={119} end={139} />
                        <Range label="Commute" start={120} end={150} />
                    </div>
                </div>
            </section>

            {/* Neighborhood card section */}
            <section className="p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h2 className="text-3xl font-medium text-gray-800 mb-8 pb-4 border-b">
                    Neighborhood Cards
                </h2>
                <div className="flex space-y-8 gap-13">
                    <div className="flex flex-col items-start gap-8">
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xl text-gray-800 mb-2">Full</h3>
                            <NeighborhoodCard
                                {...cardFull}
                                onClose={noop}
                                onPrev={noop}
                                onDetails={noop}
                                onNext={noop}
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xl text-gray-800 mb-2">
                                No image, with actions
                            </h3>
                            <NeighborhoodCard
                                {...cardNoImage}
                                onClose={noop}
                                onPrev={noop}
                                onDetails={noop}
                                onNext={noop}
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xl text-gray-800 mb-2">
                                Basic info only
                            </h3>
                            <NeighborhoodCard
                                {...cardImageOnly}
                                onClose={noop}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col items-start gap-8">
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xl text-gray-800 mb-2">
                                Info only
                            </h3>
                            <NeighborhoodCard {...cardFull} />
                        </div>

                        <div className="flex flex-col gap-4">
                            <h3 className="text-xl text-gray-800 mb-2">
                                No image, no tag, with actions
                            </h3>
                            <NeighborhoodCard
                                {...cardNoImageNoTag}
                                onClose={noop}
                                onPrev={noop}
                                onDetails={noop}
                                onNext={noop}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Components;
