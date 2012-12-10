// Particle3D class

Particle3D = function (material ) {

	THREE.Particle.call( this, material );
	
	//this.material = material instanceof Array ? material : [ material ];
	
	// define properties
	this.velocity = new THREE.Vector3(0,-8,0);
	this.velocity.rotateX(randomRange(-45,45)); 
	this.velocity.rotateY(randomRange(0,360)); 
	this.gravity = new THREE.Vector3(0,0,0); 
	//this.drag = 1; 
	// methods... 
	
};

Particle3D.prototype = new THREE.Particle();
Particle3D.prototype.constructor = Particle3D;

Particle3D.prototype.updatePhysics = function() {
	
	//this.velocity.multiplyScalar(this.drag); 
	this.velocity.addSelf(this.gravity);
	this.position.addSelf(this.velocity);

}

var TO_RADIANS = Math.PI/180; 

THREE.Vector3.prototype.rotateY = function(angle){
					
	cosRY = Math.cos(angle * TO_RADIANS);
	sinRY = Math.sin(angle * TO_RADIANS);
	
	var tempz = this.z;; 
	var tempx = this.x; 

	this.x= (tempx*cosRY)+(tempz*sinRY);
	this.z= (tempx*-sinRY)+(tempz*cosRY);


}

THREE.Vector3.prototype.rotateX = function(angle){
					
	cosRY = Math.cos(angle * TO_RADIANS);
	sinRY = Math.sin(angle * TO_RADIANS);
	
	var tempz = this.z;; 
	var tempy = this.y; 

	this.y= (tempy*cosRY)+(tempz*sinRY);
	this.z= (tempy*-sinRY)+(tempz*cosRY);


}

// THREE.Vector3.prototype.rotateZ = function(angle){
					
// 	cosRY = Math.cos(angle * TO_RADIANS);
// 	sinRY = Math.sin(angle * TO_RADIANS);
	
// 	var tempx = this.x;; 
// 	var tempy = this.y; 

// 	this.y= (tempy*cosRY)+(tempx*sinRY);
// 	this.x= (tempy*-sinRY)+(tempx*cosRY);


// }



// returns a random number between the two limits provided 
function randomRange(min, max)
{
	return ((Math.random()*(max-min)) + min); 
}


//create canvas and initiate snow particles
var canvasSnow = (function() {
	var snowAmount = 500;

	var looper = null;

	var SCREEN_WIDTH = window.innerWidth;
	var SCREEN_HEIGHT = window.innerHeight;
	var canvasHeight = null;
	var canvasWidth = null;

	var container;

	var particle;

	var camera;
	var scene;
	var renderer;
 
 	var particles = []; 
	var particleImage = new Image();//THREE.ImageUtils.loadTexture( "img/ParticleSmoke.png" );
	particleImage.src = 'img/ParticleSmoke.png'; 

	function init(particleAmount, containerId) {
		container = document.getElementById(containerId);

		canvasWidth = container.offsetWidth;
		canvasHeight = container.offsetHeight;

		snowAmount=particleAmount;
		
		camera = new THREE.PerspectiveCamera( 75, canvasWidth / canvasHeight, 1, 10000 );
		camera.position.z = 1000;

		scene = new THREE.Scene();
		scene.add(camera);
			
		renderer = new THREE.CanvasRenderer();
		renderer.setSize(canvasWidth, canvasHeight);
		var material = new THREE.ParticleBasicMaterial( { map: new THREE.Texture(particleImage) } );

		particles = []; 
		for (var i = 0; i < particleAmount; i++) {

			particle = new Particle3D( material);
			particle.position.x = Math.random() * 2000 - 1000;
			particle.position.y = Math.random() * 2000 - 1000;
			particle.position.z = Math.random() * 8000 + 500;
			particle.scale.x = particle.scale.y =  1;
			scene.add( particle );
			
			particles.push(particle); 
		}

		container.appendChild( renderer.domElement );

	    looper = setInterval( loop, 1000 / 60 );
		
	}

	function kill() {
		try{
			clearInterval(looper);
			container.removeChild(document.getElementsByTagName("canvas")[0]);
		}
		catch (e) {

		}
	}



	function setSnow(amount, containerId) {
		amount = amount-1;
		var snowAmount = [100, 300, 500];
		kill();
		init(snowAmount[amount], containerId);
		renderer.render(scene, camera);
	}

	function loop() {
		for(var i = 0; i<particles.length; i++)
		{
			var particle = particles[i]; 
			particle.updatePhysics(); 

			with(particle.position)
			{
				if(y<-1000) y+=2000; 
				if(x>1000) x-=2000; 
				else if(x<-1000) x+=2000; 
				if(z>1000) z-=2000; 
				else if(z<-1000) z+=2000; 
			}				
		}


		renderer.render( scene, camera );				
	}

	return {
		init: function(particleAmount, containerId) {
			kill();
			init(particleAmount, containerId);
		},
		setSnow: function(amount, containerId) {
			setSnow(amount, containerId);
		}
	};
})();