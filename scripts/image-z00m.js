Hooks.on("getImagePopoutHeaderButtons", function (_, buttons) {
  const buttonId = `z00m${Date.now()}`;
  buttons.unshift({
    class: "z00m",
    icon: `fas fa-magnifying-glass ${buttonId}`,
    label: "Real Size",
    onclick: () => z00mHandler(buttonId)
  });
});

function z00mHandler(buttonId){
  const buttonElem = $(`.${buttonId}`);
  buttonElem.toggleClass("fa-magnifying-glass");
  buttonElem.toggleClass("fa-magnifying-glass-plus");

  const divElem = buttonElem.parent().parent().parent();
  const sectionElemn = divElem.children("section").first();
  const imgElem = sectionElemn.find("img").first();

  sectionElemn.toggleClass("z00m");
  imgElem.toggleClass("z00m");

  let pos = { top: 0, left: 0, x: 0, y: 0 };

  if (!buttonElem.hasClass("fa-magnifying-glass-plus"))
  {
    sectionElemn.off('mousedown');
    return;
  }

  sectionElemn.on("mousedown", (e) => mouseDownHandler(sectionElemn, e, pos));
}

const mouseUpHandler = function (ele) {
  ele.off('mousemove');
  ele.off('mouseup');
};

const mouseDownHandler = function (ele, e, pos) {
  pos = {
      // The current scroll
      left: ele.scrollLeft(),
      top: ele.scrollTop(),
      // Get the current mouse position
      x: e.clientX,
      y: e.clientY,
  };

  ele.on('mousemove', (e) => mouseMoveHandler(ele, e, pos));
  ele.on('mouseup', () => mouseUpHandler(ele));
};

const mouseMoveHandler = function (ele, e, pos) {
  // How far the mouse has been moved
  const dx = e.clientX - pos.x;
  const dy = e.clientY - pos.y;

  // Scroll the element
  ele.scrollTop(pos.top - dy);
  ele.scrollLeft(pos.left - dx);
};