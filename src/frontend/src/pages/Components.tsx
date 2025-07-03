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

import ArrowLeftIcon from "assets/icons/arrow-left.svg?react";
import ArrowRightIcon from "assets/icons/arrow-right.svg?react";
import StarIcon from "assets/icons/star.svg?react";

const Components = () => {
    return (
        <div className="bg-gray-50 min-h-screen p-10 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="space-y-2">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Components
                    </h1>
                    <p className="text-gray-600">
                        A showcase of reusable components built with React Aria
                        and a custom theme using Tailwind CSS.
                    </p>
                </header>

                {/* Section for Buttons */}
                <section className="p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <h2 className="text-3xl font-medium text-gray-800 mb-8 pb-4 border-b">
                        Buttons
                    </h2>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl text-gray-800 mb-2">
                                Small
                            </h3>
                            <div className="flex flex-column flex-wrap items-center gap-4">
                                <Button
                                    variant="primary"
                                    size="small"
                                    label="Primary"
                                />
                                <Button
                                    variant="secondary"
                                    size="small"
                                    label="Secondary"
                                />
                                <Button
                                    variant="outline"
                                    size="small"
                                    label="Outline"
                                />
                                <Button
                                    variant="outline"
                                    size="small"
                                    leftIcon={
                                        <ArrowLeftIcon className="font-normal h-[14px] w-[14px] text-black" />
                                    }
                                />
                                <Button
                                    isDisabled
                                    size="small"
                                    label="Disabled"
                                />
                                <Button
                                    variant="outline"
                                    size="small"
                                    label="Next"
                                    rightIcon={
                                        <ArrowRightIcon className="font-normal h-[14px] w-[14px] text-black" />
                                    }
                                />
                                <Button
                                    variant="orange"
                                    size="small"
                                    label="Add to favorites"
                                    leftIcon={
                                        <StarIcon className="font-normal h-[14px] w-[14px] fill fill-orange-800" />
                                    }
                                />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl text-gray-800 mb-2">
                                Medium
                            </h3>
                            <div className="flex flex-column flex-wrap items-center gap-4">
                                <Button variant="primary" label="Primary" />
                                <Button variant="secondary" label="Secondary" />
                                <Button variant="outline" label="Outline" />
                                <Button
                                    variant="outline"
                                    leftIcon={
                                        <ArrowLeftIcon className="font-normal h-[14px] w-[14px] text-black" />
                                    }
                                />
                                <Button isDisabled label="Disabled" />
                                <Button
                                    variant="outline"
                                    label="Next"
                                    rightIcon={
                                        <ArrowRightIcon className="font-normal h-[14px] w-[14px] text-black" />
                                    }
                                />
                                <Button
                                    variant="orange"
                                    label="Add to favorites"
                                    leftIcon={
                                        <StarIcon className="font-normal h-[14px] w-[14px] fill fill-orange-800" />
                                    }
                                />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl text-gray-800 mb-2">
                                Large
                            </h3>
                            <div className="flex flex-column flex-wrap items-center gap-4">
                                <Button
                                    variant="primary"
                                    size="large"
                                    label="Primary"
                                />
                                <Button
                                    variant="secondary"
                                    size="large"
                                    label="Secondary"
                                />
                                <Button
                                    variant="outline"
                                    size="large"
                                    label="Outline"
                                />
                                <Button
                                    variant="outline"
                                    size="large"
                                    leftIcon={
                                        <ArrowLeftIcon className="font-normal h-[14px] w-[14px] text-black" />
                                    }
                                />
                                <Button
                                    isDisabled
                                    size="large"
                                    label="Disabled"
                                />
                                <Button
                                    variant="outline"
                                    size="large"
                                    label="Next"
                                    rightIcon={
                                        <ArrowRightIcon className="font-normal h-[14px] w-[14px] text-black" />
                                    }
                                />
                                <Button
                                    variant="orange"
                                    size="large"
                                    label="Add to favorites"
                                    leftIcon={
                                        <StarIcon className="font-normal h-[17px] w-[17px] fill fill-orange-800" />
                                    }
                                />
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
                            <h3 className="text-xl text-gray-800 mb-2">
                                Small
                            </h3>
                            <div>
                                <CompareFavoritesButton size="small" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xl text-gray-800 mb-2">
                                Medium
                            </h3>
                            <div>
                                <CompareFavoritesButton />
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xl text-gray-800 mb-2">
                                Large
                            </h3>
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
                            <h3 className="text-xl text-gray-800 mb-2">
                                Small
                            </h3>
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
                            <h3 className="text-xl text-gray-800 mb-2">
                                Medium
                            </h3>
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
                            <h3 className="text-xl text-gray-800 mb-2">
                                Large
                            </h3>
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
            </div>
        </div>
    );
};

export default Components;
