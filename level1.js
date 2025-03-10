import * as THREE from 'three';
import { OBB } from 'three/examples/jsm/Addons.js';


export function setUpLevel(scene) {

    let player = [];
    let obstacles = [];
    
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
    
    function createBoxObstacle(x_i, y_i, z_i, length, width, height, transforms, win = false){
        const box_ob_geometry = new THREE.BoxGeometry(length, width, height);
        const size = new THREE.Vector3(length, width, height);
    
        box_ob_geometry.userData.obb = new OBB();
        box_ob_geometry.userData.obb.halfSize.copy(size).multiplyScalar( 0.5 );
        
        const box_ob_texture=new THREE.TextureLoader().load('assets/smallmoontexture.png');


        box_ob_texture.minFilter = THREE.LinearMipMapLinearFilter;
    
        const box_ob_material = new THREE.MeshStandardMaterial({
            bumpMap : box_ob_texture,
            bumpScale : 5,
            color : 0x888888,
        });

    
        const box_ob_mesh = new THREE.Mesh(box_ob_geometry,box_ob_material);
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
    

    createBoxObstacle(0,-10,20,32,3,2,[]);
    createBoxObstacle(0,10,20,32,3,2,[]);
    createBoxObstacle(0,0,20,32,3,2,[]);

    createBoxObstacle(0,0,50,50,3,2,[addRotationZ(1),addTranslation(5,0,0),addTranslation(-5,0,0)]);

    createBoxObstacle(6,0,80,10,3,2,[addScaling(4, 2, 1)]);
    createBoxObstacle(-6,0,80,10,3,2,[addScaling(4, 2, 1)]);

    createBoxObstacle(0,-8,110,32,8,8,[addOscillatingTranslation(4, 0, 5, 0, 0)]);
    createBoxObstacle(0,8,110,32,8,8,[addOscillatingTranslation(4, 0, 5, 0, 0)]);

    createBoxObstacle(0,0,140,100,100,1,[], true);

    // createBoxObstacle(0,0,50,10,3,2,[]);
    // createBoxObstacle(0,0,70,10,3,2,[addOscillatingTranslation(4, 10, 0, 0, -10)]);
    // createBoxObstacle(0,0,30,20,3,2,[addRotationZ(1)], box_ob_material_texture);
    
    // createBoxObstacle(10,0,30,10,3,2,[addScaling(4, 2, 1)], box_ob_material_phong);
    // createBoxObstacle(-6,0,30,10,3,2,[addScaling(4, 2, 1)], box_ob_material_phong);
    
    // createBoxObstacle(8,0,40,10,3,2,[addScaling(4, 2, 1)], box_ob_material_texture);
    // createBoxObstacle(-9,0,40,10,3,2,[addScaling(4, 2, 1)], box_ob_material_texture);
    
    // createBoxObstacle(10,0,50,6,4,2,[], box_ob_material_texture);
    // createBoxObstacle(1,-7,50,6,4,2,[], box_ob_material_phong);
    // createBoxObstacle(5,6,50,6,4,2,[], box_ob_material_texture);
    // createBoxObstacle(7,-4,50,6,4,2,[], box_ob_material_phong);
    // createBoxObstacle(9,9,50,6,4,2,[], box_ob_material_phong);
    // createBoxObstacle(-9,9,50,6,4,2,[], box_ob_material_texture);
    // createBoxObstacle(8,-9,50,6,4,2,[], box_ob_material_phong);
    // createBoxObstacle(-8,-7,50,6,4,2,[], box_ob_material_texture);
    // createBoxObstacle(-8,4,50,6,4,2,[], box_ob_material_phong);
    // // createBoxObstacle(0,0,50,6,4,2,[], box_ob_material_texture);
    
    // createBoxObstacle(-10,0,65,16,32,2,[addOscillatingTranslation(4, 10, 0, 0, -10)], box_ob_material_texture);
    // createBoxObstacle(10,0,65,16,32,2,[addOscillatingTranslation(4, 10, 0, 0, -10)], box_ob_material_texture);
    
    // createBoxObstacle(8,0,75,5,3,2,[addRotationZ(1), addOscillatingTranslation(4, 10, 0, 0, -10), addScaling(4, 2, 1)], box_ob_material_texture);
    // createBoxObstacle(-8,0,75,5,3,2,[addRotationZ(1), addOscillatingTranslation(4, 10, 0, 0, -10), addScaling(4, 2, 1)], box_ob_material_phong);
    
    return {player, obstacles}; 

}    