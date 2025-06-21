import Button from "components/Button/Button";
import StarIcon from "assets/icons/star.svg?react";
import ArrowLeftIcon from "assets/icons/arrow-left.svg?react";
import ArrowRightIcon from "assets/icons/arrow-right.svg?react";

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
                                <Button variant="primary" size="small">
                                    Primary
                                </Button>
                                <Button variant="secondary" size="small">
                                    Secondary
                                </Button>
                                <Button variant="outline" size="small">
                                    Outline
                                </Button>
                                <Button variant="outline" size="small">
                                    <ArrowLeftIcon className="font-normal h-[14px] w-[14px] text-black" />
                                </Button>
                                <Button isDisabled size="small">
                                    Disabled
                                </Button>
                                <Button variant="outline" size="small">
                                    Next
                                    <ArrowRightIcon className="font-normal h-[14px] w-[14px] text-black" />
                                </Button>
                                <Button variant="orange" size="small">
                                    <StarIcon className="font-normal h-[14px] w-[14px]" />
                                    Add to favorites
                                </Button>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl text-gray-800 mb-2">
                                Medium
                            </h3>
                            <div className="flex flex-column flex-wrap items-center gap-4">
                                <Button variant="primary">Primary</Button>
                                <Button variant="secondary">Secondary</Button>
                                <Button variant="outline">Outline</Button>
                                <Button variant="outline">
                                    <ArrowLeftIcon className="font-normal h-[14px] w-[14px] text-black" />
                                </Button>
                                <Button isDisabled>Disabled</Button>
                                <Button variant="outline">
                                    Next
                                    <ArrowRightIcon className="font-normal h-[14px] w-[14px] text-black" />
                                </Button>
                                <Button variant="orange">
                                    <StarIcon className="font-normal h-[14px] w-[14px]" />
                                    Add to favorites
                                </Button>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl text-gray-800 mb-2">
                                Large
                            </h3>
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
                                <Button variant="outline" size="large">
                                    <ArrowLeftIcon className="font-normal h-[17px] w-[17px] text-black" />
                                </Button>
                                <Button size="large" isDisabled>
                                    Disabled
                                </Button>
                                <Button variant="outline" size="large">
                                    Next
                                    <ArrowRightIcon className="font-normal h-[17px] w-[17px] text-black" />
                                </Button>
                                <Button variant="orange" size="large">
                                    <StarIcon className="font-normal h-[17px] w-[17px]" />
                                    Add to favorites
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Components;
