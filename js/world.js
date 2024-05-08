class World {
  constructor(graph, roadWidth = 60, roadRoundness = 10) {
    this.graph = graph;
    this.roadWidth = roadWidth;
    this.roadRoundness = roadRoundness;

    this.envelopes = [];
    this.roadBorders = [];

    this.generate();
  }

  generate() {
    this.envelopes.length = 0;
    for (const segment of this.graph.segments) {
      this.envelopes.push(
        new Envelope(segment, this.roadWidth, this.roadRoundness)
      );
    }

    if (this.envelopes.length) {
      this.roadBorders = Polygon.union(this.envelopes.map((e) => e.poly));
    }
  }

  draw(ctx) {
    this.envelopes.forEach((envelope) =>
      envelope.draw(ctx, { fill: "#bbb", stroke: "#bbb", lineWidth: 15 })
    );
    this.graph.segments.forEach((segment) =>
      segment.draw(ctx, { color: "white", width: 4, dash: [10, 10] })
    );
    this.roadBorders.forEach((segment) =>
      segment.draw(ctx, { color: "white", width: 4 })
    );
  }

  dispose() {
    this.envelopes.length = 0;
    this.roadBorders.length = 0;
  }
}
