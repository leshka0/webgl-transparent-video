

import THREE from 'three.js';
import * as flags from './flags';
import {gui} from './controllers/gui';
import Screen from './screen';
import * as c from './log';
import lights from './webgl/lights'


import {cameraDev, cameraUser} from './webgl/cameras';
const renderer = require('./webgl/renderer')
const scene = require('./webgl/scene');
const OrbitControls = require('three-orbit-controls')(THREE);

const colladaload1 = require('../../node_modules/three.js/examples/js/loaders/ColladaLoader.js')(THREE);
const colladaload2 = require('../../node_modules/three.js/examples/js/loaders/collada/Animation.js')(THREE);
const colladaload3 = require('../../node_modules/three.js/examples/js/loaders/collada/AnimationHandler.js')(THREE);
const colladaload4 = require('../../node_modules/three.js/examples/js/loaders/collada/KeyFrameAnimation.js')(THREE);
const colladaload5 = require('../../node_modules/three.js/examples/js/loaders/ColladaLoader.js')(THREE);
const colladaload6 = require('../../node_modules/three.js/examples/js/Detector.js')(THREE);
const colladaload7 = require('../../node_modules/three.js/examples/js/libs/stats.min.js')(THREE);




class App{

	constructor(){

		c.enable = true;

		c.log('SHK');

		this.zoom( cameraDev, 100 );

		// Renderer
		document.body.appendChild( renderer.domElement )

		// Lights
		for( let id in lights ){
			scene.add(lights[id]);
		};

		// Helpers
		if( flags.showHelpers ){
			scene.add( new THREE.GridHelper( 50, 10 ) );
			scene.add( new THREE.AxisHelper( 10 ) );
		}

		// Controls
		this.controls = new OrbitControls( cameraDev, renderer.domElement );

		const texture = new THREE.VideoTexture(document.getElementById('video'))
		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;
		const mesh = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshLambertMaterial({
			map: texture,
			side: THREE.DoubleSide,
			color: 0xFFFFFF,
			transparent: true
		}))

		scene.add(mesh)

		// Bind
		this.bind()
		this.update();
	}

	bind() {
		Screen.on('resize', this.resize.bind(this));
	}

	zoom( camera, zoom ){
		camera.position.set( 1 * zoom, 0.75 * zoom, 1 * zoom );
		camera.lookAt( new THREE.Vector3() );
	}

	update(){

		requestAnimationFrame( this.update.bind(this) );

		if( flags.debug ){
			this.render( cameraDev,  0, 0, 1, 1 );
			this.render( cameraUser,  0, 0, 0.25, 0.25 );
		} else {
			this.render( cameraDev,  0, 0, 0.25, 0.25 );
			this.render( cameraUser,  0, 0, 1, 1 );
		}
	}

	render( camera, left, bottom, width, height ){

		left   *= Screen.width;
		bottom *= Screen.height;
		width  *= Screen.width;
		height *= Screen.height;

		cameraDev.updateProjectionMatrix();
		cameraUser.updateProjectionMatrix();

		renderer.setViewport( left, bottom, width, height );
		renderer.setScissor( left, bottom, width, height );
		renderer.enableScissorTest( true );
		renderer.setClearColor( 0x121212 );

		renderer.render( scene, camera );
	}

	resize( ){

		cameraDev.aspect  = Screen.width / Screen.height;
		cameraUser.aspect = Screen.width / Screen.height;

		cameraDev.updateProjectionMatrix()
		cameraUser.updateProjectionMatrix()

		renderer.setSize( Screen.width, Screen.height );
	}
}

export default new App();