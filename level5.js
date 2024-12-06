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

    function createBoxObstacle(x_i, y_i, z_i, length, width, height, transforms, collection, texture){
        const box_ob_geometry = new THREE.BoxGeometry(length, width, height);
        const size = new THREE.Vector3(length, width, height);
    
        box_ob_geometry.userData.obb = new OBB();
        box_ob_geometry.userData.obb.halfSize.copy(size).multiplyScalar( 0.5 );

        let box_ob_texture;
        if (texture == 0) {
            box_ob_texture = new THREE.TextureLoader().load('assets/lava-flow.jpg');
        }
        else {
            box_ob_texture = new THREE.TextureLoader().load('assets/the-end.jpg');
        } 
        
        box_ob_texture.minFilter = THREE.LinearMipMapLinearFilter;
    
        const box_ob_material = new THREE.MeshStandardMaterial({
            map: box_ob_texture,
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
            type: 'box',
            collect: collection,
            isWin: false
        });
    }
    
    function createSphereObstacle(x_i, y_i, z_i, radius, transforms, collection){  
        const sphere_ob_geometry = new THREE.SphereGeometry(radius, 64, 64);
       
        let sphere_ob_texture;

        if (collection) {
            sphere_ob_texture = new THREE.TextureLoader().load('assets/coins.jpg');
        }
        else {
            sphere_ob_texture = new THREE.TextureLoader().load('assets/lava-flow.jpg');
        }

        sphere_ob_texture.minFilter = THREE.LinearMipMapLinearFilter;
    
        const sphere_ob_material = new THREE.MeshStandardMaterial({
            map: sphere_ob_texture,
            bumpMap : sphere_ob_texture,
            bumpScale : 5,
            color : 0x888888,
        });

        const sphere_ob_mesh = new THREE.Mesh(sphere_ob_geometry, sphere_ob_material);

        sphere_ob_mesh.matrixAutoUpdate = false;
        sphere_ob_mesh.visible=false;
        sphere_ob_mesh.position.set(x_i, y_i, z_i);
        scene.add(sphere_ob_mesh);

        sphere_ob_mesh.userData.boundingSphere = new THREE.Sphere(
            sphere_ob_mesh.position, 
            radius
        );
    
        obstacles.push({
            mesh: sphere_ob_mesh, 
            x: x_i, 
            y: y_i, 
            z: z_i, 
            tranformations: transforms,
            type: 'sphere',
            collect: collection,
            collected: false,
            isWin: false
        });
    }
    
    function createCustomObstacles(){
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

    let side1 = 1/Math.sqrt(2);
    let side5 = side1*5;
    let side10 = side1*10;
    let side20 = side1*20;
    let side40 = side1*40;
    let scale1d2 = addScaling(1.2,1.2,1.2);
    let scale3 = addScaling(3,3,3);
    let scale2 = addScaling(2,2,2);

    // Freebe
    createSphereObstacle(0,0,5,1,[addTranslation(0,0,-4)], true)

    // Rotating around
    // createSphereObstacle(60,0,50,4,[addTranslation(0,0,-5), addRotationZ(6)], false);
    // createSphereObstacle(0,60,60,4,[addTranslation(0,0,-5), addRotationZ(6)], false);
    // createSphereObstacle(-60,0,70,4,[addTranslation(0,0,-5), addRotationZ(6)], false);
    // createSphereObstacle(0,-60,80,4,[addTranslation(0,0,-5), addRotationZ(6)], false);
    // createSphereObstacle(60,0,90,4,[addTranslation(0,0,-5), addRotationZ(6)], false);
    // createSphereObstacle(0,60,100,4,[addTranslation(0,0,-5), addRotationZ(6)], false);
    // createSphereObstacle(-60,0,110,4,[addTranslation(0,0,-5), addRotationZ(6)], false);
    // createSphereObstacle(0,-60,120,4,[addTranslation(0,0,-5), addRotationZ(6)], false);
    // createSphereObstacle(60,0,120,4,[addTranslation(0,0,-5), addRotationZ(6)], false);
    // createSphereObstacle(0,60,140,4,[addTranslation(0,0,-5), addRotationZ(6)], false);
    // createSphereObstacle(-60,0,150,4,[addTranslation(0,0,-5), addRotationZ(6)], false);
    // createSphereObstacle(0,-60,160,4,[addTranslation(0,0,-5), addRotationZ(6)], false);
    // createSphereObstacle(60,0,170,4,[addTranslation(0,0,-5), addRotationZ(6)], false);
    // createSphereObstacle(0,60,180,4,[addTranslation(0,0,-5), addRotationZ(6)], false);
    // createSphereObstacle(-60,0,190,4,[addTranslation(0,0,-5), addRotationZ(6)], false);
    // createSphereObstacle(0,-60,200,4,[addTranslation(0,0,-5), addRotationZ(6)], false);

    // Center converging
    createSphereObstacle(40,0,50,4,[addTranslation(-10,0,-5)],false);
    createSphereObstacle(side40,side40,50,4,[addTranslation(-side10,-side10,-5)],false);
    createSphereObstacle(0,40,50,4,[addTranslation(0,-10,-5)],false);
    createSphereObstacle(-side40,side40,50,4,[addTranslation(side10,-side10,-5)],false);
    createSphereObstacle(-40,0,50,4,[addTranslation(10,0,-5)],false);
    createSphereObstacle(-side40,-side40,50,4,[addTranslation(side10,side10,-5)],false);
    createSphereObstacle(0,-40,50,4,[addTranslation(0,10,-5)],false);
    createSphereObstacle(side40,-side40,50,4,[addTranslation(-side10,side10,-5)],false);

    // Hard after converging
    createSphereObstacle(1,10,60,1,[addTranslation(0,0,-4)], true)
    
    // X in
    createSphereObstacle(50,50,80,3,[addTranslation(-8,-8,-7)],false);
    createSphereObstacle(-50,50,80,3,[addTranslation(8,-8,-7)],false);
    createSphereObstacle(-50,-50,80,3,[addTranslation(8,8,-7)],false);
    createSphereObstacle(50,-50,80,3,[addTranslation(-8,8,-7)],false);

    // Top right
    createSphereObstacle(-5,-5,80,1,[addTranslation(0,0,-5)], true)

    // Weird pattern
    createSphereObstacle(40,0,135,5,[addTranslation(-3,0,-5)],false);
    createSphereObstacle(15,15,135,5,[addTranslation(-3*side1,-3*side1,-5)],false);
    createSphereObstacle(0,40,135,5,[addTranslation(0,-3,-5)],false);
    createSphereObstacle(-15,15,135,5,[addTranslation(3*side1,-3*side1,-5)],false);
    createSphereObstacle(-40,0,135,5,[addTranslation(3,0,-5)],false);
    createSphereObstacle(-15,-15,135,5,[addTranslation(3*side1,3*side1,-5)],false);
    createSphereObstacle(0,-40,135,5,[addTranslation(0,3,-5)],false);
    createSphereObstacle(15,-15,135,5,[addTranslation(-3*side1,3*side1,-5)],false);

    // Hold center right
    createSphereObstacle(5,-5,240,1,[addTranslation(0,0,-15)], true);   

    // Constrainer
    createBoxObstacle(0,20,160,60,20,15,[addTranslation(0,0,-3)], false, 0);
    createBoxObstacle(-20,0,160,20,20,15,[addTranslation(0,0,-3)], false, 0);
    createBoxObstacle(0,-20,160,60,20,15,[addTranslation(0,0,-3)], false, 0);
    createBoxObstacle(20,0,160,20,20,15,[addTranslation(0,0,-3)], false, 0);

    // Sphere of Doom
    createSphereObstacle(10,0,170,2,[addTranslation(0,0,-3), addRotationZ(2)], false);
    createSphereObstacle(0,10,175,2,[addTranslation(0,0,-3), addRotationZ(2)], false);
    createSphereObstacle(-10,0,180,2,[addTranslation(0,0,-3), addRotationZ(2)], false);
    createSphereObstacle(0,-10,185,2,[addTranslation(0,0,-3), addRotationZ(2)], false);

    createSphereObstacle(side10,side10,190,2,[addTranslation(0,0,-3), addRotationZ(2)], false);
    createSphereObstacle(-side10,side10,195,2,[addTranslation(0,0,-3), addRotationZ(2)], false);
    createSphereObstacle(-side10,-side10,200,2,[addTranslation(0,0,-3), addRotationZ(2)], false);
    createSphereObstacle(side10,-side10,205,2,[addTranslation(0,0,-3), addRotationZ(2)], false);

    createSphereObstacle(20,0,210,2,[addTranslation(0,0,-3), addRotationZ(2)], false);
    createSphereObstacle(0,20,215,2,[addTranslation(0,0,-3), addRotationZ(2)], false);
    createSphereObstacle(-20,0,220,2,[addTranslation(0,0,-3), addRotationZ(2)], false);
    createSphereObstacle(0,-20,225,2,[addTranslation(0,0,-3), addRotationZ(2)], false);

    createSphereObstacle(side20,side20,230,2,[addTranslation(0,0,-3), addRotationZ(2)], false);
    createSphereObstacle(-side20,side20,235,2,[addTranslation(0,0,-3), addRotationZ(2)], false);
    createSphereObstacle(-side20,-side20,240,2,[addTranslation(0,0,-3), addRotationZ(2)], false);
    createSphereObstacle(side20,-side20,245,2,[addTranslation(0,0,-3), addRotationZ(2)], false);

    // Bottom left
    createSphereObstacle(-15,-15,230,1,[addTranslation(0,0,-3)], true); 

    createBoxObstacle(0,0,230,60,60,1,[addTranslation(0,0,-3)], true, 1);
    return {player, obstacles}; 
    
}    