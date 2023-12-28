export const getRenderHeight = () => {
    const maxHeight = Math.min(window.innerHeight - 80, 700);
    const screenHeight = window.innerHeight;
    const screenWidth = window.innerWidth - 8;
    const maxWidth = screenHeight * 4 / 7 - 8;
  
    if (maxWidth > screenWidth) {
      return Math.min(maxHeight, (screenWidth) * 7 / 4);
    }
  
    return Math.min(maxHeight, screenHeight);
  };
  
  export const getRenderWidth = () => {
    return getRenderHeight() * 4 / 7;
  };