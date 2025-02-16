class Cylinder {
  constructor(segments = 12) {
    this.color      = [1, 1, 1, 1];  // RGBA
    this.matrix     = new Matrix4();
    this.textureNum = -2;           // default => color only
    this.segments   = segments;

    // We'll store all triangles in these arrays:
    this.vertices = [];  // each group of 3 floats is (x,y,z)
    this.uvs      = [];  // each group of 2 floats is (u,v)

    this.initVerts();
  }

  initVerts() {
    // We match your old logic:
    // radius = 0.5, top circle at y=+0.5, bottom circle at y=-0.5
    let r     = 0.5;
    let yTop  = 0.5;
    let yBot  = -0.5;
    let dTheta = (2 * Math.PI) / this.segments;

    for (let i = 0; i < this.segments; i++) {
      // angles for segment i and segment i+1
      let th1 = i * dTheta;
      let th2 = (i + 1 === this.segments) ? 0 : (i + 1) * dTheta;

      let x1 = r * Math.cos(th1), z1 = r * Math.sin(th1);
      let x2 = r * Math.cos(th2), z2 = r * Math.sin(th2);

      // ---------- TOP CIRCLE (fan) ----------
      // Triangle: center + (x1,yTop,z1) + (x2,yTop,z2)
      this.vertices.push(
        0,   yTop, 0,
        x1,  yTop, z1,
        x2,  yTop, z2
      );
      // UV for top circle (just a trivial mapping)
      // e.g. center => (0.5, 0.5), edges also (0.5,0.5) => “dummy” so it shows up
      this.uvs.push(
        0.5, 0.5,
        0.5, 0.5,
        0.5, 0.5
      );

      // ---------- BOTTOM CIRCLE (fan) ----------
      // Triangle: center + (x2,yBot,z2) + (x1,yBot,z1)
      this.vertices.push(
        0,    yBot, 0,
        x2,   yBot, z2,
        x1,   yBot, z1
      );
      this.uvs.push(
        0.5, 0.5,
        0.5, 0.5,
        0.5, 0.5
      );

      // ---------- SIDE (2 triangles per segment) ----------
      // Tri1
      //  (x1,yTop,z1) -> (x2,yTop,z2) -> (x1,yBot,z1)
      this.vertices.push(
        x1, yTop, z1,
        x2, yTop, z2,
        x1, yBot, z1
      );
      // Basic side UV (dummy or partial unwrap)
      this.uvs.push(
        0,0,  1,0,  0,1
      );

      // Tri2
      //  (x2,yTop,z2) -> (x2,yBot,z2) -> (x1,yBot,z1)
      this.vertices.push(
        x2, yTop, z2,
        x2, yBot, z2,
        x1, yBot, z1
      );
      this.uvs.push(
        1,0,  1,1,  0,1
      );
    }
  }

  render() {
    // 1) Set uniforms
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    gl.uniform1i(u_whichTexture, this.textureNum);
    gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);

    // 2) Single draw call for all triangles
    drawTriangle3DUV(
      new Float32Array(this.vertices),
      new Float32Array(this.uvs)
    );
  }
}
