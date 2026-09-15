# مثال قاعدة بيانات Leads + توصيات (Postgres / MySQL / SQLite)

هذا المشروع هو مثال بسيط لتخزين Leads وتقديم توصيات دراسات حالة (case studies) باستخدام Node.js وExpress وقاعدة بيانات (Postgres/MySQL/SQLite). كما تضمن المشروع إعدادات Docker لتشغيل التطبيق وقاعدة البيانات محليًا بسهولة.

## المحتويات
- `package.json`, `server.js` — خادم Express وواجهة API
- `schema_postgres.sql`, `schema_mysql.sql`, `schema_sqlite.sql` — سكيمات قواعد البيانات
- `seed.sql`, `seed.js` — بيانات تجريبية وسكربت لملئها
- `Dockerfile`, `docker-compose.yml` — لتشغيل التطبيق وقاعدة البيانات عبر Docker
- `public/` — واجهة بسيطة (index.html, app.js)

---

## تشغيل سريع (Docker)
1. تأكد أنك مثبت Docker وDocker Compose.
2. من جذر المشروع شغّل:

   docker compose up --build

   هذا سيبني صورة التطبيق، يشغّل حاوية PostgreSQL وحاوية التطبيق، وسيجري `npm install` ثم يحاول تشغيل `npm run seed` لملء البيانات التجريبية.

3. افتح المتصفح:

   http://localhost:3000

ملاحظات:
- إن لم تجهز قاعدة البيانات قبل محاولة تشغيل السكربت `seed` قد يفشل، لذلك إذا فشل الـ seed اتبع الخطوات اليدوية أدناه.

### حل مشكلة seed (يدوي)
1. شغّل قاعدة البيانات فقط:

   docker compose up db

2. عندما يصبح الـ DB جاهزًا نفّذ seed يدويًا من حاوية التطبيق:

   docker compose run --rm app npm run seed

3. ثم شغّل التطبيق:

   docker compose up app

يمكنك أيضًا مراقبة سجلات حاوية الـ DB للتحقق من جاهزيته:

   docker compose logs -f db

---

## تشغيل محلي بدون Docker
1. نفّذ السكيمة المناسبة في قاعدة بياناتك:
   - PostgreSQL: `psql -d your_db_name -f schema_postgres.sql`
   - MySQL: `mysql -u user -p your_db_name < schema_mysql.sql`
   - SQLite: `sqlite3 data.sqlite < schema_sqlite.sql`

2. ضبط متغيرات البيئة (مثال PostgreSQL):

   export DB_TYPE=postgres
   export DATABASE_URL="postgres://user:pass@localhost:5432/your_db_name"

   أو لـ Windows PowerShell:

   $env:DB_TYPE = 'postgres'
   $env:DATABASE_URL = 'postgres://user:pass@localhost:5432/your_db_name'

   أو لـ SQLite:

   export DB_TYPE=sqlite
   export SQLITE_FILE=./data.sqlite

3. ثبت الحزم:

   npm install

4. شغّل seed لملء البيانات (اختياري لكن مفيد للعرض):

   npm run seed

5. شغّل التطبيق:

   npm start

6. افتح المتصفح:

   http://localhost:3000

---

## توصيات تشغيلية
- لتقليل حجم صورة Docker يمكنك إضافة ملف `.dockerignore` يحتوي على `node_modules`, `npm-debug.log`, وملفات التطوير المحلية.
- إذا أردت أن أضبط صورة Docker لاستخدام `npm ci` أو أُحسّن Dockerfile للـ production أخبرني.
- لإضافة CI (GitHub Actions) أبني Docker أو أشغّل اختبارات بسيطة يمكنني إضافته كخطوة لاحقة.

---

## ملاحظات حول التخصيص
- `server.js` يحتوي على منطق بسيط لاختيار نوع قاعدة البيانات عبر المتغير `DB_TYPE`، ويمكن تعديل منطق التوصية بسهولة (مثلاً استخدام `pain_points` لحساب تشابه أو استخدام خوارزمية ترتيب مخصّصة).
- في Postgres نقوم بتخزين `key_metrics` كـ JSONB مما يسهل الفرز حسب `roi_pct`؛ في SQLite يتم تخزينه كنص ويتم تحليله في جانب الخادم.

---

إذا أردت الآن أستطيع:
- فتح Pull Request لدمج `leads-setup` إلى `main`،
- إضافة `.dockerignore` و/أو تحسينات على `Dockerfile`,
- إضافة GitHub Actions CI لبناء الحاويات وتشغيل seed للتحقق.

اخبرني أي خيار تريدني أن أنفّذ بعد حفظ هذا التعديل.
