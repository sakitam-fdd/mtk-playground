export default function useMouseEvents(mouseDownHandler: any, mouseMoveHandler: any, mouseUpHandler: any) {
  return function mouseEventsHandler(event: Event) {
    let positions = mouseDownHandler(event);

    function onMouseMove(event: Event) {
      positions = mouseMoveHandler(event, positions) || positions;
    }

    window.addEventListener('mousemove', onMouseMove);

    window.addEventListener(
      'mouseup',
      (event) => {
        window.removeEventListener('mousemove', onMouseMove);

        mouseUpHandler && mouseUpHandler(event, positions);
      },
      { once: true },
    );
  };
}
