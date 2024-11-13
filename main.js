import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(-20, 5, -2);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);


// class Texture_Rotate {
//     vertexShader() {
//         return `
//         uniform sampler2D uTexture;
//         varying vec2 vUv;
//         varying vec3 vPosition;
//         void main() {
//             vUv = uv;
//             vPosition = position;
//             gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
//         }
//         `;
//     }

//     fragmentShader() {
//         return `
//         uniform sampler2D uTexture;
//         uniform float animation_time;
//         varying vec2 vUv;
//         varying vec3 vPosition;
//         void main() {    
//              // TODO: 2.c Rotate the texture map around the center of each face at a rate of 8 rpm.
//             const float PI = 3.14159265359;
//             float angle = -4.0*PI/15.0 * animation_time;
//             vec2 center = vec2(0.5, 0.5);
//             vec2 vUv_t = vUv - center;
//             vec2 vUv_r;
//             vUv_r.x = vUv_t.x * cos(angle) - vUv_t.y * sin(angle);
//             vUv_r.y = vUv_t.x * sin(angle) + vUv_t.y * cos(angle);
//             vec2 vUv_f = vUv_r + center;
//             vUv_f.x = mod(vUv_f.x, 1.0);
//             vUv_f.y = mod(vUv_f.y, 1.0);

//             // TODO: 1.b Load the texture color from the texture map
//             // Hint: Use texture2D function to get the color of the texture at the current UV coordinates
//             vec4 texColor = texture2D(uTexture, vUv_f);
            
//             // TODO: 2.d add the outline of a black square in the center of each texture that moves with the texture
//             // Hint: Tell whether the current pixel is within the black square or not using the UV coordinates
//             //       If the pixel is within the black square, set the tex_color to vec4(0.0, 0.0, 0.0, 1.0)

//             if (vUv_f.x > 0.15 && vUv_f.x < 0.25 && vUv_f.y > 0.15 && vUv_f.y < 0.85){
//                 texColor = vec4(0, 0, 0, 1.0);
//             }
//             if (vUv_f.x > 0.75 && vUv_f.x < 0.85 && vUv_f.y > 0.15 && vUv_f.y < 0.85){
//                 texColor = vec4(0, 0, 0, 1.0);
//             }
//             if (vUv_f.y > 0.15 && vUv_f.y < 0.25 && vUv_f.x > 0.15 && vUv_f.x < 0.85){
//                 texColor = vec4(0, 0, 0, 1.0);
//             }
//             if (vUv_f.y > 0.75 && vUv_f.y < 0.85 && vUv_f.x > 0.15 && vUv_f.x < 0.85){
//                 texColor = vec4(0, 0, 0, 1.0);
//             }

//             gl_FragColor = texColor;
            
//         }
//         `;
//     }
// }


// class Texture_Scroll_X {
//     vertexShader() {
//         return `
//         uniform sampler2D uTexture;
//         varying vec2 vUv;
//         varying vec3 vPosition;
//         void main() {
//             vUv = uv;
//             vPosition = position;
//             gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
//         }
//         `;
//     }

//     fragmentShader() {
//         return `
//         uniform sampler2D uTexture;
//         uniform float animation_time;
//         varying vec2 vUv;
//         varying vec3 vPosition;
//         void main() {
//             // TODO: 2.a Shrink the texuture by 50% so that the texture is repeated twice in each direction
//             vec2 vUv_f = 2.0 * vUv;

//             // TODO: 2.b Translate the texture varying the s texture coordinate by 4 texture units per second, 
//             vUv_f.x = vUv_f.x - animation_time * 4.0;
//             vUv_f.x = mod(vUv_f.x, 1.0);
//             vUv_f.y = mod(vUv_f.y, 1.0);
//             // TODO: 1.b Load the texture color from the texture map
//             // Hint: Use texture2D function to get the color of the texture at the current UV coordinates
//             vec4 texColor = texture2D(uTexture, vUv_f);
            

