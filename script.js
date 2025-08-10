import * as THREE from './lib/three.module.js';
import { OrbitControls } from './lib/OrbitControls.js';

window.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('#webgl');
  const app = new ThreeApp(wrapper);
  app.render();
}, false);


class ThreeApp {
  static CAMERA_PARAM = {
    fovy: 60,
    aspect: window.innerWidth / window.innerHeight,
    near: 0.1,
    far: 100.0,
    position: new THREE.Vector3(0.0, 2.0, 5.0),
    lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
  };

  static RENDERER_PARAM = {
    clearColor: 0x262e2e, 
    width: window.innerWidth,
    height: window.innerHeight, 
  };

  static DIRECTIONAL_LIGHT_PARAM = {
    color: 0xffffff,
    intensity: 1.0,                             // 光の強度
    position: new THREE.Vector3(1.0, 1.0, 1.0), // 光の向き　三次元空間のx方向に1 y方向に1 z方向に１移動した場所
  };

  static AMBIENT_LIGHT_PARAM = {
    color: 0xffffff, // 光の色
    intensity: 0.8,  // 光の強度
  };

  static MATERIAL_PARAM = {
    color: 0x647677, 
  };

  renderer; 
  scene;
  camera;
  directionalLight; // 平行光源（ディレクショナルライト） @@@
  ambientLight;     // 環境光（アンビエントライト） @@@
  geometry; 
  material; 
  box;
  boxArray; 
  controls;
  //axesHelper;  
  isDown;     // キーの押下状態用フラグ @@@



  /**
   * コンストラクタ
   * @constructor
   * @param {HTMLElement} wrapper - canvas 要素を append する親要素（ここではdiv）
   */
  constructor(wrapper) {
    const color = new THREE.Color(ThreeApp.RENDERER_PARAM.clearColor);//sataticなプロパティ
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(color);
    this.renderer.setSize(ThreeApp.RENDERER_PARAM.width, ThreeApp.RENDERER_PARAM.height);
    wrapper.appendChild(this.renderer.domElement);


    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      ThreeApp.CAMERA_PARAM.fovy,
      ThreeApp.CAMERA_PARAM.aspect,
      ThreeApp.CAMERA_PARAM.near,
      ThreeApp.CAMERA_PARAM.far,
    );

    this.camera.position.copy(ThreeApp.CAMERA_PARAM.position);
    this.camera.lookAt(ThreeApp.CAMERA_PARAM.lookAt);


    this.directionalLight = new THREE.DirectionalLight(
      ThreeApp.DIRECTIONAL_LIGHT_PARAM.color,
      ThreeApp.DIRECTIONAL_LIGHT_PARAM.intensity
    );
    this.directionalLight.position.copy(ThreeApp.DIRECTIONAL_LIGHT_PARAM.position);
    this.scene.add(this.directionalLight);


    this.ambientLight = new THREE.AmbientLight(
      ThreeApp.AMBIENT_LIGHT_PARAM.color,
      ThreeApp.AMBIENT_LIGHT_PARAM.intensity,
    );
    this.scene.add(this.ambientLight);
    

    // this.geometry = new THREE.BoxGeometry(1.0, 1.0, 1.0);
    // this.material = new THREE.MeshPhongMaterial(ThreeApp.MATERIAL_PARAM);
    this.material = new THREE.MeshMatcapMaterial(ThreeApp.MATERIAL_PARAM);

       
    const boxCount = 50;
    const transformScale = 5.0;
    this.boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    this.boxArray = [];

    for (let i = 0; i < boxCount; ++i) {
      const box = new THREE.Mesh(this.boxGeometry, this.material);

      if(i < 10){
        box.position.x = i * 0.5;
      }else if(i>= 10 && i < 20){
        box.position.y = (i - 9) * 0.5;
      }else{
        box.position.y = i * 0.5;
      }

      // box.position.x = i * 0.5;
      
      // box.position.x = i * box.width.x;

      // 座標をランダムに散らす
      // box.position.x = (Math.random() * 1.4 - 0.7) * transformScale;
      // box.position.y = (Math.random() * 1.4 - 0.7) * transformScale;
      // box.position.z = (Math.random() * 1.4 - 0.7) * transformScale;
      // box.rotation.set(Math.random(),Math.random(),Math.random());
      // シーンに追加する
      this.scene.add(box);
      // 配列に入れておく
      this.boxArray.push(box);
    }

    this.box = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.box);
        
    //const axesBarLength = 5.0; //広かったら数字増やす
    //this.axesHelper = new THREE.AxesHelper(axesBarLength);
    //this.scene.add(this.axesHelper);

    

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.render = this.render.bind(this);

    // キーの押下状態を保持するフラグ @@@
    this.isDown = false;
    window.addEventListener('keydown', (keyEvent) => {
      switch (keyEvent.key) {
        case ' ':
          this.isDown = true;
          break;
        default:
      }
    }, false);
    window.addEventListener('keyup', (keyEvent) => {
      this.isDown = false;
    }, false);


    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    }, false);



  }


  render() {
    requestAnimationFrame(this.render);
    this.controls.update();

    this.boxArray.forEach((box) => {
      box.rotation.y += 0.01;
      box.rotation.x += 0.01;
      
    });

    if (this.isDown === true) {
      this.box.rotation.y += 0.05;
      this.box.rotation.x  += 0.01;
    }

 
    
    this.renderer.render(this.scene, this.camera);
  }
}

