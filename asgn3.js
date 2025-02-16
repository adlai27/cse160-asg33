//
// asgn3.js
//

// GLSL Shaders
const VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying   vec2 v_UV;

  uniform mat4 u_ModelMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;

  void main(){
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }
`;

const FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;

  uniform vec4 u_FragColor;
  uniform int  u_whichTexture;
  
  uniform sampler2D u_SamplerSky;   
  uniform sampler2D u_SamplerBrick; 
  uniform sampler2D u_SamplerFish;  
  uniform sampler2D u_SamplerWood;  

  void main(){
    vec4 texColor = vec4(1.0,1.0,1.0,1.0); // default

    if(u_whichTexture == 0){
      // sky
      texColor = texture2D(u_SamplerSky, v_UV);
    } else if(u_whichTexture == 1){
      // brick
      texColor = texture2D(u_SamplerBrick, v_UV);
    } else if(u_whichTexture == 2){
      // fish
      texColor = texture2D(u_SamplerFish, v_UV);
    } else if(u_whichTexture == 3){
      // wood
      texColor = texture2D(u_SamplerWood, v_UV);
    } else if(u_whichTexture == -2){
      // color only
      texColor = u_FragColor;
    } else {
      // fallback: just color
      texColor = u_FragColor;
    }

    gl_FragColor = texColor;
  }
`;

// Global vars
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_ModelMatrix;
let u_ViewMatrix;
let u_ProjectionMatrix;

let u_whichTexture;
let u_SamplerSky;
let u_SamplerBrick;
let u_SamplerFish;
let u_SamplerWood;

let g_camera;

// 32×32
const WORLD_SIZE = 32;
let g_mapData = [];
let g_mapTexture = [];

let g_salmons = [];
let g_score = 0;

let g_AnimationOn   = false;
let g_PokeAnimation = false;
let g_startTime     = 0;
let g_seconds       = 0;

let g_isDragging = false;
let g_lastX = 0;
let g_lastY = 0;

let g_sharedCube = null;


function main(){
  const canvas = document.getElementById('webgl');
  gl = canvas.getContext('webgl',{ preserveDrawingBuffer:true });
  if(!gl){
    console.log("Failed to get WebGL context.");
    return;
  }

  if(!initShaders(gl,VSHADER_SOURCE,FSHADER_SOURCE)){
    console.log("Failed to init shaders.");
    return;
  }

  a_Position         = gl.getAttribLocation(gl.program,'a_Position');
  a_UV               = gl.getAttribLocation(gl.program,'a_UV');
  u_FragColor        = gl.getUniformLocation(gl.program,'u_FragColor');
  u_ModelMatrix      = gl.getUniformLocation(gl.program,'u_ModelMatrix');
  u_ViewMatrix       = gl.getUniformLocation(gl.program,'u_ViewMatrix');
  u_ProjectionMatrix = gl.getUniformLocation(gl.program,'u_ProjectionMatrix');
  u_whichTexture     = gl.getUniformLocation(gl.program,'u_whichTexture');
  u_SamplerSky       = gl.getUniformLocation(gl.program,'u_SamplerSky');
  u_SamplerBrick     = gl.getUniformLocation(gl.program,'u_SamplerBrick');
  u_SamplerFish      = gl.getUniformLocation(gl.program,'u_SamplerFish');
  u_SamplerWood      = gl.getUniformLocation(gl.program,'u_SamplerWood');

  if(a_Position<0 || a_UV<0 || !u_FragColor || !u_ModelMatrix
     || !u_ViewMatrix || !u_ProjectionMatrix || !u_whichTexture
     || !u_SamplerSky || !u_SamplerBrick || !u_SamplerFish || !u_SamplerWood){
    console.log("Failed to get some attrib/uniform location.");
    return;
  }

  gl.enable(gl.DEPTH_TEST);

  // single reusable cube
  g_sharedCube = new Cube();

  initEventHandlers();
  initWorldData();

  g_camera = new Camera();

  initTextures();

  g_startTime = performance.now()/1000.0;
  requestAnimationFrame(tick);
}

function initEventHandlers(){
  document.getElementById("toggle-animation").onclick=()=>{
    g_AnimationOn = !g_AnimationOn;
  };
  document.getElementById("toggle-shift").onclick=()=>{
    g_PokeAnimation = !g_PokeAnimation;
  };

  let yarnBtn = document.getElementById("spawn-yarn-btn");
  if(yarnBtn){
    yarnBtn.onclick=()=>{
      spawnYarnTower();
      g_score+=5;
      updateScoreUI();
    };
  }
  let spawnSalmonOnlyBtn = document.getElementById("spawn-salmon-only-btn");
  if(spawnSalmonOnlyBtn){
    spawnSalmonOnlyBtn.onclick=()=>{
      spawnSingleSalmon(); 
    };
  }

  window.onkeydown = e => onKeyDown(e);

  const canvas = document.getElementById('webgl');
  canvas.onmousedown=ev=>{
    g_isDragging=true;
    g_lastX=ev.clientX;
    g_lastY=ev.clientY;
  };
  canvas.onmouseup=ev=>{
    g_isDragging=false;
  };
  canvas.onmousemove=ev=>{
    if(g_isDragging){
      let dx= ev.clientX - g_lastX;
      let dy= ev.clientY - g_lastY;
      if(Math.abs(dx)>0){
        if(dx>0) g_camera.rotRight(dx*0.3);
        else     g_camera.rotLeft(-dx*0.3);
      }
      if(Math.abs(dy)>0){
        g_camera.tilt(-dy*0.3);
      }
      g_lastX=ev.clientX;
      g_lastY=ev.clientY;
      renderScene();
    }
  };
}

