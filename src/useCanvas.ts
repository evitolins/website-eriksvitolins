import { useEffect, useRef, useState } from "react";

export const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) setCtx(canvasRef.current.getContext("2d"));
  }, [canvasRef]);

  return { canvasRef, ctx };
};
