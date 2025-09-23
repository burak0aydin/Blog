-- Blog içeriklerini saklayacak tablo
CREATE TABLE blog_content (
  id BIGSERIAL PRIMARY KEY,
  content_type TEXT NOT NULL UNIQUE,
  content_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performans için index
CREATE INDEX idx_blog_content_type ON blog_content(content_type);

-- Otomatik güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger oluştur
CREATE TRIGGER update_blog_content_updated_at 
    BEFORE UPDATE ON blog_content 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) aktif et
ALTER TABLE blog_content ENABLE ROW LEVEL SECURITY;

-- Herkese okuma izni
CREATE POLICY "Enable read access for all users" ON blog_content
FOR SELECT USING (true);

-- Herkese yazma izni  
CREATE POLICY "Enable write access for all users" ON blog_content
FOR ALL USING (true);

-- Örnek veri ekle
INSERT INTO blog_content (content_type, content_data) VALUES 
('text', '{
  "title": "Hoşgeldiniz - Supabase Aktif!",
  "content": "Bu blog yazısı Supabase veritabanından geliyor! Artık tüm cihazlardan erişilebilir. Admin panelinden yeni içerikler ekleyebilirsiniz.",
  "createdDate": "2025-09-23T12:00:00.000Z"
}');

-- Verileri kontrol et
SELECT * FROM blog_content;
