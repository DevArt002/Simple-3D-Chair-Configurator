import * as THREE from "three";
import { THREEGLTFLoader, THREEDRACOLoader } from "three-loaders";
import OrbitControls from "threejs-orbit-controls";

export default {
  name: "ChairCustomizer",
  data() {
    // Size of window
    const width = window.innerWidth;
    const height = window.innerHeight;
    // Scene properties
    const scene = new THREE.Scene();
    const renderer = null;
    const camera = new THREE.PerspectiveCamera(35, 600 / 400, 0.1, 1000);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    const spoLight = new THREE.SpotLight(0xffffff);
    const controls = null;
    // Others
    const model = null;
    const currentModelIndex = 0;
    const currentPartName = "",
      currentMat = null;
    const isLoading = true;
    const loadingAmount = 0;
    const loadingTotal = 0;
    // Initial material
    const INITIAL_MTL = new THREE.MeshPhongMaterial({
      color: 0xf1f1f1,
      shininess: 10,
    });
    const INITIAL_MAP = [
      [
        { childID: "SEAT", mtl: INITIAL_MTL, ID: "SEAT" },
        { childID: "ARMS", mtl: INITIAL_MTL, ID: "ARMS" },
        { childID: "BASE", mtl: INITIAL_MTL, ID: "BASE" },
        { childID: "BACK", mtl: INITIAL_MTL, ID: "BACK" },
        { childID: "LEGS", mtl: INITIAL_MTL, ID: "LEGS" },
      ],
      [
        { childID: "back", mtl: INITIAL_MTL, ID: "BACK" },
        { childID: "base", mtl: INITIAL_MTL, ID: "BASE" },
        { childID: "cushions", mtl: INITIAL_MTL, ID: "SEAT" },
        { childID: "legs", mtl: INITIAL_MTL, ID: "LEGS" },
        { childID: "supports", mtl: INITIAL_MTL, ID: "ARMS" },
      ],
    ];
    // Model paths
    const MODELS = ["/assets/models/example.glb", "/assets/models/chair.glb"];
    // Textures properties
    const TEXTURES = [
      {
        texture: "/assets/textures/wood-1.jpg",
        size: [2, 2, 2],
        shininess: 60,
      },
      {
        texture: "/assets/textures/wood-2.jpg",
        size: [4, 4, 4],
        shininess: 0,
      },
      {
        texture: "/assets/textures/wood-3.jpg",
        size: [8, 8, 8],
        shininess: 10,
      },
      {
        texture: "/assets/textures/wood-4.jpg",
        size: [3, 3, 3],
        shininess: 0,
      },
      {
        color: "e49d37",
      },
      {
        color: "ad37e4",
      },
    ];

    return {
      width,
      height,
      scene,
      renderer,
      camera,
      dirLight,
      spoLight,
      controls,
      model,
      currentModelIndex,
      currentPartName,
      currentMat,
      isLoading,
      loadingAmount,
      loadingTotal,
      INITIAL_MAP,
      MODELS,
      TEXTURES,
    };
  },
  mounted() {
    // Set background
    this.scene.background = new THREE.Color(0xf1f1f1);
    this.scene.fog = new THREE.Fog(0xf1f1f1, 20, 100);

    // Init renderer
    const $canvas = document.getElementById("canvas");
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: $canvas,
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.physicallyCorrectLights = true;
    this.renderer.gammaOutput = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Add orbit availability
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enabled = true;
    this.controls.maxDistance = 50;
    this.controls.minDistance = 1;

    // Set camera
    this.resetCamera();

    // Add Lights
    this.dirLight.position.set(10, 10, 15);
    this.dirLight.castShadow = true;
    this.scene.add(this.dirLight);
    this.spoLight.position.set(-3, 1, -3);
    this.scene.add(this.spoLight);

    // Loadt model
    this.loadModel(this.MODELS[this.currentModelIndex], this.currentModelIndex);

    // Frame animate
    this.animate();
  },
  methods: {
    resetCamera() {
      this.camera.position.set(5, 3, -5);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    },
    loadModel(path, modelIndex) {
      const loader = new THREEGLTFLoader();
      loader.setDRACOLoader(new THREEDRACOLoader());
      loader.load(
        path,
        (gltf) => {
          this.isLoading = false;
          // called when the resource is loaded
          this.model = gltf.scene;

          this.model.traverse((o) => {
            if (o.isMesh) {
              o.castShadow = true;
              o.receiveShadow = true;
            }
          });

          for (let object of this.INITIAL_MAP[modelIndex]) {
            this.initTexture(this.model, object.childID, object.ID, object.mtl);
          }

          const box = new THREE.Box3().setFromObject(this.model);
          const center = box.getCenter(new THREE.Vector3());

          this.currentPartName = "SEAT";

          this.model.position.x += this.model.position.x - center.x;
          this.model.position.y += this.model.position.y - center.y;
          this.model.position.z += this.model.position.z - center.z;
          this.currentModelIndex === 1
            ? this.model.scale.set(2, 2, 2)
            : this.model.scale.set(1, 1, 1);
          this.scene.add(this.model);
        },
        (xhr) => {
          // called while loading is progressing
          this.loadingAmount = xhr.loaded;
          this.loadingTotal = xhr.total;
        },
        (error) => {
          // called when loading has errors
          console.error("An error happened", error);
        }
      );
    },
    initTexture(parent, type, id, mtl) {
      parent.traverse((o) => {
        if (o.isMesh) {
          if (o.name.includes(type)) {
            o.material = mtl;
            o.nameID = id; // Set a new property to identify this object
          }
        }
      });
    },
    animate() {
      requestAnimationFrame(this.animate);

      if (this.isLoading) return;

      this.renderer.render(this.scene, this.camera);
    },
    selectPart(pName) {
      this.currentPartName = pName;
    },
    changeMat(index) {
      let texture = this.TEXTURES[index - 1];

      if (texture.texture) {
        let txt = new THREE.TextureLoader().load(texture.texture);
        txt.repeat.set(texture.size[0], texture.size[1], texture.size[2]);
        txt.wrapS = THREE.RepeatWrapping;
        txt.wrapT = THREE.RepeatWrapping;

        this.currentMat = new THREE.MeshPhongMaterial({
          map: txt,
          shininess: texture.shininess ? texture.shininess : 10,
        });
      } else {
        this.currentMat = new THREE.MeshPhongMaterial({
          color: parseInt("0x" + texture.color),
          shininess: texture.shininess ? texture.shininess : 10,
        });
      }

      this.model.traverse((o) => {
        if (o.isMesh && o.nameID != null) {
          if (o.nameID == this.currentPartName) {
            o.material = this.currentMat;
          }
        }
      });
    },
    togglePart() {
      this.model.traverse((o) => {
        if (o.isMesh && o.nameID != null) {
          if (o.nameID == this.currentPartName) {
            o.visible = !o.visible;
          }
        }
      });
    },
    changeChair() {
      // Remove existing chair
      this.scene.remove(this.model);
      this.currentModelIndex + 1 > this.MODELS.length - 1
        ? (this.currentModelIndex = 0)
        : this.currentModelIndex++;
      this.resetCamera();
      this.loadModel(
        this.MODELS[this.currentModelIndex],
        this.currentModelIndex
      );
      this.isLoading = true;
    },
  },
};
