import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(-10,10,-10)

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);

const light = new THREE.AmbientLight(0x404040); // Ambient light
scene.add(light);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5).normalize();
scene.add(directionalLight);


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

// let animation_time = 0.0;

const floorGeometry = new THREE.PlaneGeometry(50, 50);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x7cfc00, side: THREE.DoubleSide });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = Math.PI / 2;
floor.position.y = -16;
scene.add(floor);


let obstacles = [];

function createBoxObstacle(x_i, y_i, z_i, isR, isT, isS, length, width, height){
    const box_ob_geometry = new THREE.BoxGeometry(length, width, height);
    const box_ob_material = new THREE.MeshBasicMaterial({
    color: 0x48ff00
    });

    const box_ob_mesh = new THREE.Mesh(box_ob_geometry, box_ob_material);
    box_ob_mesh.matrixAutoUpdate = false;
    scene.add(box_ob_mesh);

    obstacles.push({mesh: box_ob_mesh, x: x_i, y: y_i, z: z_i, isRotating: isR, isTranslating: isT, isScaling: isS});
}

function createSphereObstacle(){
    
}

function createCustomObstacles(){

}

createBoxObstacle(0,0,50,false,false,false,10,3,2);
createBoxObstacle(0,0,70,true,true,false,10,3,2);
createBoxObstacle(0,0,90,false,true,false,10,3,2);

// const box_ob_geometry = new THREE.BoxGeometry(10, 3, 2);
// const box_ob_material = new THREE.MeshBasicMaterial({
//     color: 0x48ff00
// });

// const box_ob_mesh1 = new THREE.Mesh(box_ob_geometry, box_ob_material);
// box_ob_mesh1.matrixAutoUpdate = false;
// // box_ob_mesh1.position.set(0,0,10);
// scene.add(box_ob_mesh1);

// const box_ob_mesh2 = new THREE.Mesh(box_ob_geometry, box_ob_material);
// box_ob_mesh2.matrixAutoUpdate = false;
// // box_ob_mesh2.position.set(0,0,20);
// scene.add(box_ob_mesh2);

// const box_ob_mesh3 = new THREE.Mesh(box_ob_geometry, box_ob_material);
// box_ob_mesh3.matrixAutoUpdate = false;
// // box_ob_mesh3.position.set(0,0,30);
// scene.add(box_ob_mesh3);

// const edges = new THREE.EdgesGeometry(ob1_geometry); 
// const lineMaterial = new THREE.LineBasicMaterial({
//   color: 0x000000, 
//   linewidth: 2,
//   depthWrite: false
// });

// const edgeLines = new THREE.LineSegments(edges, lineMaterial);
// edgeLines.position.copy(ob1_mesh.position);
// scene.add(edgeLines);

// let boundingBoxHelper = new THREE.Box3Helper(new THREE.Box3(), 0xffff00); // Create Box3 helper with a yellow color
// scene.add(boundingBoxHelper);

const ball_geom = new THREE.SphereGeometry(1, 1, 1);
const ball_material = new THREE.MeshBasicMaterial({
    color: 0xff0000
});

const ball_mesh = new THREE.Mesh(ball_geom, ball_material);
scene.add(ball_mesh);


// let obstacles = [
//     {mesh: box_ob_mesh1, x: 0, y: 0, z: 10, isRotating: false},
//     {mesh: box_ob_mesh2, x: 0, y: 0, z: 20, isRotating: true},
//     {mesh: box_ob_mesh3, x: 0, y: 0, z: 30, isTranslating: true}
// ];

