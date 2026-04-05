# Pokemon Team Manager — Müəllimə Təqdimat

Bu sənəd layihənin **niyə belə yazıldığını**, hər funksiyanın və state-in **məqsədini** kod nümunələri ilə izah edir.

---

## 1. Layihənin Əsas Fikri

İstifadəçi ekranda 5 Pokemon görür. İstədiyi Pokemon-u komandasına əlavə edə bilər, sayını artırıb azalda bilər, tamamilə çıxara bilər. Bütün bu məlumatlar brauzer bağlansa belə saxlanılır.

---

## 2. Məlumat Faylı — `src/data/pokemon.js`

```js
// src/data/pokemon.js — sətir 1-14

export const allPokemon = [
  { id: 4,   name: "Charmander", type: "fire",     base_experience: 62  },
  { id: 7,   name: "Squirtle",   type: "water",    base_experience: 63  },
  { id: 11,  name: "Metapod",    type: "bug",      base_experience: 72  },
  { id: 12,  name: "Butterfree", type: "flying",   base_experience: 178 },
  { id: 25,  name: "Pikachu",    type: "electric", base_experience: 112 },
  { id: 39,  name: "Jigglypuff", type: "normal",   base_experience: 95  },
  { id: 94,  name: "Gengar",     type: "poison",   base_experience: 225 },
  { id: 133, name: "Eevee",      type: "normal",   base_experience: 65  },
]

export function getRandomPokemon() {
  const shuffled = [...allPokemon].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 5)
}
```

**Niyə belə etdim?**

Bütün Pokemon məlumatlarını ayrı bir faylda saxladım ki, komponent faylları "məlumat işi" ilə məşğul olmasın. `getRandomPokemon` funksiyası `[...allPokemon]` ilə orijinal massivin kopyasını alır — çünki `.sort()` massivi özü dəyişir, orijinalı korlamaq istəmirdim. `.sort(() => Math.random() - 0.5)` rastgele sıralama verir, `.slice(0, 5)` isə ilk 5-i götürür.

---

## 3. State-lər — `src/App.jsx`

Bütün məlumatı (state-ləri) `App.jsx`-də saxladım. Uşaq komponentlər yalnız göstərmə işi görür, qərar vermir.

### 3.1 — `displayedPokemon` state-i

```jsx
// src/App.jsx — sətir 10

const [displayedPokemon] = useState(() => getRandomPokemon())
```

**Niyə `useState` istifadə etdim, sadəcə `const` yox?**

Əgər belə yazsaydım:
```jsx
const displayedPokemon = getRandomPokemon() // ❌ yanlış yanaşma
```

Vite-in HMR (Hot Module Replacement) sistemi hər fayl yadda saxlananda bu sətiri yenidən işlədərdi, yeni 5 Pokemon seçərdi. Pokemon-ların `id`-si dəyişdiyi üçün React kartları yenidən mount edərdi — ekranda "açılıb-bağlanma" (flickering) yaranardı.

`useState(() => getRandomPokemon())` ilə seçim **yalnız ilk render-də bir dəfə** baş verir. Setter funksiyasına ehtiyac olmadığından `[displayedPokemon]` şəklində yalnız dəyəri aldım.

### 3.2 — `team` state-i

```jsx
// src/App.jsx — sətir 12-19

const [team, setTeam] = useState(() => {
  try {
    const saved = localStorage.getItem('pokemon-team')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
})
```

**Niyə lazy initializer (funksiya) verdim?**

`useState(dəyər)` yazsaydım, React hər render-də `localStorage.getItem(...)` çağırardı — hətta lazım olmasa belə. Funksiya versək yalnız ilk render-də işləyir.

**Niyə `try/catch`?**

Bəzi brauzerlərin incognito rejimində `localStorage` bağlıdır. Xəta atılsa boş massiv qaytarılır, uygulama çökmür.

---

## 4. localStorage Strategiyası — `saveTeam`

