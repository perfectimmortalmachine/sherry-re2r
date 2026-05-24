let homeScene = new Phaser.Scene('home');

homeScene.preload = function() {
    this.load.image('bkg', 'assets/bkgfull.png');
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
    const scaleX = W / bkg.width;
    const scaleY = H / bkg.height;
    bkg.setScale(Math.max(scaleX, scaleY));

    // Title
    this.add.text(W / 2, 60, 'Resident Evil 2 Block Puzzle', {
        fontFamily: 'Georgia, serif',
        fontSize: '38px',
        fill: '#c8b97a',
        stroke: '#000000',
        strokeThickness: 8,
    }).setOrigin(0.5);

    // Layout
    const keys   = ['b0', 'b1', 'b2', 'b3'];
    const blockW = 220;
    const gap    = -40;
    const totalW = blockW * 4 + gap * 3;
    const startX = (W - totalW) / 2;
    const blockY = 241;

    const offsets = [
        { x: 18, y: -3 },  // block 0
        { x: 8, y: -8 },  // block 1
        { x: -35, y: -1.5 },  // block 2
        { x: -36, y: -2 },  // block 3
    ];

    keys.forEach((key, i) => {
        const src  = this.textures.get(key).getSourceImage();
        const rotH = src.height / 4;
        const scale = blockW / src.width;
        const cropH = i === 0 ? rotH - 18 : rotH;

        this.add.image(startX + i * (blockW + gap) + offsets[i].x, blockY + offsets[i].y, key)
            .setOrigin(0, 0)
            .setScale(scale)
            .setCrop(0, 0, src.width, cropH - 15);
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