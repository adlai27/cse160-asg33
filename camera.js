
class Camera {
    constructor() {
      this.eye   = new Vector3([0, 2, 8]);  // Position of the camera
      this.at    = new Vector3([0, 2, 0]);  // looking at
      this.up    = new Vector3([0, 1, 0]);  // Up direction
  
      // Rotation angles (degrees)
      this.yaw   = 0;  // left/right rotation around Y
      this.pitch = 0;  // up/down rotation
  
      // speed
      this.speed = 0.2;
  
      // Initializeon yaw/pitch
      this.updateAt();
    }
  
    updateAt() {
      let radYaw   = this.yaw   * Math.PI / 180.0;
      let radPitch = this.pitch * Math.PI / 180.0;
  
      let fx = Math.sin(radYaw) * Math.cos(radPitch);
      let fy = Math.sin(radPitch);
      let fz = -Math.cos(radYaw) * Math.cos(radPitch);
  
      let look = new Vector3([
        this.eye.elements[0] + fx,
        this.eye.elements[1] + fy,
        this.eye.elements[2] + fz
      ]);
      this.at = look;
    }
  
    // Move camera forward in direction of `at - eye`
    forward() {
      let f = new Vector3(this.at.elements);
      f.sub(this.eye);
      f.normalize();
      f.mul(this.speed);
      this.eye.add(f);
      this.at.add(f);
    }
  
    // Move camera backward
    backward() {
      let f = new Vector3(this.eye.elements);
      f.sub(this.at);
      f.normalize();
      f.mul(this.speed);
      this.eye.add(f);
      this.at.add(f);
    }
  
    // Move camera left (strafe)
    left() {
      // forward = (at - eye)
      let forward = new Vector3(this.at.elements);
      forward.sub(this.eye);
      forward.normalize();
  
      // cross(up, forward)
      let side = cross(this.up, forward);
      side.normalize();
      side.mul(this.speed);
  
      this.eye.add(side);
      this.at.add(side);
    }
  
    // Move camera right (strafe)
    right() {
      let forward = new Vector3(this.eye.elements);
      forward.sub(this.at);
      forward.normalize();
  
      // cross(up, forward)
      let side = cross(this.up, forward);
      side.normalize();
      side.mul(this.speed);
  
      this.eye.add(side);
      this.at.add(side);
    }
  
    // Move camera up (increase y)
    upward() {
      this.eye.elements[1] += this.speed;
      this.at.elements[1] += this.speed;
    }
  
    // Move camera down (decrease y)
    downward() {
      this.eye.elements[1] -= this.speed;
      this.at.elements[1] -= this.speed;
    }
  
    // Rotate camera yaw to the left (Q) => negative yaw
    rotLeft(angle = 5) {
      this.yaw -= angle;
      this.updateAt();
    }
  
    // Rotate camera yaw to the right (E) => positive yaw
    rotRight(angle = 5) {
      this.yaw += angle;
      this.updateAt();
    }
  
    // Tilt camera (pitch up/down)
    tilt(angle = 5) {
      this.pitch += angle;
      if (this.pitch > 89)  this.pitch = 89;
      if (this.pitch < -89) this.pitch = -89;
      this.updateAt();
    }
  }
  
  function cross(u, v) {
    return new Vector3([
      u.elements[1] * v.elements[2] - u.elements[2] * v.elements[1],
      u.elements[2] * v.elements[0] - u.elements[0] * v.elements[2],
      u.elements[0] * v.elements[1] - u.elements[1] * v.elements[0]
    ]);
  }
  