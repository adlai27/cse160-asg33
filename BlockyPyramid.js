// BlockyPyramid.js
class BlockyPyramid {
  constructor() {
    this.color = [1,1,1,1];
    this.matrix = new Matrix4();
    this.textureNum = -2;


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