function onKeyDown(e){
  switch(e.key){
    case "w": case "W": g_camera.forward();  break;
    case "s": case "S": g_camera.backward(); break;
    case "a": case "A": g_camera.left();     break;
    case "d": case "D": g_camera.right();    break;
    case "q": case "Q": g_camera.rotLeft();  break;
    case "e": case "E": g_camera.rotRight(); break;
    case "z": case "Z": g_camera.upward();   break;
    case "x": case "X": g_camera.downward(); break;
    case "f": case "F": addBlockInFront();   break;
    case "r": case "R": removeBlockInFront();break;
  }
  collectSalmonIfClose();
  renderScene();
}

// fill 32x32
function initWorldData(){
  for(let i=0; i<WORLD_SIZE; i++){
    g_mapData[i] = [];
    g_mapTexture[i] = [];
    for(let j=0; j<WORLD_SIZE; j++){
      g_mapData[i][j]=0;
      g_mapTexture[i][j]=1; 
    }
  }
  // boundary walls
  for(let i=0; i<WORLD_SIZE; i++){
    g_mapData[i][0] = 2; 
    g_mapData[i][WORLD_SIZE-1]=2;
    g_mapTexture[i][0] = 3; 
    g_mapTexture[i][WORLD_SIZE-1] = 3;
    g_mapData[0][i] = 2;
    g_mapData[WORLD_SIZE-1][i] = 2;
    g_mapTexture[0][i] = 3;
    g_mapTexture[WORLD_SIZE-1][i]=3;
  }
}

function initTextures(){
  let skyTex   = gl.createTexture();
  let brickTex = gl.createTexture();
  let fishTex  = gl.createTexture();
  let woodTex  = gl.createTexture();

  let skyImg   = new Image();
  let brickImg = new Image();
  let fishImg  = new Image();
  let woodImg  = new Image();

  skyImg.onload   = ()=>{ sendTexToGPU(skyImg, skyTex, 0, u_SamplerSky); };
  brickImg.onload = ()=>{ sendTexToGPU(brickImg, brickTex, 1, u_SamplerBrick); };
  fishImg.onload  = ()=>{ sendTexToGPU(fishImg, fishTex, 2, u_SamplerFish); };
  woodImg.onload  = ()=>{ sendTexToGPU(woodImg, woodTex, 3, u_SamplerWood); };

  skyImg.src   = "sky.jpg";
  brickImg.src = "brick.jpg";
  fishImg.src  = "salmon.jpg";
  woodImg.src  = "woodblock.jpg";
}
function sendTexToGPU(img,tex,unit,uniformSampler){
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);
  gl.activeTexture(gl.TEXTURE0+unit);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,img);
  gl.uniform1i(uniformSampler,unit);
}

function tick(){
  g_seconds = performance.now()/1000.0 - g_startTime;
  if(g_AnimationOn){
    updateCatAnimation();
  }
  renderScene();
  requestAnimationFrame(tick);
}

function updateCatAnimation(){
  let t=g_seconds;
  g_BodyBob   =0.03*Math.sin(2*t);
  g_TailAngle =30*Math.sin(3*t);
  let w=20*Math.sin(3*t);
  let k=10*Math.sin(3*t+Math.PI/2);
  g_FrontLeftLegUpper= w;
  g_FrontLeftLegLower= k;
  g_FrontRightLegUpper=-w;
  g_FrontRightLegLower=-k;
  g_BackLeftLegUpper=  -w;
  g_BackLeftLegLower=   k;
  g_BackRightLegUpper=  w;
  g_BackRightLegLower= -k;

  g_HeadAngleX=10*Math.sin(2*t);
  if(g_PokeAnimation){
    g_BodyBob+=0.05*Math.abs(Math.sin(5*t));
    g_HeadAngleY=20*Math.sin(10*t);
  } else {
    g_HeadAngleY=0;
  }
}

function addBlockInFront(){
  let cell = getCellInFront(1.5);
  if(cell){
    g_mapData[cell.i][cell.j]++;
    console.log("Added block at",cell);
  }
}
function removeBlockInFront(){
  let cell= getCellInFront(1.5);
  if(cell && g_mapData[cell.i][cell.j]>0){
    g_mapData[cell.i][cell.j]--;
    console.log("Removed block at",cell);
  }
}
function getCellInFront(dist=2){
  let f= new Vector3(g_camera.at.elements);
  f.sub(g_camera.eye);
  f.normalize();
  f.mul(dist);
  let pos= new Vector3(g_camera.eye.elements);
  pos.add(f);

  let j= Math.floor(pos.x + WORLD_SIZE/2);
  let i= Math.floor(pos.z + WORLD_SIZE/2);
  if(i<0||i>=WORLD_SIZE||j<0||j>=WORLD_SIZE) return null;
  return {i,j};
}

