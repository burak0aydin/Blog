-- Önce mevcut verileri kontrol et
SELECT * FROM blog_content;

-- Örnek veri ekle (eğer hata verirse önemli değil)
INSERT INTO blog_content (content_type, content_data) VALUES 
('text', '{
  "title": "Hoşgeldiniz - Supabase Aktif!",
  "content": "Bu blog yazısı Supabase veritabanından geliyor! Artık tüm cihazlardan erişilebilir. Admin panelinden yeni içerikler ekleyebilirsiniz.",
  "createdDate": "2025-09-23T12:00:00.000Z"
}');

-- Sonucu kontrol et
SELECT * FROM blog_content;
