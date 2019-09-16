export class DragSvg {
  constructor(svg) {
    this.svg = svg;
    this.draggableElements = this.svg.querySelectorAll('[data-draggable]');
    this.selectedElement = null;
    this.containersDrag = null;
    this.init();
  }

  init() {
    //Вешаем на все элементы события о перемещении svg объектов
    this.draggableElements.forEach(elem => {
      elem.addEventListener('mousedown', this.startDrag.bind(this, elem));
    })
    this.containersDrag = this.svg.querySelectorAll('[data-container-drag]')
  }

  // Получить позичию мыши на svg
  getMousePosition(x, y) {
    var CTM = this.svg.getScreenCTM();
    return {
      x: (x - CTM.e) / CTM.a,
      y: (y - CTM.f) / CTM.d
    };
  }

  // Генерация объекта с точками исходя из контейнера
  generateSVGPoints(elem) {
    let points = this.svg.createSVGPoint();

    points.x = elem.getBoundingClientRect().x
    points.y = elem.getBoundingClientRect().y

    return points
  }

  // Начало перемещения
  startDrag(elem, evt) {
    // Ищем тэг use по id
    this.selectedElement = this.svg.querySelector(`[href='#${elem.parentElement.id}']`);

    //Получаем его положение на svg
    let points = this.generateSVGPoints(elem);

    //Вешаем события
    this.svg.onmousemove = drag.bind(this, points);
    this.selectedElement.onmouseup = endDrag.bind(this);
    this.svg.mouseleave = endDrag.bind(this);

    // Функция перемещения
    function drag(points,evt) {
      evt.preventDefault();
      let position = this.getMousePosition(evt.clientX, evt.clientY)
      this.selectedElement.setAttributeNS(null, 'x', position.x - points.x - 40 );
      this.selectedElement.setAttributeNS(null, 'y', position.y -  points.y - document.documentElement.scrollTop - 40 );    

    }
    //Остановка перемещения
    function endDrag(evt) {
      this.svg.onmousemove = null;
      this.selectedElement.onmouseup = null;
      this.svg.mouseleave = null;

      this.checkDrag(this.selectedElement, evt)
    }
  }

  //Проверка попадания элемента в нужную зону
  checkDrag(elem, evt) {
    // Позиция перемещаемого элемента
    let obj1 = this.getPositionElem(elem);

    this.containersDrag.forEach(container => {
      //Позиция контейнера
      let obj2 = this.getPositionElem(container);
      //Ищем пересечение
      let mousePonts = this.getMousePosition(evt.x, evt.y);
      debugger
      if( ((obj1.x1 >= obj2.x0) && (obj1.x0 <= obj2.x1)) && ((obj1.y1 >= obj2.y0) && (obj1.y0 <= obj2.y1)) &&
        mousePonts.x >= obj2.x0 &&  mousePonts.x <= obj2.x1 && mousePonts.y >= obj2.y0 &&  mousePonts.y <= obj2.y1) {
        let points = this.generateSVGPoints(container);
        //Вставляем элемент в контейнер
        this.selectedElement.setAttributeNS(null, 'x', obj2.x0 - points.x + 10 );
        this.selectedElement.setAttributeNS(null, 'y', obj2.y0 - points.y - document.documentElement.scrollTop + 10 );
      }
    })
  }
  getPositionElem(elem) {
    let obj   = elem.getBoundingClientRect(),
      points  = this.getMousePosition(obj.x, obj.y);
      return {
        x0: points.x,
        y0: points.y,
        x1: points.x + obj.width,
        y1: points.y + obj.height,
      }
  }
}
