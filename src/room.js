import * as THREE from "three";

export function buildRoom(scene, { width = 20, depth = 30, height = 5 } = {}) {
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(width, depth),
    new THREE.MeshStandardMaterial({ color: 0x8a6f4e, roughness: 0.8 })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const wallMat = new THREE.MeshStandardMaterial({ color: 0xf2efe9 });
  const walls = [
    { w: width, pos: [0, height / 2, -depth / 2], rot: 0 },
    { w: width, pos: [0, height / 2, depth / 2], rot: Math.PI },
    { w: depth, pos: [-width / 2, height / 2, 0], rot: Math.PI / 2 },
    { w: depth, pos: [width / 2, height / 2, 0], rot: -Math.PI / 2 },
  ];
  const meshes = walls.map(({ w, pos, rot }) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, height), wallMat);
    m.position.set(...pos);
    m.rotation.y = rot;
    scene.add(m);
    return m;
  });

  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  for (let z = -depth / 2 + 5; z < depth / 2; z += 8) {
    const spot = new THREE.PointLight(0xfff2dd, 0.6, 15);
    spot.position.set(0, height - 0.3, z);
    scene.add(spot);
  }
  return meshes;
}

export function hangPainting(scene, url, { x, z, rotY, title }) {
  const tex = new THREE.TextureLoader().load(url);
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 2.2, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x222222 })
  );
  const art = new THREE.Mesh(new THREE.PlaneGeometry(3, 2), new THREE.MeshBasicMaterial({ map: tex }));
  art.position.z = 0.06;
  frame.add(art);
  frame.position.set(x, 2.2, z);
  frame.rotation.y = rotY;
  frame.userData.title = title;
  scene.add(frame);
  return frame;
}
