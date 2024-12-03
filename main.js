import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBB } from 'three/examples/jsm/Addons.js';

//Game Properties
let currentLevel = 0;
let scene, camera, renderer, controls, directionalLight;
const clock = new THREE.Clock();
let blendingFactor = 0.1;
let obstacles;
let player;

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
let switchperspective=false;
let perspectivesangles = [
    {index : 0, x: -3, y: 3, z: -20},
    {index: 1, x: 3, y: 3,z: -20},
    {index : 2, x: -3, y: -3, z: -20},
    {index : 3, x:  3, y: -3, z: -20},
] 
let currentangles = perspectivesangles[0];


// TRANSFORMATIONS

const translation = 1;
const oscillating_translation = 2;
const scaling = 3;
const rotationX = 4;
const rotationY = 5;
const rotationZ = 6;

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

function scalingMatrix(x,y,z) {
    return new THREE.Matrix4().set(
    x, 0, 0, 0,
    0, y, 0, 0,
    0, 0, z, 0,
    0, 0, 0, 1
    );
}

function oscillation(period, time, speed, adjust){
    return Math.abs(speed * (time % period) - period*speed/2) + adjust;
}

function init() {
    scene = new THREE.Scene();
    //const scenebackgroundtexture = new THREE.TextureLoader().load('assets/text.png');
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load(['assets/finalspacestuff.png','assets/finalspacestuff.png','assets/finalspacestuff.png','assets/finalspacestuff.png','assets/finalspacestuff.png','assets/finalspacestuff.png']);
    scene.background = texture;

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(-10,10,-20)

    renderer = new THREE.WebGLRenderer();

    renderer.shadowMap.enabled =true;
    //renderer.shadowMap.type=THREE.PCFShadowMap;    
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);

    //const light = new THREE.AmbientLight(0x404040); // Ambient light
    //scene.add(light);
    directionalLight = new THREE.DirectionalLight(0xffffff, 5);
    directionalLight.position.set(0,0,-1);
    //directionalLight.position.set(5, 10, -5).normalize();
    directionalLight.castShadow =true;
    directionalLight.shadow.mapSize.width =1024;
    directionalLight.shadow.mapSize.height =1024;
    directionalLight.shadow.camera.left = -32;
    directionalLight.shadow.camera.right = 32;
    directionalLight.shadow.camera.top = 32;
    directionalLight.shadow.camera.bottom = -32;
    directionalLight.shadow.camera.near =0.5;
    directionalLight.shadow.camera.far =100;
    directionalLight.shadow.bias =0.005;


    scene.add(directionalLight);
    // const balllight = new THREE.Light(0xffffff,5);
    // balllight.position.set(0,0,75);
    // scene.add(balllight);


    document.getElementById('level1').addEventListener('click', () => loadLevel(1));
    document.getElementById('level2').addEventListener('click', () => loadLevel(2));
    // document.getElementById('level3').addEventListener('click', () => loadLevel(3));
    document.getElementById('level4').addEventListener('click', () => loadLevel(4));

}

function loadLevel(level) {
    document.getElementById('homeScreen').style.display = 'none';
     currentLevel = level;

    switch (level) {
        case 1:
            import('./level1.js').then(level1 => {
                const { player: newPlayer, obstacles: newObstacles } = level1.setUpLevel(scene)
                player = newPlayer;
                obstacles = newObstacles;
            });

            break;
        case 2:
            import('./level2.js').then(level2 => {
                const { player: newPlayer, obstacles: newObstacles } = level2.setUpLevel(scene)
                player = newPlayer;
                obstacles = newObstacles;
            });
            break;
        //case 3:
        //     import('./levels/level3.js').then(level3 => level3.setupLevel(scene, camera));
        //     break;
        case 4:
            import('./level4.js').then(level4 => {
                const { player: newPlayer, obstacles: newObstacles } = level4.setUpLevel(scene)
                player = newPlayer;
                obstacles = newObstacles;
            });
            break;
    }
    animate();
}

