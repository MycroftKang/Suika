import Matter from "matter-js";
import { getRenderWidth, getRenderHeight } from "./Size";
const LINE_WIDTH = getRenderWidth() * 10;
const LINE_HEIGHT = 8;
export const GameOverLine = Matter.Bodies.rectangle(
    getRenderWidth() / 2,
    getRenderHeight() / 6.5 - 30,
    LINE_WIDTH,
    LINE_HEIGHT,
    {
        isStatic: true, 
        isSensor: true, 
        collisionFilter: { group: -1 }, 
        render: { fillStyle: '#ffffff00' },
        label: 'GAME_OVER_LINE',
    }
);

export const GameOverGuideLine = Matter.Bodies.rectangle(
    getRenderWidth() / 2,
    getRenderHeight() / 6.5,
    LINE_WIDTH,
    LINE_HEIGHT,
    {
        isStatic: true, 
        isSensor: true, 
        collisionFilter: { group: -1 }, 
        render: { fillStyle: '#ffffff20' },
        label: 'GAME_OVER_GUIDE_LINE',
    }
)