```jsx
// src/App.jsx — sətir 21-26

function saveTeam(updater) {          // sətir 21
  setTeam((prev) => {                 // sətir 22
    const next = updater(prev)        // sətir 23
    localStorage.setItem('pokemon-team', JSON.stringify(next))  // sətir 24
    return next                       // sətir 25
  })                                  // sətir 26
}
```

---

### Sətir 21 — `function saveTeam(updater)`

```jsx
function saveTeam(updater) {
```

`saveTeam` — state-i dəyişdirən **bütün** handler-ların çağırdığı bir nöqtədir. `handleAdd`, `handleIncrease`, `handleDecrease`, `handleRemove` hamısı birbaşa `setTeam` çağırmaq əvəzinə bu funksiyadan keçir.

`updater` parametri — **funksiya**dır. Handler-lar belə çağırır:
```jsx
saveTeam((prev) => [...prev, { pokemon, count: 1 }])
//        ↑ bu (prev) => ... məhz updater-dir
```

Yəni "mənə köhnə state-i ver, mən yeni state-i qaytaracağam" deməkdir.

---

### Sətir 22 — `setTeam((prev) => {`

```jsx
setTeam((prev) => {
```

`setTeam` — React-in `useState`-dən gələn setter funksiyasıdır. Ona birbaşa dəyər vermək əvəzinə **funksiya** verdim.

**Niyə funksiya verdim, dəyər yox?**

```jsx
setTeam(newValue)         // ❌ risk var
setTeam((prev) => ...)    // ✅ təhlükəsiz
```

Əgər eyni anda iki dəyişiklik baş versə (məsələn sürətli klik), React `setTeam(newValue)` variantında `newValue`-nu hər dəfə eyni köhnə state-dən hesablaya bilər — birinin nəticəsi itirilər.

`setTeam((prev) => ...)` variantında React `prev`-i həmişə **ən son** state kimi verir — heç bir dəyişiklik itirilmir.

`prev` — o anda olan komandanın massividir, məsələn:
```js
[
  { pokemon: { id: 25, name: 'Pikachu', ... }, count: 2 },
  { pokemon: { id: 7,  name: 'Squirtle', ... }, count: 1 },
]
```

---

### Sətir 23 — `const next = updater(prev)`

```jsx
const next = updater(prev)
```

`updater` — handler-dan gələn funksiyaya `prev`-i ötürürük. Həmin funksiya işləyir və **yeni massivi** qaytarır. Biz onu `next` adlandırırıq.

Məsələn `handleAdd` belə çağırır:
```jsx
saveTeam((prev) => {
  const exists = prev.some((entry) => entry.pokemon.id === pokemon.id)
  if (exists) return updateCount(prev, pokemon.id, +1)
  return [...prev, { pokemon, count: 1 }]
})
```

Bu funksiya `updater`-dir. `updater(prev)` çağıranda `prev` həmin funksiyaya daxil olur, nəticə `next`-ə yazılır.

`next` — artıq **yenilənmiş** komanda massividir. State hələ dəyişməyib, amma biz nə olacağını bilirik.

---

### Sətir 24 — `localStorage.setItem(...)`

```jsx
localStorage.setItem('pokemon-team', JSON.stringify(next))
```

Bu sətirdə iki iş baş verir:

**`JSON.stringify(next)`** — JavaScript massivini mətn (string) formatına çevirir. `localStorage` yalnız mətn saxlaya bilər, massiv saxlaya bilməz:
```js
// next massivi:
[{ pokemon: { id: 25, ... }, count: 2 }]

// JSON.stringify(next) nəticəsi:
'[{"pokemon":{"id":25,"name":"Pikachu",...},"count":2}]'
```

**`localStorage.setItem('pokemon-team', ...)`** — həmin mətni brauzerin yaddaşına yazır. `'pokemon-team'` açar addır — bu adla sonra `getItem` ilə oxuyacağıq. Brauzer bağlansa belə bu məlumat qalır.

**Niyə bu sətir `return next`-dən ÖNCƏdir?**

Çünki `next` artıq hazırdır — hesablanıb. Onu həm localStorage-ə yazırıq, həm React-ə qaytarırıq. İkisi arasında heç bir fərq yoxdur, eyni anda baş verir.

