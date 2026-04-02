# KiBox Service

> Web aplikacija za servisiranje i konfiguraciju računara

---

## Sadržaj

- [O projektu](#o-projektu)
- [Tehnologije](#tehnologije)
- [Arhitektura projekta](#arhitektura-projekta)
- [Funkcionalnosti](#funkcionalnosti)
- [Pokretanje projekta](#pokretanje-projekta)
- [API dokumentacija](#api-dokumentacija)
- [Testiranje](#testiranje)
- [Autor](#autor)

---

## O projektu

KiBox Service je full-stack web aplikacija namenjena servisu i konfiguraciji računara. Korisnicima omogućava da zakažu termin za servis, kontaktiraju tim i generišu optimalnu PC konfiguraciju prema budžetu ili željenim igricama. Admin panel pruža pregled svih zahteva, poruka i konfiguracija sa mogućnošću upravljanja terminima.

---

## Tehnologije

| Sloj | Tehnologija | Verzija |
|---|---|---|
| Frontend | Angular | 19 |
| Backend | Node.js + Express | 18+ |
| Baza podataka | MongoDB Atlas (Mongoose) | — |
| Autentifikacija | JWT (JSON Web Token) | — |
| Testiranje | Jest + Supertest | — |

---

## Arhitektura projekta

```
kibox-service/
├── backend/
│   ├── config/               # Seed skripte za inicijalnu bazu
│   ├── controllers/          # Poslovna logika (appointmentController, authController...)
│   ├── middleware/           # JWT autentifikacija (authMiddleware)
│   ├── models/               # Mongoose šeme (User, Appointment, Message...)
│   ├── routes/               # Express rute
│   ├── tests/                # Jest + Supertest testovi
│   ├── app.js                # Express aplikacija i middleware
│   └── server.js             # Pokretanje servera
└── frontend/
    └── src/app/
        ├── components/       # Angular komponente (stranice i UI elementi)
        ├── guards/           # Route guards (auth zaštita ruta)
        └── services/         # HTTP servisi za komunikaciju sa API-jem
```

---

## Funkcionalnosti

### Javni deo (bez prijave)
- Prikaz informacija o servisu
- Zakazivanje termina za servis
- Kontakt forma

### Korisnički nalog
- Registracija i prijava (JWT autentifikacija)
- PC Konfigurator — ručni odabir, generisanje po budžetu ili po igricama
- Čuvanje, pregled i slanje konfiguracija adminu

### Admin panel
- Pregled i upravljanje kontakt porukama
- Potvrda ili otkazivanje termina sa automatskim obaveštenjima korisnicima
- Pregled zahteva za konfiguracije

---

## Pokretanje projekta

### Preduslovi

- [Node.js](https://nodejs.org/) v18+
- Angular CLI: `npm install -g @angular/cli`
- MongoDB Atlas nalog sa aktivnom bazom

### 1. Backend

```bash
cd backend
npm install
```

Kreiraj `.env` fajl u `backend/` folderu:

```env
MONGO_URI=tvoj_mongodb_atlas_connection_string
PORT=5000
JWT_SECRET=tvoj_tajni_kljuc
```

```bash
npm run dev
```

Backend je dostupan na `http://localhost:5000`

### 2. Frontend

```bash
cd frontend
npm install
ng serve
```

Frontend je dostupan na `http://localhost:4200`

### 3. Seed (popunjavanje baze igricama i komponentama)

```bash
cd backend
node config/seed.js
```

---

## API dokumentacija

Svi zaštićeni endpointi zahtevaju `Authorization: Bearer <token>` header.

### Auth

| Metoda | Endpoint | Opis | Zaštita |
|---|---|---|---|
| POST | `/api/auth/register` | Registracija novog korisnika | — |
| POST | `/api/auth/login` | Prijava, vraća JWT token | — |

### Termini

| Metoda | Endpoint | Opis | Zaštita |
|---|---|---|---|
| POST | `/api/appointments` | Zakazivanje termina | — |
| GET | `/api/appointments` | Svi termini | Admin |
| GET | `/api/appointments/my` | Termini ulogovanog korisnika | Korisnik |
| PUT | `/api/appointments/:id` | Ažuriranje statusa (confirmed/cancelled) | Admin |
| PUT | `/api/appointments/seen` | Označi termine kao viđene | Korisnik |

### Poruke

| Metoda | Endpoint | Opis | Zaštita |
|---|---|---|---|
| POST | `/api/messages` | Slanje kontakt poruke | — |
| GET | `/api/messages` | Sve poruke | Admin |
| PUT | `/api/messages/:id/read` | Označi kao pročitano | Admin |

### Komponente

| Metoda | Endpoint | Opis | Zaštita |
|---|---|---|---|
| GET | `/api/components` | Sve komponente | — |
| GET | `/api/components?type=cpu` | Filtriranje po tipu | — |
| POST | `/api/components` | Dodavanje komponente | Admin |
| DELETE | `/api/components/:id` | Brisanje komponente | Admin |

### Konfiguracije

| Metoda | Endpoint | Opis | Zaštita |
|---|---|---|---|
| POST | `/api/configurations/generate` | Generisanje konfiguracije po budžetu | — |
| POST | `/api/configurations` | Čuvanje konfiguracije | Korisnik |
| GET | `/api/configurations/my` | Moje konfiguracije | Korisnik |
| PUT | `/api/configurations/:id/send` | Slanje konfiguracije adminu | Korisnik |
| DELETE | `/api/configurations/:id` | Brisanje konfiguracije | Korisnik |
| GET | `/api/configurations/all` | Sve konfiguracije | Admin |

### Igrice

| Metoda | Endpoint | Opis | Zaštita |
|---|---|---|---|
| GET | `/api/games` | Sve igrice sa zahtevima | — |
| POST | `/api/games` | Dodavanje igrice | Admin |
| DELETE | `/api/games/:id` | Brisanje igrice | Admin |

### Chat

| Metoda | Endpoint | Opis | Zaštita |
|---|---|---|---|
| GET | `/api/chats/my` | Chat ulogovanog korisnika | Korisnik |
| GET | `/api/chats/exists` | Provjera da li chat postoji | Korisnik |
| POST | `/api/chats/message` | Slanje poruke u chat | Korisnik |
| GET | `/api/chats` | Svi chatovi | Admin |
| GET | `/api/chats/:id` | Jedan chat po ID-u | Admin |

### Notifikacije

| Metoda | Endpoint | Opis | Zaštita |
|---|---|---|---|
| GET | `/api/notifications` | Notifikacije korisnika | Korisnik |
| PUT | `/api/notifications/read-all` | Označi sve kao pročitane | Korisnik |
| PUT | `/api/notifications/:id/read` | Označi jednu kao pročitanu | Korisnik |
| DELETE | `/api/notifications/read-all` | Obriši sve pročitane | Korisnik |
| DELETE | `/api/notifications/:id` | Obriši notifikaciju | Korisnik |

---

## Testiranje

Testovi pokrivaju sve API endpointe koristeći Jest i Supertest uz stvarnu MongoDB test bazu.

```bash
cd backend
npm test
```

Za pokretanje sa izveštajem pokrivenosti:

```bash
npm test -- --coverage
```

### Trenutna pokrivenost

| Kategorija | Pokrivenost |
|---|---|
| Statements | ~84% |
| Branches | ~72% |
| Functions | ~81% |
| Lines | ~86% |

Testovi su organizovani po modulima u `backend/tests/`:

- `auth.test.js` — registracija, prijava, JWT middleware
- `appointments.test.js` — zakazivanje, status, korisnički pregled
- `messages.test.js` — kontakt forma, admin pregled
- `components.test.js` — CRUD komponenti
- `configurations.test.js` — generisanje, čuvanje, admin pregled
- `games.test.js` — igrice i zahtevi
- `chat.test.js` — chat sistem
- `notifications.test.js` — notifikacije korisnika

---

## Autor

**Bogdan Bogićević**  
Indeks: 28/2022  
Institut za matematiku i informatiku, Univerzitet u Kragujevcu