//====================== Class for the Intro page ======================
class Intro extends Phaser.Scene {
  constructor() {
    super({ key: "intro" });
  }

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

    // Click launches the main scene
    this.input.once(
      "pointerup",
      function (event) {
        this.scene.start("main");
      },
      this
    );
  }
};

//====================== Class for the Main page ======================
class Main extends Phaser.Scene {

  constructor() {
    super({ key: "main" });
    // Declaring shared variables so that all methods can access them
    this.TIME_MAX = 120;
    this.timerText;
    this.timeRemaining;
    this.timerEvent;
    this.scoreText;
    this.score;
    this.bouncy;
    this.bouncyEmitter;
    this.background;
  }

  preload() {
    this.load.image("memphis", "assets/image/memphis.png");
    this.load.image("square", "assets/image/square.png");
    this.load.image("circle", "assets/image/circle.png");
    this.load.image("triangle", "assets/image/triangle.png");
    this.load.image("squiggle", "assets/image/squiggle.png");
    this.load.audio("track1", "assets/audio/track1.mp3");
    this.load.audio("track2", "assets/audio/track2.mp3");
    this.load.audio("plonk", "assets/audio/plonk.mp3");
  }

  create() {
    // Reset game
    this.timeRemaining = this.TIME_MAX;
    this.score = 0;


    /* ---------- Cameras ---------- */
    this.cameras.main.setBackgroundColor("#E8CFBD");


    /* ---------- Text ---------- */
    // Create text labels for the timer and score
    this.timerText = this.add.text(20, 20, '', { fontSize: "40px", fill: '#000' });
    this.scoreText = this.add.text(350, 20, '', { fontSize: "40px", fill: '#000' });


    /* ---------- Events ---------- */
    // Call updateTimer every second
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true
    });


    /* ---------- Sprites ---------- */
    // Background
    this.background = this.add.sprite(0, 380, "memphis");
    this.background.x = -1 * (this.background.width / 2);

    // Allow player to drag the shape objects
    const square = this.physics.add.sprite(200, 300, "square");
    const circle = this.physics.add.sprite(500, 500, "circle");
    const triangle = this.physics.add.sprite(300, 100, "triangle");

    const squiggle = this.add.sprite(100, 200, "squiggle");


    /* ---------- Sounds ---------- */
    // Noise when the correct shape is hit
    this.plonk = this.sound.add('plonk');


    /* ---------- Music ---------- */
    // Original tracks
    const track1 = this.sound.add('track1');
    //loops track 1 due to its shorter length
    track1.loop = true;
    const track2 = this.sound.add('track2');
    //array with the two tracks
    const jukeBox = [track1, track2];

    // Select a random track when the game is restarted
    const randomTrack = Phaser.Math.RND.pick(jukeBox);
    randomTrack.play();


    //==========================================
    // Set physics properties and events for each shape
    const shapes = [square, triangle, circle];
    shapes.forEach(shape => {
      // Make shape objects unaffected by gravity
      shape.body.allowGravity = false;

      // Setting immovable to true will fix the object in place whereas false will 
      // make it fall to the ground because of gravity
      shape.body.immovable = true;

      shape.body.allowRotation = true;

      // Tint shape on hover
      shape
        .on("pointerover", () => {
          shape.setTint(0x00ff00);
        })
        .on("pointerout", () => {
          shape.clearTint();
      });

      // Set shape as draggable
      shape.setInteractive();
      this.input.setDraggable(shape);
    })

    // Function to pick a random shape
    const randomShape = () => Phaser.Math.RND.pick(shapes);

    // A perpetual bouncy object
    let currentBouncyShape = square;
    this.bouncy = this.physics.add.sprite(50, 50, currentBouncyShape.texture.key);
    this.bouncy.displayHeight = Math.round(this.bouncy.height * .5);
    this.bouncy.displayWidth = Math.round(this.bouncy.width * .5);
    this.bouncy.setTint(800080);
    this.bouncy.setVelocity(50, 10).setBounce(1, 1).setCollideWorldBounds(true).setGravity(0, 0);

    // Initially set bouncy to a random shape
    let bouncyCollider = this.physics.add.collider(this.bouncy, currentBouncyShape);
    const bouncyParticles = this.add.particles(currentBouncyShape.texture.key);
    this.bouncyEmitter = bouncyParticles.createEmitter({
      scale: { start: 0.2, end: 0 },
      alpha: { start: 1, end: 0 },
      speed: { min: -200, max: 200 },
      lifespan: { min: 1000, max: 3000 },
      gravityY: 800,
      follow: this.bouncy,
      frequency: -1,
      blendMode: 'ADD'
    });

    // When bouncy hits the world bounds, change its shape
    this.bouncy.body.onWorldBounds = true;
    this.physics.world.on('worldbounds', () => {
      // Ensure the next shape is different than the current one
      let nextBouncyShape = currentBouncyShape;
      while (nextBouncyShape === currentBouncyShape) {
        nextBouncyShape = randomShape();
      }
      // Replace the current bouncy collider
      this.physics.world.removeCollider(bouncyCollider);
      bouncyCollider = this.physics.add.collider(this.bouncy, nextBouncyShape);

      // Set the texture of bouncy
      this.bouncy.setTexture(nextBouncyShape.texture.key);
      bouncyParticles.setTexture(nextBouncyShape.texture.key);
      currentBouncyShape = nextBouncyShape;
    });


    // Set events for draggable shapes
    this.input
      .on("dragstart", (pointer, gameObject) => {
        gameObject.setTint(0xff0000);
      })
      .on("drag", (pointer, gameObject, dragX, dragY) => {
        gameObject.x = dragX;
        gameObject.y = dragY;
      })
      .on("dragend", (pointer, gameObject) => {
        gameObject.clearTint();
      });
  }

  update() {
    // Every time the respective shape bounces on the draggable shapes, increment the score and play a sound.
    if (this.bouncy.body.touching.down) {
      this.score++;
      this.bouncyEmitter.explode(Phaser.Math.RND.between(10, 30));
      this.plonk.play();
    }

    // Update score
    this.scoreText.setText('Score: ' + this.score);

    // Scroll background faster as the timer gets closer to 0
    this.background.x += (this.TIME_MAX / this.timeRemaining) * 3;
    if (this.background.x > game.canvas.width + (this.background.width / 2)) {
      // Reset background
      this.background.x = -(this.background.width / 2);
    }
  }

  updateTimer() {
    // Count down from 60 seconds and add the number of times the shape bounces on it's respective shape.
    this.timeRemaining--;
    this.timerText.setText('Timer: ' + this.timeRemaining);

    // Once the timer hits '0', an alert pops up showing your score and resets the game.
    if (this.timeRemaining === 0) {
      alert("Your final score is " + this.score + "!");
      this.scene.restart();
    }
  }
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