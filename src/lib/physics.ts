import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d-compat'

// Scene constants (Three.js Y-up coordinates)
export const SCENE = {
  room: {
    xMin: -1, xMax: 1,
    yMin: 0, yMax: 4,
    zMin: -4, zMax: 0,
  },
  ramp: {
    frontZ: 0, frontY: 0.05,
    backZ: -4, backY: 1.5,
    get slope() { return (this.backY - this.frontY) / (this.backZ - this.frontZ) },
    get angle() { return Math.atan(-this.slope) },
  },
  backboard: {
    xMin: -0.6491, xMax: 0.6491,
    yMin: 2.4254, yMax: 2.9645,
    z: -2.5268,
    thickness: 0.04,
  },
  rim: {
    center: new THREE.Vector3(0, 2.2788, -2.2507),
    radius: 0.2419,
    tubeThickness: 0.02,
  },
  ball: {
    radius: 0.1367,
    spawnPositions: [
      new THREE.Vector3(-0.2735, 0.4127, -1.1233),
      new THREE.Vector3(0.0000, 0.4127, -1.1233),
      new THREE.Vector3(0.2735, 0.4127, -1.1233),
      new THREE.Vector3(-0.2735, 0.5118, -1.3967),
      new THREE.Vector3(0.0000, 0.5118, -1.3967),
      new THREE.Vector3(0.2735, 0.5118, -1.3967),
    ],
  },
}

export const GRAVITY = 9.81

export async function initPhysics() {
  await RAPIER.init()
  const world = new RAPIER.World({ x: 0, y: -GRAVITY, z: 0 })
  buildEnvironment(world)
  return world
}

function buildEnvironment(world: RAPIER.World) {
  const { room, ramp, backboard, rim } = SCENE

  // Angled ramp floor
  const rampLength = Math.sqrt(
    Math.pow(ramp.backZ - ramp.frontZ, 2) + Math.pow(ramp.backY - ramp.frontY, 2)
  )
  const rampBody = world.createRigidBody(
    RAPIER.RigidBodyDesc.fixed()
      .setTranslation(0, (ramp.frontY + ramp.backY) / 2, (ramp.frontZ + ramp.backZ) / 2)
      .setRotation(eulerToQuat(-ramp.angle, 0, 0))
  )
  world.createCollider(
    RAPIER.ColliderDesc.cuboid(1.0, 0.05, rampLength / 2)
      .setFriction(0.4)
      .setRestitution(0.3),
    rampBody
  )

  // Walls
  const wallThick = 0.1
  const roomH = room.yMax - room.yMin
  const roomD = room.zMax - room.zMin

  addBox(world, -1 - wallThick / 2, roomH / 2, (room.zMin + room.zMax) / 2, wallThick / 2, roomH / 2, roomD / 2, 0.5)
  addBox(world, 1 + wallThick / 2, roomH / 2, (room.zMin + room.zMax) / 2, wallThick / 2, roomH / 2, roomD / 2, 0.5)
  addBox(world, 0, roomH / 2, room.zMin - wallThick / 2, 1.0, roomH / 2, wallThick / 2, 0.5)
  addBox(world, 0, room.yMax + wallThick / 2, (room.zMin + room.zMax) / 2, 1.0, wallThick / 2, roomD / 2, 0.3)

  // Backboard
  const bbW = (backboard.xMax - backboard.xMin) / 2
  const bbH = (backboard.yMax - backboard.yMin) / 2
  addBox(
    world,
    0,
    (backboard.yMin + backboard.yMax) / 2,
    backboard.z - backboard.thickness / 2,
    bbW,
    bbH,
    backboard.thickness / 2,
    0.55
  )

  // Rim (ring built from spheres)
  const rimBody = world.createRigidBody(RAPIER.RigidBodyDesc.fixed())
  const rimSegments = 16
  for (let i = 0; i < rimSegments; i++) {
    const theta = (i / rimSegments) * Math.PI * 2
    const x = rim.center.x + Math.cos(theta) * rim.radius
    const z = rim.center.z + Math.sin(theta) * rim.radius
    const y = rim.center.y
    world.createCollider(
      RAPIER.ColliderDesc.ball(rim.tubeThickness)
        .setTranslation(x, y, z)
        .setRestitution(0.55)
        .setFriction(0.3),
      rimBody
    )
  }
}

