/* ===========================================================================
   Myat Thu — Page-wide 3D scroll scene
   One particle system, morphed by scroll across the page:
     hero      → SPHERE  (a wireframe icosahedron + shell of particles)
     stats     → CLOUD   (the sphere disperses into a drifting field)
     work      → SPINE   (particles form a vertical helical timeline)
     certs     → SPHERE  (the object reforms)
     → contact → fades out before the opaque contact section covers it.
   Colours track the active theme. Degrades gracefully (no JS / no WebGL /
   reduced-motion / Data Saver all get the plain gradient site).
   =========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  // Only meaningful on the home page (the scene's milestones live there).
  if (!document.querySelector(".hero") || !document.querySelector(".work")) return;

  var conn = navigator.connection;
  if (conn && conn.saveData) return;

  // Three.js is the page's heaviest asset — load it lazily, off the critical path.
  var lib = document.createElement("script");
  lib.src = "vendor/three.slim.min.js";
  lib.async = true;
  lib.onload = function () { if (typeof window.THREE !== "undefined") init(); };
  document.head.appendChild(lib);

  var SPHERE = 0, CLOUD = 1, SPINE = 2;

  function init() {
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch (e) { return; }

    var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    var small = window.innerWidth < 760;
    var canvas = renderer.domElement;
    canvas.className = "scene3d";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200);
    camera.position.set(0, 0, 26);

    var group = new THREE.Group();
    scene.add(group);

    var icosa = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(7.2, 1)),
      new THREE.LineBasicMaterial({ transparent: true, opacity: 0 })
    );
    group.add(icosa);

    var N = small ? 460 : 1120;
    var sphere = new Float32Array(N * 3);   // Fibonacci sphere shell
    var cloudN = new Float32Array(N * 3);   // normalised random cloud (scaled by spread)
    var spine = new Float32Array(N * 3);    // vertical helix timeline
    var wobble = new Float32Array(N * 2);   // per-particle idle-drift phase/speed
    var GOLD = Math.PI * (3 - Math.sqrt(5));
    for (var i = 0; i < N; i++) {
      var i3 = i * 3;
      // sphere
      var y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(Math.max(0, 1 - y * y)), th = i * GOLD;
      sphere[i3] = Math.cos(th) * r * 7.2; sphere[i3 + 1] = y * 7.2; sphere[i3 + 2] = Math.sin(th) * r * 7.2;
      // cloud (normalised -1..1)
      cloudN[i3] = Math.random() * 2 - 1; cloudN[i3 + 1] = Math.random() * 2 - 1; cloudN[i3 + 2] = Math.random() * 2 - 1;
      // spine — tall helix
      var f = i / (N - 1), ang = f * Math.PI * 9, rad = 2.3 + Math.sin(f * Math.PI * 22) * 0.5;
      spine[i3] = Math.cos(ang) * rad; spine[i3 + 1] = (0.5 - f) * 40; spine[i3 + 2] = Math.sin(ang) * rad;
      wobble[i * 2] = Math.random() * Math.PI * 2; wobble[i * 2 + 1] = 0.4 + Math.random() * 0.8;
    }

    var pos = new Float32Array(N * 3);
    var geom = new THREE.BufferGeometry();
    var posAttr = new THREE.BufferAttribute(pos, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    geom.setAttribute("position", posAttr);
    var pmat = new THREE.PointsMaterial({ size: 0.13, sizeAttenuation: true, transparent: true, opacity: 0.6, depthWrite: false });
    var points = new THREE.Points(geom, pmat);
    group.add(points);

    // Scroll milestones (DOM order). Each has a target formation and a world
    // centre; the field lerps between consecutive milestones as you scroll.
    var MILES = [
      { el: document.querySelector(".hero"), form: SPHERE, c: [9, 1, 0] },
      { el: document.querySelector(".stats"), form: CLOUD, c: [0, 0, 0] },
      { el: document.querySelector(".work"), form: SPINE, c: [7.5, 0, -2] },
      { el: document.querySelector(".certs"), form: SPHERE, c: [-2, 0, 0] }
    ].filter(function (m) { return m.el; });
    var contactEl = document.querySelector("#contact") || document.querySelector(".contact");

    var spread = { x: 20, y: 13, z: 8 };
    function computeBounds() {
      var halfY = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
      spread.y = halfY * 0.92; spread.x = halfY * camera.aspect * 1.15; spread.z = 8;
      MILES[0].c[0] = spread.x * 0.42; // keep the hero sphere to the right of the title
      if (MILES[2]) MILES[2].c[0] = spread.x * 0.32;
    }

    // Milestone / contact positions in document space, cached so the frame
    // loop never calls getBoundingClientRect (avoids per-frame layout thrash).
    var centers = [], contactTop = Infinity;
    function computeCenters() {
      for (var m = 0; m < MILES.length; m++) {
        var r = MILES[m].el.getBoundingClientRect();
        centers[m] = r.top + window.scrollY + r.height / 2;
      }
      contactTop = contactEl ? contactEl.getBoundingClientRect().top + window.scrollY : Infinity;
    }

    var lastW = 0, lastH = 0;
    function resize() {
      var w = window.innerWidth, h = window.innerHeight;
      if (!w || !h || (w === lastW && h === lastH)) return;
      lastW = w; lastH = h;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, fine ? 2 : 1.5));
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      computeBounds();
      computeCenters();
    }
    var rt = null;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(resize, 150); });
    // Section offsets shift as fonts/images settle — recompute after load.
    window.addEventListener("load", computeCenters);
    setTimeout(computeCenters, 1400);

    function applyTheme() {
      var cs = getComputedStyle(document.documentElement);
      var bone = new THREE.Color(cs.getPropertyValue("--bone").trim() || "#f1ede4");
      var dark = (0.2126 * bone.r + 0.7152 * bone.g + 0.0722 * bone.b) < 0.5;
      pmat.color.set(cs.getPropertyValue("--accent").trim() || "#b8492c");
      pmat.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
      pmat.needsUpdate = true;
      baseParticle = dark ? 0.7 : 0.62;
      icosa.material.color.set(cs.getPropertyValue("--ink").trim() || "#181511");
      baseIcosa = dark ? 0.34 : 0.16;
    }
    var baseParticle = 0.62, baseIcosa = 0.16;
    new MutationObserver(applyTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    var mx = 0, my = 0, cmx = 0, cmy = 0;
    if (fine) {
      window.addEventListener("mousemove", function (e) {
        mx = (e.clientX / window.innerWidth) * 2 - 1;
        my = (e.clientY / window.innerHeight) * 2 - 1;
      });
    }

    function smooth(x) { return x * x * (3 - 2 * x); }
    // read a particle's target xyz for a formation into out[0..2]
    function target(form, i, out) {
      var i3 = i * 3;
      if (form === SPHERE) { out[0] = sphere[i3]; out[1] = sphere[i3 + 1]; out[2] = sphere[i3 + 2]; }
      else if (form === SPINE) { out[0] = spine[i3]; out[1] = spine[i3 + 1]; out[2] = spine[i3 + 2]; }
      else { out[0] = cloudN[i3] * spread.x; out[1] = cloudN[i3 + 1] * spread.y; out[2] = cloudN[i3 + 2] * spread.z; }
    }

    var raf = null, lastT = 0, t = 0, visible = false, ta = [0, 0, 0], tb = [0, 0, 0];
    function frame(now) {
      var dt = Math.min((now - lastT) / 1000, 0.05); lastT = now; t += dt;
      var sc = window.scrollY + window.innerHeight / 2;

      // find the active milestone segment (cached document-space centres)
      var idx = 0;
      for (var m = 0; m < MILES.length - 1; m++) { if (sc >= centers[m]) idx = m; }
      var iB = Math.min(idx + 1, MILES.length - 1);
      var A = MILES[idx], B = MILES[iB];
      var ca = centers[idx], cb = centers[iB];
      var seg = cb > ca ? (sc - ca) / (cb - ca) : 0;
      seg = smooth(Math.max(0, Math.min(1, seg)));

      // fade the whole scene out as it nears the opaque contact section
      var alpha = 1;
      var fadeStart = contactTop - window.innerHeight * 1.1;
      if (sc > fadeStart) alpha = Math.max(0, 1 - (sc - fadeStart) / (window.innerHeight * 0.8));

      if (alpha <= 0.001) { // scrolled into the contact zone — nothing to draw
        pmat.opacity = 0; icosa.material.opacity = 0; renderer.render(scene, camera);
        raf = requestAnimationFrame(frame); return;
      }

      var cxw = A.c[0] + (B.c[0] - A.c[0]) * seg;
      var cyw = A.c[1] + (B.c[1] - A.c[1]) * seg;
      var czw = A.c[2] + (B.c[2] - A.c[2]) * seg;
      var spineW = ((A.form === SPINE ? (1 - seg) : 0) + (B.form === SPINE ? seg : 0)); // helix-ness

      for (var i = 0; i < N; i++) {
        target(A.form, i, ta); target(B.form, i, tb);
        var i3 = i * 3;
        var wob = Math.sin(t * wobble[i * 2 + 1] + wobble[i * 2]) * (0.15 + spineW * 0.25);
        pos[i3] = ta[0] + (tb[0] - ta[0]) * seg + cxw + wob;
        pos[i3 + 1] = ta[1] + (tb[1] - ta[1]) * seg + cyw;
        pos[i3 + 2] = ta[2] + (tb[2] - ta[2]) * seg + czw + wob;
      }
      posAttr.needsUpdate = true;

      var sphereness = ((A.form === SPHERE ? (1 - seg) : 0) + (B.form === SPHERE ? seg : 0));
      icosa.material.opacity = baseIcosa * sphereness * alpha;
      icosa.position.set(cxw, cyw, czw);
      icosa.scale.setScalar(0.6 + sphereness * 0.4 + Math.sin(t * 0.6) * 0.03);
      icosa.visible = icosa.material.opacity > 0.002;
      pmat.opacity = baseParticle * alpha;
      pmat.size = 0.13 - spineW * 0.03;

      group.rotation.y = t * 0.05 + sphereness * Math.sin(t * 0.2) * 0.15;
      icosa.rotation.set(t * 0.12, t * 0.16, 0);

      if (fine) { cmx += (mx - cmx) * 0.04; cmy += (my - cmy) * 0.04; }
      else { cmx = Math.sin(t * 0.08) * 0.4; cmy = 0; }
      camera.position.x = cmx * 2.6; camera.position.y = -cmy * 1.6; camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      if (!live) { live = true; canvas.classList.add("is-live"); }
      raf = requestAnimationFrame(frame);
    }
    var live = false;

    function update() {
      var on = visible && !document.hidden;
      if (on && !raf) { lastT = performance.now(); raf = requestAnimationFrame(frame); }
      else if (!on && raf) { cancelAnimationFrame(raf); raf = null; }
    }
    // Render only while the main content (not just one section) is on screen.
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; update(); })
      .observe(document.querySelector("main") || document.body);
    document.addEventListener("visibilitychange", update);
    canvas.addEventListener("webglcontextlost", function (e) { e.preventDefault(); if (raf) { cancelAnimationFrame(raf); raf = null; } });
    canvas.addEventListener("webglcontextrestored", update);

    applyTheme();
    resize();
    visible = true;
    update();
  }
})();
