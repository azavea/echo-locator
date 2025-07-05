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

import ArrowLeftIcon from "assets/icons/arrow-left.svg?react";
import ArrowRightIcon from "assets/icons/arrow-right.svg?react";
import StarIcon from "assets/icons/star.svg?react";

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
                    <div className="flex flex-col items-center gap-8 w-13">
                        <Meter label="Schools" value={1} />
                        <Meter label="Schools" value={10} />
                        <Meter label="Schools" value={25} />
                        <Meter label="Schools" value={50} />
                        <Meter label="Schools" value={75} />
                        <Meter label="Schools" value={90} />
                    </div>
                    <div className="flex flex-col items-center gap-8 w-13">
                        <Meter label="Schools" category="Low" value={10} />
                        <Meter
                            label="Schools"
                            category="Below Avg"
                            value={25}
                        />

                        <Meter label="Schools" category="Average" value={50} />
                        <Meter
                            label="Schools"
                            category="Above Avg"
                            value={75}
                        />
                        <Meter label="Schools" category="High" value={90} />
                    </div>
                    <div className="flex flex-col items-center gap-8 w-13">
                        <Range
                            label="Commute"
                            rangeText="30-60 min"
                            start={30}
                            end={60}
                        />
                        <Range
                            label="Commute"
                            rangeText="0 min"
                            start={0}
                            end={0}
                        />
                        <Range
                            label="Commute"
                            rangeText="60 min"
                            start={60}
                            end={60}
                        />
                        <Range
                            label="Commute"
                            rangeText="58-60 min"
                            start={58}
                            end={60}
                        />
                        <Range
                            label="Commute"
                            rangeText="120 min"
                            start={120}
                            end={120}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Components;