---

### Sətir 25 — `return next`

```jsx
return next
```

`setTeam((prev) => ...)` içindəki funksiya nə qaytarırsa, React onu yeni state kimi qəbul edir. Biz `next`-i qaytarırıq — React `team` state-ini `next` ilə yeniləyir, komponent yenidən render edilir, ekran yenilənir.

---

### Tam axın — bir misalla

İstifadəçi Pikachu-nu komandaya əlavə edir. `handleAdd` çağırılır:

```
1. handleAdd(pikachu) çağırılır
        ↓
2. saveTeam((prev) => { ... }) çağırılır
        ↓
3. setTeam((prev) => { ... }) çağırılır — React prev-i verir
        ↓
4. updater(prev) işləyir → Pikachu massivə əlavə edilir → next yaranır
        ↓
5. localStorage.setItem('pokemon-team', JSON.stringify(next)) — brauzer yaddaşına yazılır
        ↓
6. return next — React state-i yenilənir → ekran dəyişir
```

Hər şey **bir axında** baş verir. localStorage və React state həmişə eynidir.

---

### Niyə `useEffect` istifadə etmədim?

`useEffect` ilə yazılmış klassik yanaşma:
```jsx
// ❌ useEffect variantı
useEffect(() => {
  localStorage.setItem('pokemon-team', JSON.stringify(team))
}, [team])
```

Bu variantda axın belə olur:
```
1. setTeam(next) → React state-i yenilənir
2. Komponent yenidən render edilir
3. Render bitdikdən SONRA useEffect işləyir
4. localStorage yazılır
```

Yəni render → sonra localStorage. Bir əlavə addım var.

`saveTeam` variantında:
```
1. setTeam((prev) => { next hesabla → localStorage yaz → return next })
2. React state-i yenilənir
3. Komponent yenidən render edilir
```

localStorage render-dən əvvəl yazılır — bir addım azdır, hook sayı azdır, kod daha birbaşadır.

---

## 5. Handler Funksiyaları — `src/App.jsx`

### `updateCount` — sətir 28-34 (köməkçi funksiya)

```jsx
function updateCount(prev, id, delta) {
  return prev.map((entry) =>
    entry.pokemon.id === id
      ? { ...entry, count: entry.count + delta }
      : entry
  )
}
```

**Niyə bu funksiyaya ehtiyac var?**

`handleIncrease` və `handleDecrease` əvvəlcə belə yazılmışdı:

```jsx
// handleIncrease içi
prev.map((entry) =>
  entry.pokemon.id === id ? { ...entry, count: entry.count + 1 } : entry
)

// handleDecrease içi
prev.map((entry) =>
  entry.pokemon.id === id ? { ...entry, count: entry.count - 1 } : entry
)
```

İki funksiya eyni şeyi edirdi — yalnız `+1`/`-1` fərqi vardı. Bu təkrarı aradan qaldırmaq üçün `delta` parametri ilə bir köməkçi funksiya yazdım. İndi `handleIncrease` sadəcə `updateCount(prev, id, +1)`, `handleDecrease` isə `updateCount(prev, id, -1)` çağırır.

**`{ ...entry, count: entry.count + delta }` nə edir?**

React-də state-i birbaşa dəyişmək olmaz. `entry.count = entry.count + 1` yazmaq **yanlışdır**. Bunun əvəzinə spread operatoru ilə köhnə `entry`-nin bütün xüsusiyyətlərini yeni obyektə kopyalayıb yalnız `count`-u yeniləyirik. `map` həmişə yeni massiv qaytarır — orijinal `prev` toxunulmaz qalır.

---

### `handleAdd` — sətir 36-42

```jsx
function handleAdd(pokemon) {
  saveTeam((prev) => {
    const exists = prev.some((entry) => entry.pokemon.id === pokemon.id)
    if (exists) return updateCount(prev, pokemon.id, +1)
    return [...prev, { pokemon, count: 1 }]
  })
}
```

**`some` niyə, `find` yox?**

