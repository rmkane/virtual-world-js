class Graph {
  constructor(points = [], segments = []) {
    this.points = points;
    this.segments = segments;
  }

  static load(info) {
    const points = info.points.map((p) => new Point(p.x, p.y));
    const segments = info.segments.map(
      (s) =>
        new Segment(
          points.find((p) => p.equals(s.p1)),
          points.find((p) => p.equals(s.p2))
        )
    );
    return new Graph(points, segments);
  }

  addPoint(point) {
    this.points.push(point);
  }

  containsPoint(point) {
    return this.points.find((p) => p.equals(point));
  }

  tryAddPoint(point) {
    if (!this.containsPoint(point)) {
      this.addPoint(point);
      return true;
    }
    return false;
  }

  removePoint(point) {
    this.getSegmentsWithPoint(point).forEach((segment) =>
      this.removeSegment(segment)
    );
    this.points.splice(this.points.indexOf(point), 1);
  }

  addSegment(segment) {
    this.segments.push(segment);
  }

  containsSegment(segment) {
    return this.segments.find((s) => s.equals(segment));
  }

  tryAddSegment(segment) {
    if (!this.containsSegment(segment) && !segment.p1.equals(segment.p2)) {
      this.addSegment(segment);
      return true;
    }
    return false;
  }

  removeSegment(segment) {
    this.segments.splice(this.segments.indexOf(segment), 1);
  }

  getSegmentsWithPoint(point) {
    return this.segments.filter((segment) => segment.includes(point));
  }

  dispose() {
    this.points.length = 0;
    this.segments.length = 0;
  }

  draw(ctx) {
    this.segments.forEach((segment) => {
      segment.draw(ctx);
    });

    this.points.forEach((point) => {
      point.draw(ctx);
    });
  }
}
