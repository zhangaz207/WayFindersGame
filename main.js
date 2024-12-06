import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBB } from 'three/examples/jsm/Addons.js';

//Game Properties
let currentLevel;
let scene, camera, renderer, controls, directionalLight;
let clock;
let blendingFactor = 0.1;
let obstacles;
let player;
let isGameActive = false;
let speedofobst=5;
let buffed =false;

let levelScore = 0;
let collectScore = 0;
let ignoreInitial = 0;
//document.getElementById("levelScore").textContent = levelScore;
// document.getElementById("collectScore").textContent = collectScore;
// localStorage.setItem('levelScore', levelScore);
// localStorage.setItem('collectScore', collectScore);
// window.addEventListener('load', () => {
//     const savedLevelScore = localStorage.getItem('levelScore');
//     const savedCollectScore = localStorage.getItem('collectScore');

//     if (savedLevelScore) {
//         levelScore = parseInt(savedLevelScore);
//         document.getElementById("levelScore").textContent = levelScore;
//     }

//     if (savedCollectScore) {
//         collectScore = parseInt(savedCollectScore);

//         console.log("Setting collect score to:", collectScore);
//         document.getElementById("collectScore").textContent = collectScore;
//     }
// });


//Player properties
const speed = 0.1;
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;

let player_time_ccw = 0;
let player_time_cw = 0;

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
const oscillating_rotation = 7;

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
    showHomeScreen();
    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled =true; 
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    scene = new THREE.Scene();

}

function showHomeScreen() {
    document.getElementById('homeScreen').style.display = '';
    document.getElementById('loseScreen').style.display = 'none';
    document.getElementById('winScreen').style.display = 'none';
    document.getElementById('winScreen5').style.display = 'none';

    document.getElementById('collectScoreBoard').style.display = 'none';
    document.getElementById('levelContainer').style.display = '';

    // document.getElementById('startButton').addEventListener('click', () => loadLevel(1));
    // document.getElementById('showLevels').addEventListener('click', () => cheatLevels());

    document.getElementById('level1').addEventListener('click', () => loadLevel(1));
    document.getElementById('level2').addEventListener('click', () => loadLevel(2));
    document.getElementById('level3').addEventListener('click', () => loadLevel(3));
    document.getElementById('level4').addEventListener('click', () => loadLevel(4));
    document.getElementById('level5').addEventListener('click', () => loadLevel(5));
}
  
// function cheatLevels() {
//     document.getElementById('levelContainer').style.display = '';
//     document.getElementById('showLevels').style.display = 'none';
// }

function showWinScreen() {
    document.getElementById('winScreen').style.display = '';
    document.getElementById('restart-button-win').addEventListener('click', () => reloadFunct());
    removeEventListeners();
}

function showWinScreen5() {
    document.getElementById('winScreen5').style.display = '';
    document.getElementById('collectScoreBoard').style.display = 'none';
    document.getElementById("collectScore1").textContent = collectScore;
    document.getElementById('restart-button-win5').addEventListener('click', () => reloadFunct());
}
  
function showLoseScreen() {
    document.getElementById('collectScoreBoard').style.display = 'none';
    document.getElementById('loseScreen').style.display = '';
    document.getElementById('restart-button-lose').addEventListener('click', () => reloadFunct());
    removeEventListeners();
}

function reloadFunct() {
    location.reload();
    showHomeScreen();
}

function removeEventListeners(){

    document.getElementById('level1').removeEventListener('click', () => loadLevel(1));
    document.getElementById('level2').removeEventListener('click', () => loadLevel(2));
    document.getElementById('level3').removeEventListener('click', () => loadLevel(3));
    document.getElementById('level4').removeEventListener('click', () => loadLevel(4));
    document.getElementById('level5').removeEventListener('click', () => loadLevel(5));
    document.getElementById('restart-button-win').removeEventListener('click', () => loadLevel(currentLevel));
    document.getElementById('restart-button-win5').removeEventListener('click', () => loadLevel(currentLevel));
    document.getElementById('restart-button-lose').removeEventListener('click', () => loadLevel(currentLevel));

}
function clearScene() {
    // Remove all objects from the scene
    scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            object.material.dispose();
        }
        scene.remove(object);
    });
}

