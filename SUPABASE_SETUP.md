# Supabase Kurulumu ve Konfigürasyonu

Bu dosya blog projenizi Vercel'de tüm cihazlardan erişilebilir hale getirmek için Supabase kurulumunu açıklar.

## 1. Supabase Hesabı Oluşturma

1. https://supabase.com/ adresine gidin
2. "Start your project" butonuna tıklayın
3. GitHub hesabınızla giriş yapın (ücretsiz)

## 2. Yeni Proje Oluşturma

1. Dashboard'da "New Project" butonuna tıklayın
2. Proje adını "blog-website" olarak yazın
3. Güçlü bir database password oluşturun (kaydedin!)
4. Region olarak "Europe West (Ireland)" seçin
5. "Create new project" butonuna tıklayın
6. Proje oluşturulmasını bekleyin (2-3 dakika)

## 3. Database Tablosu Oluşturma

1. Sol menüden "SQL Editor" seçin
2. Aşağıdaki SQL komutunu yapıştırın ve çalıştırın:

```sql
-- Blog içeriklerini saklayacak tablo
CREATE TABLE blog_content (
  id BIGSERIAL PRIMARY KEY,
  content_type TEXT NOT NULL,
  content_data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndex ekleme (performans için)
CREATE INDEX idx_blog_content_type ON blog_content(content_type);

-- RLS (Row Level Security) kapatma (genel erişim için)
ALTER TABLE blog_content ENABLE ROW LEVEL SECURITY;

-- Herkese okuma izni verme
CREATE POLICY "Enable read access for all users" ON blog_content
FOR SELECT USING (true);

-- Herkese yazma izni verme (admin kontrolü için)
CREATE POLICY "Enable write access for all users" ON blog_content
FOR ALL USING (true);
```

## 4. Supabase Ayarlarını Alma

1. Sol menüden "Settings" > "API" seçin
2. Aşağıdaki bilgileri kopyalayın:
   - **Project URL** (https://xyz.supabase.co formatında)
   - **anon public key** (uzun bir string)

## 5. Kodunuzda Konfigürasyon

`supabase-config.js` dosyasını açın ve aşağıdaki değerleri güncelleyin:

```javascript
const SUPABASE_CONFIG = {
    url: 'BURAYA_PROJECT_URL_YAZIN', // Örnek: https://abcdefghijk.supabase.co
    key: 'BURAYA_ANON_KEY_YAZIN'     // Uzun anon key string'i
};
```

## 6. Test Etme

1. Projenizi yerel olarak çalıştırın
2. Admin panelinden blog yazısı, resim veya video ekleyin
3. Browser'ın Developer Tools > Console'unda "✅ Supabase başarıyla yüklendi" mesajını görmeli
4. Farklı bir browser/cihazdan açtığınızda veriler görünmeli

## 7. Vercel'e Deploy

1. Kodunuzu GitHub'a push edin
2. Vercel'de projeyi yeniden deploy edin
3. Farklı cihazlardan test edin

## Önemli Notlar

- ✅ **Ücretsiz Plan**: 500MB database + 2GB transfer/ay
- ✅ **Otomatik Yedekleme**: Veriler Supabase'de güvenli
- ✅ **Gerçek Zamanlı**: Değişiklikler anında senkronize
- ✅ **Offline Destek**: İnternet yokken localStorage kullanır

## Hata Giderme

### "Supabase yüklenemedi" Hatası
- Supabase URL ve key'i kontrol edin
- Browser console'unda hata mesajları olup olmadığına bakın

### "RLS policy violation" Hatası
- SQL komutlarını tekrar çalıştırın
- Table permissions'ları kontrol edin

### Veriler Görünmüyor
- Console'da "✅ Blog yazısı yüklendi" mesajlarını kontrol edin
- Database'de veriler var mı kontrol edin: Supabase Dashboard > Table Editor

## Başarı!

Artık blog yazınız, resiminiz ve YouTube videonuz tüm cihazlardan erişilebilir! 🎉
