class Player extends Sprite {
    constructor({ position, collisionBlocks, platformCollisionBlocks, imageSrc, frameRate, scale = 1, animations }) {
        super({ imageSrc, frameRate, scale })
        this.position = position
        this.velocity = {
            x: 0,
            y: 1
        }

        this.collisionblocks = collisionBlocks
        this.platformCollisionblocks = platformCollisionBlocks
        this.hitbox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            width: 10,
            height: 10
        }
        this.animations = animations
        this.lastDirection = 'right'
        for (let key in this.animations) {
            const image = new Image()
            image.src = this.animations[key].imageSrc
            this.animations[key].image = image
        }
        this.camerabox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            width: 400,
            height: 160
        }
    }
    switchSprite(key) {
        if (this.image === this.animations[key].image || !this.loaded) return
        this.image = this.animations[key].image
        this.frameRate = this.animations[key].frameRate
        this.frameBuffer = this.animations[key].frameBuffer

    }
    updateCamerabox() {
        this.camerabox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            width: 200,
            height: 160
        }
    }
    checkForHorizontalCanvasCollision() {
        if (this.hitbox.position.x + this.hitbox.width + this.velocity.x >= 576 ||
            this.hitbox.position.x + this.velocity.x <= 0
        ) {
            this.velocity.x = 0
        }
    }
    shouldPanCameraToTheLeft({ canvas, camera }) {
        const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width
        const scaleDownCanvasWidth = canvas.width / 4

        if (cameraboxRightSide >= 320) return
        if (cameraboxRightSide >= scaleDownCanvasWidth + Math.abs(camera.position.x)) {
            camera.position.x -= this.velocity.x
        }
    }
    shouldPanCameraToTheRight({ canvas, camera }) {
        if (this.camerabox.position.x <= 0) return

        if (this.camerabox.position.x <= Math.abs(camera.position.x)) {
            camera.position.x -= this.velocity.x
        }
    }
    shouldPanCameraDown({ canvas, camera }) {
        if (this.camerabox.position.y + this.velocity.y <= 0) return

        if (this.camerabox.position.y <= Math.abs(camera.position.y)) {
            camera.position.y -= this.velocity.y
            console.log(camera.position.y)
        }
    }
    shouldPanCameraUp({ canvas, camera }) {
        if (this.camerabox.position.y + this.camerabox.height + this.velocity.y >= 280) return
        const scaledCanvasHeight = canvas.height / 4
        if (this.camerabox.position.y + this.camerabox.height >=
            Math.abs(camera.position.y) + scaledCanvasHeight) {
            camera.position.y -= this.velocity.y
        }
    }

    update() {
        console.log(this.position.y)

        this.updateFrames()
        this.updateHitbox()
        this.updateCamerabox()

        this.draw()
        this.position.x += this.velocity.x
        this.updateHitbox()
        this.checkForHorizontalCollisions()
        this.applyGravity()
        this.updateHitbox()
        this.checkForVerticalCollisions()
    }
    updateHitbox() {
        this.hitbox = {
            position: {
                x: this.position.x + 90,
                y: this.position.y + 60
            },
            width: 34,
            height: 80
        }
    }
    checkForHorizontalCollisions() {
        for (let i = 0; i < this.collisionblocks.length; i++) {
            const collisionBlock = this.collisionblocks[i]

            if (collision({
                object1: this.hitbox,
                object2: collisionBlock
            })) {
                if (this.velocity.x > 0) {
                    this.velocity.x = 0
                    const offset = this.hitbox.position.x - this.position.x + this.hitbox.width
                    this.position.x = collisionBlock.position.x - offset - 0.01
                    break
                }
                if (this.velocity.x < 0) {
                    this.velocity.x = 0
                    const offset = this.hitbox.position.x - this.position.x
                    this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01
                    break
                }
            }
        }
    }
    applyGravity() {
        this.velocity.y += gravity
        this.position.y += this.velocity.y
    }
    checkForVerticalCollisions() {
        for (let i = 0; i < this.collisionblocks.length; i++) {
            const collisionBlock = this.collisionblocks[i]

            if (collision({
                object1: this.hitbox,
                object2: collisionBlock
            })) {
                if (this.velocity.y > 0) {
                    this.velocity.y = 0
                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height
                    this.position.y = collisionBlock.position.y - offset - 0.01
                    break
                }
                if (this.velocity.y < 0) {
                    this.velocity.y = 0
                    const offset = this.hitbox.position.y - this.position.y
                    this.position.y = collisionBlock.position.y + collisionblock.height - offset + 0.01
                    break
                }
            }
            //Platform collision blocks
            for (let i = 0; i < this.platformCollisionblocks.length; i++) {
                const platformCollisionBlock = this.platformCollisionblocks[i]

                if (platfromCollision({
                    object1: this.hitbox,
                    object2: platformCollisionBlock
                })) {
                    if (this.velocity.y > 0) {
                        this.velocity.y = 0
                        const offset = this.hitbox.position.y - this.position.y + this.hitbox.height
                        this.position.y = platformCollisionBlock.position.y - offset - 0.01
                        break
                    }

                }
            }
        }
    }
}