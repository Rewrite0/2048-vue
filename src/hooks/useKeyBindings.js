import useBlockMove from '@/hooks/useBlockMove.js';


export default function useKeyBindings(store) {
  const { blockMove } = useBlockMove(store);

  const moveUp = () => blockMove('up');
  const moveDown = () => blockMove('down');
  const moveLeft = () => blockMove('left');
  const moveRight = () => blockMove('right');

  const keyBindings = () => {
    // 按键绑定
    document.addEventListener("keyup", (event) => {
      if (!store.canMove) {
        return;
      }
      switch (event.key.toLocaleUpperCase()) {
        case "ARROWUP":
        case "W":
          moveUp();
          break;
        case "ARROWDOWN":
        case "S":
          moveDown();
          break;
        case "ARROWLEFT":
        case "A":
          moveLeft();
          break;
        case "ARROWRIGHT":
        case "D":
          moveRight();
          break;
      }
    });
  }

  return {
    keyBindings,
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
  }
}