//             // TODO: 2.d add the outline of a black square in the center of each texture that moves with the texture
//             // Hint: Tell whether the current pixel is within the black square or not using the UV coordinates
//             //       If the pixel is within the black square, set the tex_color to vec4(0.0, 0.0, 0.0, 1.0)
//             if (vUv_f.x > 0.15 && vUv_f.x < 0.25 && vUv_f.y > 0.15 && vUv_f.y < 0.85){
//                 texColor = vec4(0, 0, 0, 1.0);
//             }
//             if (vUv_f.x > 0.75 && vUv_f.x < 0.85 && vUv_f.y > 0.15 && vUv_f.y < 0.85){
//                 texColor = vec4(0, 0, 0, 1.0);
//             }
//             if (vUv_f.y > 0.15 && vUv_f.y < 0.25 && vUv_f.x > 0.15 && vUv_f.x < 0.85){
//                 texColor = vec4(0, 0, 0, 1.0);
//             }
//             if (vUv_f.y > 0.75 && vUv_f.y < 0.85 && vUv_f.x > 0.15 && vUv_f.x < 0.85){
//                 texColor = vec4(0, 0, 0, 1.0);
//             }
            

//             gl_FragColor = texColor;
//         }
//         `;
//     }
// }

let animation_time = 0.0;


const ob1_geometry = new THREE.BoxGeometry(10, 2, 2);
const ob1_material = new THREE.MeshBasicMaterial({
    color: 0x48ff00
});

const ob1_mesh = new THREE.Mesh(ob1_geometry, ob1_material);
ob1_mesh.position.set(0, 0, 10);
scene.add(ob1_mesh);

const edges = new THREE.EdgesGeometry(ob1_geometry); 
const lineMaterial = new THREE.LineBasicMaterial({
  color: 0x000000, 
  linewidth: 2,
  depthWrite: false
});

const edgeLines = new THREE.LineSegments(edges, lineMaterial);
edgeLines.position.copy(ob1_mesh.position);
scene.add(edgeLines);


const ob1_bounding = new THREE.Box3().setFromObject(ob1_mesh);

const ball_geom = new THREE.SphereGeometry(1, 64,64);
const ball_material = new THREE.MeshBasicMaterial({
    color: 0xff0000
});


const ball_mesh = new THREE.Mesh(ball_geom, ball_material);
ball_mesh.position.set(0, 0, 0);
scene.add(ball_mesh);


let obstacles = [
    ob1_bounding
    //array of obstacles
];

function checkCollision(obs_bounding, ball_bounding) {
    // Check if the box intersects with the sphere's bounding sphere
    console.log("Box position:", ob1_mesh.position);
    console.log("Ball position:", ball_mesh.position);
    console.log("Box bounding:", ob1_bounding);
    console.log("Ball bounding:", ball_bounding);

    if (obs_bounding.intersectsSphere(ball_bounding)) {
        console.log("The box and sphere are colliding!");
        return true;
    }
    else{
        console.log("The box and sphere are not colliding!");
    }
}
 
// const cube1_texture = new THREE.TextureLoader().load('assets/stars.png');

// cube1_texture.minFilter = THREE.NearestFilter;
// cube1_texture.magFilter = THREE.NearestFilter;

// const cube1_uniforms = {
//     uTexture: { value: cube1_texture },
//     animation_time: { value: animation_time }
// };
// const cube1_shader = new Texture_Rotate();
// const cube1_material = new THREE.ShaderMaterial({
//     uniforms: cube1_uniforms,
//     vertexShader: cube1_shader.vertexShader(),
//     fragmentShader: cube1_shader.fragmentShader(),
// });

// const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
// scene.add(ambientLight);

// const pointLight = new THREE.PointLight(0xffffff, 1, 100);  // White light
// pointLight.position.set(5, 5, 5); // Position the light
// scene.add(pointLight);

// const cube2_geometry = new THREE.BoxGeometry(2, 2, 2);

