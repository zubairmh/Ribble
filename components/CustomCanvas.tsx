"use client";
import { useRef, useEffect, MouseEvent, useState } from "react";

interface CanvasProps {
  className: string;
  width: number;
  height: number;
  color: string;
  clear: boolean;
  brushSize: number;
  fillMode: boolean;
  setClear: (params: any) => any;
}

const CustomCanvas = (props: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mouseDown, setmouseDown] = useState(false);
  const [lastMouseX, setLastMouseX] = useState(0);
  const [lastMouseY, setLastMouseY] = useState(0);
  function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
      y: ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
    };
  }
  useEffect(() => {
    //console.log("clear");
    if (canvasRef.current && props.clear) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d")!;
      context.clearRect(0, 0, canvas.width, canvas.height);
      props.setClear(false);
    }
  }, [props.clear]);
  function interpolate(
    x: number,
    y: number,
    x2: number,
    y2: number,
    context: CanvasRenderingContext2D
  ) {
    var a = x - x2;
    var b = y - y2;
    var c = Math.hypot(a, b);
    var interpolation=(20/props.brushSize)*40
    if (c > 10) {
      for (var i = 1; i <= interpolation; i++) {
        context.fillStyle = props.color;
        context.beginPath();
        context.arc(
          x + i * ((x2 - x) / interpolation),
          y + i * ((y2 - y) / interpolation),
          props.brushSize,
          0,
          2 * Math.PI
        );
        context.fill();
      }
    }
  }
  function draw(e: MouseEvent) {
    if (canvasRef.current && mouseDown && !props.fillMode) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d")!;
      var pos = getMousePos(canvas, e);
      var posx = pos.x;
      var posy = pos.y;
      if (lastMouseX != 0 || lastMouseY != 0) {
        interpolate(lastMouseX, lastMouseY, posx, posy, context);
      }
      context.fillStyle = props.color;
      context.beginPath();
      context.arc(posx, posy, props.brushSize, 0, 2 * Math.PI);
      context.fill();
      setLastMouseX(posx);
      setLastMouseY(posy);
    }
  }

  function getPixel(imgData: Uint8ClampedArray, index: number) {
    var i = Math.floor(index * 4);
    var d = imgData;
    //console.log("d",d);
    //console.log(i, d[i])
    return [d[i], d[i + 1], d[i + 2], d[i + 3]]; // Returns array [R,G,B,A]
  }

  function arraysEqual(a: number[], b: number[]) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  function fill(e: MouseEvent) {
    //console.log("Checking Fill Mode")
    if (canvasRef.current && props.fillMode) {
      //console.log("Filling Current")
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d")!;
      var pos = getMousePos(canvas, e);
      var x = Math.floor(pos.x);
      var y = Math.floor(pos.y);
      var imgd = context.getImageData(0, 0, canvas.width, canvas.height);
      var pix = imgd.data;
      //console.log("Pix", pix);
      const initialPixel = getPixel(pix, y * imgd.width + x);

      var stack = Array();
      stack.push([x, y]); // Push the seed
      while (stack.length > 0) {
        var currPoint = stack.shift();
        //console.log("Filling", currPoint)
        const pixel = getPixel(pix, currPoint[1] * imgd.width + currPoint[0]);
        //console.log("Initial Pixel", initialPixel)
        //console.log("New Pixel", pixel)
        if (
          currPoint[0] > 0 &&
          currPoint[0] < canvas.width &&
          currPoint[1] > 0 &&
          currPoint[1] < canvas.height &&
          arraysEqual(initialPixel, pixel)
        ) {
          // Check if the point is not filled
          context.fillStyle=props.color;
          context.fillRect(currPoint[0], currPoint[1], 1, 1); // Fill the point with the foreground
          stack.push([currPoint[0] + 1, currPoint[1]]); // Fill the east neighbour
          stack.push([currPoint[0], currPoint[1] + 1]); // Fill the south neighbour
          stack.push([currPoint[0] - 1, currPoint[1]]); // Fill the west neighbour
          stack.push([currPoint[0], currPoint[1] - 1]); // Fill the north neighbour
        }
      }
    }
  }
  return (
    <canvas
      onClick={(event: MouseEvent) => {fill(event)}}
      onMouseDown={() => {
        setmouseDown(true);
      }}
      onMouseLeave={() => {
        setmouseDown(false);
        setLastMouseX(0);
        setLastMouseY(0);
      }}
      onMouseUp={() => {
        setmouseDown(false);
        setLastMouseX(0);
        setLastMouseY(0);
      }}
      onMouseMove={draw}
      className={props.className}
      ref={canvasRef}
      height={props.height}
      width={props.width}
    />
  );
};

CustomCanvas.defaultProps = {
  width: 1280,
  height: 500,
};
export default CustomCanvas;
