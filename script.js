class Paint {
  constructor(container) {
    this.container = container;
    this.containerMenu = null;
    this.svg = null;
    this.buttons = [];
    this.currentElement = null;
    this.activeButton = null;

    this.init();
  }

  init() {
    this.containerMenu = this.container.querySelector('.containerMenu');
    this.svg = this.container.querySelector('svg');
  }

  initDrag() {
    this.svg.onclick = null;
    this.svg.onmousedown = startDrag
    let elemDrag = null,
        offset = null;
    function startDrag(evt) {
      elemDrag = evt.target;
      if( elemDrag.dataset.draggable != "" ) return;

      offset = getMousePosition(evt.clientX, evt.clientY, this);
      if ( elemDrag.tagName == "rect" ) {
        offset.x -= parseFloat(elemDrag.getAttributeNS(null, "x"));
        offset.y -= parseFloat(elemDrag.getAttributeNS(null, "y"));
      } else if ( elemDrag.tagName == "circle" ) {
        offset.x -= parseFloat(elemDrag.getAttributeNS(null, "cx"));
        offset.y -= parseFloat(elemDrag.getAttributeNS(null, "cy"));
      }
      
      elemDrag.addEventListener('mousemove', drag.bind(this));
      elemDrag.addEventListener('mouseup', endDrag);
      elemDrag.addEventListener('mouseleave', endDrag);
    }
    function drag(evt, svg) {
      if(elemDrag) {
        evt.preventDefault();
        let coord = getMousePosition(evt.clientX, evt.clientY, this);
        if( elemDrag.tagName == "rect" ) {
          elemDrag.setAttributeNS(null, "x", coord.x - offset.x);
          elemDrag.setAttributeNS(null, "y", coord.y - offset.y);
        } else if ( elemDrag.tagName == "circle" ) {
          elemDrag.setAttributeNS(null, "cx", coord.x - offset.x);
          elemDrag.setAttributeNS(null, "cy", coord.y - offset.y);
        }
      }
    }
    function endDrag(evt) {
      elemDrag = null;
    }
  }

  createButton(param) {
    let button = new Button(param, this.containerMenu)
    button.elemDom.addEventListener('click', () => {
      this.disactiveAllButtons()
      button.active();
    });
    this.buttons.push(button);
  }

  disactiveAllButtons() {
    this.buttons.forEach(item=>{
      item.disactive();
    })
  }
}

class Button {
  constructor(data, container) {
    this.data = data;
    this.container = container;
    this.elemDom = null;

    this.init();
  }

  init() {
    this.elemDom = this.createButton();
  }

  createButton() {
    let button = document.createElement('button');
    button.innerText = this.data.title;
    button.addEventListener('click', this.data.onClick.bind(this))
      
    this.container.append(button);
    return button;
  }

  active() {
    this.elemDom.classList.add('active');
  }
  disactive() {
    this.elemDom.classList.remove('active');
  }
}

class Figure {
  constructor(svg) {
    this.svg = svg;
    this._svgns = "http://www.w3.org/2000/svg";
    this._element = null;
    this.svg.onmousedown = null;
  }
  appendFigure(elem) {
    elem.setAttributeNS(null, 'data-draggable', '');
    elem.setAttributeNS(null, 'fill', '#'+Math.round(0xffffff * Math.random()).toString(16));
    this.svg.appendChild(elem);
  }
  // initDrag() {
  //   this.svg.onclick = null;
  //   this.svg.onmousedown = startDrag
  //   let elemDrag = null,
  //       offset = null;
  //   function startDrag(evt) {
  //     elemDrag = evt.target;
  //     if( elemDrag.dataset.draggable != "" ) return;

  //     offset = getMousePosition(evt.clientX, evt.clientY, this);
  //     if ( elemDrag.tagName == "rect" ) {
  //       offset.x -= parseFloat(elemDrag.getAttributeNS(null, "x"));
  //       offset.y -= parseFloat(elemDrag.getAttributeNS(null, "y"));
  //     } else if ( elemDrag.tagName == "circle" ) {
  //       offset.x -= parseFloat(elemDrag.getAttributeNS(null, "cx"));
  //       offset.y -= parseFloat(elemDrag.getAttributeNS(null, "cy"));
  //     }
      
  //     elemDrag.addEventListener('mousemove', drag.bind(this));
  //     elemDrag.addEventListener('mouseup', endDrag);
  //     elemDrag.addEventListener('mouseleave', endDrag);
  //   }
  //   function drag(evt, svg) {
  //     if(elemDrag) {
  //       evt.preventDefault();
  //       let coord = getMousePosition(evt.clientX, evt.clientY, this);
  //       if( elemDrag.tagName == "rect" ) {
  //         elemDrag.setAttributeNS(null, "x", coord.x - offset.x);
  //         elemDrag.setAttributeNS(null, "y", coord.y - offset.y);
  //       } else if ( elemDrag.tagName == "circle" ) {
  //         elemDrag.setAttributeNS(null, "cx", coord.x - offset.x);
  //         elemDrag.setAttributeNS(null, "cy", coord.y - offset.y);
  //       }
        
  //     }
  //   }
  //   function endDrag(evt) {
  //     elemDrag = null;
  //   }
  // }
  removeDrag() {
    this.svg.onmousedown = null;
  }
}

class Rect extends Figure {
  init() {
    this.svg.onclick = this.create.bind(this);
  }
  create(e) {
    let elem = document.createElementNS(this._svgns, 'rect');
    let position = getMousePosition(e.clientX, e.clientY, this.svg);
    elem.setAttributeNS(null, 'x', position.x);
    elem.setAttributeNS(null, 'y', position.y);
    elem.setAttributeNS(null, 'height', '50');
    elem.setAttributeNS(null, 'width', '50');
    this.appendFigure(elem);
  }
}

class Ellipse extends Figure{
  init() {
    this.svg.onclick = this.create.bind(this);
  }
  create(e) {
    let elem = document.createElementNS(this._svgns, 'circle');
    let position = getMousePosition(e.clientX, e.clientY, this.svg);
    elem.setAttributeNS(null, 'cx', position.x);
    elem.setAttributeNS(null, 'cy', position.y);
    elem.setAttributeNS(null, 'r', '50');
    this.appendFigure(elem);
  }
}

let paint = new Paint(document.querySelector('.paint'));

paint.createButton({
  title: "Select",
  onClick: (button) => {
    // paint.currentElement.initDrag();
    paint.initDrag();
  }
})

paint.createButton({
  title: "Rect",
  onClick: (button) => {
    paint.currentElement = new Rect(paint.svg);
    paint.currentElement.init();
  }
})

paint.createButton({
  title: "Ellipse",
  onClick: (button) => {
    paint.currentElement = new Ellipse(paint.svg);
    paint.currentElement.init();
  }
})


function getMousePosition(x,y, svg) {
  var CTM = svg.getScreenCTM();
  return {
    x: (x - CTM.e) / CTM.a,
    y: (y - CTM.f) / CTM.d
  };
}

class Picture {
  constructor() {
    this.listFigure = [];
  }

  add() {

  }

  draw() {

  }

  select() {}
}
