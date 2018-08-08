//====================== Class for the intro page ======================
class Intro extends Phaser.Scene {
  constructor() {
    super({ key: "intro" });
  }

  // Required by Phaser to preload assets
  preload() { }

  // Required by Phaser to render assets in canvas
  create() {
    // Set background color to egg yolk yellow
    this.cameras.main.setBackgroundColor("#FFBE28");

    // Add "Cadavre" with a bright blue background
    this.add
      .text(100, 100, "Cadavre")
      .setFontSize(64)
      .setFontStyle("bold italic")
      .setFontFamily("Arial")
      .setPadding({ left: 16 })
      .setBackgroundColor("#0000ff");
    // Add "Exquis" with a bright blue background
    this.add
      .text(250, 200, "Exquis")
      .setFontSize(64)
      .setFontStyle("bold italic")
      .setFontFamily("Arial")
      .setPadding({ right: 16 })
      .setBackgroundColor("#0000ff");
    this.input.manager.enabled = true;
    // on-click launches next scene ("main");
    this.input.once(
      "pointerup",
      function (event) {
        this.scene.start("main");
      },
      this
    );
  }

  // Required by Phaser to update game objects
  update() { }
};

//====================== Class for the Main page ======================
class Main extends Phaser.Scene {
  constructor() {
    super({ key: "main" });
    // Declaring shared variables so that all methods can access them
    this.timer;
    this.total = 0;
    this.score;
    this.timedEvent;
    this.square;
    this.bouncy;
  }

  preload() {
    this.load.image("memphis","assets/memphis.png");
    this.load.image("square", "assets/square.png");
    this.load.image("circle", "assets/circle.png");
    this.load.image("triangle", "assets/triangle.png");
    this.load.image("squiggle", "assets/squiggle.png");
  }

  create() {
    
    //creating timer on the background
    this.timer = this.add.text(20, 20, '', {fontSize: "40px", fill: '#000'});

    // every second, it will call updateCounter method
    this.timedEvent = this.time.addEvent({
      delay: 1000,
      callback: updateCounter,
      callbackScope: this,
      loop: true
    });

    this.cameras.main.setBackgroundColor("#E8CFBD");
    // Allows player to drag background
    var memphis = this.add.sprite(400, 380, "memphis").setInteractive();

    // Allows player to drag object
    this.square = this.physics.add.sprite(200, 300, "square").setInteractive();
    var circle = this.add.sprite(500, 500, "circle");
    // Allows player to drag object
    var triangle = this.physics.add.sprite(300, 100, "triangle").setInteractive();
    var squiggle = this.add.sprite(100, 200, "squiggle");
    


    //==========================================

    //Makes objects unaffected by gravity or collision inertia
    this.square.body.allowGravity = false;
    this.square.body.immovable = true; //setting immovable to true will fix the object in place whereas false will make it fall to the ground bc of gravity
    triangle.body.allowGravity = false;
    triangle.body.immovable = true;

    //A perpetual bouncy object
    this.bouncy = this.physics.add.sprite(50, 50, "square")
    this.bouncy.displayHeight = Math.round(this.bouncy.height * .5);
    this.bouncy.setTint(800080)
    this.bouncy.setVelocity(50, 10).setBounce(1, 1).setCollideWorldBounds(true).setGravity(0, 0)
    this.bouncy.displayWidth = Math.round(this.bouncy.width * .5);

    //Changes what bouncy will collide with and what it looks like
    var bounceOff = this.physics.add.collider(this.bouncy, this.square)
    this.bouncy.body.onWorldBounds = true;
    this.physics.world.on('worldbounds', function(body){
      if(this.bouncy.texture.key === "square"){
        this.bouncy.setTexture("triangle");
        this.physics.world.removeCollider(bounceOff);
        bounceOff = this.physics.add.collider(this.bouncy, triangle);
      } else {
        this.bouncy.setTexture("square");
        this.physics.world.removeCollider(bounceOff);
        bounceOff = this.physics.add.collider(this.bouncy, this.square);
      }
  },this);

    //==========================================

    //==========================================


    this.square.on("pointerover", function () {
      this.setTint(0x00ff00);
    });

    this.square.on("pointerout", function () {
      this.clearTint();
    });

    triangle.on("pointerover", function () {
      this.setTint(0x00ff00);
    });

    triangle.on("pointerout", function () {
      this.clearTint();
    });

    this.input.setDraggable(this.square);
    this.input.setDraggable(triangle);
    this.input.setDraggable(memphis);

    this.input.on("dragstart", function (pointer, gameObject) {
      gameObject.setTint(0xff0000);
    });

    this.input.on("drag", function (pointer, gameObject, dragX, dragY) {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on("dragend", function (pointer, gameObject) {
      gameObject.clearTint();
    });
  }

  update() {
    if(this.bouncy.body.touching.down) {
      console.log("touched Down!");
    }
   }
}

function hitWorldBounds(sprite) {
  sprite.setTexture("triangle")
}

function updateCounter() {
  this.total++;
  this.timer.setText('Timer: ' + this.total);
}

// Define game configurations
let config = {
  type: Phaser.AUTO, // either canvas or WebGL
  width: 600,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 800 }, // for defining global gravity
      debug: false // for testing sprites
    }
  },
  scene: [Intro, Main]
};

// Initialize the game
let game = new Phaser.Game(config);