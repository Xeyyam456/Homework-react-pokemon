# Pokemon Team Manager — CSS İzahı

Bu sənəd layihədəki **bütün `.css` və `.module.css` fayllarının hər sətirini** ətraflı izah edir.
JSX/JS izahları üçün → [README.md](./README.md)

---

## 1. `src/index.css` — Global Stillər

Bu fayl bütün sayfaya tətbiq olur. `main.jsx`-də `import './index.css'` ilə yüklənir.

```css
* {
```
`*` — universal selektor. Sayfadakı **hər elementi** hədəf alır, heç birini istisna etmir.

```css
  box-sizing: border-box;
```
Brauzer default-unda elementin `width`-i yalnız məzmunu ölçür; `padding` və `border` əlavə olunub genişliyi artırır. `border-box` deyəndə `padding` və `border` artıq genişliyin **daxilinə** hesablanır. Bütün elementlərdə ölçüləri nəzarətdə saxlamaq asanlaşır.

```css
  margin: 0;
  padding: 0;
```
Brauzer `<body>`, `<h1>`, `<p>` kimi elementlərə default margin/padding tətbiq edir. İkisinı sıfırlayırıq ki, dizayn gözlənilməz boşluqlarla başlamasın.

```css
body {
  background-color: #add8e6;
```
`#add8e6` — hex rəng kodu. `#RR GG BB` formatındadır: `AD` qırmızı (173), `D8` yaşıl (216), `E6` mavi (230) — bu dəyərlər açıq mavi rəng verir (ingilis dilindəki "light blue").

```css
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
```
Sıralama soldan sağa üstünlüklə oxunur. Brauzer `Segoe UI` (Windows-a məxsus font) axtarır, tapmazsa `Tahoma`, tapmazsa `Geneva`, tapmazsa `Verdana`, ən sonda isə sistemdəki istənilən `sans-serif` (serifizsiz) fontu işlədilir.

```css
  min-height: 100vh;
```
`vh` (viewport height) vahidi — ekran hündürlüyünün faizini bildirir. `100vh` = ekranın tam hündürlüyü. `min-height` deyildiyi üçün məzmun az olsa belə `body` bütün ekranı doldurur, arxa fon rəngi yarımçıq dayanmır.

---

## 2. `src/App.module.css` — App Komponentinin Stilləri

CSS Module olduğundan bu siniflər yalnız `App.jsx`-ə aiddir. Başqa komponentlər eyni adlı sinif işlətse belə toqquşmur.

```css
.app {
  max-width: 900px;
```
Məzmunun maksimum eni 900px-dir. Ekran daha geniş olsa da konteyner genişləmir; saytın çox hər iki tərəfə yayılmaması üçündür.

```css
  margin: 0 auto;
```
`0` — üst/alt margin. `auto` — sol/sağ margin avtomatik bərabər hesablanır. Nəticədə konteyner həmişə sayfanın ortasında yerləşir.

```css
  padding: 32px 16px;
```
İki dəyər: `32px` üst/alt, `16px` sol/sağ daxili boşluq. Məzmun konteyner kənarlarına yapışmır.

```css
  display: flex;
  flex-direction: column;
```
CSS Flexbox aktivdir. `flex-direction: column` — uşaq elementlər şaquli, alt-alta dizilir (default `row` yatay dizim).

```css
  align-items: center;
```
Flexbox-da `column` istiqamətdə `align-items` üfüqi (x) oxu idarə edir. `center` — bütün uşaq elementlər mərkəzə yığılır.

```css
  gap: 24px;
```
Uşaq elementlər arasındaki boşluq 24px. `gap` — `margin` istifadə etmədən elementlərarası məsafəni idarə etməyin müasir Flexbox/Grid üsuludur.

```css
.pokemonGrid {
  display: flex;
  flex-wrap: wrap;
```
`display: flex` — kartlar üfüqi sıralanır. `flex-wrap: wrap` — kartlar `div` içinə sığmayanda növbəti sətirə keçir, kəsilmir.

```css
  justify-content: center;
```
`row` istiqamətdə `justify-content` üfüqi (x) oxunu idarə edir. `center` — kartlar ortalı yerləşdirilir.

```css
  gap: 16px;
```
Kartlar arasında 16px boşluq (həm sətirdaxili, həm sətirlərarası).

---

## 3. `src/components/Button/Button.module.css`

```css
.btn {
  border: none;
```
Brauzerin default düymə kənarı (border) silinir.

```css
  border-radius: 6px;
```
Düymənin küncləri 6px radiusla yuvarlaqlaşdırılır.

```css
  font-weight: 600;
  cursor: pointer;
```
`font-weight: 600` — yarımqalın (semi-bold) mətn. `cursor: pointer` — siçan üzərinə gəldikdə əl (☝) ikonası göstərilir; istifadəçiyə kliklenə biləcəyini bildirir.

