/// - Start Scene - ///
let startScene = new Phaser.Scene('start');

startScene.preload = function() {
    this.load.image('bkg',      'assets/fullbackground.png');
    this.load.image('menubkg',  'assets/bedroom.png');
    this.load.image('b0',       'assets/block0-dialSheet.png');
    this.load.image('b1',       'assets/block1-dialSheet.png');
    this.load.image('b2',       'assets/block2-dialSheet.png');
    this.load.image('b3',       'assets/block3-dialSheet.png');
    this.load.image('scissors', 'assets/scissors.png');
    this.load.audio('up',       'assets/audio/sherry-up.wav');
    this.load.audio('rotate',   'assets/audio/sherry-rotate.wav');
    this.load.audio('down',     'assets/audio/sherry-down.wav');
};

startScene.create = function() {
    const W = this.sys.game.canvas.width;
    const H = this.sys.game.canvas.height;

    const menubkg = this.add.image(W / 2, H / 2, 'menubkg');
    const scaleX  = W / menubkg.width;
    const scaleY  = H / menubkg.height;
    menubkg.setScale(Math.max(scaleX, scaleY));

    this.add.text(W / 2, H / 2 - 80, 'Resident Evil 2', {
        fontFamily: 'Cascadia Code, serif',
        fontSize: '48px',
        fill: '#ff0000',
        stroke: '#000000',
        strokeThickness: 10,
    }).setOrigin(0.5);

    this.add.text(W / 2, H / 2 - 20, 'Sherry Block Puzzle', {
        fontFamily: 'Cascadia Code, serif',
        fontSize: '36px',
        fill: '#cccccc',
        stroke: '#000000',
        strokeThickness: 8,
    }).setOrigin(0.5);

    this.add.text(W / 2, H / 2 - 300,
        'Note: the game starts from the point AFTER\n' +
        'inserting the doll block and shifting\n' +
        'the first block to slot 3 (array_index[2])', {
        fontFamily: 'Cascadia Code, serif',
        fontSize: '18px',
        fill: '#d8d9cb',
        stroke: '#000000',
        strokeThickness: 8,
        align: 'center',
    }).setOrigin(0.5);

    this.add.text(W / 2, H / 2 + 30, 'by Palm', {
        fontFamily: 'Cascadia Code, serif',
        fontSize: '18px',
        fill: '#e4dddd',
    }).setOrigin(0.5);

    this.add.text(W / 2, H / 2 + 50, 'speedrun.com/palm', {
        fontFamily: 'Cascadia Code, serif',
        fontSize: '18px',
        fill: '#e4dddd',
    }).setOrigin(0.5);

    this.add.text(W / 2, H / 2 + 70, 'github.com/perfectimmortalmachine', {
        fontFamily: 'Cascadia Code, serif',
        fontSize: '18px',
        fill: '#e4dddd',
    }).setOrigin(0.5);

    const pb = localStorage.getItem('re2BlockPB');
    if (pb) {
        this.add.text(W / 2, H / 2 + 120, `PB: ${pb}s`, {
            fontFamily: 'Cascadia Code, serif',
            fontSize: '16px',
            fill: '#7a9a5a',
        }).setOrigin(0.5);
    }

    const btn = this.add.text(W / 2, H / 2 + 180, '[ START (Press Enter) ]', {
        fontFamily: 'Cascadia Code, serif',
        fontSize: '28px',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6,
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.time.addEvent({
        delay: 600, loop: true,
        callback: () => btn.setVisible(!btn.visible),
    });

    const launch = () => {
        if (this.sound.context.state === 'suspended') {
            this.sound.context.resume();
        }
        this.cameras.main.fadeOut(600, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('home');
        });
    };

    btn.on('pointerdown', launch);
    this.input.keyboard.on('keydown-ENTER', launch);
};

/// - Home Scene - ///
let homeScene = new Phaser.Scene('home');

homeScene.create = function() {
    const W = this.sys.game.canvas.width;
    const H = this.sys.game.canvas.height;

    const bkg = this.add.image(W / 2, H / 2, 'bkg').setVisible(false).setDepth(0);
    bkg.setOrigin(0.5, 0.5);
    const scaleX = W / bkg.width;
    const scaleY = H / bkg.height;
    bkg.setScale(Math.max(scaleX, scaleY));

    const title = this.add.text(W / 1.28, 660, 'Resident Evil 2 Sherry Block Puzzle', {
        fontFamily: 'Cascadia Code, serif',
        fontSize: '26px',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
    }).setOrigin(0.5).setVisible(false).setDepth(10);

    const byPalm = this.add.text(W / 1.2, 700, 'by Palm (speedrun.com/palm)', {
        fontFamily: 'Cascadia Code, serif',
        fontSize: '26px',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
    }).setOrigin(0.5).setVisible(false).setDepth(10);

    const instructions = this.add.text(W / 5.8, 700, 'Press "R" to reset anytime', {
        fontFamily: 'Cascadia Code, serif',
        fontSize: '26px',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
    }).setOrigin(0.5).setVisible(false).setDepth(10);

    const instructions2 = this.add.text(W / 6.45, 660, 'Press "Q" for main menu', {
        fontFamily: 'Cascadia Code, serif',
        fontSize: '26px',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
    }).setOrigin(0.5).setVisible(false).setDepth(10);

    const instructions3 = this.add.text(W / 7, 620, 'Press "P" to clear PB', {
        fontFamily: 'Cascadia Code, serif',
        fontSize: '26px',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
    }).setOrigin(0.5).setVisible(false).setDepth(10);

    const keys   = ['b0', 'b1', 'b2', 'b3'];
    const blockW = 300;
    const gap    = -40;
    const totalW = blockW * 4 + gap * 3;
    const startX = (W - totalW) / 2;
    const blockY = 220;
    const hoverOffset = -200;

    const TINT_SOLVED   = 0xe8e8e8;
    const TINT_UNSOLVED = 0xc7c7c7;

    // U->D B0->B3
    const offsets = [
        [ { x: 61,  y: 8   }, { x: 61,  y: 8   }, { x: 61,  y: 8   }, { x: 61,  y: 2   } ],
        [ { x: 28,  y: -2  }, { x: 32,  y: -2  }, { x: 34,  y: -2  }, { x: 37,  y: 6   } ],
        [ { x: -44, y: 8   }, { x: -44, y: 6.7 }, { x: -44, y: 0   }, { x: -40, y: 8   } ],
        [ { x: -63, y: 6   }, { x: -63, y: 6   }, { x: -63, y: 6   }, { x: -63, y: 15  } ],
    ];

    // U->D B0->B3
    const bottomCrop = [
        [ 26, 26, 26,  26 ],
        [ 16, 16, 16,  16 ],
        [ 15,  3,  1, -50 ],
        [ 15, 15, 15,   0 ],
    ];

    // U->D B0->B3
    const topCrop = [
        [  0,  0,  0,  0 ],
        [  0,  0,  0,  0 ],
        [  0, 10,  0, 10 ],
        [  0,  0,  0, 20 ],
    ];

    const rotations = (() => {
        const rots = [0, 1, 2, 3].map(() => Phaser.Math.Between(0, 3));
        if (rots.every(r => r === 0)) {
            rots[Phaser.Math.Between(0, 3)] = Phaser.Math.Between(1, 3);
        }
        return rots;
    })();

    const images = [];

    const blockCentres = keys.map((key, i) =>
        startX + i * (blockW + gap) + offsets[i][0].x + blockW / 2
    );

    // Cropping bcos bajej photoshop
    keys.forEach((key, i) => {
        const src   = this.textures.get(key).getSourceImage();
        const rotH  = src.height / 4;
        const scale = blockW / src.width;
        const rot   = rotations[i];
        const cropH = rotH - bottomCrop[i][rot] - topCrop[i][rot];
        const cropY = rot * rotH + topCrop[i][rot];

        const initX = startX + i * (blockW + gap) + offsets[i][rot].x;
        const initY = blockY + offsets[i][rot].y - cropY * scale;

        const img = this.add.image(initX, initY, key)
            .setOrigin(0, 0)
            .setScale(scale)
            .setCrop(0, cropY, src.width, cropH)
            .setVisible(false)
            .setDepth(10)
            .setTint(rot === 0 ? TINT_SOLVED : TINT_UNSOLVED);

        images.push({ img, src, rotH, scale });
    });

    let activeBlock  = 2;
    let selected     = -1;
    let animating    = false;
    let gameWon      = false;
    let glowTween    = null;
    let glowT        = 0;

    this.time.addEvent({
        delay: 16, loop: true,
        callback: () => {
            if (gameWon || selected !== -1) return;
            glowT += 0.05
            ;
            const t   = (Math.sin(glowT) + 1) / 2;   
            const rot = rotations[activeBlock];
            const base = rot === 0 ? 0xe8 : 0xc7;
            const hi   = 0xff;
            const v    = Math.round(base + (hi - base) * t * 0.95);
            const hex  = (v << 16) | (v << 8) | v;
            images[activeBlock].img.setTint(hex);
        },
    });

    let elapsedMs    = 0;
    let timerRunning = false;

    const timerText = this.add.text(20, 20, '0.000', {
        fontFamily: 'Cascadia Code',
        fontSize: '22px',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
    }).setVisible(false).setDepth(10);

    // save pb local
    const pbValue = localStorage.getItem('re2BlockPB');
    const pbText  = this.add.text(20, 50, pbValue ? `PB: ${pbValue}s` : 'PB: —', {
        fontFamily: 'Cascadia Code',
        fontSize: '14px',
        fill: '#7a9a5a',
        stroke: '#000000',
        strokeThickness: 3,
    }).setVisible(false).setDepth(10);

    this.time.addEvent({
        delay: 16, loop: true,
        callback: () => {
            if (!timerRunning) return;
            elapsedMs += 16;
            timerText.setText((elapsedMs / 1000).toFixed(3));
        },
    });

    const overlay   = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0).setDepth(50);
    const winBox    = this.add.rectangle(W / 2, 80, 700, 100, 0x0e120e).setDepth(51).setVisible(false);
    const winBorder = this.add.graphics().setDepth(52);

    const winTitle = this.add.text(W / 2, 40, '✦  Puzzle Complete!  ✦', {
        fontFamily: 'Cascadia Code, serif',
        fontSize: '22px',
        fill: '#a89a60',
        stroke: '#000000',
        strokeThickness: 6,
    }).setOrigin(0.5).setDepth(53).setVisible(false);

    const winTime = this.add.text(W / 2, 75, '', {
        fontFamily: 'Cascadia Code, serif',
        fontSize: '18px',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
    }).setOrigin(0.5).setDepth(53).setVisible(false);

    const winPB = this.add.text(W / 2, 105, '', {
        fontFamily: 'Cascadia Code, serif',
        fontSize: '16px',
        fill: '#7a9a5a',
        stroke: '#000000',
        strokeThickness: 3,
    }).setOrigin(0.5).setDepth(53).setVisible(false);

    const winPrompt = this.add.image(400, 90, 'scissors')
        .setOrigin(0.5)
        .setDepth(53)
        .setVisible(false)
        .setScale(0.3);

    const winPrompt2 = this.add.image(850, 90, 'scissors')
        .setOrigin(0.5)
        .setDepth(53)
        .setVisible(false)
        .setScale(0.3);

    function checkWin() {
        if (gameWon) return;
        if (!rotations.every(r => r === 0)) return;

        gameWon      = true;
        timerRunning = false;

        const finalTime = (elapsedMs / 1000).toFixed(3);
        timerText.setText(finalTime);

        const prevPB = localStorage.getItem('re2BlockPB');
        let pbMsg    = '';

        if (!prevPB || parseFloat(finalTime) < parseFloat(prevPB)) {
            localStorage.setItem('re2BlockPB', finalTime);
            if (prevPB) {
                const diff = (parseFloat(prevPB) - parseFloat(finalTime)).toFixed(3);
                pbMsg = `NEW PB! (${diff}s faster)`;
            } else {
                pbMsg = 'First clear — PB set!';
            }
            pbText.setText(`PB: ${finalTime}s`).setFill('#64c864');
            winPB.setFill('#64c864');
        } else {
            pbMsg = `PB: ${prevPB}s`;
            winPB.setFill('#7a9a5a');
        }

        this.tweens.add({
            targets:   overlay,
            fillAlpha: 0.7,
            duration:  400,
            ease:      'Cubic.Out',
            onComplete: () => {
                winBox.setVisible(true);
                winBorder.lineStyle(2, 0xa89a60, 1);
                winBorder.strokeRect(W / 2 - 352, 22, 704, 130);
                winTitle.setVisible(true);
                winTime.setText(`Time: ${finalTime}s`).setVisible(true);
                winPB.setText(pbMsg).setVisible(true);
                winPrompt.setVisible(true);
                winPrompt2.setVisible(true);
            },
        });
    }

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
        const rot = rotations[activeBlock];
        images[activeBlock].img.setTint(rot === 0 ? TINT_SOLVED : TINT_UNSOLVED);
        glowT = 0;
    }

    function hoverBlock(i) {
        const { img, scale } = images[i];
        animating = false;
        homeScene.tweens.killTweensOf(img);
        homeScene.children.bringToTop(img);
        homeScene.tweens.add({
            targets:  img,
            y:        getBaseY(i) + hoverOffset,
            x:        getBaseX(i) - 10,
            scaleX:   scale * 1.06,
            scaleY:   scale * 1.06,
            duration: 200,
            ease:     'Cubic.Out',
        });
    }

    function unhoverBlock(i) {
        const { img, scale } = images[i];
        animating = false;
        homeScene.tweens.killTweensOf(img);

        const { src, rotH } = images[i];
        const rot   = rotations[i];
        const cropY = rot * rotH + topCrop[i][rot];
        const cropH = getCropH(i, rot);
        img.setCrop(0, cropY, src.width, cropH);
        img.setTint(rot === 0 ? TINT_SOLVED : TINT_UNSOLVED);

        images.forEach(entry => homeScene.children.bringToTop(entry.img));
        homeScene.tweens.add({
            targets:  img,
            y:        getBaseY(i),
            x:        getBaseX(i),
            scaleX:   scale,
            scaleY:   scale,
            duration: 200,
            ease:     'Cubic.Out',
            onComplete: () => {
                checkWin.call(homeScene);
            },
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

        homeScene.tweens.killTweensOf(img);
        img.setCrop(0, cropY, src.width, cropH);
        img.setTint(rot === 0 ? TINT_SOLVED : TINT_UNSOLVED);

        const fromY = direction > 0
            ? targetY + slideAmt
            : targetY - slideAmt;

        img.setY(fromY);
        img.setX(targetX);

        homeScene.tweens.add({
            targets:  img,
            y:        targetY,
            duration: 110,
            ease:     'Cubic.Out',
            onComplete: () => { animating = false; },
        });
    }

    const keyW = this.input.keyboard.addKey('W');
    const keyS = this.input.keyboard.addKey('S');
    const keyA = this.input.keyboard.addKey('A');
    const keyD = this.input.keyboard.addKey('D');
    const keyF = this.input.keyboard.addKey('F');
    const keyE = this.input.keyboard.addKey('E');

    keyF.on('down', function() {
        if (gameWon) return;
        if (selected === -1) {
            homeScene.sound.play('up', { volume: 0.6 });
            selected = activeBlock;
            hoverBlock(selected);
        } else {
            homeScene.sound.play('down', { volume: 0.6 });
            unhoverBlock(selected);
            selected = -1;
        }
    });

    keyE.on('down', function() {
        if (gameWon) return;
        if (selected === -1) {
            homeScene.sound.play('up', { volume: 0.6 });
            selected = activeBlock;
            hoverBlock(selected);
        } else {
            homeScene.sound.play('down', { volume: 0.6 });
            unhoverBlock(selected);
            selected = -1;
        }
    });

    keyW.on('down', function() {
        if (gameWon || selected === -1) return;
        homeScene.sound.play('rotate', { volume: 0.6 });
        rotations[selected] = (rotations[selected] + 1) % 4;
        updateCrop(selected, 1);
    });

    keyS.on('down', function() {
        if (gameWon || selected === -1) return;
        homeScene.sound.play('rotate', { volume: 0.6 });
        rotations[selected] = (rotations[selected] - 1 + 4) % 4;
        updateCrop(selected, -1);
    });

    keyA.on('down', function() {
        if (gameWon || selected !== -1) return;
        const rot = rotations[activeBlock];
        images[activeBlock].img.setTint(rot === 0 ? TINT_SOLVED : TINT_UNSOLVED);
        activeBlock = (activeBlock - 1 + 4) % 4;
        glowT = 0;
        updateIndicator();
    });

    keyD.on('down', function() {
        if (gameWon || selected !== -1) return;
        const rot = rotations[activeBlock];
        images[activeBlock].img.setTint(rot === 0 ? TINT_SOLVED : TINT_UNSOLVED);
        activeBlock = (activeBlock + 1) % 4;
        glowT = 0;
        updateIndicator();
    });

    this.input.keyboard.on('keydown-R', () => {
        this.cameras.main.fadeOut(400, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('home');
        });
    });

    this.input.keyboard.on('keydown-Q', () => {
        this.cameras.main.fadeOut(400, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('start');
        });
    });

    this.input.keyboard.on('keydown-P', () => {
        localStorage.removeItem('re2BlockPB');
        pbText.setText('PB: —');
    });

    this.time.delayedCall(300, () => {
        bkg.setVisible(true);
        title.setVisible(true);
        byPalm.setVisible(true);
        instructions.setVisible(true);
        instructions2.setVisible(true);
        instructions3.setVisible(true);
        images.forEach(({ img }) => img.setVisible(true));
        timerText.setVisible(true);
        pbText.setVisible(true);
        this.cameras.main.fadeIn(600, 0, 0, 0);
        timerRunning = true;
    });
};

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    scene: [startScene, homeScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
};

const game = new Phaser.Game(config);