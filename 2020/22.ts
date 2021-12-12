import '@core/polyfill';
import { read } from '@core/utilityBelt';

async function getCards(): Promise<[number[], number[]]> {
  const text = await read('./22.txt');
  return text.split('\n\n').map((parts) => parts.split('\n').slice(1).map((r) => r.toInt())) as [number[], number[]];
}

function playGame(decks: [number[], number[]]): [number[], number[]] {
  const p1Deck = [...decks[0]];
  const p2Deck = [...decks[1]];

  while (p1Deck.length > 0 && p2Deck.length > 0) {
    const p1Card = p1Deck.shift()!;
    const p2Card = p2Deck.shift()!;

    if (p1Card > p2Card) {
      p1Deck.push(p1Card, p2Card);
    } else {
      p2Deck.push(p2Card, p1Card);
    }
  }

  return [p1Deck, p2Deck];
}

function playRecursiveGame(decks: [number[], number[]]): [number[], number[]] {
  const p1Deck = [...decks[0]];
  const p2Deck = [...decks[1]];
  const seen = new Set<string>();

  while (p1Deck.length > 0 && p2Deck.length > 0) {
    const p1DeckSnapshot = p1Deck.join(',');
    if (seen.has(p1DeckSnapshot)) {
      return [p1Deck, []];
    }
    seen.add(p1DeckSnapshot);

    const p1Card = p1Deck.shift()!;
    const p2Card = p2Deck.shift()!;

    const player1Wins = (() => {
      if (p1Deck.length >= p1Card && p2Deck.length >= p2Card) {
        const p1RecursiveDeck = p1Deck.slice(0, p1Card);
        const p2RecursiveDeck = p2Deck.slice(0, p2Card);
        const recursiveResult = playRecursiveGame([p1RecursiveDeck, p2RecursiveDeck]);
        return recursiveResult[0].length > 0;
      } else {
        return p1Card > p2Card;
      }
    })();

    if (player1Wins) {
      p1Deck.push(p1Card, p2Card);
    } else {
      p2Deck.push(p2Card, p1Card);
    }
  }

  return [p1Deck, p2Deck];
}

async function main1() {
  const decks = await getCards();
  const endGame = playGame(decks);
  const winner = endGame.find((deck) => deck.length > 0)!;
  const cardScores = winner.map((c, i) => BigInt(c * (winner.length - i)));
  const score = cardScores.reduce((scoreSum, cardScore) => scoreSum + cardScore, BigInt(0));
  console.log(score.toString());
}

async function main2() {
  const decks = await getCards();
  const endGame = playRecursiveGame(decks);
  const winner = endGame.find((deck) => deck.length > 0)!;
  const cardScores = winner.map((c, i) => BigInt(c * (winner.length - i)));
  const score = cardScores.reduce((scoreSum, cardScore) => scoreSum + cardScore, BigInt(0));
  console.log(score.toString());
}

main2();