```css
  color: #fff;
```
Mətn rəngi ağ — bütün variantlarda rəngli fon üzərindədir.

```css
  transition: filter 0.15s;
```
Hover zamanı `filter` xüsusiyyətinin dəyişimi 0.15 saniyəlik hamar animasiya ilə baş verəcək.

```css
  display: inline-flex;
  align-items: center;
  justify-content: center;
```
`inline-flex` — düymə sətir içindəki element kimi davranır amma Flexbox xüsusiyyətlərindən istifadə edir. `align-items` + `justify-content: center` — məzmun (`children`) həm şaquli, həm üfüqi olaraq mərkəzlənir. `+` və `-` kimi tək simvollu düymələr tam ortada görünür.

```css
.btn:hover {
  filter: brightness(0.88);
```
Hover-da düymə 12% qaralaşır (`1.0` normal parlaq, `0.88` biraz tünd). Bu üsul bütün variant rənglərinə eyni hover effekti verir — hər variant üçün ayrıca hover yazmağa ehtiyac qalmır.

```css
.primary { background: #2979ff; padding: 8px 14px; font-size: 0.9rem; }
```
"Add to Team" düyməsi. `#2979ff` — parlaq mavi. `8px 14px` — üst/alt 8, sol/sağ 14px padding. `0.9rem` — kök elementin font ölçüsünün 90%-i.

```css
.danger { background: #d32f2f; padding: 6px 14px; font-size: 0.9rem; }
```
"Remove" düyməsi. `#d32f2f` — Material Design-ın standart qırmızısı (Red 700).

```css
.inc { background: #2e7d32; width: 32px; height: 32px; font-size: 1.2rem; }
```
`+` düyməsi. `#2e7d32` — tünd yaşıl (Green 800). `32×32px` sabit ölçü — kvadrat düymə görünüşü verir.

```css
.dec { background: #ffa000; width: 32px; height: 32px; font-size: 1.2rem; }
```
`-` düyməsi. `#ffa000` — Amber 700 (narıncı-sarı). Eyni kvadrat ölçü.

---

## 4. `src/components/Title/Title.module.css`

```css
.h1 {
  font-size: 2.4rem;
  font-weight: 800;
  color: #1a1a2e;
  text-align: center;
}
```
`2.4rem` — tipik brauzer base font-u 16px olduqda `38.4px`. `font-weight: 800` — Extra Bold (900 yox 800, çünki çox yoğun görünür). `#1a1a2e` — tünd donanma mavisi (navy), siyah deyil. `text-align: center` — başlıq mətni hər zaman ortalı.

```css
.h2 {
  font-size: 1.6rem;
  font-weight: 700;
  color: #1a1a2e;
  text-align: center;
}
```
`1.6rem` ≈ 25.6px. İstifadə yeri: "Your Pokemon Team", "Total Pokemon in Team: N".

```css
.h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a2e;
}
```
`1.1rem` ≈ 17.6px. Kiçik alt başlıq üçün. `text-align` yoxdur — standart sola hizalı qalır.

---

## 5. `src/components/PokemonCard/PokemonCard.module.css`

```css
.card {
  background: #fff;
  border-radius: 12px;
```
Ağ fon. `border-radius: 12px` — dörd künc 12px radiusla yuvarlaqlaşdırılır; kart görünüşü yaradır.

```css
  padding: 20px 16px;
  width: 160px;
```
Üst/alt 20px, sol/sağ 16px daxili boşluq. Sabit 160px en — bütün kartlar eyni ölçüdə olsun. Kartların içindəki məzmun ölçüyə sığdırılır.

```css
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
```
Flexbox column: şəkil, ad, düymə alt-alta dizilir. `align-items: center` — hamısı üfüqi olaraq ortalı. `gap: 10px` — elementlər arası boşluq.

```css
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
```
Kölgə sintaksisi: `offset-x offset-y blur-radius color`. `0` — üfüqi sürüşmə yoxdur. `2px` — kölgə 2px aşağı düşür. `8px` — kölgənin yayılma (bulanıqlıq) radiusu. `rgba(0,0,0,0.1)` — 10% şəffaflıqla qara. Karta zərif dərinlik effekti verir.

```css
.name { font-size: 1.05rem; font-weight: 600; color: #1a1a2e; }
```
Pokemon adı — ortadan bir az böyük (1.05rem), yarımqalın, tünd rəng.

> **Qəyd:** `.btnAdd` sinifi fayldadır, lakin artıq istifadə edilmir — düymə stilleri `Button.module.css`-də idarə olunur.

---

## 6. `src/components/TeamList/TeamList.module.css`

```css
.list { width: 100%; display: flex; flex-direction: column; gap: 10px; }
```
Tam en işgal edir. Column flex — sıralar alt-alta. 10px boşluq.

