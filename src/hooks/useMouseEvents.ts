export default function useMouseEvents(mouseDownHandler: any, mouseMoveHandler: any, mouseUpHandler: any) {
  return function mouseEventsHandler(event: Event) {
    let positions = mouseDownHandler(event);

    function onMouseMove(e: Event) {
      positions = mouseMoveHandler(e, positions) || positions;
    }

    window.addEventListener('mousemove', onMouseMove);

    window.addEventListener(
      'mouseup',
      (e) => {
        window.removeEventListener('mousemove', onMouseMove);

        mouseUpHandler && mouseUpHandler(e, positions);
      },
      { once: true },
    );
  };
}