`find` tapılan obyekti qaytarır. Amma burada tapılan `entry`-yə ehtiyac yoxdur — yalnız "varmı?" sualının cavabı lazımdır. `some` birinci uyğun elementi tapan kimi `true` qaytarır, axtarmanı dayandırır. Məqsədə daha düzgün metoddur.

**Axın:**
- Pokemon komandadadırsa → `updateCount(prev, pokemon.id, +1)` → count artır
- Deyilsə → `[...prev, { pokemon, count: 1 }]` → yeni `entry` sona əlavə edilir

---

### `handleIncrease` — sətir 44-46

```jsx
function handleIncrease(id) {
  saveTeam((prev) => updateCount(prev, id, +1))
}
```

`+` düyməsindən gəlir. `updateCount`-a `delta: +1` verilir. Bütün məntiqi `updateCount` idarə edir — bu funksiya yalnız "hansı id, hansı istiqamət" bildirir.

---

### `handleDecrease` — sətir 48-52

```jsx
function handleDecrease(id) {
  saveTeam((prev) =>
    updateCount(prev, id, -1).filter(({ count }) => count > 0)
  )
}
```

`-` düyməsindən gəlir. `updateCount`-a `delta: -1` verilir, `count` azaldılır. Ardından `.filter(({ count }) => count > 0)` — `count`-u 0-a düşən `entry` siyahıdan çıxarılır.

**`{ count }` destructuring niyə?**

`filter((entry) => entry.count > 0)` yerinə `filter(({ count }) => count > 0)` yazdım — `entry.count` yerinə birbaşa `count` açılır, bir iç-içəlik azalır.

**`TeamList.jsx`-dəki əlavə qoruma:**
```jsx
onClick={() => entry.count > 1 && onDecrease(entry.pokemon.id)}
```
`count` artıq `1`-dirsə `onDecrease` çağırılmır — düymə heç nə etmir. Beləliklə istifadəçi `−` düyməsini bassın, count 0-a düşmür; Pokemon-u silmək üçün "Remove" düyməsini istifadə etməlidir.

---

### `handleRemove` — sətir 54-56

```jsx
function handleRemove(id) {
  saveTeam((prev) => prev.filter(({ pokemon }) => pokemon.id !== id))
}
```

`TeamList.jsx`-dəki "Remove" düyməsi basıldıqda çağırılır. `id` — hansı Pokemon-un silinəcəyini bildirir.

**Addım-addım nə baş verir:**

`saveTeam(...)` çağırılır — həm state, həm localStorage eyni anda yenilənəcək.

`.filter(({ pokemon }) => pokemon.id !== id)` — `{ pokemon }` destructuring ilə hər `entry`-dən birbaşa `pokemon` sahəsi çıxarılır. `entry.pokemon.id` yazmaq əvəzinə sadəcə `pokemon.id` yazılır:

```
entry.pokemon.id !== id   // destructuringsiz
pokemon.id !== id         // destructuring ilə — daha qısa
```

`filter` şərti `true` qaytaran `entry`-ləri saxlayır, `false` qaytaranı siyahıdan çıxarır. `filter` həmişə **yeni massiv** qaytarır — orijinal `prev` dəyişmir.

**`handleDecrease` ilə fərqi nədir?**

| | `handleDecrease` | `handleRemove` |
|---|---|---|
| Nə edir | `count`-u 1 azaldır, 0-a düşərsə çıxarır | Birbaşa siyahıdan çıxarır, `count`-a baxmır |
| Haradan gəlir | `−` düyməsi | "Remove" düyməsi |
| İstifadə şərti | `count > 1` olduqda aktiv | Həmişə aktiv |

---

## 6. Komponentlər

### `Button` — `src/components/Button/Button.jsx`

```jsx
// sətir 1-12

import styles from './Button.module.css'

export default function Button({ label, onClick, variant = 'primary' }) {
  return (
    <button
      type="button"
      className={`${styles.btn} ${styles[variant]}`}
      onClick={onClick}>
      {label}
    </button>
  )
}
```

