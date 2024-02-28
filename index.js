const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576
const scaledCanvas = {
    width: canvas.width / 2,
    height: canvas.height / 2
}

const floorCollisions2d = []
for (let i = 0; i < floorCollisions.length; i += 36) {
    floorCollisions2d.push(floorCollisions.slice(i, i + 36))
}

const collisionBlocks = []
floorCollisions2d.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 2576) {
            collisionBlocks.push(new CollisionBlock({
                position: {
                    x: x * 16,
                    y: y * 16
                }
            }))
        }
    }
    )
})

const platformCollisions2d = []
for (let i = 0; i < platformCollisions.length; i += 36) {
    platformCollisions2d.push(platformCollisions.slice(i, i + 36))
}

const platformCollisionBlocks = []
platformCollisions2d.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 2576) {
            platformCollisionBlocks.push(new CollisionBlock({
                position: {
                    x: x * 16,
                    y: y * 16
                },
                height: 4
            }))
        }
    }
    )
})

const gravity = 0.1




const player = new Player({
    position: { x: 0, y: 0 },
    collisionBlocks: collisionBlocks,
    platformCollisionBlocks: platformCollisionBlocks,
    imageSrc: './img/wizard/Idle.png',
    frameRate: 6,
    animations: {
        Idle: {
            imageSrc: './img/wizard/Idle.png',
            frameRate: 6,
            frameBuffer: 3
        },
        IdleLeft: {
            imageSrc: './img/wizard/Idle-left.png',
            frameRate: 6,
            frameBuffer: 3
        },
        Run: {
            imageSrc: './img/wizard/Run.png',
            frameRate: 8,
            frameBuffer: 7
        },
        RunLeft: {
            imageSrc: './img/wizard/Run-left.png',
            frameRate: 8,
            frameBuffer: 7
        },
        Jump: {
            imageSrc: './img/wizard/Jump.png',
            frameRate: 2,
            frameBuffer: 3
        },
        JumpLeft: {
            imageSrc: './img/wizard/Jump-left.png',
            frameRate: 2,
            frameBuffer: 3
        },
        Fall: {
            imageSrc: './img/wizard/Fall.png',
            frameRate: 2,
            frameBuffer: 3
        },
        FallLeft: {
            imageSrc: './img/wizard/Fall-left.png',
            frameRate: 2,
            frameBuffer: 3
        }
    }
})
const keys = {
    d: {
        pressed: false
    },
    a: {
        pressed: false
    }
}

const background = new Sprite({ position: { x: 0, y: 0 }, imageSrc: './img/legacy.png' })

const backgroundImageHeight = 432
const camera = {
    position: {
        x: 0,
        y: -backgroundImageHeight + scaledCanvas.height
    }
}
function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)
    c.save()
    c.scale(2, 2)
    c.translate(camera.position.x, camera.position.y)
    background.update()


    player.checkForHorizontalCanvasCollision()
    player.update()

    player.velocity.x = 0
    if (keys.d.pressed) {
        player.switchSprite('Run')
        player.velocity.x = 2
        player.lastDirection = 'right'
        player.shouldPanCameraToTheLeft({ canvas, camera })
    }
    else if (keys.a.pressed) {
        player.switchSprite('RunLeft')
        player.velocity.x = -2
        player.lastDirection = 'left'
        player.shouldPanCameraToTheRight({ canvas, camera })
    } else if (player.velocity.y === 0) {
        if (player.lastDirection === 'right') player.switchSprite('Idle')
        else player.switchSprite('IdleLeft')
    }
    if (player.velocity.y < 0) {
        player.shouldPanCameraDown({ camera, canvas })
        if (player.lastDirection === 'right') player.switchSprite('Jump')
        else player.switchSprite('JumpLeft')
    }
    else if (player.velocity.y > 0) {
        player.shouldPanCameraUp({ canvas, camera })
        if (player.lastDirection === 'right') player.switchSprite('Fall')
        else player.switchSprite('FallLeft')
    }
    c.restore()

}
animate()



window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'd':
            keys.d.pressed = true
            break
        case 'a':
            keys.a.pressed = true
            break
        case 'w':
            player.velocity.y = -4
            break
    }
})
window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }
})