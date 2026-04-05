# Pokemon Team Manager — JSX / JS Kod İzahı

Bu sənəd layihədəki **bütün `.jsx` və `.js` fayllarının hər sətirini** ətraflı izah edir.
CSS izahları üçün → [README-CSS.md](./README-CSS.md)

---

## Layihə Strukturu

```
src/
├── index.css
├── App.module.css
├── App.jsx
├── main.jsx
├── data/
│   └── pokemon.js
└── components/
    ├── Button/
    │   ├── Button.jsx
    │   ├── Button.module.css
    │   └── index.jsx
    ├── Title/
    │   ├── Title.jsx
    │   ├── Title.module.css
    │   └── index.jsx
    ├── PokemonCard/
    │   ├── PokemonCard.jsx
    │   ├── PokemonCard.module.css
    │   └── index.jsx
    ├── PokemonSprite/
    │   ├── PokemonSprite.jsx
    │   ├── PokemonSprite.module.css
    │   └── index.jsx
    ├── TeamList/
    │   ├── TeamList.jsx
    │   ├── TeamList.module.css
    │   └── index.jsx
    └── TeamStats/
        ├── TeamStats.jsx
        ├── TeamStats.module.css
        └── index.jsx
```

---

## 1. `src/main.jsx` — Tətbiqin Başlanğıc Nöqtəsi

```jsx
import { StrictMode } from 'react'
```
React kitabxanasından `StrictMode` komponentini import edir. `StrictMode` — development rejimində köhnə və ya problemli API istifadələrini konsola xəbərdarlıq kimi çıxarır. Production build-də heç bir əlavə iş görmür, sürəti yavaşlatmır.

```jsx
import { createRoot } from 'react-dom/client'
```
`react-dom/client` modulundan `createRoot` funksiyasını import edir. React 18 ilə gəldi — HTML-dəki DOM elementini React-in idarə edəcəyi "kök" nöqtəsinə çevirir.

```jsx
import './index.css'
```
`index.css` faylını import edir. Heç bir dəyişəndə saxlanılmır — sadəcə import edilməsi kifayətdir, Vite onu avtomatik sayfaya əlavə edir. Buraya bütün sayfaya aid global stillər yazılır.

```jsx
import App from './App.jsx'
```
`App.jsx` faylından default export edilmiş `App` komponentini import edir. Tətbiqimizin ana komponentidir, bütün digər komponentlər onun içindən çağırılır.

```jsx
createRoot(document.getElementById('root'))
```
`document.getElementById('root')` — `index.html`-dəki `<div id="root"></div>` elementini tapır. `createRoot(...)` həmin elementi React-in render edəcəyi kök nöqtə olaraq qeyd edir.

```jsx
.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```
`.render()` metoduna JSX verilir. `<StrictMode>` içindəki `<App />` bütün tətbiqi təmsil edir. React bu JSX-i DOM-a çevirir və `<div id="root">` içinə yerləşdirir.

---

## 2. `src/data/pokemon.js` — Pokemon Verilənləri

```js
export const allPokemon = [
```
`export` — bu dəyişəni başqa fayllardan import etməyə icazə verir. `const` — yenidən təyin edilə bilməyən sabit dəyişən. `allPokemon` adı verilir. `[` — JavaScript massivi (array) başlayır.

