import { useCallback, useEffect } from "react";
import { useCanvas } from "./useCanvas";

interface ShowcaseSettings {
  numSplines: number; // Number of splines to generate
  numVertices: number; // Number of vertices in each spline
  splineOffset: number; // Offset in pixels between each spline (minimum)
  maxOffset: number; // Maximum offset in pixels
  maxRotate: number; // Maximum rotate in degrees
  minThickness: number;
  maxThickness: number;
  mouseX: number;
  mouseY: number;
  wiggle: number;
}

export const Showcase = ({
  numSplines = 100,
  numVertices = 100,
  splineOffset = 0.2,
  maxOffset = 10,
  maxRotate = 90,
  minThickness = 1,
  maxThickness = 16,
  mouseX = 0,
  mouseY = 0,
  wiggle = 60,
}: ShowcaseSettings): JSX.Element => {
  const { canvasRef, ctx } = useCanvas();

  const render = useCallback(
    (ctx: CanvasRenderingContext2D, settings: ShowcaseSettings) => {
      const {
        numSplines,
        numVertices,
        splineOffset,
        maxOffset,
        maxRotate,
        minThickness,
        maxThickness,
        mouseX,
        mouseY,
        wiggle,
      } = settings;

      function generateSpline(
        x: number,
        y: number,
        color: string,
        centerX: number,
        centerY: number
      ) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((Math.floor(Math.random() * maxRotate) * Math.PI) / 180);
        ctx.beginPath();
        ctx.moveTo(x, y);
        const minMax = wiggle;
        for (let i = 0; i < numVertices; i++) {
          // Calculate slightly offset coordinates
          x += Math.random() * (maxOffset - splineOffset) + splineOffset;
          y += Math.random() * minMax * 2 - minMax; // Random y offset (-10 to 10)
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = color;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = Math.floor(
          Math.random() * (maxThickness - minThickness) + minThickness
        );
        // ctx.translate(ctx.canvas.width / -2, ctx.canvas.height / -2);

        ctx.stroke();
        ctx.restore();
      }

      function getRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 8; i++) {
          color += letters[Math.floor(Math.random() * letters.length)];
        }
        return color;
      }

      function clear() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      }

      clear();

      // Add background
      ctx.fillStyle = "rgb(37, 69, 90)";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // Generate a series of splines with offsets
      let startX = 10; // Adjusted to start from the left
      let startY = 0; // Top of the canvas

      const randIndex = Math.floor(Math.random() * numSplines);

      for (let i = 0; i < numSplines; i++) {
        const color = i === randIndex ? "white" : getRandomColor();
        generateSpline(startX, startY, color, mouseX, mouseY);
        startX += Math.random() * (maxOffset - splineOffset) + splineOffset;
        startY = startY + 0; // Will eventually add behavior here
      }
    },
    []
  );

  useEffect(() => {
    if (!ctx) return;
    render(ctx, {
      numSplines,
      numVertices,
      splineOffset,
      maxOffset,
      maxRotate,
      minThickness,
      maxThickness,
      mouseX,
      mouseY,
      wiggle,
    });
    // const id = setInterval(() => render(ctx), 10);
    // return () => {
    //   clearInterval(id);
    // };
  }, [ctx, render, mouseX, mouseY, wiggle]);

  return (
    <canvas
      ref={canvasRef}
      id="canvas"
      width="1100"
      height="420"
      style={{ background: "#fff" }}
    />
  );
};
