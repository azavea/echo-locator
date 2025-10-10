import type { Dispatch, SetStateAction } from "react";

import type { UserProfileSliceState } from "reducers/userProfile/types";

export interface BaseProps {
    buffer: UserProfileSliceState;
    setProfileBuffer: Dispatch<SetStateAction<UserProfileSliceState>>;
    handleBack: () => void;
    handleNext: () => void;
}
