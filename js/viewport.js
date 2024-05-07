class Viewport {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");

    this.zoom = 1;
    this.center = new Point(canvas.width / 2, canvas.height / 2);
    this.offset = scale(this.center, -1);

    this.drag = {
      start: new Point(0, 0),
      end: new Point(0, 0),
      offset: new Point(0, 0),
      active: false,
    };

    this.#addEventListeners();
  }

  reset() {
    this.ctx.restore();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(this.center.x, this.center.y);
    this.ctx.scale(1 / this.zoom, 1 / this.zoom);
    const offset = this.getOffset();
    this.ctx.translate(offset.x, offset.y);
  }

  getMouse(e, subtractDragOffset = false) {
    const p = new Point(
      (e.offsetX - this.center.x) * this.zoom - this.offset.x,
      (e.offsetY - this.center.y) * this.zoom - this.offset.y
    );
    return subtractDragOffset ? subtract(p, this.drag.offset) : p;
  }

  getOffset() {
    return add(this.offset, this.drag.offset);
  }

  #addEventListeners() {
    // Zoom
    this.canvas.addEventListener("mousewheel", this.#onWheel.bind(this));

    // Pan (Middle-click)
    this.canvas.addEventListener("mousedown", this.#onMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.#onMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.#onMouseUp.bind(this));

    // Ensures panning stops if mouse leaves canvas
    this.canvas.addEventListener("mouseleave", this.#onMouseUp.bind(this));
  }

  #onWheel(e) {
    if (!e.ctrlKey) {
      // Only zoom if Ctrl is NOT pressed, else it interferes with panning
      const dir = Math.sign(e.deltaY);
      const step = 0.1;
      this.zoom += dir * step;
      this.zoom = Math.max(1, Math.min(5, this.zoom));
      e.preventDefault();
    }
  }

  #onMouseDown(e) {
    if (e.ctrlKey && e.button === 0) {
      // Check if Ctrl is pressed and left-click
      this.drag.start = this.getMouse(e);
      this.drag.active = true;
      this.canvas.style.cursor = "grabbing";
      e.preventDefault();
    }
  }

  #onMouseMove(e) {
    if (this.drag.active) {
      this.drag.end = this.getMouse(e);
      this.drag.offset = subtract(this.drag.end, this.drag.start);
      e.preventDefault(); // Optional: Prevent default behavior while panning
    }
  }

  #onMouseUp(e) {
    if (this.drag.active) {
      this.offset = add(this.offset, this.drag.offset);
      this.drag = {
        start: new Point(0, 0),
        end: new Point(0, 0),
        offset: new Point(0, 0),
        active: false,
      };
      this.canvas.style.cursor = "default";
    }
  }
}
