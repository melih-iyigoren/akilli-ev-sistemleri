📡 Online Akıllı Ev Sistemi Otomasyon Programı

🧾 Proje Hakkında

Bu proje, kullanıcıların birden fazla evi için oda, cihaz ve sensör yönetimini web üzerinden gerçekleştirebilmesini sağlayan bir Akıllı Ev Otomasyon Sistemi yazılımıdır. Kullanıcılar sisteme giriş yaparak:

- Evlerini ve odalarını tanımlayabilir,
- Cihazları uzaktan kontrol edebilir,
- Sensör verilerini anlık olarak takip edebilirler.

Ayrıca bir yönetici (admin) paneli aracılığıyla tüm kullanıcılar, evler, odalar, cihazlar ve sensörler merkezi olarak izlenebilir ve yönetilebilir.

🎯 Projenin Amacı

- Farklı lokasyonlardaki evleri tek bir sistem üzerinden yönetebilmek,
- Kullanıcı ve yönetici bazlı yetkilendirme sistemi oluşturmak,
- Gerçek zamanlı cihaz/sensör kontrolü sağlamak,
- Veritabanı ilişkileri ve güvenliği en iyi düzeyde entegre etmek.

🧱 Kullanılan Teknolojiler

Frontend:
- React.js
- Chakra UI
- React Router

Backend:
- Node.js
- Express.js
- JSON Web Token (JWT)
- Bcrypt

Veritabanı:
- PostgreSQL
- 5NF normalizasyonu
- Index, View, Trigger kullanımı

🗃️ Veritabanı Yapısı

- `kullanici` (rol bilgisi ile birlikte)
- `ev`
- `oda`
- `cihaz`
- `sensor`

View ve Index’ler:
- Sık sorgulanan alanlar için index (örneğin: email, sensor_tipi)
- View: `kullanici_cihaz_bilgisi`, `kullanici_ev_bilgisi`

Trigger:
- `sensor_deger_kontrol`: Kritik değerlerde otomatik olarak `sensor_log` tablosuna kayıt atar.

📚 Yapılan Araştırmalar

- Node.js ile PostgreSQL `pg` kütüphanesi kullanımı ve asenkron bağlantı yönetimi
- React component yapısı, state ve router yönetimi
- Chakra UI ile kullanıcı dostu responsive arayüz geliştirme
- SQL normalizasyon (3NF → 5NF), performans odaklı veri tasarımı
- Trigger & View optimizasyonları

📈 Sistem Akışı (Görsel README'ye manuel eklenmeli)

→ Giriş / Kayıt
→ Rol kontrolü (Admin / Kullanıcı)
→ Dashboard
→ Ev → Oda → Cihaz → Sensör hiyerarşisi
→ Gerçek zamanlı kontrol & izleme

🛡️ Güvenlik

- Parola hashleme (bcrypt)
- JWT ile token bazlı oturum yönetimi
- Backend’de yetkilendirme kontrolü

📁 Proje Yapısı (Backend Örneği)

- db.js
- index.js
- routes/
- controllers/
- middleware/
- models/
- .env

✅ Sonuç

Bu proje ile:

- Tamamen ilişkisel bir veritabanı,
- Yetkilere dayalı kullanıcı sistemi,
- Gerçek zamanlı veri izleme,
- Modern web teknolojileriyle hazırlanmış bir arayüz
bir araya getirilmiş ve modüler bir akıllı ev otomasyon sistemi oluşturulmuştur.
