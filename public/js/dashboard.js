const canvas = document.getElementById("leafCanvas");

if (canvas) {
	const ctx = canvas.getContext("2d");

	function resize() {
		const dpr = window.devicePixelRatio || 1;
		canvas.width = Math.floor(canvas.offsetWidth * dpr);
		canvas.height = Math.floor(canvas.offsetHeight * dpr);
		canvas.style.width = canvas.offsetWidth + 'px';
		canvas.style.height = canvas.offsetHeight + 'px';
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	}

	window.addEventListener('resize', resize);
	resize();

	let leaves = [];
	const LEAF_COUNT = 24;

	function rand(min, max) { return min + Math.random() * (max - min); }

	function init() {
		leaves = [];
		for (let i = 0; i < LEAF_COUNT; i++) {
			leaves.push({
				x: rand(0, canvas.offsetWidth),
				y: rand(-canvas.offsetHeight, canvas.offsetHeight),
				size: rand(8, 22),
				speed: rand(0.3, 1.2),
				sway: rand(12, 60),
				phase: rand(0, Math.PI * 2),
				rot: rand(-0.8, 0.8),
				alpha: rand(0.35, 0.9)
			});
		}
	}

	function drawLeaf(x, y, size, rot, alpha) {
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(rot);
		ctx.globalAlpha = alpha;

		const g = ctx.createLinearGradient(-size/2, 0, size/2, 0);
		g.addColorStop(0, 'rgba(255,255,255,0.9)');
		g.addColorStop(1, 'rgba(255,255,255,0.4)');

		ctx.fillStyle = g;
		ctx.beginPath();
		ctx.moveTo(0, -size*0.4);
		ctx.bezierCurveTo(size*0.6, -size*0.6, size*0.6, size*0.4, 0, size*0.7);
		ctx.bezierCurveTo(-size*0.6, size*0.4, -size*0.4, -size*0.6, 0, -size*0.4);
		ctx.fill();

		ctx.restore();
		ctx.globalAlpha = 1;
	}

	function step() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		leaves.forEach(leaf => {
			// horizontal sway (natural motion)
			leaf.phase += 0.02 * leaf.speed;
			leaf.x += Math.sin(leaf.phase) * (leaf.sway * 0.03);
			leaf.y += leaf.speed + Math.abs(Math.cos(leaf.phase)) * 0.2;
			leaf.rot = Math.sin(leaf.phase) * 0.6;

			// respawn at top
			if (leaf.y - leaf.size > canvas.offsetHeight) {
				leaf.y = -leaf.size - Math.random() * 60;
				leaf.x = rand(0, canvas.offsetWidth);
				leaf.size = rand(8, 22);
				leaf.speed = rand(0.3, 1.2);
				leaf.sway = rand(12, 60);
				leaf.alpha = rand(0.35, 0.9);
			}

			drawLeaf(leaf.x, leaf.y, leaf.size, leaf.rot, leaf.alpha);
		});

		requestAnimationFrame(step);
	}

	init();
	step();

}
