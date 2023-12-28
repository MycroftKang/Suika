import Matter from "matter-js";
import { getRenderWidth, getRenderHeight } from "./Size";

export const GuideLineColor = '#ffffff30';

export const GuideLine = Matter.Bodies.rectangle(
    getRenderWidth() / 2,
    getRenderHeight() / 2 + 40,
    5,
    getRenderHeight(),
    {
        isStatic: true, 
        isSensor: true, 
        collisionFilter: { group: -1 }, 
        render: { fillStyle: GuideLineColor },
        label: 'GUIDE_LINE'
    }
)