**Niyə `children` yox, `label` prop?**

`children` istifadə etsəydim komponent iki tag arasında açılıb bağlanmalı idi:
```jsx
<Button variant="primary">Add to Team</Button>  // children
```

`label` prop ilə self-closing olur:
```jsx
<Button variant="primary" label="Add to Team" />  // label
```

Bu daha qısa və digər komponentlərlə (məsələn `<PokemonSprite />`) eyni stildir.

**Niyə `type="button"`?**

HTML-də `<form>` içindəki düymənin default tipi `submit`-dir. `type="button"` vermək formu göndərməsinin qarşısını alır. Hazırda formumuz yoxdur, amma bu yaxşı bir vərdişdir.

**4 variant:**
| Variant | Rəng | İstifadə yeri |
|---|---|---|
| `primary` | Mavi | "Add to Team" |
| `danger` | Qırmızı | "Remove" |
| `inc` | Yaşıl | `+` |
| `dec` | Narıncı | `−` |

---

### `Title` — `src/components/Title/Title.jsx`

```jsx
// sətir 1-6

import styles from './Title.module.css'

export default function Title({ children, level = 2 }) {
  const Tag = `h${level}`
  return <Tag className={styles[Tag]}>{children}</Tag>
}
```

**Niyə belə etdim?**

`h1`, `h2`, `h3` üçün 3 ayrı komponent yazmaq əvəzinə `level` prop aldım. `const Tag = \`h${level}\`` — ədədi template literal ilə string-ə çevirir: `1` → `"h1"`. React `Tag`-ı HTML elementi kimi render edir.



---

### `PokemonSprite` — `src/components/PokemonSprite/PokemonSprite.jsx`

```jsx
// sətir 1-5

import styles from './PokemonSprite.module.css'

export default function PokemonSprite({ id, name, size = 'md' }) {
  const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
  return <img src={url} alt={name} className={`${styles.sprite} ${styles[size]}`} />
}
```

**Niyə ayrı komponent etdim?**

Əvvəlcə həm `PokemonCard`, həm `TeamList` öz içindəki `const spriteUrl = \`...${id}.png\`` yaradırdı. URL məntiqi iki yerdə təkrar yazılırdı. Bunu bir komponentə çıxardım:

- URL qurmaq məntiqi bir yerdədir
- `size` prop ilə eyni komponent fərqli ölçülərdə işlənir: `"sm"` (44px) TeamList-də, `"md"` (80px) PokemonCard-da

---

### `PokemonCard` — `src/components/PokemonCard/PokemonCard.jsx`

```jsx
// sətir 1-13

import styles from './PokemonCard.module.css'
import Button from '../Button'
import PokemonSprite from '../PokemonSprite'

export default function PokemonCard({ pokemon, onAdd }) {
  return (
    <div className={styles.card}>
      <PokemonSprite id={pokemon.id} name={pokemon.name} size="md" />
      <p className={styles.name}>{pokemon.name}</p>
      <Button variant="primary" onClick={() => onAdd(pokemon)} label="Add to Team" />
    </div>
  )
}
```

Bu komponent yalnız **göstərir**. `onAdd` funksiyasını özü yazmır — `App.jsx`-dən `handleAdd` kimi gəlir. Komponent "nə edəcəyini" bilmir, yalnız "nə zaman" baş verdiyini bildirir. Bu "props down, events up" (məlumat aşağı, hadisə yuxarı) prinsipidir.

---

### `TeamList` — `src/components/TeamList/TeamList.jsx`

```jsx
// sətir 1-22

import styles from './TeamList.module.css'
import Button from '../Button'
import PokemonSprite from '../PokemonSprite'

export default function TeamList({ team, onIncrease, onDecrease, onRemove }) {
  return (
    <div className={styles.list}>
      {team.map((entry) => (
        <div key={entry.pokemon.id} className={styles.row}>
          <PokemonSprite id={entry.pokemon.id} name={entry.pokemon.name} size="sm" />
          <span className={styles.name}>{entry.pokemon.name}</span>
          <div className={styles.controls}>
            <Button variant="dec" onClick={() => entry.count > 1 && onDecrease(entry.pokemon.id)} label="-" />
            <span className={styles.count}>{entry.count}</span>
            <Button variant="inc" onClick={() => onIncrease(entry.pokemon.id)} label="+" />
            <Button variant="danger" onClick={() => onRemove(entry.pokemon.id)} label="Remove" />
          </div>
        </div>
      ))}
    </div>
  )
}
```

