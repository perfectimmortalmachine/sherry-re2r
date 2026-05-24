let homeScene = new Phaser.Scene('home');

homeScene.preload = function() {
    this.load.image('bkg', 'assets/fullbackground.png');
    this.load.image('b0', 'assets/block0-dialSheet.png');
    this.load.image('b1', 'assets/block1-dialSheet.png');
    this.load.image('b2', 'assets/block2-dialSheet.png');
    this.load.image('b3', 'assets/block3-dialSheet.png');
};

homeScene.create = function() {
    const W = this.sys.game.canvas.width;
    const H = this.sys.game.canvas.height;

    // Background
    const bkg = this.add.image(W / 2, H / 2, 'bkg');
    bkg.setOrigin(0.5, 0.5);
    const scaleX = W / bkg.width;
    const scaleY = H / bkg.height;
    bkg.setScale(Math.max(scaleX, scaleY));

    // Title
    this.add.text(W / 1.25, 660, 'Resident Evil 2 Block Puzzle', {
        fontFamily: 'Cascadia Code, serif',
        fontSize: '26px',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
    }).setOrigin(0.5);

    // Palm
    this.add.text(W / 1.08, 700, 'by Palm', {
        fontFamily: 'Cascadia Code, serif',
        fontSize: '26px',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
    }).setOrigin(0.5);

    // Layout
    const keys   = ['b0', 'b1', 'b2', 'b3'];
    const blockW = 300;
    const gap    = -40;
    const totalW = blockW * 4 + gap * 3;
    const startX = (W - totalW) / 2;
    const blockY = 220;
    const hoverOffset = -200;

    // Offsets (Block from Dial)
    const offsets = [
        [ { x: 61,  y: 8  }, { x: 61,  y: 8  }, { x: 61,  y: 8  }, { x: 61,  y: 2  } ],
        [ { x: 28,  y: -2 }, { x: 32,  y: -2 }, { x: 34,  y: -2 }, { x: 37,  y: 6 } ],
        [ { x: -44, y: 8  }, { x: -44, y: 6.7  }, { x: -44, y: 0  }, { x: -40, y: 8  } ],
        [ { x: -63, y: 6  }, { x: -63, y: 6  }, { x: -63, y: 6  }, { x: -63, y: 15  } ],
    ];

    // Offsets (Trim from Top)
    const bottomCrop = [
        [ 26, 26, 26, 26 ],
        [ 16, 16, 16, 16 ],
        [ 15, 3, 1, -50 ],
        [ 15, 15, 15, 0 ],
    ];

    // Offsets (Trim from Bottom)
    const topCrop = [
        [ 0, 0, 0, 0 ],
        [ 0, 0, 0, 0 ],
        [ 0, 10, 0, 10 ],
        [ 0, 0, 0, 20 ],
    ];

    const rotations = [0, 0, 0, 0];
    const images    = [];

    const blockCentres = keys.map((key, i) =>
        startX + i * (blockW + gap) + offsets[i][0].x + blockW / 2
    );

    keys.forEach((key, i) => {
        const src   = this.textures.get(key).getSourceImage();
        const rotH  = src.height / 4;
        const scale = blockW / src.width;
        const cropH = rotH - bottomCrop[i][0] - topCrop[i][0];

        const img = this.add.image(
            startX + i * (blockW + gap) + offsets[i][0].x,
            blockY + offsets[i][0].y,
            key
        )
            .setOrigin(0, 0)
            .setScale(scale)
            .setCrop(0, topCrop[i][0], src.width, cropH);

        const maskShape = this.add.graphics();
        maskShape.fillRect(
            startX + i * (blockW + gap) + offsets[i][0].x - 20,
            blockY + offsets[i][0].y - 230,
            blockW + 40,
            cropH * scale + 230
        );
        const mask = maskShape.createGeometryMask();
        img.setMask(mask);

        images.push({ img, src, rotH, scale });
    });

    let activeBlock = 0;
    let selected    = -1;
    let animating   = false;

    const dot = this.add.circle(blockCentres[0], H - 300, 6, 0xffdd00);

    const indicator = this.add.text(W / 2, H - 40, 'Block 1', {
        fontFamily: 'Cascadia Code',
        fontSize: '16px',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
    }).setOrigin(0.5);

    function getCropH(i, rot) {
        const { rotH } = images[i];
        return rotH - bottomCrop[i][rot] - topCrop[i][rot];
    }

    function getBaseY(i) {
        const { rotH, scale } = images[i];
        const rot   = rotations[i];
        const cropY = rot * rotH + topCrop[i][rot];
        return blockY + offsets[i][rot].y - cropY * scale;
    }

    function getBaseX(i) {
        return startX + i * (blockW + gap) + offsets[i][rotations[i]].x;
    }

    function updateIndicator() {
        indicator.setText(`Block ${activeBlock + 1}`);
        dot.setX(blockCentres[activeBlock]);
    }

    function hoverBlock(i) {
        const { img, scale } = images[i];
        homeScene.children.bringToTop(img);
        homeScene.children.bringToTop(dot);
        homeScene.tweens.add({
            targets:  img,
            y:        getBaseY(i) + hoverOffset,
            x:        getBaseX(i) - 10,
            scaleX:   scale * 1.06,
            scaleY:   scale * 1.06,
            duration: 180,
            ease:     'Cubic.Out',
        });
    }

    function unhoverBlock(i) {
        const { img, scale } = images[i];
        images.forEach(entry => homeScene.children.bringToTop(entry.img));
        homeScene.children.bringToTop(dot);
        homeScene.tweens.add({
            targets:  img,
            y:        getBaseY(i),
            x:        getBaseX(i),
            scaleX:   scale,
            scaleY:   scale,
            duration: 180,
            ease:     'Cubic.Out',
        });
    }

    function updateCrop(i, direction) {
        if (animating) return;
        animating = true;

        const { img, src, rotH, scale } = images[i];
        const rot      = rotations[i];
        const cropY    = rot * rotH + topCrop[i][rot];
        const cropH    = getCropH(i, rot);
        const targetY  = getBaseY(i) + hoverOffset;
        const targetX  = getBaseX(i) - 10;
        const slideAmt = cropH * scale;

        img.setCrop(0, cropY, src.width, cropH);

        const fromY = direction > 0
            ? targetY + slideAmt
            : targetY - slideAmt;

        img.setY(fromY);
        img.setX(targetX);

        homeScene.tweens.add({
            targets:  img,
            y:        targetY,
            duration: 80,
            ease:     'Cubic.Out',
            onComplete: () => { animating = false; },
        });
    }

    const keyW = this.input.keyboard.addKey('W');
    const keyS = this.input.keyboard.addKey('S');
    const keyA = this.input.keyboard.addKey('A');
    const keyD = this.input.keyboard.addKey('D');
    const keyF = this.input.keyboard.addKey('F');

    keyF.on('down', function() {
        if (selected === -1) {
            selected = activeBlock;
            hoverBlock(selected);
        } else {
            unhoverBlock(selected);
            selected = -1;
        }
    });

    keyW.on('down', function() {
        if (selected === -1) return;
        rotations[selected] = (rotations[selected] + 1) % 4;
        updateCrop(selected, 1);
    });

    keyS.on('down', function() {
        if (selected === -1) return;
        rotations[selected] = (rotations[selected] - 1 + 4) % 4;
        updateCrop(selected, -1);
    });

    keyA.on('down', function() {
        if (selected !== -1) return;
        activeBlock = (activeBlock - 1 + 4) % 4;
        updateIndicator();
    });

    keyD.on('down', function() {
        if (selected !== -1) return;
        activeBlock = (activeBlock + 1) % 4;
        updateIndicator();
    });
};

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    scene: [homeScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
};

const game = new Phaser.Game(config);