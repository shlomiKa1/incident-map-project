# מפת אירועים (Incident Map)

מערכת לדיווח ומעקב אחרי אירועים על מפה. משתמש מחובר רואה את כל הדיווחים כ-markers, מוסיף דיווח בלחיצה על המפה, מסנן לפי קטגוריה ומעדכן סטטוס.
כל יצירה, עדכון או מחיקה מגיעים לכל המחוברים בזמן אמת דרך Socket.IO, בלי לרענן את הדף.

## טכנולוגיות

**שרת (`backend`)**

- Node.js + Express
- MongoDB (דרייבר רשמי)
- Zod לולידציה
- JWT + bcrypt
- Socket.IO
- helmet, cors, cookie-parser
- `node:test` לבדיקות

**לקוח (`frontend`)**

- React + TypeScript (Vite)
- React Router
- Zustand
- Leaflet + react-leaflet (OpenStreetMap)
- Socket.IO Client

## התחברות עם Cookie

במפרט ההתחברות היא עם `Authorization: Bearer <token>`. אני בחרתי ב-**httpOnly cookie**:

- ה-token נשמר ב-cookie ש-JavaScript לא יכול לקרוא, ולכן קוד זדוני בדף לא יכול לגנוב אותו.
- השרת שם את ה-cookie ב-login וב-register, ומוחק אותו ב-`POST /auth/logout`.
- הלקוח שולח כל בקשה עם `credentials: "include"`, ובטעינת הדף שואל את השרת `GET /auth/me` כדי לדעת אם המשתמש מחובר.
- ה-Socket לא מאומת, לפי המפרט. הלקוח מתחבר רק בדף המפה, ומתנתק ב-logout.

שאר החוזה זהה למפרט: אותם נתיבים, אותם status codes, ואותו פורמט תשובה `{ success, data }` / `{ success, message }`.

## איך מריצים

את השרת אפשר להריץ באחת משתי דרכים: **עם Docker** או **בלי Docker**. הלקוח רץ תמיד עם `npm run dev`.

בשתי הדרכים, קודם יוצרים קובץ `backend/.env` לפי `backend/example.env`.

### שרת עם Docker

```bash
# מהתיקייה הראשית
docker compose up --build
```