function loadLevel(level) {
    clearScene();
    document.getElementById('homeScreen').style.display = 'none';
    document.getElementById('winScreen').style.display = 'none';
    document.getElementById('loseScreen').style.display = 'none';
    document.getElementById('levelContainer').style.display = 'none';
    document.body.appendChild(renderer.domElement);

    if (level == 5) {
        document.getElementById('collectScoreBoard').style.display = '';
    }
    else { 
        document.getElementById('collectScoreBoard').style.display = 'none';
    }

    currentLevel = level;
    isGameActive = true;

    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load(['assets/galaxy.png','assets/galaxy.png','assets/galaxy.png','assets/galaxy.png','assets/galaxy.png','assets/galaxy.png']);
    scene.background = texture;

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0,0,-50);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);

    //const light = new THREE.AmbientLight(0x404040); // Ambient light
    //scene.add(light);
    directionalLight = new THREE.DirectionalLight(0xffffff, 8);
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

    clock = new THREE.Clock();
  

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
        case 3:
            import('./level3.js').then(level3 => {
                const { player: newPlayer, obstacles: newObstacles } = level3.setUpLevel(scene)
                player = newPlayer;
                obstacles = newObstacles;
            });
            break;
        case 4:
            import('./level4.js').then(level4 => {
                const { player: newPlayer, obstacles: newObstacles } = level4.setUpLevel(scene)
                player = newPlayer;
                obstacles = newObstacles;
            });
            break;
        case 5:
            import('./level5.js').then(level5 => {
                const { player: newPlayer, obstacles: newObstacles } = level5.setUpLevel(scene)
                player = newPlayer;
                obstacles = newObstacles;
            });
            break;
    }
    animate();
}

// function rgbToHex(r, g, b) {
//     return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
//   }

//   function convertNumtoLetter(a) {
//     switch(a) {
//         case 0:
//             return "0";
//         case 10:
//             return "a";  
//         // code block
//           break;
//         case 11:
//           return "b";
//           break;
//         case 12:
//             return "c";
//         case 13: 
//             return "d";
//         case 14:
//             return "e";
//         case 15:
//             return "f";
//         default:
//           return a.toString()
//       }
//   }
  
//   function componentToHex(c) {

//     let hex1= Math.floor(c/16);
//     let hex2 = Math.floor(c % 16);


//     return convertNumtoLetter(hex1) +convertNumtoLetter(hex2);
//   }