// TODO: 1.a Load texture map 
// const cube2_texture = new THREE.TextureLoader().load('assets/earth.gif');;

// TODO: 1.c Apply Texture Filtering Techniques to Cube 2
// Linear Mipmapping Texture Filtering
// cube2_texture.minFilter = THREE.LinearMipmapLinearFilter;

// TODO: 2.a Enable texture repeat wrapping for Cube 2
// cube2_texture.wrapS = THREE.RepeatWrapping;
// cube2_texture.wrapT = THREE.RepeatWrapping;

// const cube2_uniforms = {
//     uTexture: { value: cube2_texture },
//     animation_time: { value: animation_time }
// };
// const cube2_shader = new Texture_Scroll_X();
// const cube2_material = new THREE.ShaderMaterial({
//     uniforms: cube2_uniforms,
//     vertexShader: cube2_shader.vertexShader(),
//     fragmentShader: cube2_shader.fragmentShader(),
// });

// const cube2_mesh = new THREE.Mesh(cube2_geometry, cube2_material);
// cube2_mesh.position.set(-2, 0, 0)
// scene.add(cube2_mesh);

const clock = new THREE.Clock();

function translationMatrix(tx, ty, tz) {
	return new THREE.Matrix4().set(
		1, 0, 0, tx,
		0, 1, 0, ty,
		0, 0, 1, tz,
		0, 0, 0, 1
	);
}

function rotationMatrixX(theta) { 
    return new THREE.Matrix4().set(
        1, 0, 0, 0,
        0, Math.cos(theta), -Math.sin(theta), 0,
        0, Math.sin(theta), Math.cos(theta), 0,
        0, 0, 0, 1
    );
}

function rotationMatrixY(theta) {
    return new THREE.Matrix4().set(
        Math.cos(theta), 0, Math.sin(theta), 0,
        0, 1, 0, 0,
        -Math.sin(theta), 0, Math.cos(theta), 0,
        0, 0, 0, 1
    );
}
const speed = 0.1;
const cSpeed = 0.1;
let blendingFactor = 0.1;

let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;

let cLeft = false;
let cRight = false;
let cUp = false;
let cDown = false;
let obstructed = false;
let c_x = -10;
let c_y = 10;
let c_z = -10;

