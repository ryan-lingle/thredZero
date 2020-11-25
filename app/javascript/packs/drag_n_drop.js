import mouseScroller from './mouse_scroller';

export default function runDragger() {

  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  let element;

  dragElement();

  function dragElement() {
    document.querySelectorAll('.grabber').forEach((g) => {
      g.addEventListener('mousedown', dragMouseDown)
    })
  }

  function dragMouseDown(e) {
    e.preventDefault();
    pos1 = e.clientY;
    element = e.target.parentNode;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
    window.onmousemove = mouseScroller;
  }

  function closeDragElement(e) {
    element.style.zIndex = 10;
    document.onmouseup = null;
    document.onmousemove = null;
    window.onmousemove = null;
  }

  function elementDrag(e) {
    e.preventDefault();
    pos2 = pos1 - e.clientY;
    pos1 = e.clientY;
    element.style.position = 'absolute';
    element.style.left = '340px';
    element.style.zIndex = 10000;
    element.style.top = (element.offsetTop - pos2) + "px";
  }
}



