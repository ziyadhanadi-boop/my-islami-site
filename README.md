# منصة إسلامي (Islamic Articles Platform)

هذا المشروع عبارة عن منصة مقالات إسلامية متكاملة (Full-Stack) تم تصميمها كـ Single Page Application عصري، وتتضمن لوحة تحكم للمديرين:
- **Backend:** Node.js, Express, MongoDB
- **Frontend:** React, Vite, React Router
- **Styling:** CSS خالص (بدون إطارات) بتصميم عصري وداعم للغة العربية (RTL)

## المتطلبات الأساسية
قبل البدء، تأكد من تثبيت البرامج التالية على جهازك:
1. [Node.js](https://nodejs.org/) (إصدار 18 فما فوق).
2. [MongoDB](https://www.mongodb.com/try/download/community) (يمكنك استخدام إصدار محلي أو خادم MongoDB Atlas السحابي).

## تعليمات التشغيل

### 1- تشغيل الخادم (Backend)
افتح موجه الأوامر (Terminal) في مسار المشروع وانتقل لمجلد الخادم:
```bash
cd server
npm install
npm run dev
```
سيعمل الخادم على المنفذ `5000`، وسيرتبط بقاعدة البيانات `islami_db`.

### 2- تشغيل واجهة المستخدم (Frontend)
افتح نافذة جديدة في موجه الأوامر وانتقل لمجلد الواجهة:
```bash
cd client
npm install
npm run dev
```
ستعمل الواجهة عادة على `http://localhost:5173`. قم بفتح الرابط في المتصفح.

## إعداد حساب المدير لأول مرة
تمت إضافة مسار (أداة سريعة) لإنشاء حساب إدمن لأول مرة (Bootstrap User):
ارسل طلب `POST` إلى `http://localhost:5000/api/auth/setup` باستخدام Postman أو أي أداة مشابهة يحتوي على:

```json
{
  "email": "ziyad@islami.com"",
  "password": "Ziyad@is1""
}
```
بعد نجاح الإنشاء، يمكنك تسجيل الدخول إلى لوحة التحكم من خلال الرابط:
`http://localhost:5173/admin/login

## هيكل المشروع وخصائصه
- `/client/src/pages`: يحتوي على الصفحات الرئيسية (الرئيسية، البحث بالأقسام، وتفاصيل المقال).
- `/client/src/pages/admin`: يتضمن لوحة تحكم خاصة بنظام إدارة محتوى كامل للمقالات.
- `/server/routes`: يحتوي على الـ APIs وإعداد رفع الصور عبر Multer بملف `uploads`.

تم تطبيق تصميم يراعي الخطوط العربية (Cairo & Tajawal) مع ألوان مريحة للعين ومتجاوبة مع جميع الشاشات.
