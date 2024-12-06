import * as THREE from 'three';
import { OBB } from 'three/examples/jsm/Addons.js';


export function setUpLevel(scene) {

    let player = [];
    let obstacles = [];

    const player_geom = new THREE.SphereGeometry(1, 64, 64);

    const newtexturemat = new THREE.TextureLoader().load('assets/ballpattern.png');
    newtexturemat.minFilter = THREE.LinearMipMapLinearFilter;

    const player_material = new THREE.MeshStandardMaterial({
        map : newtexturemat,
        });

    const player1 = new THREE.Mesh(player_geom, player_material);
    player1.castShadow = true;
    player1.geometry.computeBoundingSphere();
    scene.add(player1);
    player.push(player1);

    function createBoxObstacle(x_i, y_i, z_i, length, width, height, transforms,win =false){
        const box_ob_geometry = new THREE.BoxGeometry(length, width, height);
        const size = new THREE.Vector3(length, width, height);
    
        box_ob_geometry.userData.obb = new OBB();
        box_ob_geometry.userData.obb.halfSize.copy(size).multiplyScalar( 0.5 );
        
        const box_ob_texture = new THREE.TextureLoader().load('assets/smallmoontexture.png');
        box_ob_texture.minFilter = THREE.LinearMipMapLinearFilter;
    
        const box_ob_material = new THREE.MeshStandardMaterial({
            bumpMap : box_ob_texture,
            bumpScale : 5,
            color : 0x888888,
        });

        const box_ob_mesh = new THREE.Mesh(box_ob_geometry, box_ob_material);
        box_ob_mesh.matrixAutoUpdate = false;
        box_ob_mesh.visible=false;
        scene.add(box_ob_mesh);
        box_ob_mesh.userData.obb = new OBB();
    
        obstacles.push({
            mesh: box_ob_mesh, 
            x: x_i, 
            y: y_i, 
            z: z_i, 
            tranformations: transforms,
            isWin:win
        });
    }
    
    const translation = 1;
    const oscillating_translation = 2;
    const scaling = 3;
    const rotationX = 4;
    const rotationY = 5;
    const rotationZ = 6;
    
    function addTranslation(speedX, speedY, speedZ){
        return {tr_type: translation, speedX, speedY, speedZ};
    }

    function addIdentity(){
        return {tr_type: rotationX, speed : 0};
    }
    function addOscillatingTranslation(period, speedX, speedY, speedZ, adjust){
        return {tr_type: oscillating_translation, period, speedX, speedY, speedZ, adjust};
    }
    function addRotationX(speed){
        return {tr_type: rotationX, speed};
    }
    function addRotationY(speed){
        return {tr_type: rotationY, speed};
    }
    function addRotationZ(speed){
        return {tr_type: rotationZ, speed};
    }
    function addScaling(period, speed, adjust){
        return {tr_type: scaling, period, speed, adjust};
    }


    //good ones //weird teleportation //doesnt apply forward moving transformation
      createBoxObstacle(0,-32,30,64,8,6,[addOscillatingTranslation(10,0,3,5,0)]);
      createBoxObstacle(0,-24,36,64,8,6,[addOscillatingTranslation(10,0,3,4,0)]);
      createBoxObstacle(0,-16,42,64,8,6,[addOscillatingTranslation(10,0,3,3,0)]);
      createBoxObstacle(0,-8,48,64,8,6, [addOscillatingTranslation(10,0,3,2,0)]);
     // createBoxObstacle(0,0,54,64,8,6,  [addOscillatingTranslation(10,0,10,1,0)]);

      createBoxObstacle(0,32,30,64,8,6,[addOscillatingTranslation(10,0,3,5,0)]);
      createBoxObstacle(0,24,36,64,8,6,[addOscillatingTranslation(10,0,3,4,0)]);
      createBoxObstacle(0,16,42,64,8,6,[addOscillatingTranslation(10,0,3,3,0)]);
      createBoxObstacle(0,8,48,64,8,6, [addOscillatingTranslation(10,0,3,2,0)]);
      //createBoxObstacle(0,0,54,64,8,6,  [addOscillatingTranslation(10,0,10,1,0)]);
    
    //set 2
    createBoxObstacle(-12,-12,70,5,3,2,[addRotationZ(-2)]);
    createBoxObstacle(12,-12,70,5,3,2,[addRotationZ(-2)]);
    createBoxObstacle(-12,12,65,5,3,2,[addRotationZ(-2)]);
    createBoxObstacle(12,12,70,5,3,2,[addRotationZ(-2)]);

    createBoxObstacle(-6,-6,70,5,3,2,[addRotationZ(1),addScaling(1.5, 1, 1)]);
    createBoxObstacle(6,-6,70,5,3,2,[addRotationZ(1),addScaling(1.5, 1, 1)]);
    createBoxObstacle(-6,6,70,5,3,2,[addRotationZ(1),addScaling(1.5, 1, 1)]);
    createBoxObstacle(6,6,70,5,3,2,[addRotationZ(1),addScaling(1.5, 1, 1)]);
    createBoxObstacle(0,0,70,4,4,2,[addRotationZ(5),addScaling(1, 1, 1)]);

    //set 3
    //regular trnaslation brokjen
    createBoxObstacle(2.5,2.5,85,5,5,2,[addRotationZ(0.5), addScaling(4,2,0)]);
    createBoxObstacle(-2.5,-2.5,85,5,5,2,[addRotationZ(0.5), addScaling(3,1.5,0)]);
    createBoxObstacle(-2.5,2.5,85,5,5,2,[addRotationZ(0.5), addScaling(1.5,1,0)]);
    createBoxObstacle(2.5,-2.5,85,5,5,2,[addRotationZ(0.5), addScaling(1.5,1,0)]);


    //set 4

    let mydist = -15;

    createBoxObstacle(8,-8,85-mydist,16,16,5,[addOscillatingTranslation(5,0,0,7,0)]);
    createBoxObstacle(8,8,85-mydist,16,16,5,[addOscillatingTranslation(5,0,0,7,0 )]);

    createBoxObstacle(-8,-8,95-mydist,16,16,5,[addOscillatingTranslation(10,0,0,7,0)]);
    createBoxObstacle(-8,8,95-mydist,16,16,5,[addOscillatingTranslation(10,0,0,7,0)]);

    createBoxObstacle(8,-8,115-mydist,16,16,5,[addOscillatingTranslation(5,0,0,7,0)]);
    createBoxObstacle(-8,8,115-mydist,16,16,5,[addOscillatingTranslation(5,0,0,7,0 )]);

    createBoxObstacle(-8,-8,135-mydist,16,16,5,[addOscillatingTranslation(10,0,0,7,0)]);
    createBoxObstacle(8,8,135-mydist,16,16,5,[addOscillatingTranslation(10,0,0,7,0)]);

    createBoxObstacle(8,8,155-mydist,16,16,5,[addOscillatingTranslation(5,0,0,7,0)]);
    createBoxObstacle(-8,8,155-mydist,16,16,5,[addOscillatingTranslation(5,0,0,7,0 )]);

    createBoxObstacle(-8,-8,175-mydist,16,16,5,[addOscillatingTranslation(5,0,0,7,0)]);
    createBoxObstacle(8,-8,175-mydist,16,16,5,[addOscillatingTranslation(5,0,0,7,0)]);


    //set 5
    createBoxObstacle(-16,0,190-mydist,32,64,5,[]);
    createBoxObstacle(-16,0,220-mydist,32,64,5,[]);
    //createBoxObstacle(-16,0,250-mydist,32,64,5,[]);
    //createBoxObstacle(-16,0,280-mydist,32,64,5,[]);

    createBoxObstacle(10,-32,205-mydist,20,5,30,[addOscillatingTranslation(8,0,100,0,-50)]);
    createBoxObstacle(0,0,230-mydist,64,64,30,[],false);
    //createBoxObstacle(10,-16,220-mydist,16,25,60,[addOscillatingTranslation(5,0,10,0,0)]);


    return {player, obstacles}; 
    
}    