function animate() {
    controls.update();
    let delta = clock.getDelta();
    animation_time += delta;
   
    if (!obstructed){
        ball_mesh.position.z += delta * 3;
        if (moveLeft) {
            ball_mesh.position.x += speed;
        }
        if (moveRight) {
            ball_mesh.position.x -= speed;
        }
        if (moveUp) {
            ball_mesh.position.y += speed;
        }
        if (moveDown) {
            ball_mesh.position.y -= speed;
        }
    }

    ball_mesh.geometry.computeBoundingSphere();
    const ball_bounding = ball_mesh.geometry.boundingSphere.clone();
    ball_bounding.center.applyMatrix4(ball_mesh.matrixWorld);
    obstacles.forEach(function (obs_bounding, index){
        if (checkCollision(obs_bounding, ball_bounding)){
            obstructed = true;
        }
        else{
            obstructed = false;
        }
    });
    let cameraTransform = new THREE.Matrix4();
    cameraTransform.copy(ball_mesh.matrix);
    if (cLeft) {
        if (c_x < 30)
            c_x += 1;
    }
    if (cRight) {
        if (c_x > -30)
            c_x -= 1;
    }
    if (cUp) {
        if (c_y < 30)
            c_y += 1;
    }
    if (cDown) {
        if (c_y > -10)
            c_y -= 1;
    }
    let offset = translationMatrix(c_x, c_y, c_z);
    cameraTransform.multiply(offset);
    let cameraPosition = new THREE.Vector3();
    cameraPosition.setFromMatrixPosition(cameraTransform);
    camera.position.lerp(cameraPosition, blendingFactor);
    let ballPosition = new THREE.Vector3();
    ballPosition.setFromMatrixPosition(ball_mesh.matrix);
    camera.lookAt(ballPosition);


    renderer.render(scene, camera);

    // const ball_translation = translationMatrix(0, 0, animation_time * 3);
    // const ball_rotationY = rotationMatrixY(rotation_angleY);
    // const ball_rotationX = rotationMatrixX(rotation_angleX);
    // const center = new THREE.Vector3(0,0,0);
    // const distance = new THREE.Vector3().subVectors(center, ball_mesh.position);
    // const adjust = translationMatrix(distance.x, distance.y, distance.z)

    // let model_transform = new THREE.Matrix4();
    // model_transform.multiplyMatrices(ball_translation, model_transform);
    // model_transform.multiplyMatrices(adjust, model_transform);
    // model_transform.multiplyMatrices(ball_rotationX, model_transform);
    // model_transform.multiplyMatrices(ball_rotationY, model_transform);
    // model_transform.multiplyMatrices(adjust, model_transform);
    
    // ball_mesh.matrix.copy(model_transform);
    // ball_mesh.matrixAutoUpdate = false;
    
    // TODO: 2.b&2.c Update uniform values
    // cube1_uniforms.animation_time.value = animation_time;
    // cube2_uniforms.animation_time.value = animation_time;


    // TODO: 2.e Rotate the cubes if the key 'c' is pressed to start the animation
    // Cube #1 should rotate around its own X-axis at a rate of 15 rpm.
    // Cube #2 should rotate around its own Y-axis at a rate of 40 rpm
    
    // if (isRotating){
    //     r_time += delta;
    //     const cube1_rotation = rotationMatrixX(-Math.PI/2 * r_time);
    //     const cube1_translation = translationMatrix(2, 0, 0);
    //     let model_transform1 = new THREE.Matrix4();
    //     model_transform1.multiplyMatrices(cube1_rotation, model_transform1);
    //     model_transform1.multiplyMatrices(cube1_translation, model_transform1);
    //     cube1_mesh.matrix.copy(model_transform1);
    //     cube1_mesh.matrixAutoUpdate = false;

    //     const cube2_rotation = rotationMatrixY(4*Math.PI/3 * r_time);
    //     const cube2_translation = translationMatrix(-2, 0, 0);
    //     let model_transform2 = new THREE.Matrix4();
    //     model_transform2.multiplyMatrices(cube2_rotation, model_transform2);
    //     model_transform2.multiplyMatrices(cube2_translation, model_transform2);
    //     cube2_mesh.matrix.copy(model_transform2);
    //     cube2_mesh.matrixAutoUpdate = false;
    // }
}

renderer.setAnimationLoop(animate);

// TODO: 2.e Keyboard Event Listener
// Press 'c' to start and stop the rotating both cubes

window.addEventListener('keydown', onKeyPress);
function onKeyPress(event) {
    switch (event.key) {
        case 'a':
            moveLeft = true;
            break;
        case 's':
            moveDown = true;
            break;
        case 'd':
            moveRight = true;
            break;
        case 'w': 
            moveUp = true;
            break;
        case 'ArrowLeft':
            cLeft = true;
            break;
        case 'ArrowDown':
            cDown = true;
            break;
        case 'ArrowRight':
            cRight = true;
            break;
        case 'ArrowUp': 
            cUp = true;
            break;
     }
}
window.addEventListener('keyup', onKeyRelease);
function onKeyRelease(event) {
    switch (event.key) {
        case 'a':
            moveLeft = false;
            break;
        case 's':
            moveDown = false;
            break;
        case 'd':
            moveRight = false;
            break;
        case 'w': 
            moveUp = false;
            break;
        case 'ArrowLeft':
            cLeft = false;
        case 'ArrowDown':
            cDown = false;
            break;
        case 'ArrowRight':
            cRight = false;
            break;
        case 'ArrowUp': 
            cUp = false;
            break;
    }
}

