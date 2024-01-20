"use client";
import { useRef, useEffect, MouseEvent, useState } from "react";

interface CanvasProps {
  className: string;
  width: number;
  height: number;
}

const CustomCanvas = (props: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mouseDown, setmouseDown] = useState(false);
  const [lastMouseX, setLastMouseX] = useState(0);
  const [lastMouseY, setLastMouseY] = useState(0);
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d")!;
      context.beginPath();
      +context.arc(50, 50, 50, 0, 2 * Math.PI);
      +context.fill();
    }
  }, []);
  function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
      y: ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
    };
  }
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
    if (c > 10) {
      for (var i = 1; i <= 10; i++) {
        context.fillStyle = "#000000";
        context.beginPath();
        context.arc(
          x + i * ((x2 - x) / 10),
          y + i * ((y2 - y) / 10),
          10,
          0,
          2 * Math.PI
        );
        context.fill();
      }
    }
  }
  function draw(e: MouseEvent) {
    if (canvasRef.current && mouseDown) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d")!;
      var pos = getMousePos(canvas, e);
      var posx = pos.x;
      var posy = pos.y;
      if (lastMouseX != 0 || lastMouseY != 0) {
        interpolate(lastMouseX, lastMouseY, posx, posy, context);
      }
      context.fillStyle = "#000000";
      context.beginPath();
      context.arc(posx, posy, 10, 0, 2 * Math.PI);
      context.fill();
      setLastMouseX(posx);
      setLastMouseY(posy);
    }
  }
  return (
    <canvas
      onMouseDown={() => {
        setmouseDown(true);
      }}
      onMouseLeave={() => {setmouseDown(false); setLastMouseX(0); setLastMouseY(0)}}
      onMouseUp={() => {setmouseDown(false); setLastMouseX(0); setLastMouseY(0)}}
      onMouseMove={draw}
      className={props.className}
      ref={canvasRef}
      height={props.height}
      width={props.width}
    />
  );
};
if (window) {
  CustomCanvas.defaultProps = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export default CustomCanvas;
