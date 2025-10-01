import type { Map } from "maplibre-gl";
import type { ReactElement } from "react";
import { createPortal } from "react-dom";
import {
    useControl,
    type ControlPosition,
    type IControl,
} from "react-map-gl/maplibre";

// Based on template in https://maplibre.org/maplibre-gl-js/docs/API/interfaces/IControl/
class CustomControl implements IControl {
    _map: Map | null = null;
    _container: HTMLElement | null = null;
    _position: ControlPosition;

    constructor(position: ControlPosition) {
        this._position = position;
    }

    onAdd(map: Map) {
        this._map = map;
        this._container = document.createElement("div");
        this._container.className = "maplibregl-ctrl";
        return this._container;
    }

    onRemove() {
        this._container?.parentNode?.removeChild(this._container);
        if (this._map) {
            this._map = null;
        }
    }

    getDefaultPosition(): ControlPosition {
        return this._position;
    }

    getElement() {
        return this._container;
    }
}

interface CustomControlOverlayProps {
    position: ControlPosition;
    children: ReactElement;
}

function CustomControlOverlay({
    position,
    children,
}: CustomControlOverlayProps) {
    const ctrl = useControl(() => {
        return new CustomControl(position);
    });

    const parentControlElem = ctrl.getElement();
    if (parentControlElem === null) return null;

    return createPortal(children, parentControlElem);
}

export default CustomControlOverlay;
