# KiBox Service

Web aplikacija za servisiranje i konfiguraciju računara.

## O projektu

KiBox Service je full-stack web aplikacija koja omogućava korisnicima da zakazuju termine za servisiranje računara, kontaktiraju servis, kao i da konfigurišu PC prema svom budžetu ili željenim igricama.

## Tehnologije

| Sloj | Tehnologija |
|---|---|
| Frontend | Angular 19 |
| Backend | Node.js + Express |
| Baza podataka | MongoDB Atlas (Mongoose) |
| Autentifikacija | JWT |
| Testiranje | Jest + Supertest |

## Arhitektura
```
kibox-service/
├── backend/
│   ├── config/          # Seed skripte
│   ├── controllers/     # Poslovna logika
│   ├── middleware/      # Auth middleware
│   ├── models/          # MongoDB šeme
│   ├── routes/          # API rute
│   ├── tests/           # Jest testovi
│   ├── app.js           # Express aplikacija
│   └── server.js        # Pokretanje servera
└── frontend/
    └── src/app/
        ├── components/  # Angular komponente
        ├── guards/      # Route guards
        └── services/    # HTTP servisi
```

## Funkcionalnosti

### Javni deo
- Prikaz informacija o servisu
- Zakazivanje termina za servis
- Kontakt forma

### Korisnički nalog
- Registracija i prijava
- PC Konfigurator (ručni odabir, po budžetu, po igricama)
- Čuvanje i poređenje konfiguracija

### Admin panel
- Pregled poruka
- Upravljanje terminima (potvrda/otkazivanje)
- Pregled zahteva za konfiguracije

## Pokretanje projekta

### Preduslovi
- Node.js (v18+)
- Angular CLI (`npm install -g @angular/cli`)

### Backend
```bash
cd backend
npm install
```

Kreiraj `.env` fajl u `backend` folderu:
```
MONGO_URI=tvoj_mongodb_atlas_connection_string
PORT=5000
JWT_SECRET=tvoj_secret_key
```
```bash
npm run dev
```

Backend radi na `http://localhost:5000`

### Frontend
```bash
cd frontend
npm install
ng serve
```

Frontend radi na `http://localhost:4200`

### Testovi
```bash
cd backend
npm test
```

### Seed (igrice u bazu)
```bash
cd backend
node config/seed.js
```

## API Endpoints

### Auth
| Method | Endpoint | Opis |
|---|---|---|
| POST | /api/auth/register | Registracija |
| POST | /api/auth/login | Prijava |

### Termini
| Method | Endpoint | Opis |
|---|---|---|
| POST | /api/appointments | Zakazivanje termina |
| GET | /api/appointments | Svi termini (admin) |
| PUT | /api/appointments/:id | Ažuriranje statusa (admin) |

### Poruke
| Method | Endpoint | Opis |
|---|---|---|
| POST | /api/messages | Slanje poruke |
| GET | /api/messages | Sve poruke (admin) |
| PUT | /api/messages/:id/read | Označi kao pročitano (admin) |

### Komponente
| Method | Endpoint | Opis |
|---|---|---|
| GET | /api/components | Sve komponente |
| POST | /api/components | Dodavanje (admin) |
| DELETE | /api/components/:id | Brisanje (admin) |

### Konfiguracije
| Method | Endpoint | Opis |
|---|---|---|
| POST | /api/configurations | Kreiranje |
| GET | /api/configurations/my | Moje konfiguracije |
| POST | /api/configurations/generate | Generisanje |
| GET | /api/configurations/all | Sve (admin) |
| DELETE | /api/configurations/:id | Brisanje |

### Igrice
| Method | Endpoint | Opis |
|---|---|---|
| GET | /api/games | Sve igrice |

## Autor

Bogdan Bogićević, 28/2022
Institut za matematiku i informatiku, Kragujevac