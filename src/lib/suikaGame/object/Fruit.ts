import { getRenderWidth } from "./Size";

export enum SpecialItem {
  BOMB = "BOMB"
}

export enum Fruit {
  BLUEBERRY = "BLUEBERRY",
  STRAWBERRY = "STRAWBERRY",
  TANGERINE = "TANGERINE",
  TOMATO = "TOMATO",
  AVOCADO = "AVOCADO",
  KOREANMELON = "KOREANMELON",
  APPLE = "APPLE",
  PEACH = "PEACH",
  COCONUT = "COCONUT",
  MELON = "MELON",
  WATERMELON = "WATERMELON",
  GOLDWATERMELON = "GOLDWATERMELON",
}

export type FruitType = keyof typeof Fruit;
export type ItemType = SpecialItem | Fruit;

const weight = 1.1
let first_fruit = true;

export const getSpecialItemFeature = (item: ItemType) => {
  switch (item) {
    case SpecialItem.BOMB:
      return { radius: getRenderWidth() / (30 * weight), mass: 1, label: SpecialItem.BOMB, score: null };
    default:
      return null;
  }
}

export const getFruitFeature = (fruit: ItemType) => {
  switch (fruit) {
    case Fruit.BLUEBERRY:
      return { radius: getRenderWidth() / (24 * weight), mass: 0.8, label: Fruit.BLUEBERRY, score: 1 };
    case Fruit.STRAWBERRY:
      return { radius: getRenderWidth() / (18 * weight), mass: 1, label: Fruit.STRAWBERRY, score: 3 };
    case Fruit.TANGERINE:
      return { radius: getRenderWidth() / (12 * weight), mass: 1, label: Fruit.TANGERINE, score: 6 };
    case Fruit.TOMATO:
      return { radius: getRenderWidth() / (10 * weight), mass: 1, label: Fruit.TOMATO, score: 10 };
    case Fruit.AVOCADO:
      return { radius: getRenderWidth() / (8 * weight), mass: 1, label: Fruit.AVOCADO, score: 15 };
    case Fruit.KOREANMELON:
      return { radius: getRenderWidth() / (7 * weight), mass: 1, label: Fruit.KOREANMELON, score: 21 };
    case Fruit.APPLE:
      return { radius: getRenderWidth() / (6 * weight), mass: 1, label: Fruit.APPLE, score: 28 };
    case Fruit.PEACH:
      return { radius: getRenderWidth() / (5.3 * weight), mass: 1, label: Fruit.PEACH, score: 36 };
    case Fruit.COCONUT:
      return { radius: getRenderWidth() / (4.6 * weight), mass: 1, label: Fruit.COCONUT, score: 45 };
    case Fruit.MELON:
      return { radius: getRenderWidth() / (3.95 * weight), mass: 1, label: Fruit.MELON, score: 55 };
    case Fruit.WATERMELON:
      return { radius: getRenderWidth() / (3.5 * weight), mass: 1, label: Fruit.WATERMELON, score: 66 };
    case Fruit.GOLDWATERMELON:
      return { radius: getRenderWidth() / (3.5 * weight), mass: 1, label: Fruit.GOLDWATERMELON, score: 78 };
    default:
      return null;
  }
}

export const getItemTypeFeature = (item: ItemType) => {
  return getFruitFeature(item) || getSpecialItemFeature(item)
}

export const getRandomFruitFeature = () => {
  // if (first_fruit) {
  //   first_fruit = false;
  //   return getFruitFeature(Fruit.WATERMELON);
  // }
  // else {
  //   return getSpecialItemFeature(SpecialItem.BOMB);
  // }

  if (Math.random() < 0.98 || first_fruit) {
    first_fruit = false;
    const fruits = Object.values(Fruit).slice(0, 5);
    const randomIndex = Math.floor(Math.random() * fruits.length); // 무작위 인덱스 선택
    return getFruitFeature(fruits[randomIndex]);
  } else {
    return getSpecialItemFeature(SpecialItem.BOMB);
  };
}

export const getNextFruitFeature = (currentFruit: Fruit) => {
  // 현재 과일의 순서를 찾기
  const currentIndex = Object.values(Fruit).indexOf(currentFruit);

  if (currentIndex === -1) {
    // 주어진 과일이 유효하지 않은 경우, 예외 처리
    return null;
  }

  // 다음 과일의 순서 계산
  const nextIndex = (currentIndex + 1) % Object.values(Fruit).length;

  // 다음 과일의 종류 가져오기
  const nextFruit = Object.values(Fruit)[nextIndex];

  // 다음 과일의 특성 가져오기
  const feature = getFruitFeature(nextFruit);

  return feature;
};
