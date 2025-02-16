//
// blockyAnimal.js
//
// Contains the blocky cat drawing code
let g_HeadAngleX = 0;
let g_HeadAngleY = 0;
let g_FrontLeftLegUpper = 10, g_FrontLeftLegLower = 0, g_FrontLeftPawAngle=0;
let g_FrontRightLegUpper=10, g_FrontRightLegLower=0, g_FrontRightPawAngle=0;
let g_BackLeftLegUpper = -20, g_BackLeftLegLower=40, g_BackLeftPawAngle=0;
let g_BackRightLegUpper= -20, g_BackRightLegLower=40, g_BackRightPawAngle=0;
let g_TailAngle=0;
let g_BodyBob=0;

function drawBlockyCat(x=0,y=0,z=0){
  // BODY
  let body= new BlockyCube();
  body.textureNum= -2; // color only
  body.color=[1.0,0.6,0.0,1.0];
  body.matrix.translate(x, y+g_BodyBob, z);
  body.matrix.scale(0.5,0.3,0.8);
  body.render();

  // NECK
  let neck= new Cylinder();
  neck.color=[1.0,0.6,0.0,1.0];
  neck.matrix.translate(x,y,z);
  neck.matrix.translate(-0.0,0.15+g_BodyBob,-0.35);
  neck.matrix.rotate(g_HeadAngleX,1,0,0);
  neck.matrix.rotate(g_HeadAngleY,0,1,0);
  let neckMat=new Matrix4(neck.matrix);
  neck.matrix.scale(0.1,0.2,0.1);
  neck.render();

  // HEAD
  let head = new Cylinder();
  head.color = [1.0,0.6,0.0,1.0];
  head.matrix = neckMat;
  head.matrix.translate(-0.15, 0.45, -0.35);
  head.matrix.scale(0.3, 0.3, 0.35);
  head.matrix.translate(0.5, -0.9, 0.5);
  head.render();

  let headMat = new Matrix4(head.matrix);

  // Ears
  let earL = new BlockyPyramid();
  earL.color = [0.9, 0.4, 0.0, 1.0];
  earL.matrix = new Matrix4(headMat);
  earL.matrix.translate(-0.25, 0.45, 0.2);
  earL.matrix.rotate(15, 0, 0, 1);
  earL.matrix.scale(0.19, 0.40, 0.12);
  earL.render();

  let earR = new BlockyPyramid();
  earR.color = [0.9, 0.4, 0.0, 1.0];
  earR.matrix = new Matrix4(headMat);
  earR.matrix.translate(0.25, 0.45, 0.2);
  earR.matrix.rotate(-15, 0, 0, 1);
  earR.matrix.scale(0.19, 0.40, 0.12);
  earR.render();

  // Eyes
  let eyeL = new BlockyCube();
  eyeL.color = [0.0, 0.0, 1.0, 1.0];
  eyeL.matrix = new Matrix4(headMat);
  eyeL.matrix.translate(0.3, 0.18, -0.4);
  eyeL.matrix.scale(0.09, 0.09, 0.09);
  eyeL.render();

  let eyeR = new BlockyCube();
  eyeR.color = [0.0, 0.0, 1.0, 1.0];
  eyeR.matrix = new Matrix4(headMat);
  eyeR.matrix.translate(-0.3, 0.18, -0.4);
  eyeR.matrix.scale(0.09, 0.09, 0.09);
  eyeR.render();

  // Snout
  let snout = new BlockyCube();
  snout.color = [0.0, 0.0, 0.0, 1.0];
  snout.matrix = new Matrix4(headMat);
  snout.matrix.translate(0.0, 0.05, -0.55);
  snout.matrix.scale(0.06, 0.06, 0.1);
  snout.render();

  // Whiskers
  let whiskerR1 = new BlockyCube();
  whiskerR1.color = [0, 0, 0, 1];
  whiskerR1.matrix = new Matrix4(headMat);
  whiskerR1.matrix.translate(0.01, 0.09, -0.6);
  whiskerR1.matrix.rotate(-6, 0, 0, 1);
  whiskerR1.matrix.scale(0.2, 0.008, 0.008);
  whiskerR1.matrix.translate(-0.5, -0.5, -0.5);
  whiskerR1.render();

  let whiskerR2 = new BlockyCube();
  whiskerR2.color = [0, 0, 0, 1];
  whiskerR2.matrix = new Matrix4(headMat);
  whiskerR2.matrix.translate(0.01, 0.042, -0.6);
  whiskerR2.matrix.rotate(6, 0, 0, 1);
  whiskerR2.matrix.scale(0.2, 0.008, 0.008);
  whiskerR2.matrix.translate(-0.5, -0.5, -0.5);
  whiskerR2.render();

  let whiskerL1 = new BlockyCube();
  whiskerL1.color = [0, 0, 0, 1];
  whiskerL1.matrix = new Matrix4(headMat);
  whiskerL1.matrix.translate(-0.01, 0.09, -0.6);
  whiskerL1.matrix.rotate(6, 0, 0, 1);
  whiskerL1.matrix.scale(0.2, 0.008, 0.008);
  whiskerL1.matrix.translate(0.5, -0.5, -0.5);
  whiskerL1.render();

  let whiskerL2 = new BlockyCube();
  whiskerL2.color = [0, 0, 0, 1];
  whiskerL2.matrix = new Matrix4(headMat);
  whiskerL2.matrix.translate(-0.01, 0.042, -0.6);
  whiskerL2.matrix.rotate(-6, 0, 0, 1);
  whiskerL2.matrix.scale(0.2, 0.008, 0.008);
  whiskerL2.matrix.translate(0.5, -0.5, -0.5);
  whiskerL2.render();

  // Tail
  let tail = new BlockyCube();
  tail.color = [1.0, 0.6, 0.0, 1.0];
  tail.matrix.translate(0.0, 0.16, 0.38);
  tail.matrix.rotate(57, 1, 0, 0);
  tail.matrix.rotate(g_TailAngle, 0, 1, 0);
  tail.matrix.scale(0.06, 0.05, 0.5);
  tail.matrix.translate(-0.7, -0.4, -0.5);
  tail.render();

  // Tail puff
  let tailPuffMat = new Matrix4(tail.matrix);
  let tailPuff = new Cylinder();
  tailPuff.color = [0.9, 0.4, 0.0, 1.0];
  tailPuff.matrix = tailPuffMat;
  tailPuff.matrix.translate(-0.07, 0.007, -0.5);
  tailPuff.matrix.rotate(90, 1, 0, 0);
  tailPuff.matrix.scale(1.5, 0.09, 1.8);
  tailPuff.render();

  // FRONT LEFT leg
  let fl1 = new Cylinder();
  fl1.color = [1.0, 0.6, 0.0, 1.0];
  fl1.matrix.translate(0.24, 0., -0.35);
  fl1.matrix.rotate(g_FrontLeftLegUpper, 1, 0, 0);
  fl1.matrix.scale(0.08, 0.3, 0.08);
  fl1.matrix.translate(-0.5, -0.65, -0.5);
  fl1.render();

  let fl2 = new Cylinder();
  fl2.color = [1.0, 0.6, 0.0, 1.0];
  fl2.matrix.translate(0.24, 0.0, -0.35);
  fl2.matrix.rotate(g_FrontLeftLegUpper, 1, 0, 0);
  fl2.matrix.translate(0, -0.3, 0);
  fl2.matrix.rotate(g_FrontLeftLegLower, 1, 0, 0);
  fl2.matrix.scale(0.08, 0.16, 0.08);
  fl2.matrix.translate(-0.5, -0.65, -0.5);
  fl2.render();

  let fl2MatrixCopy = new Matrix4(fl2.matrix);
  let flPaw = new BlockyCube();
  flPaw.color = [0.9, 0.4, 0.0, 1.0];
  flPaw.matrix = fl2MatrixCopy;
  flPaw.matrix.translate(-0.002, -0.5, -0.24);
  flPaw.matrix.rotate(g_FrontLeftPawAngle, 1, 0, 0);
  flPaw.matrix.scale(1, 0.3, 1);
  flPaw.render();

  // FRONT RIGHT leg
  let fr1 = new Cylinder();
  fr1.color = [1.0, 0.6, 0.0, 1.0];
  fr1.matrix.translate(-0.16, 0.0, -0.35);
  fr1.matrix.rotate(g_FrontRightLegUpper, 1, 0, 0);
  fr1.matrix.scale(0.08, 0.3, 0.08);
  fr1.matrix.translate(-0.5, -0.65, -0.5);
  fr1.render();

  let fr2 = new Cylinder();
  fr2.color = [1.0, 0.6, 0.0, 1.0];
  fr2.matrix.translate(-0.16, 0.0, -0.35);
  fr2.matrix.rotate(g_FrontRightLegUpper, 1, 0, 0);
  fr2.matrix.translate(0, -0.3, 0);
  fr2.matrix.rotate(g_FrontRightLegLower, 1, 0, 0);
  fr2.matrix.scale(0.08, 0.16, 0.08);
  fr2.matrix.translate(-0.5, -0.65, -0.5);
  fr2.render();

  let fr2MatrixCopy = new Matrix4(fr2.matrix);
  let frPaw = new BlockyCube();
  frPaw.color = [0.9, 0.4, 0.0, 1.0];
  frPaw.matrix = fr2MatrixCopy;
  frPaw.matrix.translate(-0.002, -0.5, -0.24);
  frPaw.matrix.rotate(g_FrontRightPawAngle, 1, 0, 0);
  frPaw.matrix.scale(1, 0.3, 1);
  frPaw.render();

  // BACK LEFT leg
  let bl1 = new Cylinder();
  bl1.color = [1.0, 0.6, 0.0, 1.0];
  bl1.matrix.translate(0.24, 0.0, 0.35);
  bl1.matrix.rotate(g_BackLeftLegUpper, 1, 0, 0);
  bl1.matrix.scale(0.08, 0.3, 0.08);
  bl1.matrix.translate(-0.5, -0.55, -0.5);
  bl1.render();

  let bl2 = new Cylinder();
  bl2.color = [1.0, 0.6, 0.0, 1.0];
  bl2.matrix.translate(0.24, -0.01, 0.35);
  bl2.matrix.rotate(g_BackLeftLegUpper, 1, 0, 0);
  bl2.matrix.translate(0, -0.3, 0);
  bl2.matrix.rotate(g_BackLeftLegLower, 1, 0, 0);
  bl2.matrix.scale(0.08, 0.17, 0.08);
  bl2.matrix.translate(-0.5, -0.55, -0.5);
  bl2.render();

  let bl2MatrixCopy = new Matrix4(bl2.matrix);
  let blPaw = new BlockyCube();
  blPaw.color = [0.9, 0.4, 0.0, 1.0];
  blPaw.matrix = bl2MatrixCopy;
  blPaw.matrix.translate(-0.002, -0.5, -0.23);
  blPaw.matrix.rotate(g_BackLeftPawAngle, 1, 0, 0);
  blPaw.matrix.scale(1, 0.3, 1);
  blPaw.render();

  // BACK RIGHT leg
  let br1 = new Cylinder();
  br1.color = [1.0, 0.6, 0.0, 1.0];
  br1.matrix.translate(-0.16, 0.0, 0.35);
  br1.matrix.rotate(g_BackRightLegUpper, 1, 0, 0);
  br1.matrix.scale(0.08, 0.3, 0.08);
  br1.matrix.translate(-0.5, -0.55, -0.5);
  br1.render();

  let br2 = new Cylinder();
  br2.color = [1.0, 0.6, 0.0, 1.0];
  br2.matrix.translate(-0.16, -0.01, 0.35);
  br2.matrix.rotate(g_BackRightLegUpper, 1, 0, 0);
  br2.matrix.translate(0, -0.3, 0);
  br2.matrix.rotate(g_BackRightLegLower, 1, 0, 0);
  br2.matrix.scale(0.08, 0.17, 0.08);
  br2.matrix.translate(-0.5, -0.55, -0.5);
  br2.render();

  let br2MatrixCopy = new Matrix4(br2.matrix);
  let brPaw = new BlockyCube();
  brPaw.color = [0.9, 0.4, 0.0, 1.0];
  brPaw.matrix = br2MatrixCopy;
  brPaw.matrix.translate(-0.002, -0.5, -0.23);
  brPaw.matrix.rotate(g_BackRightPawAngle, 1, 0, 0);
  brPaw.matrix.scale(1, 0.3, 1);
  brPaw.render();
}