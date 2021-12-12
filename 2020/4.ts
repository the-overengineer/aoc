import { read, count, Validate } from '@core/utilityBelt';

function parsePassports(text: string) {
  return text.split('\n\n').map((chunk) => {
    return chunk.split('\n').join(' ').split(' ').map((pair) => {
      return pair.trim().split(':')
    }).reduce((passport, [key, value]) => ({ ...passport, [key]: value }), {})
  })
}

async function getPassportDescriptors() {
  return parsePassports(await read('./4.txt'))
}

/*
byr (Birth Year)
iyr (Issue Year)
eyr (Expiration Year)
hgt (Height)
hcl (Hair Color)
ecl (Eye Color)
pid (Passport ID)
cid (Country ID)
*/

const requiredKeys = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']

function hasValidFields(passport: any): boolean {
  const keys = Object.keys(passport)
  return requiredKeys.every((k) => keys.includes(k))
}

/*
byr (Birth Year) - four digits; at least 1920 and at most 2002.
iyr (Issue Year) - four digits; at least 2010 and at most 2020.
eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
hgt (Height) - a number followed by either cm or in:
  If cm, the number must be at least 150 and at most 193.
  If in, the number must be at least 59 and at most 76.
hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
pid (Passport ID) - a nine-digit number, including leading zeroes.
cid (Country ID) - ignored, missing or not.
*/

function isValid(p: any): boolean {
  if (!hasValidFields(p)) {
    return false
  }

  if (!Validate.inRange(1920, 2002)(p.byr)) {
    return false
  }

  if (!Validate.inRange(2010, 2020)(p.iyr)) {
    return false
  }

  if (!Validate.inRange(2020, 2030)(p.eyr)) {
    return false
  }

  if (!Validate.match(/^\#[0-9a-fA-F]{6}$/)(p.hcl)) {
    return false
  }

  if (!Validate.oneOf(['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'])(p.ecl)) {
    return false
  }

  if (!Validate.match(/^\d{9}$/)(p.pid)) {
    return false
  }

  const heightPattern = /^(\d+)(in|cm)$/

  if (!Validate.match(heightPattern)(p.hgt)) {
    return false
  }

  const [_, height, unit] = heightPattern.exec(p.hgt)!

  return unit === 'in' ? Validate.inRange(59, 76)(height) : Validate.inRange(150, 193)(height)
}

async function main1() {
  const passports = await getPassportDescriptors()
  const validCount = count(passports, hasValidFields)
  console.log(validCount)
}


async function main2() {
  const passports = await getPassportDescriptors()
  const validCount = count(passports, isValid)
  console.log(validCount)
}

main2()