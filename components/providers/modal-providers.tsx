"use client";
import { useEffect, useState } from "react";

import SettingsModal  from "../modals/settings-modal"
import CoverImageModal from "../modals/cover-image-modal";

export const ModelProvider = () => {
    const [mounted, setIsmounted] = useState(false);
    useEffect(() => {
        setIsmounted(true)
    }, [])
    if(!mounted) {
        return null;
    }
    return (
        <>
            <SettingsModal />
            <CoverImageModal />
        </>
    )
}