# Lacca's Bot

Multifunkciós Discord bot: moderálás, gazdaság/szint rendszer, ticket rendszer,
nyereményjátékok, fun parancsok, automatizmusok (welcome/bye/sticky/afk/counter)
és egy AI-alapú `/prompt` szerver-építő parancs.

## Telepítés

1. Töltsd le/másold ezt a mappát a szerveredre (vagy saját géped).
2. Telepítsd a Node.js-t (18-as vagy újabb verzió ajánlott).
3. Másold le a `.env.example` fájlt `.env` néven (Railway-en/más hosting
   platformon ez a "Variables" fület jelenti, nem kell fájlt csinálni), és
   töltsd ki:
   - `DISCORD_TOKEN` — a bot tokenje a Discord Developer Portalról
   - `CLIENT_ID` — a bot alkalmazás ID-ja
   - `GUILD_ID` — (opcionális) a teszt szervered ID-ja, ha csak egy szerveren
     akarod azonnal tesztelni a parancsokat (globális parancsoknál akár 1 órát
     is várni kell, mire mindenhol megjelennek)
   - `GEMINI_API_KEY` — csak akkor kell, ha a `/prompt` parancsot használni
     akarod. Ingyenes: menj a **aistudio.google.com** oldalra, jelentkezz be
     Google fiókkal, és a "Get API key" gombbal kártya nélkül generálhatsz
     egyet — a Gemini API-nak van tartósan ingyenes szintje.
4. Indítsd el a botot:
   ```
   npm start
   ```
   Ez **automatikusan** lefuttatja a `npm install`-t (Railway/hasonló
   platformokon ezt magától megteszi buildeléskor), regisztrálja a slash
   parancsokat, majd elindítja a botot — nincs szükség külön lépésre.

   Saját gépen, ha még nincs telepítve semmi, előtte futtasd egyszer:
   ```
   npm install
   ```

### Railway-en

A `railway.json` fájl már tartalmazza a build (`npm install`) és indítási
(`npm start`) parancsokat, tehát a GitHub repo Railway-hez kötése után nincs
más dolgod, mint kitölteni a **Variables** fület a fenti négy változóval —
onnantól minden automatikus, minden újraindításnál is.

## Szükséges bot jogosultságok / intentek

A Discord Developer Portalon a bot beállításainál engedélyezd:
- Server Members Intent
- Message Content Intent

Meghíváskor legalább az alábbi jogosultságok kellenek (vagy Administrator,
egyszerűség kedvéért): Manage Roles, Manage Channels, Kick Members,
Ban Members, Moderate Members, Manage Messages, Manage Nicknames,
Manage Guild.

## Parancs kategóriák

- **moderation** — ban, kick, unban, warn, warnings, timeout, untimeout,
  purge, lock, unlock, slowmode, setnick
- **fun** — oleles, pofon, csok, marry, valas, iq, joslas, kerdes, kpo,
  akasztofa, amoba
- **economy** — balance, daily, slot, shop, leaderboard
- **leveling** — rank, levelleaderboard (automatikus XP minden üzenetért)
- **utility** — userinfo, serverinfo, botinfo, invite, ping, avatar, help
- **tickets** — ticketsetup (panel gombbal), ticketclose, ticketclaim,
  ticketunclaim, ticketadd, ticketremove
- **giveaway** — gstart, gend, greroll
- **automation** — welcome, bye, sticky, afk, birthday, counter, autorole
- **serverbuilder** — `/prompt` — szöveges leírás alapján felépíti/kiegészíti
  a szerver kategória- és csatorna-struktúráját (meglévő névvel egyező
  kategóriát/csatornát nem duplikálja)

## Adatbázis

Az adatok egy helyi SQLite fájlban (`lacca.sqlite`) tárolódnak, ami az első
induláskor automatikusan létrejön. Nincs szükség külön adatbázis szerverre.

## Megjegyzések / ismert korlátok

- A giveaway rendszer 🎉 reakció alapú; ha a bot leáll a nyereményjáték
  közben, a lezárás időzítése elvész (a `/gend` paranccsal kézzel lezárható).
- A `/shop` parancs csak levonja a coint, a megvásárolt hatást (pl. szerepkör
  kiosztása) egyelőre kézzel kell rendezni — ez egyszerűen bővíthető.
- A `/prompt` parancs a Google Gemini API-t hívja, aminek van tartósan
  ingyenes szintje — nem kell hozzá bankkártya, csak egy Google fiók.
- Ez egy alap, működő verzió — bátran bővítsd tovább saját igény szerint,
  minden parancs külön fájlban van a `commands/` mappában.