// TRANSFORMATIONS

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
function rotationMatrixZ(theta) {
	return new THREE.Matrix4().set(
    Math.cos(theta), -Math.sin(theta), 0, 0,
    Math.sin(theta), Math.cos(theta), 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
	);
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


//Game Properties
let isAlive = true;
const clock = new THREE.Clock();
let blendingFactor = 0.1;


//Player properties
const speed = 0.1;
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;
let obstructed = false;


// Camera properties
const cSpeed = 0.5;
let cLeft = false;
let cRight = false;
let cUp = false;
let cDown = false;
let c_x = -10;
let c_y = 20;
let c_z = -20;


// HELPER FUNCTIONS

function checkCollision(obs_bounding, ball_bounding) {
    // Check if the box intersects with the sphere's bounding sphere
    console.log("Box bounding:", obs_bounding);
    console.log("Ball bounding:", ball_bounding);

    if (obs_bounding.intersectsSphere(ball_bounding)) {
        //console.log("The box and sphere are colliding!");
        return true;
    }
    else{
        //console.log("The box and sphere are not colliding!");
        return false;
    }
}

// function checkSphereBoxCollision(sphere, box) {
//     // Step 1: Create a matrix to hold the inverse of the box's world matrix
//     const boxWorldMatrix = new THREE.Matrix4();
//     box.updateWorldMatrix(true, false);  // Make sure world matrix is up to date
//     boxWorldMatrix.copy(box.matrixWorld).invert();  // Invert the world matrix of the box
//     console.log(boxWorldMatrix)

//     // Step 2: Transform the sphere's center position into the box's local space
//     const sphereCenterLocal = sphere.position.clone().applyMatrix4(boxWorldMatrix);

//     // Step 3: Get the AABB of the box in local space
//     const boxLocal = new THREE.Box3().setFromObject(box);  // AABB of the box in local coordinates

//     // Step 4: Check if the transformed sphere center is inside the box's AABB
//     const closestPoint = new THREE.Vector3();
//     boxLocal.clampPoint(sphereCenterLocal, closestPoint);  // Clamp the sphere center to the closest point on the box's AABB

//     // Step 5: Check if the distance between the sphere center and the closest point is less than or equal to the sphere's radius
//     const distance = closestPoint.distanceTo(sphereCenterLocal);
//     return distance <= sphere.geometry.parameters.radius;
// }



function animate() {
    controls.update();
    let delta = clock.getDelta();
    // animation_time += delta;
   
    if (!obstructed){
        if (moveLeft) {
            if (ball_mesh.position.x < 15)
                ball_mesh.position.x += speed;
        }
        if (moveRight) {
            if (ball_mesh.position.x > -15)
                ball_mesh.position.x -= speed;
        }
        if (moveUp) {
            if (ball_mesh.position.y < 15)
                ball_mesh.position.y += speed;
        }
        if (moveDown) {
            if (ball_mesh.position.y > -15)
                ball_mesh.position.y -= speed;
        }
    }
    
    ball_mesh.geometry.computeBoundingSphere();
    const ball_bounding = ball_mesh.geometry.boundingSphere.clone();
    ball_bounding.center.applyMatrix4(ball_mesh.matrixWorld);

    // const ball_bounding = new THREE.Sphere(ball_mesh.position, 0.5);

    obstacles.forEach(function (obs,index){

        if (!obstructed){
            //constant speed of obstacles moving towards player 
            
            let obs_incoming = translationMatrix(obs.x,obs.y, obs.z-clock.getElapsedTime() * 5);

            let model_transform = new THREE.Matrix4();
            if (obs.isRotating){
                console.log(obs.mesh.rotation)
                let obs_rotation = rotationMatrixZ(clock.getElapsedTime());
                model_transform.multiply(obs_rotation);

            }
            if (obs.isTranslating){
                let obs_translation;
                
                //use oscilating function for matrix
                if (clock.getElapsedTime() % 4 <= 2){
                    obs_translation = translationMatrix(10 - (clock.getElapsedTime() % 4) * 10, 0, 0);
                    
                }
                else {
                    obs_translation = translationMatrix(10 - (4 - (clock.getElapsedTime() % 4)) * 10, 0, 0);
                }
                model_transform.multiply(obs_translation);
            }


            model_transform.multiply(obs_incoming);
            
            obs.mesh.matrix.copy(model_transform);

            const bounding = new THREE.Box3().setFromObject(obs.mesh);
            // let corners = [];
            // const min = bounding.min;
            // const max = bounding.max;
            // corners.push(new THREE.Vector3(min.x, min.y, min.z));
            // corners.push(new THREE.Vector3(min.x, min.y, max.z));
            // corners.push(new THREE.Vector3(min.x, max.y, min.z));
            // corners.push(new THREE.Vector3(min.x, max.y, max.z));
            // corners.push(new THREE.Vector3(max.x, min.y, min.z));
            // corners.push(new THREE.Vector3(max.x, min.y, max.z));
            // corners.push(new THREE.Vector3(max.x, max.y, min.z));
            // corners.push(new THREE.Vector3(max.x, max.y, max.z));

            // const rotatedCorners = corners.map(corner => {
            //     const transformedCorner = corner.clone().applyMatrix4(obs.mesh.matrixWorld);
            //     return transformedCorner;
            // });

            // const rotatedBox = new THREE.Box3();
            // rotatedBox.makeEmpty();
            // rotatedCorners.forEach(corner => rotatedBox.expandByPoint(corner));

            // console.log(rotatedBox);

        
            // const bounding = new THREE.Box3();
            // bounding.makeEmpty();
            // obs.mesh.geometry.computeBoundingBox();
            // const bounding = obs.mesh.geometry.boundingBox.clone();
            // bounding.applyMatrix4(obs.mesh.matrixWorld);

            // obs_mesh.geometry.comp();
            // const bounding = ball_mesh.geometry.boundingBox.clone();
            // bounding.center.applyMatrix4(obs_mesh.matrixWorld);
            
            
            // edgeLines.matrix.copy(obs.mesh.matrix);
            // boundingBoxHelper.update();


            // const geometryVertices = [];
            // geometry.getAttribute('position').array.forEach((value, index) => {
            //     if (index % 3 === 0) {
            //         geometryVertices.push(new THREE.Vector3(
            //             geometry.getAttribute('position').array[index],
            //             geometry.getAttribute('position').array[index + 1],
            //             geometry.getAttribute('position').array[index + 2]
            //         ));
            //     }
            // });
        
            if (checkCollision(bounding, ball_bounding)){
                isAlive = false;
                obstructed = true;
            }
            else{
                obstructed = false;
            }

            // if (checkSphereBoxCollision(ball_mesh, obs.mesh)) {
            //     console.log("Collision detected!");
            //     isAlive = false;
            //     obstructed = true;
            // } else {
            //     console.log("No collision");
            //     obstructed = false;
            // }
        }   
    });

    // let cameraTransform = new THREE.Matrix4();
    // cameraTransform.copy(ball_mesh.matrix);
    // if (cLeft) {
    //     if (c_x < 30)
    //         c_x += cSpeed;
    // }
    // if (cRight) {
    //     if (c_x > -60)
    //         c_x -= cSpeed;
    // }
    // if (cUp) {
    //     if (c_z < 60)
    //         c_z += cSpeed;
    // }
    // if (cDown) {
    //     if (c_z > -60)
    //         c_z -= cSpeed;
    // }
    // let offset = translationMatrix(c_x, c_y, c_z);
    // cameraTransform.multiply(offset);
    // let cameraPosition = new THREE.Vector3();
    // cameraPosition.setFromMatrixPosition(cameraTransform);
    // camera.position.lerp(cameraPosition, blendingFactor);
    // let ballPosition = new THREE.Vector3();
    // ballPosition.setFromMatrixPosition(ball_mesh.matrix);
    // camera.lookAt(ballPosition);


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

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

