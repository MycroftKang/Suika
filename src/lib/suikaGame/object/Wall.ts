import Matter from "matter-js";
import {getRenderHeight, getRenderWidth} from "./Size";

const WALL_WIDTH = getRenderWidth() * 10;
const WALL_HEIGHT = getRenderHeight() * 10
export const WALL_BACK = Matter.Bodies.rectangle(getRenderWidth(), getRenderHeight(), getRenderWidth() * 2, getRenderHeight() * 2, {label: 'WALL_BACK', isStatic: true, isSensor: true, render: { fillStyle: 'none' }});
export const WALL_BOTTOM = Matter.Bodies.rectangle(getRenderWidth()/2, (WALL_HEIGHT + getRenderHeight() * 2) / 2, WALL_WIDTH, WALL_HEIGHT, {label: 'WALL_BOTTOM', isStatic: true, friction: 1, render: { fillStyle: 'none' }});
export const WALL_LEFT = Matter.Bodies.rectangle(-WALL_WIDTH/2, getRenderHeight()/2, WALL_WIDTH, WALL_HEIGHT, {label: 'WALL_LEFT', isStatic: true, friction: 1,  render: { fillStyle: 'none' }});
export const WALL_RIGHT = Matter.Bodies.rectangle(WALL_WIDTH/2 + getRenderWidth(), getRenderHeight()/2, WALL_WIDTH, WALL_HEIGHT, {label: 'WALL_RIGHT', isStatic: true, friction: 1, render: { fillStyle: 'none' }});
export const Wall = [ WALL_BACK, WALL_BOTTOM, WALL_LEFT, WALL_RIGHT ];
export default Wall;