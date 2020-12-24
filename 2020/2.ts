import { read as readFile} from './utilityBelt';

function countLetter(text: string, letter: string): number {
  return text.split('').reduce((sum, c) => c === letter ? sum + 1 : sum, 0)
}

interface DbRow {
  letter: string
  min: number
  max: number
  password: string
}


const pattern = /^(\d+)\-(\d+) ([A-Za-z]): (\w+)$/

async function readDbRows(): Promise<DbRow[]> {
  const text = await readFile('./2.txt');
  const rows = text.split('\n');
  return rows.map((row): DbRow => {
    const match = pattern.exec(row)!;

    return {
      letter: match[3],
      min: Number.parseInt(match[1], 10),
      max: Number.parseInt(match[2], 10),
      password: match[4],
    }
  })
}

function matchesPolicy1(row: DbRow): boolean {
  const hits = countLetter(row.password, row.letter)
  return hits >= row.min && hits <= row.max
}

function matchesPolicy2(row: DbRow): boolean {
  return (row.password[row.min - 1] === row.letter)
    !== (row.password[row.max - 1] === row.letter)
}

async function main() {
  const rows = await readDbRows();
  const valid = rows.filter(matchesPolicy2);
  console.log(valid.length)
}

main()
