exports.distance = (x, y)=>{
  return Math.pow((Math.pow(x, 2) + Math.pow(y, 2)), .5);
};
exports.mass = (m)=>{
  return Math.pow(6*m/Math.PI, 1/2).toFixed(4);
};
exports.direction = (x, y)=>{
  return (Math.abs((Math.atan(x/y)*(180/Math.PI)))/90*100).toFixed(4);
};
exports.pace = (dist, qX, qY, r, m, dir, p)=>{
  let speed = 2.2 * Math.pow(m, -.0439);
  let fullSpeed = r + 50;
  let partSpeed = dist / fullSpeed;
  let dX = (dir * speed) / 100;
  let dY = ((100 - dX) * speed) / 100;
  let fX, fY;
  //console.log(`IN: ${p.x}`);
  if(dist >= fullSpeed){
    fX = speed * dX * qX;
    fY = speed * dY * qY;
  }else if(dist < fullSpeed && dist > 0.00001){
    fX = speed * partSpeed * dX * qX;
    fY = speed * partSpeed * dY * qY;
  }else{
    fX = 0;
    fY = 0;
  }
  //console.log(`OUT: ${p.x}`);
  return {
    x: fX,
    y: fY
  };
};