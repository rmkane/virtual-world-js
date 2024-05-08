class Polygon {
  constructor(points = []) {
    this.points = points;
    this.segments = [];
    for (let i = 1; i <= points.length; i++) {
      this.segments.push(new Segment(points[i - 1], points[i % points.length]));
    }
  }

  static union(polys) {
    Polygon.multiBreak(polys);
    const keptSegments = [];
    for (let i = 0; i < polys.length; i++) {
      for (const segment of polys[i].segments) {
        let keep = true;
        for (let j = 0; j < polys.length; j++) {
          if (i !== j && polys[j].containsSegment(segment)) {
            keep = false;
            break;
          }
        }
        if (keep) {
          keptSegments.push(segment);
        }
      }
    }
    return keptSegments;
  }

  static multiBreak(polys) {
    for (let i = 0; i < polys.length; i++) {
      for (let j = i + 1; j < polys.length; j++) {
        Polygon.break(polys[i], polys[j]);
      }
    }
  }

  static break(poly1, poly2) {
    const segs1 = poly1.segments;
    const segs2 = poly2.segments;
    for (let i = 0; i < segs1.length; i++) {
      for (let j = 0; j < segs2.length; j++) {
        const inter = getIntersection(
          segs1[i].p1,
          segs1[i].p2,
          segs2[j].p1,
          segs2[j].p2
        );

        if (inter && inter.offset !== 1 && inter.offset !== 0) {
          const point = new Point(inter.x, inter.y);
          let aux = segs1[i].p2;
          segs1[i].p2 = point;
          segs1.splice(i + 1, 0, new Segment(point, aux));
          aux = segs2[j].p2;
          segs2[j].p2 = point;
          segs2.splice(j + 1, 0, new Segment(point, aux));
        }
      }
    }
  }

  distanceToPoint(point) {
    return Math.min(...this.segments.map((s) => s.distanceToPoint(point)));
  }

  distanceToPoly(poly) {
    return Math.min(...this.points.map((p) => poly.distanceToPoint(p)));
  }

  intersectsPoly(poly) {
    for (let s1 of this.segments) {
      for (let s2 of poly.segments) {
        if (getIntersection(s1.p1, s1.p2, s2.p1, s2.p2)) {
          return true;
        }
      }
    }
    return false;
  }

  containsSegment(segment) {
    const midpoint = average(segment.p1, segment.p2);
    return this.containsPoint(midpoint);
  }

  containsPoint(point) {
    const outerPoint = new Point(-1000, -1000);
    let intersectionCount = 0;
    for (const segment of this.segments) {
      const inter = getIntersection(outerPoint, point, segment.p1, segment.p2);
      if (inter) {
        intersectionCount++;
      }
    }
    return intersectionCount % 2 === 1;
  }

  drawSegents(ctx) {
    this.segments.forEach((segment) => {
      segment.draw(ctx, { color: getRandomColor(), width: 5 });
    });
  }

  draw(
    ctx,
    { stroke = "blue", lineWidth = 2, fill = "rgba(0, 0, 255, 0.3" } = {}
  ) {
    ctx.beginPath();
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.moveTo(this.points[0].x, this.points[0].y);
    this.points.forEach((point) => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}
