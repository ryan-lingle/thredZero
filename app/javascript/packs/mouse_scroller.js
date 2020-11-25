export default function mouseScroller(event) {
  const viewportY = event.clientY;
  const viewportHeight = document.documentElement.clientHeight;
  const viewPortLowerDelta = viewportHeight - viewportY;
  const viewPortUpperDelta = viewportY;
  console.log(viewPortUpperDelta)
  if (viewPortLowerDelta < 50 && !window.isScrolling) {
    window.isScrolling = true;
    window.insideMargin = false;
    startScrolling('down');
  } else if (viewPortUpperDelta < 185 && !window.isScrolling) {
    window.isScrolling = true;
    window.insideMargin = false;
    startScrolling('up');
  } else {
    window.insideMargin = true;
  }
}

function startScrolling(d) {
  const n = d == 'down' ? 3 : -3;
  window.scrollBy(0, n);
  if (window.insideMargin) {
    window.isScrolling = false;
  } else {
    setTimeout( function() { startScrolling(d) }, 10 );
  }
}