**`entry.count > 1 && onDecrease(...)` — niyə?**

`&&` qısa dövrə operatorudur: sol tərəf `false` olduqda sağ tərəf işlənmir. `count` artıq `1`-dirsə `onDecrease` çağırılmır. İstifadəçi düyməyə bassın, heç nə olmur — count heç vaxt 0-a düşmür.

**`key={entry.pokemon.id}` — niyə?**

React siyahını yenidən render edəndə hansı elementin dəyişdiyini `key` ilə müəyyən edir. `key` olmasaydı React bütün siyahını yenidən çəkirdi — performans problemiyaranar, animasiyalar düzgün işləməzdi.

---

### `TeamStats` — `src/components/TeamStats/TeamStats.jsx`

```jsx
// sətir 1-28

import styles from './TeamStats.module.css'
import Title from '../Title'

export default function TeamStats({ team }) {
  const total = team.reduce((sum, e) => sum + e.count, 0)

  return (
    <div className={styles.wrapper}>
      <Title level={2}>Total Pokemon in Team: {total}</Title>
      <Title level={3}>Individual Pokemon Count</Title>
      <table className={styles.table}>
        ...
        <tbody>
          {team.map((entry) => (
            <tr key={entry.pokemon.id}>
              <td className={styles.statName}>{entry.pokemon.name}</td>
              <td className={styles.statCount}>{entry.count}</td>
              <td className={styles.statLabel}>{entry.count === 1 ? 'Pokemon' : 'Pokemons'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

**`reduce` niyə?**

`team` massivinə baxanda hər `entry`-nin öz `count`-u var. Hamısını toplamaq üçün `reduce` istifadə etdim — `sum` başlanğıcda `0`-dır, hər addımda `entry.count` əlavə olunur.

**`entry.count === 1 ? 'Pokemon' : 'Pokemons'` — niyə?**

Tək/cəm fərqini gözlədim: `1 Pokemon`, `2 Pokemons`. Ternary operator bu işi bir sətirdə həll edir.

---

## 7. Komponent Qovluq Strukturu

Hər komponent 3 fayldan ibarətdir:

```
Button/
├── Button.jsx          ← komponent məntiqi
├── Button.module.css   ← yalnız bu komponentə aid stillər
└── index.jsx           ← export { default } from './Button'
```

**`index.jsx` niyə var?**

`import Button from '../Button'` yazanda Vite `Button/index.jsx`-i avtomatik tapır. O da `Button.jsx`-i ötürür. Bu sayədə import yolları qısa qalır, fayl adı işlənmir.

**CSS Modules niyə?**

`.card` sinifini həm `PokemonCard.module.css`-də, həm `TeamList.module.css`-də istifadə etmək mümkündür — bir-birini əzmir. Hər modul öz sinif adlarını unikal hash ilə kompile edir.

---

## 8. Məlumat Axını

```
App.jsx
│
├── state: displayedPokemon   →  PokemonCard (yalnız oxur)
│
├── state: team               →  TeamList   (yalnız oxur)
│                             →  TeamStats  (yalnız oxur)
│
├── handleAdd     ←────────────  PokemonCard (onAdd prop)
├── handleIncrease ←───────────  TeamList   (onIncrease prop)
├── handleDecrease ←───────────  TeamList   (onDecrease prop)
└── handleRemove  ←────────────  TeamList   (onRemove prop)
```

State yalnız `App.jsx`-dədir. Uşaq komponentlər state-i dəyişə bilmir — yalnız prop kimi aldıqları funksiyaları çağırır. Bu **"single source of truth"** prinsipidir.
