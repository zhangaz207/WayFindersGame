import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, -8);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);


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

            if (vUv_f.x > 0.15 && vUv_f.x < 0.25 && vUv_f.y > 0.15 && vUv_f.y < 0.85){
                texColor = vec4(0, 0, 0, 1.0);
            }
            if (vUv_f.x > 0.75 && vUv_f.x < 0.85 && vUv_f.y > 0.15 && vUv_f.y < 0.85){
                texColor = vec4(0, 0, 0, 1.0);
            }
            if (vUv_f.y > 0.15 && vUv_f.y < 0.25 && vUv_f.x > 0.15 && vUv_f.x < 0.85){
                texColor = vec4(0, 0, 0, 1.0);
            }
            if (vUv_f.y > 0.75 && vUv_f.y < 0.85 && vUv_f.x > 0.15 && vUv_f.x < 0.85){
                texColor = vec4(0, 0, 0, 1.0);
            }

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
            if (vUv_f.x > 0.15 && vUv_f.x < 0.25 && vUv_f.y > 0.15 && vUv_f.y < 0.85){
                texColor = vec4(0, 0, 0, 1.0);
            }
            if (vUv_f.x > 0.75 && vUv_f.x < 0.85 && vUv_f.y > 0.15 && vUv_f.y < 0.85){
                texColor = vec4(0, 0, 0, 1.0);
            }
            if (vUv_f.y > 0.15 && vUv_f.y < 0.25 && vUv_f.x > 0.15 && vUv_f.x < 0.85){
                texColor = vec4(0, 0, 0, 1.0);
            }
            if (vUv_f.y > 0.75 && vUv_f.y < 0.85 && vUv_f.x > 0.15 && vUv_f.x < 0.85){
                texColor = vec4(0, 0, 0, 1.0);
            }
            

            gl_FragColor = texColor;
        }
        `;
    }
}

let animation_time = 0.0;
let r_time = 0.0;
let delta_time;

const cube1_geometry = new THREE.BoxGeometry(2, 2, 2);

// TODO: 1.a Load texture map 
const cube1_texture = new THREE.TextureLoader().load('assets/stars.png');

// TODO: 1.c Apply Texture Filtering Techniques to Cube 1
// Nearest Neighbor Texture Filtering
cube1_texture.minFilter = THREE.NearestFilter;
cube1_texture.magFilter = THREE.NearestFilter;

// TODO: 2.a Enable texture repeat wrapping for Cube 1

const cube1_uniforms = {
    uTexture: { value: cube1_texture },
    animation_time: { value: animation_time }
};
const cube1_shader = new Texture_Rotate();
const cube1_material = new THREE.ShaderMaterial({
    uniforms: cube1_uniforms,
    vertexShader: cube1_shader.vertexShader(),
    fragmentShader: cube1_shader.fragmentShader(),
});

const cube1_mesh = new THREE.Mesh(cube1_geometry, cube1_material);
cube1_mesh.position.set(2, 0, 0)
scene.add(cube1_mesh);

const cube2_geometry = new THREE.BoxGeometry(2, 2, 2);

// TODO: 1.a Load texture map 
const cube2_texture = new THREE.TextureLoader().load('assets/earth.gif');;

// TODO: 1.c Apply Texture Filtering Techniques to Cube 2
// Linear Mipmapping Texture Filtering
cube2_texture.minFilter = THREE.LinearMipmapLinearFilter;

// TODO: 2.a Enable texture repeat wrapping for Cube 2
cube2_texture.wrapS = THREE.RepeatWrapping;
cube2_texture.wrapT = THREE.RepeatWrapping;

const cube2_uniforms = {
    uTexture: { value: cube2_texture },
    animation_time: { value: animation_time }
};
const cube2_shader = new Texture_Scroll_X();
const cube2_material = new THREE.ShaderMaterial({
    uniforms: cube2_uniforms,
    vertexShader: cube2_shader.vertexShader(),
    fragmentShader: cube2_shader.fragmentShader(),
});

const cube2_mesh = new THREE.Mesh(cube2_geometry, cube2_material);
cube2_mesh.position.set(-2, 0, 0)
scene.add(cube2_mesh);

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

function animate() {
    controls.update();
    let delta = clock.getDelta();
    animation_time += delta;
    
    // TODO: 2.b&2.c Update uniform values
    cube1_uniforms.animation_time.value = animation_time;
    cube2_uniforms.animation_time.value = animation_time;


    // TODO: 2.e Rotate the cubes if the key 'c' is pressed to start the animation
    // Cube #1 should rotate around its own X-axis at a rate of 15 rpm.
    // Cube #2 should rotate around its own Y-axis at a rate of 40 rpm
    
    if (isRotating){
        r_time += delta;
        const cube1_rotation = rotationMatrixX(-Math.PI/2 * r_time);
        const cube1_translation = translationMatrix(2, 0, 0);
        let model_transform1 = new THREE.Matrix4();
        model_transform1.multiplyMatrices(cube1_rotation, model_transform1);
        model_transform1.multiplyMatrices(cube1_translation, model_transform1);
        cube1_mesh.matrix.copy(model_transform1);
        cube1_mesh.matrixAutoUpdate = false;

        const cube2_rotation = rotationMatrixY(4*Math.PI/3 * r_time);
        const cube2_translation = translationMatrix(-2, 0, 0);
        let model_transform2 = new THREE.Matrix4();
        model_transform2.multiplyMatrices(cube2_rotation, model_transform2);
        model_transform2.multiplyMatrices(cube2_translation, model_transform2);
        cube2_mesh.matrix.copy(model_transform2);
        cube2_mesh.matrixAutoUpdate = false;
    }


    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// TODO: 2.e Keyboard Event Listener
// Press 'c' to start and stop the rotating both cubes
let isRotating = false;
window.addEventListener('keydown', onKeyPress);
function onKeyPress(event) {
    switch (event.key) {
        case 'c':
            isRotating = !isRotating;
    }
}