import { read } from '@core/utilityBelt';

type Direction = 'N' | 'E' | 'S' | 'W';
type Coordinates = [number, number];
type Turn = 'L' | 'R';
type Command = Direction | Turn | 'F';

const orderedDirections: Direction[] = ['E', 'S', 'W', 'N'];

class Ship {
  private facing: Direction = 'E';
  private readonly position: Coordinates = [0, 0];
  private waypointPosition: Coordinates = [10, 1];

  public get manhattanDistance(): number {
    return Math.abs(this.position[0]) + Math.abs(this.position[1]);
  }

  public steer(command: Command, amount: number) {
    if (command === 'F') {
      this.move(this.facing, amount);
    } else if (['L', 'R'].includes(command)) {
      this.turn(command as Turn, amount);
    } else {
      this.move(command as Direction, amount);
    }
  }

  public steerWithWaypoint(command: Command, amount: number) {
    if (command === 'F') {
      this.position[0] += amount * this.waypointPosition[0]
      this.position[1] += amount * this.waypointPosition[1]
    } else if (['L', 'R'].includes(command)) {
      this.rotateWaypoint(command as Turn, amount);
    } else {
      this.moveWaypoint(command as Direction, amount);
    }
  }

  private move(direction: Direction, steps: number) {
    if (direction === 'N') {
      this.position[1] += steps;
    } else if (direction === 'E') {
      this.position[0] += steps;
    } else if (direction === 'S') {
      this.position[1] -= steps;
    } else {
      this.position[0] -= steps;
    }
  }

  private moveWaypoint(direction: Direction, steps: number) {
    if (direction === 'N') {
      this.waypointPosition[1] += steps;
    } else if (direction === 'E') {
      this.waypointPosition[0] += steps;
    } else if (direction === 'S') {
      this.waypointPosition[1] -= steps;
    } else {
      this.waypointPosition[0] -= steps;
    }
  }

  private turn(direction: Turn, degrees: number): void {
    const ticks = Math.floor(degrees / 90);
    const currentFacing = orderedDirections.findIndex((d) => d === this.facing);

    if (direction === 'R') {
      this.facing = orderedDirections[(currentFacing + ticks) % orderedDirections.length];
    } else {
      this.facing = orderedDirections[(currentFacing - ticks + orderedDirections.length) % orderedDirections.length];
    }
  }

  private rotateWaypoint(direction: Turn, degrees: number): void {
    const ticks = Math.floor(degrees / 90);

    for (let i = 0; i < ticks; i++) {
      const [oldX, oldY] = this.waypointPosition;

      if (direction === 'R') {
        this.waypointPosition = [oldY, -oldX];
      } else {
        this.waypointPosition = [-oldY, oldX];
      }
    }
  }
}

async function main1() {
  const commands: [Command, number][] = await read('./12.txt').then((text) => {
    return text.split('\n').map((line) => {
      const cmd: Command = line.charAt(0) as Command;
      const amount = parseInt(line.slice(1), 10);

      return [cmd, amount];
    });
  });
  const ship = new Ship();

  for (const [command, amount] of commands) {
    ship.steer(command, amount);
  }

  console.log(ship);
  console.log(ship.manhattanDistance);
}

async function main2() {
  const commands: [Command, number][] = await read('./12.txt').then((text) => {
    return text.split('\n').map((line) => {
      const cmd: Command = line.charAt(0) as Command;
      const amount = parseInt(line.slice(1), 10);

      return [cmd, amount];
    });
  });
  const ship = new Ship();

  for (const [command, amount] of commands) {
    ship.steerWithWaypoint(command, amount);
  }

  console.log(ship);
  console.log(ship.manhattanDistance);
}

main2();