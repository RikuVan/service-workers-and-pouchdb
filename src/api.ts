import { catchError, map, mergeMap, pluck, startWith, switchMap, toArray } from 'rxjs/operators'
import { from, of } from 'rxjs'

import { fromFetch } from 'rxjs/fetch'

/* URLS */
const API_ROOT = 'https://dog.ceo/api'
const BREED_LIST_URL = `${API_ROOT}/breeds/list`
export const getImagesUrlFor = (breed: string) => `${API_ROOT}/breed/${breed}/images`

/* HELPERS */
const groupByFirstLetter = (names: string[]) =>
  names.reduce((acc, val) => {
    let char = val.charAt(0).toUpperCase()
    acc[char] = [].concat(acc[char] || [], val)
    return acc
  }, {})

const handleJSONResponse = (response: Response) => {
  if (response.ok) {
    return response.json()
  } else {
    return of({ error: true, message: `Error ${response.status}` })
  }
}

const rand = (items: string[]) => {
  return items[~~(items.length * Math.random())]
}

/* REQUEST$ */

// returns map of breeds grouped by first letter of name
export function getBreeds() {
  return fromFetch(BREED_LIST_URL).pipe(
    switchMap(handleJSONResponse),
    pluck('message'),
    map(groupByFirstLetter),
    catchError((error) => {
      console.log('error: ', error)
      return of(error)
    })
  )
}

// returns image urls for one breed
export function getImagesForBreed(breed: string) {
  return fromFetch(getImagesUrlFor(breed)).pipe(switchMap(handleJSONResponse), pluck('message'))
}

// returns image URLS for multiple breeds
export function getImagesForBreeds(breeds: string[], random = false) {
  const getSingleImage = random ? rand : (items: string[]) => items[0]
  // max concurrency of 4
  return from(breeds).pipe(
    mergeMap((breed) => getImagesForBreed(breed), 4),
    map(getSingleImage),
    toArray(),
    startWith(null)
  )
}
