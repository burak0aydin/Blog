// Supabase Configuration
// Bu bilgileri Supabase dashboard'unuzdan alacaksınız
const SUPABASE_CONFIG = {
    url: 'https://siveyftuwgnavyoczhir.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdmV5ZnR1d2duYXZ5b2N6aGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2MjQyOTgsImV4cCI6MjA3NDIwMDI5OH0.aq8vlNDfQh19I3OLScGo5BxDD89v830LqLVvIbX0WW8'
};

// Supabase client'ı yükle (CDN üzerinden)
let supabase = null;

// Supabase'i dinamik olarak yükle
async function initSupabase() {
    if (!supabase) {
        // CDN üzerinden Supabase'i yükle
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        document.head.appendChild(script);
        
        return new Promise((resolve) => {
            script.onload = () => {
                supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);
                console.log('✅ Supabase başarıyla yüklendi');
                resolve();
            };
        });
    }
}

// Gelişmiş Storage Manager - hem localStorage hem de Supabase kullanır
class AdvancedStorageManager {
    static async init() {
        try {
            await initSupabase();
            console.log('✅ AdvancedStorageManager başlatıldı');
        } catch (error) {
            console.warn('⚠️ Supabase yüklenemedi, localStorage kullanılacak:', error);
        }
    }

    // İçerik kaydetme - hem local hem remote
    static async saveContent(type, data) {
        try {
            // Önce localStorage'a kaydet (hızlı erişim için)
            const key = `blog_${type}`;
            localStorage.setItem(key, JSON.stringify(data));
            console.log(`✅ ${type} localStorage'a kaydedildi`);

            // Sonra Supabase'e kaydet (kalıcı saklama için)
            if (supabase) {
                await this.saveToSupabase(type, data);
            }
        } catch (error) {
            console.error(`❌ ${type} kaydedilirken hata:`, error);
            throw error;
        }
    }

    // Supabase'e kaydetme
    static async saveToSupabase(type, data) {
        try {
            const record = {
                content_type: type,
                content_data: data,
                updated_at: new Date().toISOString()
            };

            // Önce mevcut kaydı kontrol et
            const { data: existing } = await supabase
                .from('blog_content')
                .select('id')
                .eq('content_type', type)
                .single();

            if (existing) {
                // Güncelle
                const { error } = await supabase
                    .from('blog_content')
                    .update(record)
                    .eq('content_type', type);
                
                if (error) throw error;
                console.log(`✅ ${type} Supabase'de güncellendi`);
            } else {
                // Yeni kayıt ekle
                const { error } = await supabase
                    .from('blog_content')
                    .insert([record]);
                
                if (error) throw error;
                console.log(`✅ ${type} Supabase'e eklendi`);
            }
        } catch (error) {
            console.error(`❌ Supabase'e ${type} kaydedilirken hata:`, error);
            // Supabase hatası durumunda localStorage ile devam et
        }
    }

    // İçerik yükleme - önce remote sonra local
    static async loadContent(type) {
        try {
            // Önce Supabase'den yüklemeyi dene
            if (supabase) {
                const remoteData = await this.loadFromSupabase(type);
                if (remoteData) {
                    // Remote data varsa localStorage'ı da güncelle
                    const key = `blog_${type}`;
                    localStorage.setItem(key, JSON.stringify(remoteData));
                    console.log(`✅ ${type} Supabase'den yüklendi`);
                    return remoteData;
                }
            }

            // Supabase'de yoksa localStorage'dan yükle
            const key = `blog_${type}`;
            const stored = localStorage.getItem(key);
            if (stored) {
                console.log(`✅ ${type} localStorage'dan yüklendi`);
                return JSON.parse(stored);
            }

            return null;
        } catch (error) {
            console.error(`❌ ${type} yüklenirken hata:`, error);
            return null;
        }
    }

    // Supabase'den yükleme
    static async loadFromSupabase(type) {
        try {
            const { data, error } = await supabase
                .from('blog_content')
                .select('content_data')
                .eq('content_type', type)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    // Kayıt bulunamadı - normal durum
                    return null;
                }
                throw error;
            }

            return data ? data.content_data : null;
        } catch (error) {
            console.error(`❌ Supabase'den ${type} yüklenirken hata:`, error);
            return null;
        }
    }

    // İçerik temizleme
    static async clearContent(type) {
        try {
            // localStorage'dan temizle
            localStorage.removeItem(`blog_${type}`);

            // Supabase'den temizle
            if (supabase) {
                const { error } = await supabase
                    .from('blog_content')
                    .delete()
                    .eq('content_type', type);
                
                if (error) throw error;
                console.log(`✅ ${type} Supabase'den temizlendi`);
            }
        } catch (error) {
            console.error(`❌ ${type} temizlenirken hata:`, error);
        }
    }

    // Tüm verileri senkronize et
    static async syncAllData() {
        try {
            if (!supabase) return;

            console.log('🔄 Tüm veriler senkronize ediliyor...');

            const contentTypes = ['text', 'image', 'video'];
            
            for (const type of contentTypes) {
                const localData = this.loadLocalContent(type);
                if (localData) {
                    await this.saveToSupabase(type, localData);
                }
            }

            console.log('✅ Tüm veriler senkronize edildi');
        } catch (error) {
            console.error('❌ Senkronizasyon hatası:', error);
        }
    }

    // Sadece localStorage'dan yükleme (senkronizasyon için)
    static loadLocalContent(type) {
        try {
            const key = `blog_${type}`;
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            return null;
        }
    }

    // Sayfa yenilendiğinde verileri geri yükleme
    static async initializeFromStorage() {
        console.log('🚀 Veriler yükleniyor...');
        
        // Blog yazısı yükleme
        const textData = await this.loadContent('text');
        if (textData) {
            window.APP_STATE.textTitle = textData.title || 'Blog Yazısı';
            window.APP_STATE.textContent = textData.content || '';
            console.log('✅ Blog yazısı yüklendi');
        }

        // Resim yükleme
        const imageData = await this.loadContent('image');
        if (imageData) {
            window.APP_STATE.imageURL = imageData.data;
            console.log('✅ Resim yüklendi');
        }

        // YouTube video yükleme
        const videoData = await this.loadContent('video');
        if (videoData && videoData.type === 'youtube') {
            window.APP_STATE.videoURL = videoData.embedUrl;
            window.APP_STATE.youtubeVideoId = videoData.videoId;
            window.APP_STATE.youtubeUrl = videoData.originalUrl;
            console.log('✅ YouTube video yüklendi');
        }
        
        console.log('🏁 Veri yükleme tamamlandı');
    }

    // Çevrimdışı durumu kontrol et
    static isOnline() {
        return navigator.onLine;
    }

    // Supabase bağlantı durumunu kontrol et
    static async checkSupabaseConnection() {
        try {
            if (!supabase) return false;
            
            const { data, error } = await supabase
                .from('blog_content')
                .select('count')
                .limit(1);
            
            return !error;
        } catch (error) {
            return false;
        }
    }
}

// Network durumu izleme
window.addEventListener('online', async () => {
    console.log('🌐 İnternet bağlantısı geri geldi');
    if (supabase) {
        await AdvancedStorageManager.syncAllData();
    }
});

window.addEventListener('offline', () => {
    console.log('📴 İnternet bağlantısı kesildi - localStorage kullanılacak');
});

// Export (varsa)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdvancedStorageManager, initSupabase };
}
