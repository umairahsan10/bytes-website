'use client';
import { useEffect, useRef } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    initFluid: (canvas: HTMLCanvasElement) => void;
  }
}

export const WebGLFluidOriginal: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    // Configuration
    const config = {
      SIM_RESOLUTION: 128,
      DYE_RESOLUTION: 1024,
      CAPTURE_RESOLUTION: 512,
      DENSITY_DISSIPATION: 1,
      VELOCITY_DISSIPATION: 0.2,
      PRESSURE: 0.6,
      PRESSURE_ITERATIONS: 20,
      CURL: 30,
      SPLAT_RADIUS: 0.25,
      SPLAT_FORCE: 6000,
      SHADING: true,
      COLORFUL: true,
      COLOR_UPDATE_SPEED: 10,
      PAUSED: false,
      BACK_COLOR: { r: 0, g: 0, b: 0 },
      TRANSPARENT: false,
      BLOOM: true,
      BLOOM_ITERATIONS: 8,
      BLOOM_RESOLUTION: 256,
      BLOOM_INTENSITY: 0.8,
      BLOOM_THRESHOLD: 0.6,
      BLOOM_SOFT_KNEE: 0.7,
      SUNRAYS: true,
      SUNRAYS_RESOLUTION: 196,
      SUNRAYS_WEIGHT: 1.0,
    };

    // Shader sources
    const vertexShader = `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;
      void main () {
          vUv = aPosition * 0.5 + 0.5;
          vL = vUv - vec2(texelSize.x, 0.0);
          vR = vUv + vec2(texelSize.x, 0.0);
          vT = vUv + vec2(0.0, texelSize.y);
          vB = vUv - vec2(0.0, texelSize.y);
          gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const splatShader = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main () {
          vec2 p = vUv - point.xy;
          p.x *= aspectRatio;
          vec3 splat = exp(-dot(p, p) / radius) * color;
          vec3 base = texture2D(uTarget, vUv).xyz;
          gl_FragColor = vec4(base + splat, 1.0);
      }
    `;

    const advectionShader = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform float dt;
      uniform float dissipation;
      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
          vec2 st = uv / tsize - 0.5;
          vec2 iuv = floor(st);
          vec2 fuv = fract(st);
          vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
          vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
          vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
          vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
          return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
      }
      void main () {
          vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
          gl_FragColor = dissipation * bilerp(uSource, coord, texelSize);
          gl_FragColor.a = 1.0;
      }
    `;

    const divergenceShader = `
      precision mediump float;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
          float L = texture2D(uVelocity, vL).x;
          float R = texture2D(uVelocity, vR).x;
          float T = texture2D(uVelocity, vT).y;
          float B = texture2D(uVelocity, vB).y;
          vec2 C = texture2D(uVelocity, vUv).xy;
          if (vL.x < 0.0) { L = -C.x; }
          if (vR.x > 1.0) { R = -C.x; }
          if (vT.y > 1.0) { T = -C.y; }
          if (vB.y < 0.0) { B = -C.y; }
          float div = 0.5 * (R - L + T - B);
          gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `;

    const curlShader = `
      precision mediump float;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
          float L = texture2D(uVelocity, vL).y;
          float R = texture2D(uVelocity, vR).y;
          float T = texture2D(uVelocity, vT).x;
          float B = texture2D(uVelocity, vB).x;
          float vorticity = R - L - T + B;
          gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `;

    const vorticityShader = `
      precision highp float;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;
      void main () {
          float L = texture2D(uCurl, vL).x;
          float R = texture2D(uCurl, vR).x;
          float T = texture2D(uCurl, vT).x;
          float B = texture2D(uCurl, vB).x;
          float C = texture2D(uCurl, vUv).x;
          vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
          force /= length(force) + 0.0001;
          force *= curl * C;
          force.y *= -1.0;
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity += force * dt;
          velocity = min(max(velocity, -1000.0), 1000.0);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `;

    const pressureShader = `
      precision mediump float;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          float C = texture2D(uPressure, vUv).x;
          float divergence = texture2D(uDivergence, vUv).x;
          float pressure = (L + R + B + T - divergence) * 0.25;
          gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `;

    const gradientSubtractShader = `
      precision mediump float;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity.xy -= vec2(R - L, T - B);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `;

    const displayShader = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform float aspectRatio;
      void main () {
          vec3 C = texture2D(uTexture, vUv).rgb;
          float a = max(C.r, max(C.g, C.b));
          gl_FragColor = vec4(C, a);
      }
    `;

    // Utility functions
    function getWebGLContext(canvas: HTMLCanvasElement) {
      const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };
      let gl = canvas.getContext('webgl2', params) as WebGL2RenderingContext;
      const isWebGL2 = !!gl;
      if (!isWebGL2) gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params) as any;
      return { gl, isWebGL2 };
    }

    function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    function createProgram(gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string) {
      const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
      const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
      if (!vertexShader || !fragmentShader) return null;

      const program = gl.createProgram();
      if (!program) return null;
      
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program linking error:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }

      return program;
    }

    // Initialize WebGL
    const { gl: webgl } = getWebGLContext(canvas);
    
    const ext = {
      formatRGBA: webgl.RGBA,
      formatRG: webgl.RGBA,
      formatR: webgl.RGBA,
      halfFloatTexType: webgl.HALF_FLOAT,
      supportLinearFiltering: true
    };

    // Create programs
    const programs = {
      splat: createProgram(webgl, vertexShader, splatShader),
      advection: createProgram(webgl, vertexShader, advectionShader),
      divergence: createProgram(webgl, vertexShader, divergenceShader),
      curl: createProgram(webgl, vertexShader, curlShader),
      vorticity: createProgram(webgl, vertexShader, vorticityShader),
      pressure: createProgram(webgl, vertexShader, pressureShader),
      gradientSubtract: createProgram(webgl, vertexShader, gradientSubtractShader),
      display: createProgram(webgl, vertexShader, displayShader),
    };

    // Create framebuffers and textures
    function createFBO(gl: WebGLRenderingContext, w: number, h: number, format: number, type: number, param: number) {
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, format, w, h, 0, format, type, null);

      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);

      return {
        texture,
        fbo,
        width: w,
        height: h,
        attach(id: number) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        }
      };
    }

    function createDoubleFBO(gl: WebGLRenderingContext, w: number, h: number, format: number, type: number, param: number) {
      let fbo1 = createFBO(gl, w, h, format, type, param);
      let fbo2 = createFBO(gl, w, h, format, type, param);

      return {
        width: w,
        height: h,
        texelSizeX: 1.0 / w,
        texelSizeY: 1.0 / h,
        get read() {
          return fbo1;
        },
        set read(value) {
          fbo1 = value;
        },
        get write() {
          return fbo2;
        },
        set write(value) {
          fbo2 = value;
        },
        swap() {
          const temp = fbo1;
          fbo1 = fbo2;
          fbo2 = temp;
        }
      };
    }

    // Resize canvas
    function resizeCanvas() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
      }
      return false;
    }

    // Initialize simulation
    const simWidth = config.SIM_RESOLUTION;
    const simHeight = config.SIM_RESOLUTION;
    const dyeWidth = config.DYE_RESOLUTION;
    const dyeHeight = config.DYE_RESOLUTION;

    const velocity = createDoubleFBO(webgl, simWidth, simHeight, ext.formatRG, ext.halfFloatTexType, ext.supportLinearFiltering ? webgl.LINEAR : webgl.NEAREST);
    const density = createDoubleFBO(webgl, dyeWidth, dyeHeight, ext.formatRGBA, ext.halfFloatTexType, ext.supportLinearFiltering ? webgl.LINEAR : webgl.NEAREST);
    const pressure = createDoubleFBO(webgl, simWidth, simHeight, ext.formatR, ext.halfFloatTexType, ext.supportLinearFiltering ? webgl.LINEAR : webgl.NEAREST);
    const divergence = createFBO(webgl, simWidth, simHeight, ext.formatR, ext.halfFloatTexType, ext.supportLinearFiltering ? webgl.LINEAR : webgl.NEAREST);
    const curl = createFBO(webgl, simWidth, simHeight, ext.formatR, ext.halfFloatTexType, ext.supportLinearFiltering ? webgl.LINEAR : webgl.NEAREST);

    // Create vertex buffer
    const blit = (() => {
      webgl.bindBuffer(webgl.ARRAY_BUFFER, webgl.createBuffer());
      webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), webgl.STATIC_DRAW);
      webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, webgl.createBuffer());
      webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), webgl.STATIC_DRAW);
      webgl.vertexAttribPointer(0, 2, webgl.FLOAT, false, 0, 0);
      webgl.enableVertexAttribArray(0);

      return () => {
        webgl.drawElements(webgl.TRIANGLES, 6, webgl.UNSIGNED_SHORT, 0);
      };
    })();

    // Simulation variables
    let lastUpdateTime = Date.now();
    const colorUpdateTimer = 0.0;
    const pointers: any[] = [];

    pointers.push({
      id: 0,
      texcoordX: 0.5,
      texcoordY: 0.5,
      prevTexcoordX: 0.5,
      prevTexcoordY: 0.5,
      deltaX: 0,
      deltaY: 0,
      down: false,
      moved: false,
      color: [30, 0, 300]
    });

    // Helper functions
    function HSVtoRGB(h: number, s: number, v: number) {
      let r, g, b, i, f, p, q, t;
      i = Math.floor(h * 6);
      f = h * 6 - i;
      p = v * (1 - s);
      q = v * (1 - f * s);
      t = v * (1 - (1 - f) * s);
      switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
        default: r = g = b = 0;
      }
      return {
        r: Math.floor(r * 255),
        g: Math.floor(g * 255),
        b: Math.floor(b * 255)
      };
    }

    function generateColor() {
      const c = HSVtoRGB(Math.random(), 1.0, 1.0);
      return { r: c.r * 0.15, g: c.g * 0.15, b: c.b * 0.15 };
    }

    function splat(x: number, y: number, dx: number, dy: number, color: { r: number; g: number; b: number }) {
      if (!programs.splat) return;
      
      webgl.useProgram(programs.splat);
      webgl.uniform1i(webgl.getUniformLocation(programs.splat, 'uTarget'), velocity.read.attach(0));
      webgl.uniform1f(webgl.getUniformLocation(programs.splat, 'aspectRatio'), canvas.width / canvas.height);
      webgl.uniform2f(webgl.getUniformLocation(programs.splat, 'point'), x, y);
      webgl.uniform3f(webgl.getUniformLocation(programs.splat, 'color'), dx, dy, 0.0);
      webgl.uniform1f(webgl.getUniformLocation(programs.splat, 'radius'), correctRadius(config.SPLAT_RADIUS / 100.0));
      webgl.bindFramebuffer(webgl.FRAMEBUFFER, velocity.write.fbo);
      blit();
      velocity.swap();

      webgl.uniform1i(webgl.getUniformLocation(programs.splat, 'uTarget'), density.read.attach(0));
      webgl.uniform3f(webgl.getUniformLocation(programs.splat, 'color'), color.r, color.g, color.b);
      webgl.bindFramebuffer(webgl.FRAMEBUFFER, density.write.fbo);
      blit();
      density.swap();
    }

    function correctRadius(radius: number) {
      const aspectRatio = canvas.width / canvas.height;
      if (aspectRatio > 1) radius *= aspectRatio;
      return radius;
    }

    // Simulation step function
    function step(dt: number) {
      if (!programs.curl || !programs.vorticity || !programs.divergence || !programs.pressure || !programs.gradientSubtract || !programs.advection) return;

      webgl.disable(webgl.BLEND);

      // Curl
      webgl.useProgram(programs.curl);
      webgl.uniform2f(webgl.getUniformLocation(programs.curl, 'texelSize'), velocity.texelSizeX, velocity.texelSizeY);
      webgl.uniform1i(webgl.getUniformLocation(programs.curl, 'uVelocity'), velocity.read.attach(0));
      webgl.bindFramebuffer(webgl.FRAMEBUFFER, curl.fbo);
      blit();

      // Vorticity
      webgl.useProgram(programs.vorticity);
      webgl.uniform2f(webgl.getUniformLocation(programs.vorticity, 'texelSize'), velocity.texelSizeX, velocity.texelSizeY);
      webgl.uniform1i(webgl.getUniformLocation(programs.vorticity, 'uVelocity'), velocity.read.attach(0));
      webgl.uniform1i(webgl.getUniformLocation(programs.vorticity, 'uCurl'), curl.attach(1));
      webgl.uniform1f(webgl.getUniformLocation(programs.vorticity, 'curl'), config.CURL);
      webgl.uniform1f(webgl.getUniformLocation(programs.vorticity, 'dt'), dt);
      webgl.bindFramebuffer(webgl.FRAMEBUFFER, velocity.write.fbo);
      blit();
      velocity.swap();

      // Divergence
      webgl.useProgram(programs.divergence);
      webgl.uniform2f(webgl.getUniformLocation(programs.divergence, 'texelSize'), velocity.texelSizeX, velocity.texelSizeY);
      webgl.uniform1i(webgl.getUniformLocation(programs.divergence, 'uVelocity'), velocity.read.attach(0));
      webgl.bindFramebuffer(webgl.FRAMEBUFFER, divergence.fbo);
      blit();

      // Pressure
      webgl.useProgram(programs.pressure);
      webgl.uniform2f(webgl.getUniformLocation(programs.pressure, 'texelSize'), pressure.texelSizeX, pressure.texelSizeY);
      webgl.uniform1i(webgl.getUniformLocation(programs.pressure, 'uDivergence'), divergence.attach(0));
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        webgl.uniform1i(webgl.getUniformLocation(programs.pressure, 'uPressure'), pressure.read.attach(1));
        webgl.bindFramebuffer(webgl.FRAMEBUFFER, pressure.write.fbo);
        blit();
        pressure.swap();
      }

      // Gradient subtract
      webgl.useProgram(programs.gradientSubtract);
      webgl.uniform2f(webgl.getUniformLocation(programs.gradientSubtract, 'texelSize'), velocity.texelSizeX, velocity.texelSizeY);
      webgl.uniform1i(webgl.getUniformLocation(programs.gradientSubtract, 'uPressure'), pressure.read.attach(0));
      webgl.uniform1i(webgl.getUniformLocation(programs.gradientSubtract, 'uVelocity'), velocity.read.attach(1));
      webgl.bindFramebuffer(webgl.FRAMEBUFFER, velocity.write.fbo);
      blit();
      velocity.swap();

      // Advection
      webgl.useProgram(programs.advection);
      webgl.uniform2f(webgl.getUniformLocation(programs.advection, 'texelSize'), velocity.texelSizeX, velocity.texelSizeY);
      const velocityId = velocity.read.attach(0);
      webgl.uniform1i(webgl.getUniformLocation(programs.advection, 'uVelocity'), velocityId);
      webgl.uniform1i(webgl.getUniformLocation(programs.advection, 'uSource'), velocityId);
      webgl.uniform1f(webgl.getUniformLocation(programs.advection, 'dt'), dt);
      webgl.uniform1f(webgl.getUniformLocation(programs.advection, 'dissipation'), config.VELOCITY_DISSIPATION);
      webgl.bindFramebuffer(webgl.FRAMEBUFFER, velocity.write.fbo);
      blit();
      velocity.swap();

      webgl.uniform1i(webgl.getUniformLocation(programs.advection, 'uVelocity'), velocity.read.attach(0));
      webgl.uniform1i(webgl.getUniformLocation(programs.advection, 'uSource'), density.read.attach(1));
      webgl.uniform1f(webgl.getUniformLocation(programs.advection, 'dissipation'), config.DENSITY_DISSIPATION);
      webgl.bindFramebuffer(webgl.FRAMEBUFFER, density.write.fbo);
      blit();
      density.swap();
    }

    function render() {
      if (!programs.display) return;
      
      webgl.bindFramebuffer(webgl.FRAMEBUFFER, null);
      webgl.viewport(0, 0, canvas.width, canvas.height);
      webgl.useProgram(programs.display);
      webgl.uniform1i(webgl.getUniformLocation(programs.display, 'uTexture'), density.read.attach(0));
      webgl.uniform1f(webgl.getUniformLocation(programs.display, 'aspectRatio'), canvas.width / canvas.height);
      blit();
    }

    // Mouse/touch handling
    function updatePointerMoveData(pointer: any, posX: number, posY: number) {
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.texcoordX = posX / canvas.clientWidth;
      pointer.texcoordY = 1.0 - posY / canvas.clientHeight;
      pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
      pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
      pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
    }

    function correctDeltaX(delta: number) {
      const aspectRatio = canvas.width / canvas.height;
      if (aspectRatio < 1) delta *= aspectRatio;
      return delta;
    }

    function correctDeltaY(delta: number) {
      const aspectRatio = canvas.width / canvas.height;
      if (aspectRatio > 1) delta /= aspectRatio;
      return delta;
    }

    canvas.addEventListener('mousedown', (e) => {
      const posX = e.offsetX;
      const posY = e.offsetY;
      updatePointerMoveData(pointers[0], posX, posY);
      pointers[0].down = true;
      pointers[0].color = generateColor();
    });

    canvas.addEventListener('mousemove', (e) => {
      const posX = e.offsetX;
      const posY = e.offsetY;
      updatePointerMoveData(pointers[0], posX, posY);
      // Only create splat effects when mouse is pressed down (dragging)
      if (pointers[0].down) {
        splat(pointers[0].texcoordX, pointers[0].texcoordY, pointers[0].deltaX, pointers[0].deltaY, pointers[0].color);
      }
    });

    canvas.addEventListener('mouseup', () => {
      pointers[0].down = false;
    });

    // Touch events
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touches = e.targetTouches;
      for (let i = 0; i < touches.length; i++) {
        if (i >= pointers.length) break;
        const posX = touches[i].pageX;
        const posY = touches[i].pageY;
        updatePointerMoveData(pointers[i], posX, posY);
        pointers[i].down = true;
        pointers[i].color = generateColor();
      }
    });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touches = e.targetTouches;
      for (let i = 0; i < touches.length; i++) {
        if (i >= pointers.length) break;
        const posX = touches[i].pageX;
        const posY = touches[i].pageY;
        updatePointerMoveData(pointers[i], posX, posY);
        splat(pointers[i].texcoordX, pointers[i].texcoordY, pointers[i].deltaX, pointers[i].deltaY, pointers[i].color);
      }
    });

    canvas.addEventListener('touchend', (e) => {
      const touches = e.targetTouches;
      for (let i = 0; i < pointers.length; i++) {
        if (i >= touches.length) pointers[i].down = false;
      }
    });

    // Animation loop
    function update() {
      const dt = calcDeltaTime();
      if (resizeCanvas()) {
        // Handle resize
      }
      
      if (!config.PAUSED) {
        step(dt);
      }
      render();
      
      animationRef.current = requestAnimationFrame(update);
    }

    function calcDeltaTime() {
      const now = Date.now();
      let dt = (now - lastUpdateTime) / 1000;
      dt = Math.min(dt, 0.016666);
      lastUpdateTime = now;
      return dt;
    }

    // Start animation
    resizeCanvas();
    
    // Initial fireball effects on load
    setTimeout(() => {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          const x = Math.random();
          const y = Math.random();
          const dx = (Math.random() - 0.5) * 20;
          const dy = (Math.random() - 0.5) * 20;
          const color = generateColor();
          splat(x, y, dx, dy, color);
        }, i * 200);
      }
    }, 1000);
    
    update();

    // Handle window resize
    const handleResize = () => {
      resizeCanvas();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <Script
        src="/webgl-fluid.js"
        strategy="lazyOnload"
        onLoad={() => {
          if (typeof window.initFluid === 'function') {
            try {
              window.initFluid(canvasRef.current);
              console.log("WebGL Fluid simulation initialized successfully");
            } catch (error) {
              console.error("Error initializing WebGL fluid:", error);
            }
          } else {
            console.error("initFluid function not found on window object.");
          }
        }}
        onError={(e) => {
          console.error("Error loading WebGL fluid script:", e);
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ 
          width: '100%', 
          height: '100%',
          display: 'block',
          touchAction: 'none'
        }}
      />
    </>
  );
};

export default WebGLFluidOriginal; 