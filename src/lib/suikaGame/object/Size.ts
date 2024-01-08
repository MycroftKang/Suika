let renderHeight: number

export const getRenderHeight = () => {
  
  if (renderHeight) {
    return renderHeight;
  }

  const maxHeight = Math.min(window.innerHeight - 80, 700);
  const screenHeight = window.innerHeight;
  const screenWidth = window.innerWidth - 8;
  const maxWidth = screenHeight * 4 / 7 - 8;

  if (maxWidth > screenWidth) {
    renderHeight = Math.min(maxHeight, (screenWidth) * 7 / 4);
  }
  else {
    renderHeight = Math.min(maxHeight, screenHeight);
  }

  return renderHeight;
};

export const getRenderWidth = () => {
  return getRenderHeight() * 4 / 7;
};