function animate() {
    
    controls.update();
    requestAnimationFrame(animate);
    // let delta = clock.getDelta();
    // animation_time += delta;
    let game_time = clock.getElapsedTime();
   

    if (!obstructed){
        // if (currentLevel != 4) {
            if (moveLeft) {
                if (player.position.x < 15)
                    player.position.x += speed;
            }
            if (moveRight) {
                if (player.position.x > -15)
                    player.position.x -= speed;
            }
            if (moveUp) {
                if (player.position.y < 15)
                    player.position.y += speed;
            }
            if (moveDown) {
                if (player.position.y > -15)
                    player.position.y -= speed;
            }
        //}
        // else{
        //     if (moveLeft) {
        //         player.rotation.z += speed;
        //     }
        //     if (moveRight) {
        //         player.rotation.z -= speed;
        //     }
        // }
    }


    let player_bounding;
    //if (currentLevel != 4){
        player.geometry.computeBoundingSphere();
        player_bounding = player.geometry.boundingSphere.clone();
        player_bounding.center.applyMatrix4(player.matrixWorld);
    // }
    // else{
    //     player.userData.obb = new OBB();
    //     player_bounding = player.userData.obb.clone();
    //     player_bounding.applyMatrix4(player.matrixWorld);
    // }


    obstacles.forEach(function (obs,index){
        let currentdepth = new THREE.Vector4();
        currentdepth.setFromMatrixPosition(obs.mesh.matrixWorld);
        console.log('currentdepth',currentdepth.z);
        
        if (currentdepth.z >=45) {
            obs.mesh.visible =false;
        }

        if(currentdepth.z <45 && currentdepth.z >=-12) {
            obs.mesh.castShadow=true;
            obs.mesh.visible=true;
            obs.mesh.receiveShadow =true;
        }

        if (currentdepth.z < -12) {
            obs.mesh.visible =false;
        }
        if (!obstructed){
            
            let model_transform = new THREE.Matrix4();
            
            obs.tranformations.forEach(function (t, index){
                let matrix;
                switch(t.tr_type) {
                    case translation:
                        matrix = translationMatrix(t.speedX * game_time,t.speedY*game_time, t.speedZ*game_time); //something wrong
                        break;
                    case oscillating_translation:
                        matrix = translationMatrix(oscillation(t.period, game_time, t.speedX, t.speedX ? t.adjust : 0), oscillation(t.period, game_time, t.speedY, t.speedY ? t.adjust : 0), oscillation(t.period, game_time, t.speedZ, t.speedZ ? t.adjust : 0));
                        break;
                    case rotationX:
                        matrix = rotationMatrixX(t.speed * game_time);
                        break;
                    case rotationY: 
                        matrix = rotationMatrixY(t.speed * game_time);
                        break;
                    case rotationZ: 
                        matrix = rotationMatrixZ(t.speed * game_time);
                        break;
                    case scaling:
                        matrix = scalingMatrix(oscillation(t.period, game_time, t.speed, t.adjust), oscillation(t.period, game_time, t.speed, t.adjust), 1);
                        break;
                }
                
                model_transform.multiply(matrix);
            });

             //constant speed of obstacles moving towards player
            const obs_incoming = translationMatrix(obs.x,obs.y, obs.z - game_time * 5);
            model_transform.multiply(obs_incoming);
            
            obs.mesh.matrix.copy(model_transform);

            obs.mesh.userData.obb.copy( obs.mesh.geometry.userData.obb );
            console.log(obs.mesh.matrixWorld)
            obs.mesh.userData.obb.applyMatrix4( model_transform );
            console.log(obs.mesh.userData.obb)

            //const bounding = new THREE.Box3().setFromObject(obs.mesh);
        
            if (checkCollision(obs.mesh.userData.obb, player_bounding)){
                obstructed = true;
            }
            else{
                obstructed = false;
            }

        }   
        
    });

    // let cameraTransform = new THREE.Matrix4();
    // cameraTransform.copy(player.matrix);

    // if (!switchperspective) {
    //     if (cLeft) {
    //         if (c_x < 30)
    //             c_x += cSpeed;
    //     }
    //     if (cRight) {
    //         if (c_x > -60)
    //             c_x -= cSpeed;
    //     }
    //     if (cUp) {
    //         if (c_z < 60)
    //             c_z += cSpeed;
    //     }
    //     if (cDown) {
    //         if (c_z > -60)
    //             c_z -= cSpeed;
    //     }
    
    //     let offset = translationMatrix(c_x, c_y, c_z);
    //     cameraTransform.multiply(offset);
    //     let cameraPosition = new THREE.Vector3();
    //     cameraPosition.setFromMatrixPosition(cameraTransform);
    //     camera.position.lerp(cameraPosition, blendingFactor);
    //     let ballPosition = new THREE.Vector3();
    //     ballPosition.setFromMatrixPosition(player.matrix);
    //     camera.lookAt(ballPosition);
    // }
    // else {
    //     if (cLeft) {
    //         if (currentangles.index == 0 || currentangles.index == 2) {
    //             currentangles=perspectivesangles[currentangles.index+1 %4];
    //         }
    //     }
    //     if (cRight) {
    //         if (currentangles.index == 1 || currentangles.index == 3) {
    //             currentangles=perspectivesangles[currentangles.index-1 %4];
    //         }
    //     }
    //     if (cUp) {
    //         if (currentangles.index == 2 || currentangles.index == 3) {
    //             currentangles=perspectivesangles[currentangles.index-2 %4];
    //         }
    //     }
    //     if (cDown) {
    //         if (currentangles.index == 0 || currentangles.index == 1) {
    //             currentangles=perspectivesangles[currentangles.index+2 %4];
    //         } 
    //     }

    //     let offset = translationMatrix(currentangles.x, currentangles.y, currentangles.z);
    //     cameraTransform.multiply(offset);
    //     let cameraPosition = new THREE.Vector3();
    //     cameraPosition.setFromMatrixPosition(cameraTransform);
    //     camera.position.lerp(cameraPosition, blendingFactor);
    //     let ballPosition = new THREE.Vector3();
    //     ballPosition.setFromMatrixPosition(player.matrix);
    //     camera.lookAt(ballPosition.x,ballPosition.y,ballPosition.z+20);
    
    //}

    //directional light movement
    directionalLight.position.x=camera.position.x;
    directionalLight.position.y=camera.position.y;
    directionalLight.position.z=camera.position.z;

    directionalLight.rotationX=camera.rotationX;
    directionalLight.rotationY=camera.rotationY;
    directionalLight.rotationZ=camera.rotationZ;


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


}

init();

// HELPER FUNCTIONS

function checkCollision(obs_bounding, player_bounding) {
    // Check if the box intersects with the sphere's bounding sphere
    console.log("Box bounding:", obs_bounding);
    console.log("Ball bounding:", player_bounding);

    // if (currentLevel != 4)
        if (obs_bounding.intersectsSphere(player_bounding)) {
            console.log("The box and sphere are colliding!");
            return true;
        }
        else{
            console.log("The box and sphere are not colliding!");
            return false;
        }
    // {
    //     if (obs_bounding.intersects(player_bounding)) {
    //         console.log("The box and sphere are colliding!");
    //         return true;
    //     }
    //     else{
    //         return false;
    //     }else
    // }
}

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
        case 'p':
            switchperspective=!switchperspective;
    }
}

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});