function addBox(
  world: RAPIER.World,
  x: number,
  y: number,
  z: number,
  hx: number,
  hy: number,
  hz: number,
  restitution = 0.5
) {
  const body = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(x, y, z))
  world.createCollider(
    RAPIER.ColliderDesc.cuboid(hx, hy, hz).setRestitution(restitution).setFriction(0.5),
    body
  )
}

function eulerToQuat(x: number, y: number, z: number) {
  const q = new THREE.Quaternion()
  q.setFromEuler(new THREE.Euler(x, y, z))
  return { x: q.x, y: q.y, z: q.z, w: q.w }
}

export class Ball {
  mesh: THREE.Mesh
  body: RAPIER.RigidBody
  spawnPos: THREE.Vector3
  state: 'READY' | 'FLYING' | 'ROLLING'
  settleFrames: number

  constructor(world: RAPIER.World, mesh: THREE.Mesh, spawnPos: THREE.Vector3) {
    this.mesh = mesh
    this.spawnPos = spawnPos.clone()
    this.state = 'READY'
    this.settleFrames = 0

    const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(spawnPos.x, spawnPos.y, spawnPos.z)
      .setLinearDamping(0.15)
      .setAngularDamping(0.3)
      .setCcdEnabled(true)

    this.body = world.createRigidBody(bodyDesc)

    const colDesc = RAPIER.ColliderDesc.ball(SCENE.ball.radius)
      .setRestitution(0.65)
      .setFriction(0.4)
      .setDensity(0.6)

    world.createCollider(colDesc, this.body)
  }

  update() {
    const t = this.body.translation()
    const r = this.body.rotation()
    this.mesh.position.set(t.x, t.y, t.z)
    this.mesh.quaternion.set(r.x, r.y, r.z, r.w)

    const vel = this.body.linvel()
    const speed = Math.hypot(vel.x, vel.y, vel.z)

    if (this.state === 'FLYING' && t.y < 0.8 && speed < 2.0) {
      this.state = 'ROLLING'
    }

    if (this.state === 'ROLLING') {
      if (speed < 0.15) {
        this.settleFrames++
        if (this.settleFrames > 45) {
          this.state = 'READY'
          this.settleFrames = 0
        }
      } else {
        this.settleFrames = 0
      }
    }

    if (t.z > 0.2 || t.y < -0.5) {
      this.body.setLinvel({ x: 0, y: 0, z: 0 }, true)
      this.body.setAngvel({ x: 0, y: 0, z: 0 }, true)
      this.body.setTranslation(this.spawnPos, true)
      this.state = 'READY'
    }
  }

  shoot(velocity: { x: number; y: number; z: number }) {
    this.body.setLinvel(velocity, true)
    this.state = 'FLYING'
  }
}

export function computeShotVelocity(fromPos: { x: number; y: number; z: number }, apexAboveRim = 0.6) {
  const rim = SCENE.rim.center
  const dx = rim.x - fromPos.x
  const dy = rim.y - fromPos.y
  const dz = rim.z - fromPos.z

  const peakAboveStart = dy + apexAboveRim
  const vy = Math.sqrt(2 * GRAVITY * peakAboveStart)

  const tAscent = vy / GRAVITY
  const tDescent = Math.sqrt((2 * apexAboveRim) / GRAVITY)
  const tof = tAscent + tDescent

  return {
    x: dx / tof,
    y: vy,
    z: dz / tof,
  }
}

export const SHOT_METER = {
  MAX_HOLD: 1.2,
  PERFECT_HOLD: 0.85,
  TOLERANCE: 0.06,
}

export function holdToPower(holdDuration: number) {
  const normalized = Math.min(holdDuration / SHOT_METER.MAX_HOLD, 1.0)
  return 0.65 + normalized * 0.55
}

export function isPerfect(holdDuration: number) {
  return Math.abs(holdDuration - SHOT_METER.PERFECT_HOLD) < SHOT_METER.TOLERANCE
}

export function createScoreDetector(onScore: (ball: Ball) => void) {
  const rim = SCENE.rim
  const ballPrevY = new Map<Ball, number>()

  return function checkScore(balls: Ball[]) {
    for (const ball of balls) {
      const t = ball.body.translation()
      const prevY = ballPrevY.get(ball) ?? t.y

      if (prevY > rim.center.y && t.y <= rim.center.y && ball.state === 'FLYING') {
        const dx = t.x - rim.center.x
        const dz = t.z - rim.center.z
        const distXZ = Math.hypot(dx, dz)
        if (distXZ < rim.radius - 0.05) {
          onScore(ball)
        }
      }

      ballPrevY.set(ball, t.y)
    }
  }
}
