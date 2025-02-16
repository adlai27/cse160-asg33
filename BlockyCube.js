// BlockyCube.js
class BlockyCube {
  constructor() {
    this.color = [1,1,1,1];
    this.matrix = new Matrix4();
    this.textureNum = -2;  // -2 => color-only by default

    // A 1×1×1 cube, centered at the origin (coordinates from -0.5..+0.5).
    // We'll store 36 vertices (12 triangles) in a single Float32Array.
    // Front, Back, Left, Right, Top, Bottom faces.

    this.vertices = [
      // front face (2 triangles)
      -0.5,-0.5,-0.5,   0.5, 0.5,-0.5,   0.5,-0.5,-0.5,
      -0.5,-0.5,-0.5,  -0.5, 0.5,-0.5,   0.5, 0.5,-0.5,

      // back face (2 triangles)
      -0.5,-0.5, 0.5,   0.5,-0.5, 0.5,   0.5, 0.5, 0.5,
      -0.5,-0.5, 0.5,  -0.5, 0.5, 0.5,   0.5, 0.5, 0.5,

      // left face (2 triangles)
      -0.5,-0.5,-0.5,  -0.5,-0.5, 0.5,  -0.5, 0.5, 0.5,
      -0.5,-0.5,-0.5,  -0.5, 0.5, 0.5,  -0.5, 0.5,-0.5,

      // right face (2 triangles)
       0.5,-0.5,-0.5,   0.5, 0.5, 0.5,   0.5,-0.5, 0.5,
       0.5,-0.5,-0.5,   0.5, 0.5,-0.5,   0.5, 0.5, 0.5,

      // top face (2 triangles)
      -0.5, 0.5,-0.5,   0.5, 0.5, 0.5,   0.5, 0.5,-0.5,
      -0.5, 0.5,-0.5,  -0.5, 0.5, 0.5,   0.5, 0.5, 0.5,

      // bottom face (2 triangles)
      -0.5,-0.5,-0.5,   0.5,-0.5,-0.5,   0.5,-0.5, 0.5,
      -0.5,-0.5,-0.5,   0.5,-0.5, 0.5,  -0.5,-0.5, 0.5,
    ];

    // Simple UVs for each triangle. Here we just do a basic 0..1 mapping per face.
    // It's up to you how you lay out the texture.
    this.uvs = [
      // front face
      0,0, 1,1, 1,0,
      0,0, 0,1, 1,1,
      // back face
      0,0, 1,0, 1,1,
      0,0, 0,1, 1,1,
      // left face
      0,0, 1,0, 1,1,
      0,0, 1,1, 0,1,
      // right face
      0,0, 1,1, 1,0,
      0,0, 0,1, 1,1,
      // top face
      0,0, 1,1, 1,0,
      0,0, 0,1, 1,1,
      // bottom face
      0,0, 1,0, 1,1,
      0,0, 1,1, 0,1
    ];
  }

  render() {
    // Set uniform color, texture, transform
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    gl.uniform1i(u_whichTexture, this.textureNum);
    gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);

    // Single draw call for all 36 vertices
    drawTriangle3DUV(
      new Float32Array(this.vertices),
      new Float32Array(this.uvs)
    );
  }
}
