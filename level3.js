import * as THREE from 'three';
import { OBB } from 'three/examples/jsm/Addons.js';


let player;
let obstacles = [];

export function setUpLevel(scene) {

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
    
    
    // Custom Phong Shader has already been implemented, no need to make change.
    function createPhongMaterial(materialProperties) {
        const numLights = 1;
        // Vertex Shader
        let vertexShader = `
            precision mediump float;
            const int N_LIGHTS = ${numLights};
            uniform float ambient, diffusivity, specularity, smoothness;
            uniform vec4 light_positions_or_vectors[N_LIGHTS];
            uniform vec4 light_colors[N_LIGHTS];
            uniform float light_attenuation_factors[N_LIGHTS];
            uniform vec4 shape_color;
            uniform vec3 squared_scale;
            uniform vec3 camera_center;
            varying vec3 N, vertex_worldspace;
    
            // ***** PHONG SHADING HAPPENS HERE: *****
            vec3 phong_model_lights(vec3 N, vec3 vertex_worldspace) {
                vec3 E = normalize(camera_center - vertex_worldspace);
                vec3 result = vec3(0.0);
                for(int i = 0; i < N_LIGHTS; i++) {
                    vec3 surface_to_light_vector = light_positions_or_vectors[i].xyz - 
                        light_positions_or_vectors[i].w * vertex_worldspace;
                    float distance_to_light = length(surface_to_light_vector);
                    vec3 L = normalize(surface_to_light_vector);
                    vec3 H = normalize(L + E);
                    float diffuse = max(dot(N, L), 0.0);
                    float specular = pow(max(dot(N, H), 0.0), smoothness);
                    float attenuation = 1.0 / (1.0 + light_attenuation_factors[i] * distance_to_light * distance_to_light);
                    vec3 light_contribution = shape_color.xyz * light_colors[i].xyz * diffusivity * diffuse
                                            + light_colors[i].xyz * specularity * specular;
                    result += attenuation * light_contribution;
                }
                return result;
            }
    
            uniform mat4 model_transform;
            uniform mat4 projection_camera_model_transform;
    
            void main() {
                gl_Position = projection_camera_model_transform * vec4(position, 1.0);
                N = normalize(mat3(model_transform) * normal / squared_scale);
                vertex_worldspace = (model_transform * vec4(position, 1.0)).xyz;
            }
        `;
        // Fragment Shader
        let fragmentShader = `
            precision mediump float;
            const int N_LIGHTS = ${numLights};
            uniform float ambient, diffusivity, specularity, smoothness;
            uniform vec4 light_positions_or_vectors[N_LIGHTS];
            uniform vec4 light_colors[N_LIGHTS];
            uniform float light_attenuation_factors[N_LIGHTS];
            uniform vec4 shape_color;
            uniform vec3 camera_center;
            varying vec3 N, vertex_worldspace;
    
            // ***** PHONG SHADING HAPPENS HERE: *****
            vec3 phong_model_lights(vec3 N, vec3 vertex_worldspace) {
                vec3 E = normalize(camera_center - vertex_worldspace);
                vec3 result = vec3(0.0);
                for(int i = 0; i < N_LIGHTS; i++) {
                    vec3 surface_to_light_vector = light_positions_or_vectors[i].xyz - 
                        light_positions_or_vectors[i].w * vertex_worldspace;
                    float distance_to_light = length(surface_to_light_vector);
                    vec3 L = normalize(surface_to_light_vector);
                    vec3 H = normalize(L + E);
                    float diffuse = max(dot(N, L), 0.0);
                    float specular = pow(max(dot(N, H), 0.0), smoothness);
                    float attenuation = 1.0 / (1.0 + light_attenuation_factors[i] * distance_to_light * distance_to_light);
                    vec3 light_contribution = shape_color.xyz * light_colors[i].xyz * diffusivity * diffuse
                                            + light_colors[i].xyz * specularity * specular;
                    result += attenuation * light_contribution;
                }
                return result;
            }
    
            void main() {
                // Compute an initial (ambient) color:
                vec4 color = vec4(shape_color.xyz * ambient, shape_color.w);
                // Compute the final color with contributions from lights:
                color.xyz += phong_model_lights(normalize(N), vertex_worldspace);
                gl_FragColor = color;
            }
        `;
    
        let shape_color = new THREE.Vector4(
            materialProperties.color.r, 
            materialProperties.color.g, 
            materialProperties.color.b, 
            1.0
        );
        // Prepare uniforms
        const uniforms = {
            ambient: { value: materialProperties.ambient },
            diffusivity: { value: materialProperties.diffusivity },
            specularity: { value: materialProperties.specularity },
            smoothness: { value: materialProperties.smoothness },
            shape_color: { value: shape_color },
            squared_scale: { value: new THREE.Vector3(1.0, 1.0, 1.0) },
            camera_center: { value: new THREE.Vector3() },
            model_transform: { value: new THREE.Matrix4() },
            projection_camera_model_transform: { value: new THREE.Matrix4() },
            light_positions_or_vectors: { value: [] },
            light_colors: { value: [] },
            light_attenuation_factors: { value: [] }
        };
    
        // Create the ShaderMaterial using the custom vertex and fragment shaders
        return new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: uniforms
        });
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

    player = new THREE.Mesh(player_geom, player_material);
    player.castShadow =true;
    player.geometry.computeBoundingSphere();
    scene.add(player);

    function createBoxObstacle(x_i, y_i, z_i, length, width, height, transforms, disapearing =false, shrink =false, scale =false, speedobs =false, win = false){
        const box_ob_geometry = new THREE.BoxGeometry(length, width, height);
        const size = new THREE.Vector3(length, width, height);
    
        box_ob_geometry.userData.obb = new OBB();
        box_ob_geometry.userData.obb.halfSize.copy(size).multiplyScalar( 0.5 );
        // const box_ob_material = new THREE.MeshPhongMaterial({
        // color: 0x48ff00, flatShading : true
        // });
        


        const box_ob_texture=new THREE.TextureLoader().load('assets/smallmoontexture.png');


        box_ob_texture.minFilter = THREE.LinearMipMapLinearFilter;
    
        const box_ob_material = new THREE.MeshStandardMaterial({
            bumpMap : box_ob_texture,
            bumpScale : 5,
            color : 0x888888,
        });

        // const box_uniforms = {
        //     uTexture: { value: box_ob_texture },
        //     //animation_time: { value: animation_time }
        // };
        //const box_ob_shader = new Texture_Rotate();

        // const box_ob_material = new THREE.ShaderMaterial({
        //     uniforms: box_uniforms,
        //     vertexShader: box_ob_shader.vertexShader(),
        //     fragmentShader: box_ob_shader.fragmentShader(),
        // });


        
        const buffmaterial = new THREE.MeshPhongMaterial({color: 0x00FF00 });
        let box_ob_mesh;
        if (shrink ==false && scale ==false && speedobs ==false ) {
             box_ob_mesh= new THREE.Mesh(box_ob_geometry, box_ob_material);
        }
        else {
            box_ob_mesh = new THREE.Mesh(box_ob_geometry, buffmaterial);

        }
        //box_ob_mesh.castShadow = true;
        //box_ob_mesh.receiveShadow = true;

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
            vis : disapearing,
            small: shrink,
            big : scale,
            fast : speedobs,
            isWin:win
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
    
    const sizeofbuff=3;
    createBoxObstacle(0,10,25,sizeofbuff,sizeofbuff,sizeofbuff,[],false,true);
    createBoxObstacle(0,-10,25,sizeofbuff,sizeofbuff,sizeofbuff,[],false,false,true);
    createBoxObstacle(0,0,25,sizeofbuff,sizeofbuff,sizeofbuff,[],false,false,false,true);
    createBoxObstacle(10,10,25,sizeofbuff,sizeofbuff,sizeofbuff,[],false,true);
    createBoxObstacle(-10,-10,25,sizeofbuff,sizeofbuff,sizeofbuff,[],false,false,true);
    createBoxObstacle(10,-10,25,sizeofbuff,sizeofbuff,sizeofbuff,[],false,false,false,true);
    createBoxObstacle(-10,10,25,sizeofbuff,sizeofbuff,sizeofbuff,[],false,true);
    createBoxObstacle(10,0,25,sizeofbuff,sizeofbuff,sizeofbuff,[],false,false,true);
    createBoxObstacle(-10,0,25,sizeofbuff,sizeofbuff,sizeofbuff,[],false,false,false,true);

    createBoxObstacle(0,10,80,sizeofbuff,sizeofbuff,sizeofbuff,[],false,true);
    createBoxObstacle(0,-10,90,sizeofbuff,sizeofbuff,sizeofbuff,[],false,false,true);
    createBoxObstacle(0,0,100,sizeofbuff,sizeofbuff,sizeofbuff,[],false,false,false,true);
    createBoxObstacle(10,10,110,sizeofbuff,sizeofbuff,sizeofbuff,[],false,true);
    createBoxObstacle(-10,-10,120,sizeofbuff,sizeofbuff,sizeofbuff,[],false,false,true);
    createBoxObstacle(10,-10,130,sizeofbuff,sizeofbuff,sizeofbuff,[],false,false,false,true);
    createBoxObstacle(-10,10,140,sizeofbuff,sizeofbuff,sizeofbuff,[],false,true);
    createBoxObstacle(10,0,150,sizeofbuff,sizeofbuff,sizeofbuff,[],false,false,true);
    createBoxObstacle(-10,0,160,sizeofbuff,sizeofbuff,sizeofbuff,[],false,false,false,true);

    //good ones //weird teleportation //doesnt apply forward moving transformation
    //   createBoxObstacle(0,-32,30,64,8,6,[addOscillatingTranslation(10,0,3,5,0)],true);
    //   createBoxObstacle(0,-24,36,64,8,6,[addOscillatingTranslation(10,0,3,4,0)],true);
    //   createBoxObstacle(0,-16,42,64,8,6,[addOscillatingTranslation(10,0,3,3,0)],true);
    //   createBoxObstacle(0,-8,48,64,8,6, [addOscillatingTranslation(10,0,3,2,0)],true);
    //  // createBoxObstacle(0,0,54,64,8,6,  [addOscillatingTranslation(10,0,10,1,0)]);

    //   createBoxObstacle(0,32,30,64,8,6,[addOscillatingTranslation(10,0,3,5,0)],true);
    //   createBoxObstacle(0,24,36,64,8,6,[addOscillatingTranslation(10,0,3,4,0)],true);
    //   createBoxObstacle(0,16,42,64,8,6,[addOscillatingTranslation(10,0,3,3,0)],true);
    //   createBoxObstacle(0,8,48,64,8,6, [addOscillatingTranslation(10,0,3,2,0)],true);
    //   //createBoxObstacle(0,0,54,64,8,6,  [addOscillatingTranslation(10,0,10,1,0)]);
    
    //set 2
    createBoxObstacle(-12,-12,70,5,3,2,[addRotationZ(-2)]);
    createBoxObstacle(12,-12,70,5,3,2,[addRotationZ(-2)],true);
    createBoxObstacle(-12,12,65,5,3,2,[addRotationZ(-2)],true);
    createBoxObstacle(12,12,70,5,3,2,[addRotationZ(-2)]);

    createBoxObstacle(-6,-6,70,5,3,2,[addRotationZ(1),addScaling(1.5, 1, 1)],true);
    createBoxObstacle(6,-6,70,5,3,2,[addRotationZ(1),addScaling(1.5, 1, 1)]);
    createBoxObstacle(-6,6,70,5,3,2,[addRotationZ(1),addScaling(1.5, 1, 1)],true);
    createBoxObstacle(6,6,70,5,3,2,[addRotationZ(1),addScaling(1.5, 1, 1)]);
    createBoxObstacle(0,0,70,4,4,2,[addRotationZ(5),addScaling(1, 1, 1)]);

    //set 3
    //regular trnaslation brokjen
    createBoxObstacle(2.5,2.5,85,5,5,2,[addRotationZ(0.5), addScaling(4,2,0)]);
    createBoxObstacle(-2.5,-2.5,85,5,5,2,[addRotationZ(0.5), addScaling(3,1.5,0)],true);
    createBoxObstacle(-2.5,2.5,85,5,5,2,[addRotationZ(0.5), addScaling(1.5,1,0)]);
    createBoxObstacle(2.5,-2.5,85,5,5,2,[addRotationZ(0.5), addScaling(1.5,1,0)],true);


    //set 4

    let mydist = -15;

    createBoxObstacle(8,-8,85-mydist,16,16,5,[addOscillatingTranslation(5,0,0,7,0)]);
    createBoxObstacle(8,8,85-mydist,16,16,5,[addOscillatingTranslation(5,0,0,7,0 )],true);

    createBoxObstacle(-8,-8,95-mydist,16,16,5,[addOscillatingTranslation(10,0,0,7,0)]);
    createBoxObstacle(-8,8,95-mydist,16,16,5,[addOscillatingTranslation(10,0,0,7,0)],true);

    createBoxObstacle(8,-8,115-mydist,16,16,5,[addOscillatingTranslation(5,0,0,7,0)]);
    createBoxObstacle(-8,8,115-mydist,16,16,5,[addOscillatingTranslation(5,0,0,7,0 )],true);

    createBoxObstacle(-8,-8,135-mydist,16,16,5,[addOscillatingTranslation(10,0,0,7,0)],true);
    createBoxObstacle(8,8,135-mydist,16,16,5,[addOscillatingTranslation(10,0,0,7,0)]);

    createBoxObstacle(8,8,155-mydist,16,16,5,[addOscillatingTranslation(5,0,0,7,0)]);
    createBoxObstacle(-8,8,155-mydist,16,16,5,[addOscillatingTranslation(5,0,0,7,0 )],true);

    createBoxObstacle(-8,-8,175-mydist,16,16,5,[addOscillatingTranslation(5,0,0,7,0)],true);
    createBoxObstacle(8,-8,175-mydist,16,16,5,[addOscillatingTranslation(5,0,0,7,0)]);


    //set 5
    createBoxObstacle(-16,0,190-mydist,32,64,5,[]);
    createBoxObstacle(-16,0,220-mydist,32,64,5,[]);
    //createBoxObstacle(-16,0,250-mydist,32,64,5,[]);
    //createBoxObstacle(-16,0,280-mydist,32,64,5,[]);

    createBoxObstacle(10,-32,205-mydist,20,5,30,[addOscillatingTranslation(8,0,100,0,-50)]);
    createBoxObstacle(0,0,230-mydist,64,64,30,[],false,false,false,false,true);

    //createBoxObstacle(10,-16,220-mydist,16,25,60,[addOscillatingTranslation(5,0,10,0,0)]);


    return {player, obstacles}; 
    
}    