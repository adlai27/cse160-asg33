// BlockyPyramid.js
class BlockyPyramid {
  constructor() {
    this.color = [1,1,1,1];
    this.matrix = new Matrix4();
    this.textureNum = -2; // default color-only

    // We'll build a square-based pyramid:
    // base at y=0, corners at (±0.5,0,±0.5), apex at (0,1,0).
    // 6 triangles total: 2 for base, then 4 sides.

    this.vertices = [
      // base (2 triangles)
      -0.5,0,-0.5,   0.5,0,-0.5,   0.5,0, 0.5,
      -0.5,0,-0.5,   0.5,0, 0.5,   -0.5,0,0.5,

      // side 1
      -0.5,0,-0.5,   0.5,0,-0.5,   0,1,0,
      // side 2
       0.5,0,-0.5,   0.5,0, 0.5,   0,1,0,
      // side 3
       0.5,0, 0.5,  -0.5,0, 0.5,   0,1,0,
      // side 4
      -0.5,0, 0.5,  -0.5,0,-0.5,   0,1,0,
    ];

    // Basic UV mapping. For the base, we map corners in [0..1]. 
    // For the sides, we'll do something simple, e.g. all 0..1 as well.
    this.uvs = [
      // base (2 triangles)
      0,0, 1,0, 1,1,
      0,0, 1,1, 0,1,

      // side 1
      0,0, 1,0, 0.5,1,
      // side 2
      0,0, 1,0, 0.5,1,
      // side 3
      0,0, 1,0, 0.5,1,
      // side 4
      0,0, 1,0, 0.5,1,
    ];
  }

  render(){
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    gl.uniform1i(u_whichTexture, this.textureNum);
    gl.uniform4f(u_FragColor, this.color[0],this.color[1],this.color[2],this.color[3]);

    drawTriangle3DUV(
      new Float32Array(this.vertices),
      new Float32Array(this.uvs)
    );
  }
}