```js
  { id: 4,   name: "Charmander", type: "fire",     base_experience: 62  },
```
Massivin ilk obyekti. `id: 4` — PokeAPI-dəki rəsmi nömər (Charmander #4-cüdür, bu nömrə sprite URL-ində istifadə olunur). `name` — Pokemon adı. `type` — elementi. `base_experience` — məğlub edildikdə verilən təcrübə xalı.

```js
  { id: 7,   name: "Squirtle",   type: "water",    base_experience: 63  },
  { id: 11,  name: "Metapod",    type: "bug",      base_experience: 72  },
  { id: 12,  name: "Butterfree", type: "flying",   base_experience: 178 },
  { id: 25,  name: "Pikachu",    type: "electric", base_experience: 112 },
  { id: 39,  name: "Jigglypuff", type: "normal",   base_experience: 95  },
  { id: 94,  name: "Gengar",     type: "poison",   base_experience: 225 },
  { id: 133, name: "Eevee",      type: "normal",   base_experience: 65  },
```
Qalan 7 Pokemon obyekti. Hər biri eyni strukturdadır. Cəmi 8 Pokemon var.

```js
]
```
`allPokemon` massivin sonu.

```js
export function getRandomPokemon(count = 5) {
```
`export` — başqa fayllardan import edilə bilsin. `count = 5` — default parametr; çağırarkən dəyər ötürülməzsə avtomatik `5` götürülür.

```js
  const shuffled = [...allPokemon].sort(() => Math.random() - 0.5)
```
`[...allPokemon]` — spread operatoru (`...`) ilə `allPokemon`-un **yeni kopyası** yaradılır. Bu vacibdir, çünki `.sort()` massivi özü dəyişir; orijinal `allPokemon` array-ini korlamaq istəmirik. `.sort(() => Math.random() - 0.5)` — `Math.random()` 0 ilə 1 arasında təsadüfi ədəd qaytarır; 0.5 çıxarılınca nəticə ya mənfi ya müsbət olur, buna görə elementlər təsadüfi sıralanır.

```js
  return shuffled.slice(0, count)
```
`.slice(0, count)` — sıralanmış massivdən ilk `count` (5) elementi götürüb yeni massiv qaytarır. Hər yeniləmədə fərqli 5 Pokemon göstərilir.

---

## 3. `src/components/Button/Button.jsx` — Yenidən İstifadə Edilən Düymə

```jsx
import styles from './Button.module.css'
```
Düyməyə aid CSS Module-u import edir. `styles` obyekti CSS siniflərini JavaScript-dən istifadə etməyə imkan verir.

```jsx
export default function Button({ label, onClick, variant = 'primary' }) {
```
`Button` komponent funksiyası. Props destructuring ilə üç dəyər alır:
- `label` — düymənin içindəki mətn (məs. `"Add to Team"`, `"+"`, `"-"`, `"Remove"`)
- `onClick` — klik hadisəsi funksiyası, yuxarıdan ötürülür
- `variant = 'primary'` — düymənin növü, default `'primary'`-dir. Mövcud növlər: `primary` (mavi), `danger` (qırmızı), `inc` (yaşıl), `dec` (narıncı)

```jsx
  return (
    <button
      type="button"
      className={`${styles.btn} ${styles[variant]}`}
      onClick={onClick}
    >
      {label}
    </button>
```
`type="button"` — brauzerin default `submit` davranışını bloklayır; form içindəki düymələr formu göndərməsin deyə vacibdir. İki CSS sinifi birlikdə tətbiq olunur: `styles.btn` — bütün düymələrə ortaq bazis stillər, `styles[variant]` — varianta görə rəng sinifi. `label` prop düymənin görünən məzmununu render edir. `children` istifadə edilmədiyindən `<Button />` self-closing tag kimi yazıla bilir.

---

## 4. `src/components/Title/Title.jsx` — Başlıq Komponenti

```jsx
import styles from './Title.module.css'
```
`Title` komponentinin CSS Module-u import edilir.

```jsx
export default function Title({ children, level = 2 }) {
  const Tag = `h${level}`
```
`Title` komponent funksiyası. `children` — başlıq məzmunu. `level = 2` — həddin nömrəsi, default `2`-dir. `const Tag = \`h${level}\`` — ədədi template literal ilə string-ə çevirir: `1` → `"h1"`, `2` → `"h2"`, `3` → `"h3"`. Bu sayədə `<Title level={1}>`, `<Title level={2}>`, `<Title level={3}>` kimi çağırıla bilər. `as: Tag` pattern-indən daha sadədir — string əvəzinə ədəd ötürülür.

```jsx
  return <Tag className={styles[Tag]}>{children}</Tag>
```
`Tag` dəyişəni HTML elementi kimi render olunur. `styles[Tag]` — məsələn `Tag = 'h1'` olduqda `styles.h1` class-ı tətbiq olunur. Bu bir sətirlik return budur — `{}` işarəsinə ehtiyac yoxdur.

---

## 5. `src/components/PokemonCard/PokemonCard.jsx`

```jsx
import styles from './PokemonCard.module.css'
import Button from '../Button'
import PokemonSprite from '../PokemonSprite'
```
CSS Module-u, `Button` və `PokemonSprite` komponentlərini import edir. Hər import `index.jsx` vasitəsilə müvafiq komponent faylını tapır.

```jsx
export default function PokemonCard({ pokemon, onAdd }) {
```
`pokemon` — id, name, type, base_experience olan obyekt. `onAdd` — "Add to Team" basıldıqda çağırılacaq callback funksiyası (`App.jsx`-dən gəlir).

```jsx
  return (
    <div className={styles.card}>
      <PokemonSprite id={pokemon.id} name={pokemon.name} size="md" />
```
Kartın `div`-i açılır. `PokemonSprite` komponenti sprite URL-ini özü qurur. `size="md"` — 80×80px ölçüsü seçilir.

```jsx
      <p className={styles.name}>{pokemon.name}</p>
```
Pokemon adı `<p>` (paragraph) teqi içində göstərilir.

```jsx
      <Button variant="primary" onClick={() => onAdd(pokemon)} label="Add to Team" />
```
`Button` komponenti self-closing formada yazılır. `label="Add to Team"` — düymənin mətni prop kimi ötürülür. `onClick={() => onAdd(pokemon)}` — klik olduqda `handleAdd` funksiyasına `pokemon` obyekti ötürülür.

---

## 6. `src/components/PokemonSprite/PokemonSprite.jsx` — Sprite Şəkil Komponenti

```jsx
import styles from './PokemonSprite.module.css'
```
`PokemonSprite`-ın CSS Module-u import edilir.

```jsx
export default function PokemonSprite({ id, name, size = 'md' }) {
```
Üç prop qəbul edir. `id` — Pokemon nömrəsi (URL-i qurmaq üçün). `name` — şəkil yüklənməsə göstərilən alternativ mətn (`alt` atributu). `size = 'md'` — default ölçü `'md'` (80×80px); `'sm'` verildikdə 44×44px olur.

```jsx
  const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
```
Template literal ilə sprite URL-i dinamik yaradılır. `${id}` — Pokemon-un id nömrəsi URL-ə yerləşdirilir. GitHub-da PokeAPI-nin rəsmi sprite arxiv linkidir. URL məntiqi indi yalnız bu bir komponentdədir; `PokemonCard` və `TeamList` bu konstantı ayrıca yaratmır.

```jsx
  return <img src={url} alt={name} className={`${styles.sprite} ${styles[size]}`} />
```
Tək sətirlik return — mötərizəsiz yazılır. `styles.sprite` — ümumi bazis stil (`image-rendering: pixelated`). `styles[size]` — `size` dəyərinə görə `.sm` ya `.md` sinifi seçilir. Bu sayədə eyni komponent fərqli yerlərdə fərqli ölçüdə usar olunur.

---

## 7. `src/components/TeamList/TeamList.jsx`

```jsx
import styles from './TeamList.module.css'
import Button from '../Button'
import PokemonSprite from '../PokemonSprite'
```
CSS Module, `Button` və `PokemonSprite` komponentləri import edilir.

```jsx
export default function TeamList({ team, onIncrease, onDecrease, onRemove }) {
```
4 prop qəbul edilir. `team` — `{ pokemon, count }` formatında obyektlər massivi. `onIncrease`, `onDecrease`, `onRemove` — `App.jsx`-dəki `handleIncrease`, `handleDecrease`, `handleRemove` funksiyaları.

```jsx
  return (
    <div className={styles.list}>
      {team.map((entry) => (
```
`team` massivi `.map()` ilə gəzilir. `(entry) => (` — ox funksiyası ilə JSX birbaşa qaytarılır; mötərizə `(...)` implicit return-dir, `{ return ... }` yazmağa ehtiyac yoxdur. Hər iterasiyada `entry = { pokemon: {...}, count: N }`.

```jsx
        <div key={entry.pokemon.id} className={styles.row}>
```
Hər üzv üçün bir sıra render olunur. `key={entry.pokemon.id}` — React-in diffing (fərqləndirmə) alqoritmi üçün unikal tanımlayıcı.

```jsx
          <PokemonSprite id={entry.pokemon.id} name={entry.pokemon.name} size="sm" />
          <span className={styles.name}>{entry.pokemon.name}</span>
```
`PokemonSprite` `size="sm"` ilə — 44×44px kiçik ölçü. Yanında Pokemon adı göstərilir. Sprite URL-i artıq burada qurulmur — `PokemonSprite` komponenti özü idarə edir.

```jsx
          <div className={styles.controls}>
            <Button variant="dec" onClick={() => entry.count > 1 && onDecrease(entry.pokemon.id)} label="-" />
```
`controls` konteynerinin içindəki azaltma düyməsi. `onClick={() => entry.count > 1 && onDecrease(...)}` — `&&` qısa dövrə operatoru: `entry.count > 1` doğru olduqda `onDecrease` çağırılır, yanlış olduqda (count 1-dirsə) heç nə olmur. Beləliklə count 1-dən aşağı düşmür. `label="-"` — mətn prop kimi ötürülür.

```jsx
            <span className={styles.count}>{entry.count}</span>
```
Cari say `<span>` içindədir.

```jsx
            <Button variant="inc" onClick={() => onIncrease(entry.pokemon.id)} label="+" />
            <Button variant="danger" onClick={() => onRemove(entry.pokemon.id)} label="Remove" />
```
`inc` — yaşıl artırma düyməsi. `danger` — qırmızı silmə düyməsi. Hamısı `label` prop ilə self-closing formada yazılır.

---

## 8. `src/components/TeamStats/TeamStats.jsx`

```jsx
import styles from './TeamStats.module.css'
import Title from '../Title'
```
CSS Module və `Title` komponenti import edilir.

```jsx
export default function TeamStats({ team }) {
```
Yalnız `team` prop-unu qəbul edir — başqa heç nəyə ehtiyac yoxdur.

```jsx
  const total = team.reduce((sum, e) => sum + e.count, 0)
```
`Array.reduce()` massivi tək dəyərə endirən metoddur. `sum` — yığılan cəm, `e` — cari element. `e.count`-u hər addımda `sum`-a əlavə edir. `0` — başlanğıc dəyər (boş komandada 0 qaytarılsın deyə). Nəticə komandadakı **bütün Pokemon-ların toplam sayıdır**.

```jsx
  return (
    <div className={styles.wrapper}>
      <Title level={2}>Total Pokemon in Team: {total}</Title>
```
`Title` komponenti `level={2}` ilə çağırılır — `<h2>` elementi render olunur. `{total}` — hesablanan rəqəm JSX içinə daxil edilir.

```jsx
      <Title level={3}>Individual Pokemon Count</Title>
```
`Title` komponenti `as="h3"` ilə — cədvəlin üstündəki kiçik alt başlıq.

```jsx
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nickname</th>
            <th>Count</th>
            <th>Label</th>
          </tr>
        </thead>
```
`<table>` — HTML cədvəli. `<thead>` — başlıq bölməsi. `<tr>` — bir sıra. `<th>` — başlıq xanası (qalın, ortalanmış). 3 sütun yaradılır.

```jsx
        <tbody>
          {team.map((entry) => (
            <tr key={entry.pokemon.id}>
```
`<tbody>` — məlumat bölməsi. `team.map(...)` — hər komanda üzvü üçün bir cədvəl sırası render olunur. `key` burada da vacibdir.

```jsx
              <td className={styles.statName}>{entry.pokemon.name}</td>
```
Ad sütunu — yaşıl rəngli xana.

```jsx
              <td className={styles.statCount}>{entry.count}</td>
```
Say sütunu — qırmızı rəngli xana.

```jsx
              <td className={styles.statLabel}>{entry.count === 1 ? 'Pokemon' : 'Pokemons'}</td>
```
Ternary operator: `count === 1` olduqda `'Pokemon'`, çox olduqda `'Pokemons'` yazılır. Tək/cəm formu düzgün göstərilir.

---

## 9. `src/App.jsx` — Ana Komponent

```jsx
import { useState } from 'react'
```
React-dən yalnız `useState` hook-u import edilir. `useEffect`-ə ehtiyac yoxdur — localStorage-a yazma əməliyyatı birbaşa state yeniləmə anında baş verir.

```jsx
import { getRandomPokemon } from './data/pokemon'
import PokemonCard from './components/PokemonCard'
import TeamList from './components/TeamList'
import TeamStats from './components/TeamStats'
import Title from './components/Title'
import styles from './App.module.css'
```
Lazımi modul, komponent və CSS Module-lar import edilir. Komponent yollarında fayl adı yox, qovluq adı yazılıb — Vite hər qovluğun `index.jsx`-ini avtomatik tapır.

```jsx
export default function App() {
```
`App` — ana komponent funksiyası. `export default` — bu fayldan yalnız bir şey export edilir.

```jsx
  const [displayedPokemon] = useState(() => getRandomPokemon())
```
`useState`-ə funksiya (lazy initializer) verilir — bu funksiya yalnız **ilk render-də** bir dəfə işləyir. Bu vacibdir: əgər `const displayedPokemon = getRandomPokemon()` şəklində komponent xaricində yazılsaydı, Vite-in HMR (Hot Module Replacement) mexanizmi hər fayl yadda saxlananda modulu yenidən qiymətləndirər, yeni random Pokemon seçərdi — `key` propları dəyişər, kartlar yenidən mount olar, ekranda açılıb-bağlanma (flickering) yaranardı. `useState` ilə seçim stabildir — səhifə yeniləməsinə qədər eyni 5 Pokemon göstərilir. `[displayedPokemon]` — destructuring ilə yalnız dəyər alınır, setter funksiyasına ehtiyac olmadığından atılır.

```jsx
  const [team, setTeam] = useState(() => {
    try {
      const saved = localStorage.getItem('pokemon-team')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
```
`useState`-ə funksiya (lazy initializer) verilir — bu funksiya yalnız ilk render-də işləyir. `localStorage.getItem('pokemon-team')` — brauzer yaddaşından əvvəlki komanda məlumatlarını oxuyur. `JSON.parse(saved)` — JSON formatındakı mətn JavaScript obyektinə/massivinə çevrilir. `try/catch` — localStorage əlçatmaz olduqda (məs. bəzi incognito rejimlərinde) xəta atılsa, boş massiv qaytarılır.

```jsx
  function saveTeam(updater) {
    setTeam((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      localStorage.setItem('pokemon-team', JSON.stringify(next))
      return next
    })
  }
```
`useEffect` istifadə etmədən localStorage-a yazan köməkçi funksiya. `setTeam((prev) => ...)` — funksional yeniləmə forması; `prev` cari state-in ən son dəyərini verir. `typeof updater === 'function' ? updater(prev) : updater` — `updater` funksiya ola bilər (handleAdd, handleIncrease...) ya da birbaşa dəyər; hər iki halı idarə edir. `next` — yeni state dəyəri hesablandıqdan sonra dərhal localStorage-a yazılır. `return next` — React state-i də `next` ilə yenilənir. Beləliklə hər dəyişiklik anında həm state, həm localStorage eyni vaxtda yenilənir; `useEffect`-in əlavə render dövrünə ehtiyac qalmır.

```jsx
  function updateCount(prev, id, delta) {
    return prev.map((entry) =>
      entry.pokemon.id === id
        ? { ...entry, count: entry.count + delta }
        : entry
    )
  }
```
Köməkçi funksiya. `handleIncrease` və `handleDecrease` əvvəlcə hər ikisi `map`+spread ilə eyni şeyi edirdi — yalnız `+1`/`-1` fərqi vardı. Bu təkrarı aradan qaldırmaq üçün `delta` parametri ilə bir dəfə yazdım. `delta` `+1` ya `-1` alır. `map` həmişə yeni massiv qaytarır — orijinal `prev` dəyişmir (immutable update).

```jsx
  function handleAdd(pokemon) {
    saveTeam((prev) => {
      const exists = prev.some((entry) => entry.pokemon.id === pokemon.id)
      if (exists) return updateCount(prev, pokemon.id, +1)
      return [...prev, { pokemon, count: 1 }]
    })
  }
```
`prev.some(...)` — komandada həmin Pokemon artıq varmı deyə yoxlayır. `find`-dən fərqli olaraq tapılan `entry` obyekti lazım deyil, yalnız "varmı?" sualının cavabı lazımdır — buna görə `some` daha uyğundur. Varsa: `updateCount(prev, pokemon.id, +1)` — say artırılır. Yoxdursa: `[...prev, { pokemon, count: 1 }]` — köhnə massiv kopyalanıb sonuna yeni element əlavə edilir.

```jsx
  function handleIncrease(id) {
    saveTeam((prev) => updateCount(prev, id, +1))
  }
```
`+` düyməsindən gəlir. `updateCount`-a `delta: +1` verilir — uyğun `entry`-nin `count`-u 1 artırılır.

```jsx
  function handleDecrease(id) {
    saveTeam((prev) =>
      updateCount(prev, id, -1).filter(({ count }) => count > 0)
    )
  }
```
`-` düyməsindən gəlir. `updateCount`-a `delta: -1` verilir, `count` azaldılır. `.filter(({ count }) => count > 0)` — `count` 0-a düşən `entry` massivdən çıxarılır. `{ count }` destructuring ilə `entry.count` yerinə birbaşa `count` yazılır.

```jsx
  function handleRemove(id) {
    saveTeam((prev) => prev.filter(({ pokemon }) => pokemon.id !== id))
  }
```
"Remove" düyməsindən gəlir. `{ pokemon }` destructuring ilə hər `entry`-dən birbaşa `pokemon` sahəsi çıxarılır — `entry.pokemon.id` yerinə sadəcə `pokemon.id` yazılır. `filter` şərti `true` qaytaran `entry`-ləri saxlayır, `false` qaytaranı siyahıdan çıxarır.

```jsx
  return (
    <div className={styles.app}>
      <Title level={1}>Pokemon Team Manager</Title>
```
Ana konteyner `div`-i açılır. `Title` komponenti `level={1}` ilə — sayfanın əsas başlığı `<h1>` kimi render olunur.

```jsx
      <div className={styles.pokemonGrid}>
        {displayedPokemon.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} onAdd={handleAdd} />
        ))}
      </div>
```
`pokemonGrid` konteynerinin içindəki 5 `PokemonCard`. `key={pokemon.id}` — React üçün unikal tanımlayıcı. `pokemon={pokemon}` — Pokemon obyekti prop kimi ötürülür. `onAdd={handleAdd}` — klik funksiyası prop kimi ötürülür.

```jsx
      <Title level={2}>Your Pokemon Team</Title>

      {team.length > 0 && (
        <TeamList
          team={team}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onRemove={handleRemove}
        />
      )}
```
`Title level={2}` — komanda bölümünün başlığı. `team.length > 0 && (...)` — şərti render: komanda boşdursa `TeamList` göstərilmir. `TeamList`-ə 4 prop ötürülür.

```jsx
      <TeamStats team={team} />
    </div>
  )
}
```
`TeamStats` həmişə render olunur — komanda boş olsa belə cədvəl göstərilir (sadəcə data yoxdur). Ana `div` bağlanır, `return` və `App` funksiyası bitirir.

---

## 10. `index.jsx` Faylları — Re-export Pattern

Hər komponentin qovluğunda `index.jsx` yalnız bu bir sətirdən ibarətdir:

```jsx
export { default } from './PokemonCard'   // və ya './TeamList', './Button' ...
```

Bu "re-export" üsuludur. `App.jsx`-də `import PokemonCard from './components/PokemonCard'` yazıldıqda Vite `PokemonCard/index.jsx`-i tapır, o da `PokemonCard.jsx`-dən default export-u ötürür. Bu sayədə:
- Komponent kodu `ComponentName.jsx`-də saxlanılır (oxunaqlıdır)
- CSS `ComponentName.module.css`-dədir (ayrıdır)
- `index.jsx` sadəcə körpü rolunu oynayır (import yolları qısa qalır)
