Hooks.on("getHeaderControlsImagePopout", function (app, buttons) {
  const buttonId = `z00m${Date.now()}`;
  app.options.actions.z00m = () => z00mHandler(buttonId);
  buttons.unshift({
    action: "z00m",
    class: "z00m",
    icon: `fas fa-magnifying-glass ${buttonId}`,
    label: game.i18n.localize("Z00M.ButtonTitle"),
    onclick: () => z00mHandler(buttonId)
  });
});

Hooks.on("ready", function () {
  game.settings.register("image-z00m", "maxZoom", {
    name: game.i18n.localize("Z00M.MaxZoom"),
    hint: game.i18n.localize("Z00M.MaxZoomHint"),
    scope: 'world',     // "world" = sync to db, "client" = local storage
    config: true,       // false if you dont want it to show in module config
    type: Number,       // Number, Boolean, String, Object
    default: 100
  });
});

const z00mButtonsTemplate = '<div class="z00m-control"><text>100%</text><i class="fas fa-magnifying-glass-plus"></i><i class="fas fa-magnifying-glass-minus"></i></div>';

function z00mHandler(buttonId) {
  const buttonElem = $(`.${buttonId}`);
  buttonElem.toggleClass("fa-magnifying-glass");
  buttonElem.toggleClass("fa-magnifying-glass-location");

  const divElem = buttonElem.closest(".application.image-popout");
  const sectionElemn = divElem.children("section").first();
  const imgElem = sectionElemn.find("img").first();
  const z00mButtons = $(z00mButtonsTemplate);
  const zoomText = z00mButtons.find("text").first();

  sectionElemn.toggleClass("z00m");
  imgElem.toggleClass("z00m");

  if (!buttonElem.hasClass("fa-magnifying-glass-location")) {
    divElem.children(".z00m-control").first().remove();
    imgElem.css("width", "");
    sectionElemn.off('mousedown');
    return;
  }

  let zoomConfig = {
    currentZoom: 100,
    maxZoom: game.settings.get("image-z00m", "maxZoom"),
    originalSize: imgElem.prop('naturalWidth'),
    imgElem: imgElem,
    textElem: zoomText
  };

  z00mButtons.find(".fa-magnifying-glass-plus").first().on("click", () => zoomIn(zoomConfig));
  z00mButtons.find(".fa-magnifying-glass-minus").first().on("click", () => zoomOut(zoomConfig));
  divElem.get(0).appendChild(z00mButtons.get(0));

  let pos = { top: 0, left: 0, x: 0, y: 0 };

  applyZoom(0, zoomConfig);
  sectionElemn.on("mousedown", (e) => mouseDownHandler(sectionElemn, e, pos));
}

const mouseUpHandler = function (ele) {
  ele.off('mousemove');
  ele.off('mouseup');
};

const mouseDownHandler = function (ele, e, pos) {
  pos = {
    left: ele.scrollLeft(),
    top: ele.scrollTop(),
    x: e.clientX,
    y: e.clientY,
  };

  ele.on('mousemove', (e) => mouseMoveHandler(ele, e, pos));
  ele.on('mouseup', () => mouseUpHandler(ele));
};

const mouseMoveHandler = function (ele, e, pos) {
  const dx = e.clientX - pos.x;
  const dy = e.clientY - pos.y;

  ele.scrollTop(pos.top - dy);
  ele.scrollLeft(pos.left - dx);
};

const zoomIn = function (zoomConfig) {
  if (zoomConfig.currentZoom == zoomConfig.maxZoom)
    return;
  applyZoom(10, zoomConfig);
}

const zoomOut = function (zoomConfig) {
  if (zoomConfig.currentZoom == 10)
    return;
  applyZoom(-10, zoomConfig);
}

const applyZoom = function (modifier, zoomConfig) {
  zoomConfig.currentZoom += modifier;
  const newWidth = zoomConfig.originalSize * zoomConfig.currentZoom / 100;

  zoomConfig.imgElem.css("width", `${newWidth}px`);
  zoomConfig.textElem.text(`${zoomConfig.currentZoom}%`);
}