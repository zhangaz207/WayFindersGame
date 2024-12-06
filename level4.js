import * as THREE from 'three';
import { OBB } from 'three/examples/jsm/Addons.js';

export function setUpLevel(scene) {

    let player = [];
    let obstacles = [];

    // while (scene.children.length > 0) {
    //     scene.remove(scene.children[0]);
    // }
    
    class Texture_Rotate {
        vertexShader() {
            return `
            uniform sampler2D uTexture;
            varying vec2 vUv;
            varying vec3 vPosition;
            void main() {
                vUv = uv;
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
            }
            `;
        }
    
        fragmentShader() {
            return `
            uniform sampler2D uTexture;
            uniform float animation_time;
            varying vec2 vUv;
            varying vec3 vPosition;
            void main() {    
                 // TODO: 2.c Rotate the texture map around the center of each face at a rate of 8 rpm.
                const float PI = 3.14159265359;
                float angle = -4.0*PI/15.0 * animation_time;
                vec2 center = vec2(0.5, 0.5);
                vec2 vUv_t = vUv - center;
                vec2 vUv_r;
                vUv_r.x = vUv_t.x * cos(angle) - vUv_t.y * sin(angle);
                vUv_r.y = vUv_t.x * sin(angle) + vUv_t.y * cos(angle);
                vec2 vUv_f = vUv_r + center;
                vUv_f.x = mod(vUv_f.x, 1.0);
                vUv_f.y = mod(vUv_f.y, 1.0);
    
                // TODO: 1.b Load the texture color from the texture map
                // Hint: Use texture2D function to get the color of the texture at the current UV coordinates
                vec4 texColor = texture2D(uTexture, vUv_f);
                
                // TODO: 2.d add the outline of a black square in the center of each texture that moves with the texture
                // Hint: Tell whether the current pixel is within the black square or not using the UV coordinates
                //       If the pixel is within the black square, set the tex_color to vec4(0.0, 0.0, 0.0, 1.0)
    
                // if (vUv_f.x > 0.15 && vUv_f.x < 0.25 && vUv_f.y > 0.15 && vUv_f.y < 0.85){
                //     texColor = vec4(0, 0, 0, 1.0);
                // }
                // if (vUv_f.x > 0.75 && vUv_f.x < 0.85 && vUv_f.y > 0.15 && vUv_f.y < 0.85){
                //     texColor = vec4(0, 0, 0, 1.0);
                // }
                // if (vUv_f.y > 0.15 && vUv_f.y < 0.25 && vUv_f.x > 0.15 && vUv_f.x < 0.85){
                //     texColor = vec4(0, 0, 0, 1.0);
                // }
                // if (vUv_f.y > 0.75 && vUv_f.y < 0.85 && vUv_f.x > 0.15 && vUv_f.x < 0.85){
                //     texColor = vec4(0, 0, 0, 1.0);
                // }
    
                gl_FragColor = texColor;
                
            }
            `;
        }
    }
    
    
    class Texture_Scroll_X {
        vertexShader() {
            return `
            uniform sampler2D uTexture;
            varying vec2 vUv;
            varying vec3 vPosition;
            void main() {
                vUv = uv;
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
            }
            `;
        }
    
        fragmentShader() {
            return `
            uniform sampler2D uTexture;
            uniform float animation_time;
            varying vec2 vUv;
            varying vec3 vPosition;
            void main() {
                // TODO: 2.a Shrink the texuture by 50% so that the texture is repeated twice in each direction
                vec2 vUv_f = 2.0 * vUv;
    
                // TODO: 2.b Translate the texture varying the s texture coordinate by 4 texture units per second, 
                vUv_f.x = vUv_f.x - animation_time * 4.0;
                vUv_f.x = mod(vUv_f.x, 1.0);
                vUv_f.y = mod(vUv_f.y, 1.0);
                // TODO: 1.b Load the texture color from the texture map
                // Hint: Use texture2D function to get the color of the texture at the current UV coordinates
                vec4 texColor = texture2D(uTexture, vUv_f);
                
    
                // TODO: 2.d add the outline of a black square in the center of each texture that moves with the texture
                // Hint: Tell whether the current pixel is within the black square or not using the UV coordinates
                //       If the pixel is within the black square, set the tex_color to vec4(0.0, 0.0, 0.0, 1.0)
                // if (vUv_f.x > 0.15 && vUv_f.x < 0.25 && vUv_f.y > 0.15 && vUv_f.y < 0.85){
                //     texColor = vec4(0, 0, 0, 1.0);
                // }
                // if (vUv_f.x > 0.75 && vUv_f.x < 0.85 && vUv_f.y > 0.15 && vUv_f.y < 0.85){
                //     texColor = vec4(0, 0, 0, 1.0);
                // }
                // if (vUv_f.y > 0.15 && vUv_f.y < 0.25 && vUv_f.x > 0.15 && vUv_f.x < 0.85){
                //     texColor = vec4(0, 0, 0, 1.0);
                // }
                // if (vUv_f.y > 0.75 && vUv_f.y < 0.85 && vUv_f.x > 0.15 && vUv_f.x < 0.85){
                //     texColor = vec4(0, 0, 0, 1.0);
                // }
                
    
                gl_FragColor = texColor;
            }
            `;
        }
    }


    const player_geom = new THREE.SphereGeometry(1, 64, 64);
    // const player_material = new THREE.MeshPhongMaterial({
    //     color: 0xff0000
    // });

    const newtexturemat = new THREE.TextureLoader().load('assets/ballpattern.png');
    newtexturemat.minFilter = THREE.LinearMipMapLinearFilter;

    const player_material = new THREE.MeshStandardMaterial({
        map : newtexturemat,
        });
    
// const newtexturemat = new THREE.TextureLoader().load('assets/glass.png');
     // const player_material = new THREE.ShaderMaterial({
    //     map : newtexturemat,
    // });

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
        // const box_ob_material = new THREE.MeshPhongMaterial({
        // color: 0x48ff00, flatShading : true
        // });
        
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
    
    function createSphereObstacle(){
        
    }
    
    function createCustomObstacles(){
    
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