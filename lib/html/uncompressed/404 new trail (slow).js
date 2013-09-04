stars = (function(){
  // Blue orb effect
  star_val = null;
  stars_a = new Array()
  NUMBER_ORBS = 75;
  NUMBER_TRAILS = 5;
  SPARK_LENGTH = 30;
  SPEED = 6;  // speed of animation
  total_width = 0;
  total_height = 0;
  colors = [ '#ffff00', '#ffc601', '#ff7801', '#c36c07' ];
  canvas = null;
  background = null;
  GRAVITY = .3;
  INERTIA = .1;
  DISTANCE_TO_FRONT = .55;

  // Individual orb class
  function Star_el(size, x, y, distance) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.frame = 0;
    this.distance = distance;
    this.explosion = null;
  }
  Star_el.prototype.animate = function() {
    if ( this.frame > NUMBER_TRAILS )
      return -1;
    c = ( this.distance >= DISTANCE_TO_FRONT) ? canvas2 : canvas;
    //backgroundColor = ( this.frame > 3 ) ? "rgba(95, 95, 95, " + (1 - ( this.frame / NUMBER_TRAILS )) + ")" : colors[this.frame];
    backgroundColor = ( this.frame > 3 ) ? "rgb(95, 95, 95)" : colors[this.frame];
    width = ( this.frame > 3 ) ? this.size : this.size * ( .8 + .2 * ( this.frame / NUMBER_TRAILS ) );

    c.beginPath();
    c.arc( this.x, this.y, width, 0, Math.PI*2, true); 
    c.closePath();
    c.fillStyle = backgroundColor; 
    c.fill();

    this.frame += 1;
  }

  function Explosion(x, y) {
    this.x = x;
    this.y = y;
    this.sparks = [];
    this.frame = 0;
    for( t=0; t<20; t++) {
      spark = new Spark( this.x, this.y );
      this.sparks.push( spark );
    }
  }
  Explosion.prototype.animate = function() {
    this.frame++;
    if ( this.sparks.length < 2 )
      return -1;

    canvas2.beginPath();
    canvas2.arc( this.x, this.y, 5 + (this.frame*2) , 0, Math.PI, true); 
    canvas2.closePath();
    canvas2.fillStyle = 'rgba(255, 163, 0, ' + (35 - this.frame) / 35 + ')'; 
    canvas2.fill();

    canvas2.beginPath();

    for( t = this.sparks.length-1; t >= 0; t-- ) {
      spark = this.sparks[t];
      spark.x2 = spark.x1;
      spark.y2 = spark.y1;
      spark.x_speed += ( spark.x_speed > 0 ) ? INERTIA*-1 : INERTIA;
      spark.y_speed += GRAVITY;
      spark.x1 += ( spark.x_speed * .5 );
      spark.y1 += ( spark.y_speed * .5 );

      if ( spark.length < this.frame || spark.y1 > this.y ) {
        this.sparks.splice(t, 1);
      } else {
        // draw
        canvas2.moveTo( spark.x1, spark.y1 );
        canvas2.lineTo( spark.x2, spark.y2 );
      }
    }

    canvas2.lineWidth = 3;
    canvas2.strokeStyle = "#FFFF00"; 
    canvas2.stroke();

  }

  function Spark(x, y) {
    this.base = y;
    this.x1 = x;
    this.y1 = y;
    this.x2 = x;
    this.y2 = y;
    this.length = SPARK_LENGTH + Math.floor( Math.random() * 14 ) - 7 
    this.x_speed = gen_per(-10, 10) * 100;
    this.y_speed = gen_per(-10, -5) * 100;
  }


  // Individual star + it's orbs class
  function Star(id) {
    this.id = id;
    this.pause = gen_per(1, 100) * 100;
    this.distance = 0;
  }
  Star.prototype.init = function() {
    // Init trails
    this.generate();
  }
  Star.prototype.generate = function() {
    this.trails = [];
    if ( this.id < NUMBER_ORBS * .4 )
      this.distance = gen_per(5, 15);
    else if ( this.id < NUMBER_ORBS * .75 )
      this.distance = gen_per(10, 25);
    else
      this.distance = gen_per(18, 65);

    this.x = total_width * ( gen_per(1, 130) );
    this.y = total_height * .20 * ( .6 - this.distance );
    speed = 3 * ( this.distance * 4 );
    this.speed = { x: speed * gen_per(80, 160), y: speed };
    this.size = Math.floor( 18 * this.distance );
    this.explosion = null;
    this.trails.push( new Star_el(this.size, this.x, this.y, this.distance) );
  }
  Star.prototype.animate = function() {
    // Are we ready to start?
    if (this.pause > 0) {
      this.pause--;
      if ( this.pause < 1 )
        this.init();

    // Animate
    } else {

      // Add a new trail only if we haven't gone off screen
      if ( this.x > boundary_left && this.y < boundary_bottom) {
        trail = new Star_el(this.size, this.x, this.y, this.distance);
        this.trails.push( trail );

        // Move
        this.x -= this.speed.x;
        this.y += this.speed.y;
      }

      // Explosion
      if ( this.distance >= DISTANCE_TO_FRONT && this.y > boundary_bottom && this.x > boundary_left && this.explosion !== "finished" ) {
        if ( this.explosion === null )
          this.explosion = new Explosion( this.x, this.y+5 );
        if ( this.explosion.animate() === -1 )
          this.explosion = "finished";
      }

      // Loop through all existing trails and animate
      if ( this.trails.length > 0 ) {
        for (t = this.trails.length-1; t>=0; t--) {
          res = this.trails[t].animate();
          // If trail returns -1 then remove it
          if ( res === -1 )
            this.trails.splice(t, 1); 
        }
      }

      // Okay to die?
      if ( this.trails.length === 0 && (this.explosion === null || this.explosion === "finished") ) {
        this.pause = gen_per(1, 20) * 100;
      }
    }
  } 

  // Rand generator
  function gen_per(min, max) {
    return Math.floor((Math.random() * (max - min)) + min) / 100;
  }

  // Init orbs
  function init_canvas(c) {
    c.setAttribute('width', total_width);
    c.setAttribute('height', total_height);
    c.getContext("2d").width = total_width;
    c.getContext("2d").height = total_height;
    return c.getContext("2d")
  }

  function init_star() {
    total_width = document.body.clientWidth;
    total_height = document.body.clientHeight;
    boundary_bottom = total_height * .75;
    boundary_left = 0;
    canvas = init_canvas(document.getElementById('canvas1'));
    canvas2 = init_canvas(document.getElementById('canvas2'));
    bg_img = new Image();
    bg_img.src = get_img();
    
    for (t=0; t < NUMBER_ORBS; t++) {
      cur = new Star( t );
      stars_a.push(cur);
    }
    start_star();
  }

  // Start orbs
  function start_star() {
    stop_star();
    star_val = setInterval( function(){ move_star(); }, SPEED * 5 );
  }
  function clear_canvas( c ) {
    var img = c.getImageData(0,0,canvas.width,canvas.height);
    for( t = 3; t < img.data.length; t += 4 )
      img.data[t] = Math.floor( img.data[t] * .97 );
    c.putImageData( img, 0, 0 );
  }
  // Move orbs
  function move_star() {
    //canvas.clearRect ( 0, 0, total_width, total_height );
    clear_canvas( canvas );
    clear_canvas( canvas2 );
    for (h=0; h < NUMBER_ORBS; h++) {
      if( stars_a[h].distance < DISTANCE_TO_FRONT ) stars_a[h].animate();
    }
    canvas.drawImage( bg_img, 0, 0, total_width, total_height); 
    for (h=0; h < NUMBER_ORBS; h++) {
      if( stars_a[h].distance >= DISTANCE_TO_FRONT ) stars_a[h].animate();
    }
  }

  // Stop orbs
  function stop_star() {
    window.clearInterval(star_val);
  }

  window.onload = function() {
    init_star();
    start_star();
  }

  document.onkeydown = checkKey;
  function checkKey(e) {
      e = e || window.event;
      if (e.keyCode === 32)
        stop_star();
  }

  function get_img() {
    return "data:image/png;base64,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";
  }
})();