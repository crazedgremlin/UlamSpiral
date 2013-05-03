/*
    
Dan McArdle
3 May 2013

Render an Ulam Spiral
*/

function render() {

    // determine render mode chosen by user
    var renderMode = (function () {
        var radios = document.getElementsByName('renderLayers');
        for (var i=0; i<radios.length; i++)
            if (radios[i].checked)
                return radios[i].value
    })();

    console.log("RENDER MODE = " + renderMode);

    var canvas = document.getElementById('ulamCanvas');
    if (canvas.getContext){
        var ctx = canvas.getContext('2d');
        console.log(ctx);

        // determine the largest visible square
        var sideLength = Math.min(window.innerWidth, window.innerHeight);
        var w = sideLength;
        var h = sideLength;
        ctx.canvas.width = sideLength;
        ctx.canvas.height = sideLength;

        var imgData = ctx.createImageData(w, h);

        function setPixel(imageData, x, y, r, g, b, a) {
            var index = (x + y * imageData.width) * 4;
            imageData.data[index+0] = r;
            imageData.data[index+1] = g;
            imageData.data[index+2] = b;
            imageData.data[index+3] = a;
        }

        // Create a direction enum
        var Direction = {
               RIGHT: 0,
               UP: 1,
               LEFT: 2,
               DOWN: 3
        }

        function turnLeft (direction) {
            switch (direction) {
                case Direction.RIGHT: return Direction.UP;
                case Direction.UP:    return Direction.LEFT;
                case Direction.LEFT:  return Direction.DOWN;
                case Direction.DOWN:  return Direction.RIGHT;
            }
        }


        var x = w/2;
        var y = h/2;
        var direction = Direction.RIGHT;
        var maxSideLength = 0;
        var sideLength = 0;
        var sideCount = 0;

        var pixelCount = 1;
        while (pixelCount <= w*h) {

            if (pixelCount % 1000 == 0) {
                console.log( "Pixel count = " + pixelCount );
            }

            // how many divisors does this number have?
            var divCount = divisorCount(pixelCount);


            // draw a black pixel
            if (renderMode !== 'both')
                setPixel(imgData, x, y, 0, 0, 0, 255);

            if (divCount == 0) { // it's prime!
                if (renderMode !== 'composites')
                    setPixel(imgData, x, y, 255, 0, 0, 255);
                
            } else {
                if (renderMode !== 'primes')
                    setPixel(imgData, x, y, 0, 0, 10000*255.*divCount/pixelCount , 255);
            }

            pixelCount++;

            switch (direction) {
                case Direction.RIGHT: x ++; break;
                case Direction.UP:    y --; break;
                case Direction.LEFT:  x --; break;
                case Direction.DOWN:  y ++; break;
            }


            if (sideLength < maxSideLength) {
                sideLength++;
            } else {
                // we have completed a side
                sideLength = 0;
                sideCount++;
                direction = turnLeft(direction);


                if (sideCount === 2) {
                    sideCount = 0;
                    maxSideLength++;
                } else {
                }
            }
        }

        // copy image data back to canvas 
        ctx.putImageData(imgData, 0, 0); 
        
    } else {
        alert("Canvas not supported. Get a better browser.");
    }

}





function divisorCount (num) {
    /* Compute number of divisors of num exluding 1 and itself */

    var count = 0;
    var end = Math.sqrt(num);
    for (var i=2; i < end; i++) {
        if (num % i == 0) {
            count++;
        }
    }
    return count;
}
