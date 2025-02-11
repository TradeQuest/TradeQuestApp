(function () {
    const { Renderer, Program, Mesh, Color, Triangle } = window.OGL;

    function AuroraBackground(props) {
        const { colorStops = ["#00d8ff", "#7cff67", "#00d8ff"], amplitude = 1.0 } = props || {};
        let container = document.getElementById("aurora-background");

        const renderer = new Renderer();
        const gl = renderer.gl;
        gl.clearColor(1, 1, 1, 1);

        function resize() {
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        window.addEventListener("resize", resize);
        resize();

        const geometry = new Triangle(gl);
        geometry.addAttribute("uv", {
            size: 2,
            data: new Float32Array([0, 0, 2, 0, 0, 2]),
        });

        const colorStopsArray = colorStops.map(hex => {
            const c = new Color(hex);
            return [c.r, c.g, c.b];
        });

        const program = new Program(gl, {
            vertex: `#version 300 es
                in vec2 uv;
                in vec2 position;
                out vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 0.0, 1.0);
                }
            `,
            fragment: `#version 300 es
                precision highp float;
                uniform float uTime;
                uniform float uAmplitude;
                uniform vec3 uColorStops[3];
                in vec2 vUv;
                out vec4 fragColor;
                void main() {
                    vec3 color = mix(uColorStops[0], uColorStops[2], vUv.x);
                    float height = sin(vUv.y * 6.283 + uTime) * 0.5 + 0.5;
                    fragColor.rgb = height * color;
                    fragColor.a = 1.0;
                }
            `,
            uniforms: {
                uTime: { value: 0 },
                uAmplitude: { value: amplitude },
                uColorStops: { value: colorStopsArray },
            },
        });

        const mesh = new Mesh(gl, { geometry, program });
        container.appendChild(gl.canvas);

        let animateId = 0;
        function update(t) {
            animateId = requestAnimationFrame(update);
            program.uniforms.uTime.value = t * 0.001;
            renderer.render({ scene: mesh });
        }
        animateId = requestAnimationFrame(update);

        return container;
    }

    window.AuroraBackground = AuroraBackground;
})();
