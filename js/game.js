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
}

class Main extends Phaser.Scene {
  constructor() {
    super({ key: "main" });
  }

  preload() {
    this.load.image("memphis","assets/memphis.png");
    this.load.image("square", "assets/square.png");
    this.load.image("circle", "assets/circle.png");
    this.load.image("triangle", "assets/triangle.png");
    this.load.image("squiggle", "assets/squiggle.png");

  }

  create() {
    this.cameras.main.setBackgroundColor("#E8CFBD");
    // Allows player to drag background
    var memphis = this.add.sprite(400, 300, "memphis").setInteractive();

    // Allows player to drag object
    var square = this.physics.add.sprite(200, 300, "square").setInteractive();
    var circle = this.add.sprite(500, 500, "circle");
    // Allows player to drag object
    var triangle = this.physics.add.sprite(300, 100, "triangle").setInteractive();
    var squiggle = this.add.sprite(100, 200, "squiggle");
    


    //==========================================

    //Makes objects unaffected by gravity or collision inertia
    square.body.allowGravity = false;
    square.body.immovable = true;
    triangle.body.allowGravity = false;
    triangle.body.immovable = true;

    //A perpetual bouncy object
    var bouncy = this.physics.add.sprite(50, 50, "square")
    bouncy.displayWidth = Math.round(bouncy.width * .5);
    bouncy.displayHeight = Math.round(bouncy.height * .5);
    bouncy.setTint(800080)
    bouncy.setVelocity(100, 200).setBounce(1, 1).setCollideWorldBounds(true).setGravity(0, 0)

    //Changes what bouncy will collide with and what it looks like
    var bounceOff = this.physics.add.collider(bouncy, square)
    bouncy.body.onWorldBounds = true;
    this.physics.world.on('worldbounds', function(body){
      if(bouncy.texture.key === "square"){
        bouncy.setTexture("triangle");
        this.physics.world.removeCollider(bounceOff);
        bounceOff = this.physics.add.collider(bouncy, triangle);
      } else {
        bouncy.setTexture("square");
        this.physics.world.removeCollider(bounceOff);
        bounceOff = this.physics.add.collider(bouncy, square);
      }
  },this);

    //==========================================


    square.on("pointerover", function () {
      this.setTint(0x00ff00);
    });

    square.on("pointerout", function () {
      this.clearTint();
    });

    triangle.on("pointerover", function () {
      this.setTint(0x00ff00);
    });

    triangle.on("pointerout", function () {
      this.clearTint();
    });

    this.input.setDraggable(square);
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

  update() { }
}

function hitWorldBounds(sprite) {
  sprite.setTexture("triangle")
}

// Define game configurations
let config = {
  type: Phaser.AUTO, // either canvas or WebGL
  width: 600,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 80 }, // for defining global gravity
      debug: false // for testing sprites
    }
  },
  scene: [Intro, Main]
};

// Initialize the game
let game = new Phaser.Game(config);
