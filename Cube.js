//
// Cube.js
//
class Cube {
  constructor(){
    this.type       = 'cube';
    this.color      = [1.0,1.0,1.0,1.0];
    this.matrix     = new Matrix4();
    this.textureNum = -2;

    // 36 vertices
    this.verts = [
      // Front
      0,0,0, 1,1,0, 1,0,0,
      0,0,0, 0,1,0, 1,1,0,

      // Top
      0,0,1, 1,1,1, 1,0,1,
      0,0,1, 0,1,1, 1,1,1,

      // Bottom
      0,0,0,   0,0,1,  0,1,1,
      0,0,0,   0,1,1,  0,1,0,

      // RIGHT face
      1,0,0,   1,1,1,  1,0,1,
      1,0,0,   1,1,0,  1,1,1,

      // TOP face
      0,1,0,   1,1,1,  1,1,0,
      0,1,0,   0,1,1,  1,1,1,

      // BOTTOM face
      0,0,0,   1,0,0,  1,0,1,
      0,0,0,   1,0,1,  0,0,1,
    ];
    this.vert32bit = new Float32Array(this.verts);

    // UV for 36 vertices
    this.uvVerts = [
      0,0, 1,1, 1,0,  0,0, 0,1, 1,1,  // front
      0,0, 1,1, 1,0,  0,0, 0,1, 1,1,  // top
      0,0, 1,1, 1,0,  0,0, 0,1, 1,1,  // bottom
      0,0, 1,1, 1,0,  0,0, 0,1, 1,1,  // right
      0,0, 1,1, 1,0,  0,0, 0,1, 1,1,  // left
      0,0, 1,1, 1,0,  0,0, 0,1, 1,1   // back
    ];
  }

  render(){
    let rgba = this.color; 
    gl.uniform1i(u_whichTexture, this.textureNum);
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);  
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

   
  }

  renderfast(){
    let rgba = this.color;
    gl.uniform1i(u_whichTexture, this.textureNum);
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    drawTriangle3D(this.verts); 
  }

  renderfaster(){
    let rgba = this.color;
    gl.uniform1i(u_whichTexture, this.textureNum);
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    drawTriangle3DUV(this.vert32bit, this.uvVerts);
  }
}

function drawTriangle3D(verts) {
  let buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.DYNAMIC_DRAW);

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  let uvbuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvbuffer);
  let zeroUV = new Float32Array(verts.length/3*2); // all 0
  gl.bufferData(gl.ARRAY_BUFFER, zeroUV, gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_UV);

  gl.drawArrays(gl.TRIANGLES, 0, verts.length/3);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

// single call for an entire array of positions + separate array of UV
function drawTriangle3DUV(posArray, uvArray) {
  // posArray can be Float32Array or normal array
  let posBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
  gl.bufferData(gl.ARRAY_BUFFER, posArray, gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  let uvBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvArray), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_UV);

  gl.drawArrays(gl.TRIANGLES, 0, posArray.length/3);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}