```css
.row {
  background: #fff;
  border-radius: 10px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
```
Hər komanda üzvü üçün ağ kart. `border-radius: 10px` — yuvarlaq künclər. `display: flex; align-items: center` — sprite, ad, kontrol düymələri eyni sətirdə şaquli olaraq ortalı. `box-shadow` — çox yüngül kölgə (`0.08` = 8% şəffaflıq, kart CSS-indəki `0.1`-dən daha zərif).

```css

.name { flex: 1; font-size: 1rem; font-weight: 500; color: #1a1a2e; }
```
`flex: 1` — ad elementi mövcud boş bütün geniş məkanı tutur. Bu sayədə kontrol düymələri həmişə sağ tərəfdə qalır, ad isə aralarını doldurur.

```css
.controls { display: flex; align-items: center; gap: 8px; }
```
Düymələr və say `<span>`-ini bir arada saxlayan konteyner. `gap: 8px` — aralarında 8px boşluq.

```css
.count { font-size: 1rem; font-weight: 600; min-width: 20px; text-align: center; }
```
Say göstəricisi. `min-width: 20px` — say 1 rəqəmdən 2 rəqəmə keçdikdə düymələr sıçramır; minimum 20px yer tutulur.

> **Qəyd:** `.btnDec`, `.btnInc`, `.btnRemove` siniffləri fayldadır, lakin artıq istifadə edilmir — düymə stilleri `Button.module.css`-də idarə olunur.

---

## 7. `src/components/TeamStats/TeamStats.module.css`

```css
.wrapper { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 12px; }
```
Tam en, column flex, mərkəzlənmiş məzmun, 12px boşluq.

```css
.table {
  width: 100%;
  border-collapse: collapse;
```
`border-collapse: collapse` — HTML cədvəlində hər xananın öz kənarı var, bu dəyər onları birləşdirir: iki xana arasında 2 xətt yox, 1 xətt görünür.

```css
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
```
`border-radius: 10px` — cədvəl künclərini yuvarlaqlaşdırır. Ancaq `<table>` elementinə `border-radius` birbaşa tam işləmir; `overflow: hidden` əlavə edilməlidir — köşe xaricindəki məzmunu kəsir, yuvarlaq effekt tam görünür.

```css
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
```
Digər kartlarla uyğun, yüngül kölgə.

```css
.table th {
  background: #f5f5f5;
  padding: 12px 20px;
  font-weight: 700;
  font-size: 0.95rem;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
```
`th` — başlıq xanaları. `#f5f5f5` — çox açıq boz fon (saflıqdan bir az ayrılır). `border-bottom: 1px solid #e0e0e0` — başlıq ilə məlumat sıralarını ayıran tünd boz xətt.

```css
.table td {
  padding: 12px 20px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
```
`td` — məlumat xanaları. `#f0f0f0` — başlıq ayırıcısından daha açıq rəng; sıralar arasında zərif xətt.

```css
.statName { color: #2e7d32; font-weight: 600; }
```
Ad sütunu — yaşıl rəng. `#2e7d32` — eyni rəng `.inc` düyməsi ilə uyğundur, dizayn tutarlılığı yaradır.

```css
.statCount { color: #d32f2f; font-weight: 700; }
```
Say sütunu — qırmızı, qalın. `#d32f2f` — `.danger` düyməsinin rəngi ilə eynidir.

```css
.statLabel { font-weight: 600; color: #1a1a2e; }
```
Label sütunu — standart tünd rəng, yarımqalın. "Pokemon" / "Pokemons" mətnini göstərir.

---

## 8. `src/components/PokemonSprite/PokemonSprite.module.css`

Sprite şəkilinin bütün stillləri bu fayla köçürülüb — `PokemonCard` və `TeamList` modullarında ayrıca `.sprite` sinifi daha yoxdur.

```css
.sprite {
  image-rendering: pixelated;
  display: block;
}
```
`image-rendering: pixelated` — brauzer kiçik şəkilləri böyüdərkən kənarları hamarlamaz, kəskin piksel formasında saxlayır. Pokemon sprite-ları orijinal olaraq 96×96 pikseldir; piksel sənəti olduqundan kəskin görünüş daha uygun dur. `display: block` — `<img>` default olaraq inline elementdir; `block` altında körpü boşluqu (baseline gap) aradan qalxır.

```css
.sm {
  width: 44px;
  height: 44px;
}
```
Kiçik ölçü — `TeamList`-də hər komanda sırasında istifadə olunur. Dar stilin içində sığır.

```css
.md {
  width: 80px;
  height: 80px;
}
```
Orta ölçü — `PokemonCard`-daklı kartın əsas görünmə ölçüsüdür. Hər iki ölçü eyni komponentdə `size` prop vasitəsilə seçilir.