זה הכל. ה-image מתקין את החבילות בעצמו, אין צורך ב-`npm install` בתיקיית `backend`.
פרטים על כתובת ה-DB בתוך Docker בסעיף [Docker](#docker) למטה.

### שרת בלי Docker

```bash
cd backend
npm install
```

יוצרים קובץ `.env` לפי `example.env`:

```
URI_MONGO=mongodb://127.0.0.1:27017
DB_NAME=incident-map
PORT=3000

CLIENT_ORIGIN=http://localhost:5173

SECRET_JWT=change-me-long-random
EXPIRE_JWT=1d
```

| משתנה           | מה זה                                                    |
| --------------- | -------------------------------------------------------- |
| `URI_MONGO`     | כתובת MongoDB: מקומי או Atlas                            |
| `DB_NAME`       | שם ה-DB                                                  |
| `PORT`          | הפורט של השרת                                            |
| `CLIENT_ORIGIN` | כתובת הלקוח, בשביל CORS. בדיוק כמו בדפדפן, בלי `/` בסוף |
| `SECRET_JWT`    | הסוד לחתימת ה-token. מחרוזת ארוכה ואקראית                |
| `EXPIRE_JWT`    | תוקף ה-token, תמיד עם יחידה: `1d`, `12h`                 |

ומריצים:

```bash
npm run dev
```

השרת עולה על `http://localhost:3000`. בדיקה: `GET /health`.

### לקוח

```bash
cd frontend
npm install
```

יוצרים קובץ `.env` לפי `example.env`:

```
VITE_API_URL=http://localhost:3000
```

ומריצים:

```bash
npm run dev
```

הלקוח עולה על `http://localhost:5173`.

### Docker

השרת רץ בקונטיינר, והקוד מתיקיית `backend` מחובר אליו (volume), כך ששינוי בקוד מגיע לקונטיינר בלי build מחדש.
ה-DB לא נמצא בקונטיינר. השרת מתחבר ל-MongoDB לפי `URI_MONGO` ב-`backend/.env`.

```bash
# מהתיקייה הראשית
docker compose up --build
```

השרת עולה על `http://localhost:3000`, והלקוח רץ כרגיל עם `npm run dev`.

**כתובת ה-DB בתוך Docker:**

| איפה ה-MongoDB          | `URI_MONGO`                                  |
| ----------------------- | -------------------------------------------- |
| Atlas                   | ה-URI של Atlas, כמו שהוא                     |
| מותקן על המחשב שלך     | `mongodb://host.docker.internal:27017`        |

בתוך קונטיינר, `127.0.0.1` הוא הקונטיינר עצמו ולא המחשב שלך, ולכן `localhost` לא יגיע ל-MongoDB שרץ על המחשב.

**הוספת חבילה ל-backend:** התיקייה `node_modules` שמורה ב-volume, ולכן חבילה חדשה לא תופיע בקונטיינר עד שמנקים אותו:

```bash
docker compose down -v
docker compose up --build
```

### בדיקות

```bash
cd backend
npm test
```

## הבדיקות שעשיתי

### מה-acceptance checklist במפרט

| דרישה מהמפרט                                   | איך בדקתי                                                              |
| ---------------------------------------------- | ---------------------------------------------------------------------- |
| Register / Login עובדים, הסיסמה לא חוזרת       | `auth.service.test.js`: אין `passwordHash` בתשובה, וב-Network בדפדפן   |
| כל נתיבי incidents דורשים התחברות              | Postman: בלי cookie מתקבל 401                                          |
| ה-markers מגיעים מה-DB                         | דיווחים שנוצרו ב-Postman מופיעים על המפה                               |
| לחיצה על marker מציגה פרטים                    | popup עם כותרת, תיאור, קטגוריה, סטטוס ותאריכים                         |
| לחיצה על המפה ממלאת lat / lng בטופס            | מצב "Add incident", לחיצה, והקואורדינטות מופיעות בטופס                 |
| Filter לפי קטגוריה                             | בחירת קטגוריה מסתירה את שאר ה-markers                                  |
| רק בעלים או admin מעדכנים ומוחקים, אחר מקבל 403 | משתמש שני: אין כפתורים ב-UI, וב-Postman PATCH ו-DELETE מחזירים 403      |
| status תומך ב-open / in_progress / closed      | שינוי ב-popup, וערך אחר נדחה ב-Zod עם 400                              |
| center / zoom מוגדרים                          | המפה נפתחת על מרכז ישראל                                               |
| לקוח אחר רואה שינוי בלי רענון                  | שני משתמשים, חלון רגיל וחלון incognito: יצירה, עדכון ומחיקה מגיעים לשני |

### בנוסף

- **הרשמה:** email קיים מחזיר 409, ו-`role` שנשלח מהלקוח נמחק ב-Zod.
- **התחברות:** סיסמה שגויה ו-email לא קיים מחזירים אותה הודעה, `Invalid credentials`.
- **ולידציה:** id לא תקין מחזיר 400, PATCH עם body ריק מחזיר 400, ו-`createdBy` לא מתקבל מהלקוח.
- **סדר שגיאות:** דיווח שלא קיים מחזיר 404 לפני 403.
- **בלי כפילויות:** מי שיוצר דיווח מקבל גם את תשובת השרת וגם את ה-event, ומופיע רק marker אחד.

## מבנה תיקיות

```
space-incident-map/
├── docker-compose.yaml
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── example.env
│   ├── package.json
│   └── src/
│       ├── index.js                # מחבר הכל: DB, repositories, services, controllers, app, socket
│       ├── app.js                  # Express: middleware, נתיבים, 404 ו-error handler
│       ├── config.js               # משתני סביבה
│       ├── db/
│       │   └── db.js               # חיבור ל-MongoDB ו-index ייחודי על email
│       ├── DAL/                    # שאילתות ל-DB בלבד
│       │   ├── repository.js       # find, findOne, insertOne, update, remove
│       │   ├── user.dal.js         # + findByEmail
│       │   └── incidents.dal.js
│       ├── mappers/                # מסמך של Mongo לצורת החוזה (_id ל-id, בלי passwordHash)
│       │   ├── user.mapper.js
│       │   └── incident.mapper.js
│       ├── services/               # חוקים: status = open, createdBy מה-token, תאריכים
│       │   ├── auth.service.js
│       │   └── incident.service.js
│       ├── controllers/            # קורא ל-service, משדר ב-socket, ועונה
│       │   ├── auth.conroller.js
│       │   └── incident.controller.js
│       ├── routes/                 # נתיבים, ולידציה והרשאות
│       │   ├── auth.route.js
│       │   └── incidents.route.js
│       ├── middleware/
│       │   ├── authMiddleware.js   # בודק את ה-cookie
│       │   ├── requireOwnerAdmin.js # 404, ואז 403 אם לא בעלים ולא admin
│       │   ├── validate.js         # Zod על body, params ו-query
│       │   ├── logger.js
│       │   └── error.handler.js    # פורמט שגיאה אחיד
│       ├── schema/                 # Zod: רק מה שהלקוח רשאי לשלוח
│       │   ├── user.js
│       │   └── incident.js
│       ├── utils/
│       │   ├── AppError.js
│       │   ├── generateToken.js
│       │   └── socket.js           # initSocket, getIO, notifier
│       └── tests/
│           └── services/
│               └── auth.service.test.js
│
└── frontend/
    ├── example.env
    ├── package.json
    └── src/
        ├── main.tsx
        ├── App.tsx                 # נתיבים
        ├── Layout.tsx              # Header + הדף
        ├── config.ts               # VITE_API_URL
        ├── types/                  # החוזה מול השרת
        ├── api/
        │   ├── client.ts           # fetch עם credentials: include ופורמט שגיאה אחיד
        │   ├── auth.api.ts
        │   └── incident.api.ts
        ├── store/
        │   ├── auth.store.ts       # user ו-status (checking / authenticated / guest)
        │   └── incidents.store.ts  # רשימה, upsert, remove, קטגוריה
        ├── hooks/
        │   ├── useAuth.ts          # login, logout
        │   ├── useAuthCheck.ts     # GET /auth/me בטעינה
        │   ├── useIncidents.ts     # טעינה, פעולות וסינון
        │   └── useIncidentSocket.ts # מאזין ל-3 ה-events ומעדכן את ה-store
        ├── socket/
        │   └── socket.ts
        ├── routes/
        │   └── ProtectedRoute.tsx
        ├── pages/
        │   ├── LoginPage.tsx
        │   ├── RegisterPage.tsx
        │   ├── MapPage.tsx         # הדף היחיד שמדבר עם ה-hooks
        │   └── NotFoundPage.tsx
        ├── componenets/
        │   ├── Header.tsx
        │   ├── incidents/
        │   │   ├── CategoryFilter.tsx
        │   │   ├── IncidentDetails.tsx  # פרטים, וכפתורים רק לבעלים
        │   │   └── IncidentForm.tsx
        │   └── map/
        │       ├── IncidentMap.tsx
        │       ├── IncidentMarker.tsx
        │       └── MapClickHandler.tsx  # לחיצה על המפה מחזירה { lat, lng }
        ├── map/
        │   └── leafletIcon.ts      # תיקון האייקון של Leaflet ב-Vite
        └── utils/
            └── permissions.ts      # מי רואה את הכפתורים (התצוגה בלבד, השרת בודק)
```

## admin

אי אפשר להירשם כ-admin. ה-`role` שנשלח מהלקוח נמחק.
כדי ליצור admin: נרשמים רגיל, משנים ב-DB את `role` ל-`"admin"`, ומתחברים מחדש.
admin יכול לעדכן ולמחוק כל דיווח.