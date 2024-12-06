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
    player1.castShadow =true;
    player1.geometry.computeBoundingSphere();
    scene.add(player1);
    player1.position.set(0,8,0);
    player.push(player1);

    const player2 = new THREE.Mesh(player_geom, player_material);
    player2.castShadow =true;
    player2.geometry.computeBoundingSphere();
    scene.add(player2);
    player2.position.set(0,-8,0);
    player.push(player2);
    

    function createBoxObstacle(x_i, y_i, z_i, length, width, height, transforms, win = false){
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
        box_ob_mesh.visible=true;
        scene.add(box_ob_mesh);
        box_ob_mesh.userData.obb = new OBB();

        obstacles.push({
            mesh: box_ob_mesh, 
            x: x_i, 
            y: y_i, 
            z: z_i, 
            tranformations: transforms,
            isWin: win
        });
    }
    
    const translation = 1;
    const oscillating_translation = 2;
    const scaling = 3;
    const rotationX = 4;
    const rotationY = 5;
    const rotationZ = 6;
    const oscillating_rotation = 7;
    
    function addTranslation(speedX, speedY, speedZ){
        return {tr_type: translation, speedX, speedY, speedZ};
    }
    function addOscillatingTranslation(period, speedX, speedY, speedZ, adjust){
        return {tr_type: oscillating_translation, period, speedX, speedY, speedZ, adjust};
    }
    function addOscillatingRotation(speed){
        return {tr_type: oscillating_rotation, speed};
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
    

    createBoxObstacle(6,6,60,15,4,20,[addTranslation(0,0,-20)]);
    createBoxObstacle(-6,-6,60,15,4,20,[addTranslation(0,0,-20)]);

    createBoxObstacle(6,-6,90,15,4,20,[addTranslation(0,0,-20)]);
    createBoxObstacle(-6,6,90,15,4,20,[addTranslation(0,0,-20)]);

    createBoxObstacle(0,0,125,15,4,30,[addTranslation(0,0,-20)]);
    createBoxObstacle(0,0,125,4,15,30,[addTranslation(0,0,-20)]);
    createBoxObstacle(6,6,125,5,5,10, [addTranslation(0,0,-20)]);
    createBoxObstacle(-6,-6,125,5,5,10, [addTranslation(0,0,-20)]);
    
    createBoxObstacle(0,0,160,20,4,15,[addRotationZ(3), addTranslation(0,0, -20)]);
    createBoxObstacle(0,0,190,20,4,15,[addRotationZ(-2), addTranslation(0,0, -20)]);
    createBoxObstacle(0,0,220,20,4,15,[addRotationZ(0.5), addTranslation(0,0, -20)]);
    createBoxObstacle(0,0,250,20,4,15,[addRotationZ(4), addTranslation(0,0, -20)]);
    createBoxObstacle(0,0,80,20,2,30,[addOscillatingRotation(2)]);

    createBoxObstacle(0,540,0,4,15,4,[addTranslation(0,-25, 5)]);
    createBoxObstacle(8,570,0,4,15,4,[addTranslation(0,-25, 5)]);
    createBoxObstacle(0,-700,0,4,5,15,[addTranslation(0,30, 5)]);
    createBoxObstacle(0,8,590,4,4,15, [addTranslation(0,0,-20)]);
    createBoxObstacle(-8,-600,0,4,15,4, [addTranslation(0,25, 5)]);
    createBoxObstacle(620,-8,0,15,4,4, [addTranslation(-25,0, 5)]);


    createBoxObstacle(0,540,0,4,15,4,[addTranslation(0,-25, 5)]);
    createBoxObstacle(8,570,0,4,15,4,[addTranslation(0,-25, 5)]);
    createBoxObstacle(0,-690,0,2,4,15,[addTranslation(0,30, 5)]);
    createBoxObstacle(0,8,600,4,4,15, [addTranslation(0,0,-20)]);
    createBoxObstacle(-8,-610,0,4,15,4, [addTranslation(0,25, 5)]);
    createBoxObstacle(630,-8,0,15,4,4, [addTranslation(-25,0, 5)]);

    createBoxObstacle(0,0,720,100,100,1,[addTranslation(0, 0, -20)], true);

    return {player, obstacles};
    
}    