function animate() {
    if (!isGameActive)
        return;
    
    const player_transform = new THREE.Matrix4();
    const translateplayer1 = translationMatrix(0,8,0);
    const translateplayer2 = translationMatrix(0,-16,0);

    controls.update();
    requestAnimationFrame(animate);
    let delta = clock.getDelta();
    let game_time = clock.getElapsedTime();
   

    // if (buffed) {
    //     let period10 = game_time % 10.0;
    //     let temp;
    //     let colorchange;
    //     if(period10<=5) {
    //         temp =1/5*period10;
    //     }
    //     else {
    //         temp =-1/5 *period10+2;
    //     }


    //     colorchange=rgbToHex(0,255*temp, 255*temp);
    //     player.material.color.set(colorchange);
    // }

    // if (!obstructed){
        if (currentLevel != 4) {
            if (moveLeft) {
                if (player[0].position.x < 15)
                    player[0].position.x += speed;
            }
            if (moveRight) {
                if (player[0].position.x > -15)
                    player[0].position.x -= speed;
            }
            if (moveUp) {
                if (player[0].position.y < 15)
                    player[0].position.y += speed;
            }
            if (moveDown) {
                if (player[0].position.y > -15)
                    player[0].position.y -= speed;
            }
        }
        else if (currentLevel == 5) {
            if (moveLeft) {
                if (player[0].position.x < 30)
                    player[0].position.x += 0.15;
            }
            if (moveRight) {
                if (player[0].position.x > -30)
                    player[0].position.x -= 0.15;
            }
            if (moveUp) {
                if (player[0].position.y < 30)
                    player[0].position.y += 0.15;
            }
            if (moveDown) {
                if (player[0].position.y > -30)
                    player[0].position.y -= 0.15;
            }
        }
        else{
            let rotateccw = rotationMatrixZ(-5*player_time_ccw);
            let rotatecw = rotationMatrixZ(5*player_time_cw);
            
            if (moveLeft) {
                player_time_ccw += delta;
            }
            if (moveRight) {
                player_time_cw += delta;
            }
            player_transform.multiply(rotateccw);
            player_transform.multiply(rotatecw);
            player_transform.multiply(translateplayer1);
            
            player[0].matrix.copy(player_transform);

            player_transform.multiply(translateplayer2);

            player[1].matrix.copy(player_transform);
            player[0].matrixAutoUpdate = false;
            player[1].matrixAutoUpdate = false;
            
        }
    //}


    console.log(obstacles[0]);
    obstacles.forEach(function (obs,index){
        let currentdepth = new THREE.Vector4();
        currentdepth.setFromMatrixPosition(obs.mesh.matrixWorld);
        console.log('currentdepth',currentdepth.z);


        if (currentdepth.z >=45 && obs.mesh.visible) {
            obs.mesh.visible =false;
        }

        if(currentdepth.z <45 && currentdepth.z >=-15 && !obs.isWin) {
            obs.mesh.castShadow=true;
            obs.mesh.visible=true;
            obs.mesh.receiveShadow =true;
        }

        if (currentdepth.z < -15 && obs.mesh.visible) {
            obs.mesh.visible =false;
        }

        if (obs.vis) {
            if (currentdepth.z <=25) {
                console.log("now")
                obs.mesh.visible =false;
            }
    
        }
            
        let model_transform = new THREE.Matrix4();
        console.log(obs);
        obs.tranformations.forEach(function (t, index){

            let matrix;

            switch(t.tr_type) {
                case translation:
                    matrix = translationMatrix(t.speedX * game_time,t.speedY*game_time, t.speedZ*game_time);
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
                case oscillating_rotation:
                    matrix = rotationMatrixZ(t.speed * Math.sin(game_time));
                    break;
            }
            model_transform.multiply(matrix);

            });

            //constant speed of obstacles moving towards player
            const obs_incoming = translationMatrix(obs.x,obs.y, obs.z - game_time * 5);
            model_transform.multiply(obs_incoming);
            
            if (currentLevel == 5 && obs.type == 'sphere') {
            obs.mesh.matrix.copy(model_transform);
            obs.mesh.userData.boundingSphere.center.setFromMatrixPosition(obs.mesh.matrixWorld);
            }
            else {
            obs.mesh.matrix.copy(model_transform);
            obs.mesh.userData.obb.copy( obs.mesh.geometry.userData.obb );
            obs.mesh.userData.obb.applyMatrix4( model_transform );
            } 

            if (currentLevel == 5) {
                let player_bounding;
                player_bounding = player[0].geometry.boundingSphere.clone();
                player_bounding.center.applyMatrix4(player[0].matrixWorld);

                if (checkCollision(obs, player_bounding)){
                    if (ignoreInitial <= obstacles.length) {
                        ignoreInitial++;
                    }
                    else if (obs.collect == true) {
                        if (obs.type == 'box') {
                            showWinScreen5();
                        }
                        if (obs.collected == false) {
                            collectScore++;
                            console.log("Score:", collectScore, "obj", obs);
                            document.getElementById("collectScoreGame").textContent = collectScore;
                            localStorage.setItem('collectScore', collectScore);
                            obs.collected = true;
                            obs.mesh.visible = false;
                        }
                    }
                    else {
                        scene.background = null;    
                        showLoseScreen();
                        while (scene.children.length > 0) {
                            console.log(scene.children.length)
                            const object = scene.children[0];
                            scene.remove(object);
                            if (object instanceof THREE.Mesh) {
                                object.geometry.dispose();
                                if (object.material) {
                                    object.material.map.dispose();
                                }
                                object.material.dispose();
                            } 
                        }
        
                        if (document.body.contains(renderer.domElement)) {
                            document.body.removeChild(renderer.domElement);
                        }
                        isGameActive = false;
                        document.getElementById("level").textContent = levelScore;
                        return; 
                    }
                }   
            }
            else {
                player.forEach(function(p){
                    console.log("why");
                    let player_bounding;
                    player_bounding = p.geometry.boundingSphere.clone();
                    player_bounding.center.applyMatrix4(p.matrixWorld);

                    if (checkCollision(obs, player_bounding)){
                    
                        if(obs.isWin){
                            isGameActive = false;
                            showWinScreen();
                            return;
                        }
        
                        if(obs.small) {
                            player.scale.x*=0.99;
                            player.scale.y*=0.99;
                            player.scale.z*=0.99;
        
                            obs.mesh.visibile =false;
                            obs.vis=true;
                            buffed=true;
                            return;
                        }
                        if(obs.big) {
                            player.scale.x*=1.01;
                            player.scale.y*=1.01;
                            player.scale.z*=1.01;
        
                            obs.mesh.visibile =false;
                            obs.vis=true;
                            buffed=true;
        
                            return;
                        }
                        if(obs.fast) {
                            speedofobst*=2;
                            obs.mesh.visibile =false;
                            obs.vis=true;
                            buffed=true;
        
                            return;
                        }
        
                        scene.background = null;
                        isGameActive = false;
                        showLoseScreen();
                        return;
                        
                    }
                });   
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

}

init();

// HELPER FUNCTIONS

function checkCollision(obs_bounding, player_bounding) {

    if (currentLevel == 5 && obs_bounding.type == 'sphere') {
        if (obs_bounding.mesh.userData.boundingSphere.intersectsSphere(player_bounding)) {
            return true;
        }
        else {
            return false;
        } 
    }
    else {
        if (obs_bounding.mesh.userData.obb.intersectsSphere(player_bounding)) {
            //console.log("The box and sphere are colliding!");
            return true;
        }
        else{
            //console.log("The box and sphere are not colliding!");
            return false;
        }
    }
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


