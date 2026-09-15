# مثال قاعدة بيانات Leads + توصيات (Postgres / MySQL / SQLite)

تشغيل سريع:
1. انسخ ملفات السكيمة المناسبة لقاعدة بياناتك (schema_postgres.sql أو schema_mysql.sql أو schema_sqlite.sql) ونفّذها.
2. ضع بيانات الاتصال في متغيرات البيئة:
   - DB_TYPE = postgres|mysql|sqlite
   - DATABASE_URL = (postgres/mysql connection string) — مثال: postgres://user:pass@localhost:5432/dbname
   - SQLITE_FILE = ./data.sqlite (لو اخترت sqlite)
3. ثبت الحزم:
   npm install
4. شغّل الخادم:
   DB_TYPE=postgres DATABASE_URL="..." npm start
5. افتح المتصفح: http://localhost:3000

ملاحظات:
- السكيمة تستخدم JSON/JSONB للمقاييس (Postgres/MySQL). في SQLite تُخزن JSON كنص ويتم تحليله في JS.
- عدّل قواعد التوصية في server.js حسب حاجتك (يمكنك استخدام تحليل pain_points أو درجات score).
- لتشغيل تلقائي لإرسال إيميلات/واتساب بعد إنشاء lead أضف تكامل مع Mailgun / Twilio داخل نهاية الـ POST /leads.