// Yarn tower
function spawnYarnTower(){
  let i= Math.floor(Math.random()*(WORLD_SIZE-2))+1;
  let j= Math.floor(Math.random()*(WORLD_SIZE-2))+1;
  let towerH= Math.floor(Math.random()*4)+2;
  g_mapData[i][j]   = towerH;
  g_mapTexture[i][j]=1; // brick
  console.log("Spawn Yarn Tower at",i,j,"height=",towerH);
  renderScene();
}

// Salmon
function spawnSingleSalmon(){
  let i= Math.floor(Math.random()*WORLD_SIZE);
  let j= Math.floor(Math.random()*WORLD_SIZE);
  let h= g_mapData[i][j];
  let salmonY= h+0.5;
  let salmonX= j - WORLD_SIZE/2;
  let salmonZ= i - WORLD_SIZE/2;
  g_salmons.push({x:salmonX,y:salmonY,z:salmonZ});
  console.log("Spawned single salmon =>",salmonX,salmonY,salmonZ);
}
function collectSalmonIfClose(){
  for(let idx=g_salmons.length-1; idx>=0; idx--){
    let s=g_salmons[idx];
    let dist= Math.sqrt(
      (g_camera.eye.elements[0]-s.x)**2 +
      (g_camera.eye.elements[1]-s.y)**2 +
      (g_camera.eye.elements[2]-s.z)**2
    );
    if(dist<1.5){
      g_score +=10;
      g_salmons.splice(idx,1);
      updateScoreUI();
    }
  }
}
function updateScoreUI(){
  let el=document.getElementById("score-display");
  if(el){
    el.innerText=`Score: ${g_score}`;
  }
}

function renderScene(){
  let start=performance.now();

  // view/projection
  let viewMat= new Matrix4();
  viewMat.setLookAt(
    g_camera.eye.elements[0],g_camera.eye.elements[1],g_camera.eye.elements[2],
    g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],
    g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]
  );
  gl.uniformMatrix4fv(u_ViewMatrix,false,viewMat.elements);

  let projMat= new Matrix4();
  projMat.setPerspective(60, gl.drawingBufferWidth/gl.drawingBufferHeight, 0.1, 1000);
  gl.uniformMatrix4fv(u_ProjectionMatrix,false,projMat.elements);

  gl.clearColor(0.8,0.8,0.9,1.0);
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

  // SKy => use renderfaster() so we keep UV for sky texture
  {
    g_sharedCube.textureNum=0; // sky
    let mat=new Matrix4();
    mat.translate(g_camera.eye.elements[0],
                  g_camera.eye.elements[1],
                  g_camera.eye.elements[2]);
    mat.scale(1000,1000,1000);
    mat.translate(-0.5,-0.5,-0.5);
    g_sharedCube.matrix=mat;
    g_sharedCube.renderfaster(); 
  }

  // draw the world
  drawWorld();

  // cat at (0,0,0)
  drawBlockyCat(0,0,0);

  // salmons
  for(let s of g_salmons){
    g_sharedCube.textureNum=2; // fish
    let mat=new Matrix4();
    mat.translate(s.x,s.y,s.z);
    mat.scale(0.5,0.5,0.01);
    g_sharedCube.matrix=mat;
    g_sharedCube.renderfaster();
  }

  let dur= performance.now()-start;
  let fps= (dur>0)? (1000.0/dur).toFixed(1) : "???";
  let perfEl=document.getElementById("performance-display");
  if(perfEl){
    perfEl.innerHTML=`Frame time: ${dur.toFixed(1)} ms | ${fps} FPS`;
  }
}

function drawWorld(){
  for(let i=0; i<WORLD_SIZE; i++){
    for(let j=0; j<WORLD_SIZE; j++){
      let h= g_mapData[i][j];
      if(h>0){
        let tex= g_mapTexture[i][j];
        for(let y=0; y<h; y++){
          g_sharedCube.textureNum=tex;
          let m=new Matrix4();
          m.translate(j - WORLD_SIZE/2,y,i - WORLD_SIZE/2);
          g_sharedCube.matrix=m;
          g_sharedCube.renderfaster();
        }
      }
    }
  }

  // ground
  g_sharedCube.textureNum=1; // brick
  g_sharedCube.color=[0.7,0.7,0.7,1];
  let gm=new Matrix4();
  gm.translate(-WORLD_SIZE/2,-1,-WORLD_SIZE/2);
  gm.scale(WORLD_SIZE,0.2,WORLD_SIZE);
  g_sharedCube.matrix=gm;
  g_sharedCube.renderfaster();
}
