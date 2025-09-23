// Basit JSON File Storage Manager
class SimpleStorageManager {
    static DATA_URL = './data/data.json';
    
    // Veri yükleme
    static async loadContent(type) {
        try {
            // Önce localStorage'dan kontrol et
            const localData = this.loadFromLocalStorage(type);
            if (localData) {
                console.log(`✅ ${type} localStorage'dan yüklendi`);
                return localData;
            }

            // JSON dosyasından yükle
            const response = await fetch(this.DATA_URL + '?t=' + Date.now());
            if (!response.ok) {
                throw new Error('Veri yüklenemedi');
            }
            
            const data = await response.json();
            const content = data.blog_content[type];
            
            if (content) {
                // localStorage'a da kaydet
                this.saveToLocalStorage(type, content);
                console.log(`✅ ${type} JSON dosyasından yüklendi`);
                return content;
            }
            
            return null;
        } catch (error) {
            console.warn(`⚠️ ${type} yüklenemedi, localStorage kullanılıyor:`, error);
            return this.loadFromLocalStorage(type);
        }
    }

    // Veri kaydetme
    static async saveContent(type, data) {
        try {
            // Önce localStorage'a kaydet
            this.saveToLocalStorage(type, data);
            
            // JSON dosyasını güncelleme simülasyonu
            console.log(`✅ ${type} kaydedildi (localStorage + simülasyon)`);
            
            // Not: Gerçek projede bu bir API call olacak
            // Şimdilik localStorage ile çalışıyoruz
            
        } catch (error) {
            console.error(`❌ ${type} kaydedilirken hata:`, error);
            throw error;
        }
    }

    // İçerik temizleme
    static async clearContent(type) {
        localStorage.removeItem(`blog_${type}`);
        console.log(`✅ ${type} temizlendi`);
    }

    // localStorage helper'ları
    static loadFromLocalStorage(type) {
        try {
            const stored = localStorage.getItem(`blog_${type}`);
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error(`❌ localStorage'dan ${type} okunamadı:`, error);
            return null;
        }
    }

    static saveToLocalStorage(type, data) {
        try {
            localStorage.setItem(`blog_${type}`, JSON.stringify(data));
        } catch (error) {
            console.error(`❌ localStorage'a ${type} kaydedilemedi:`, error);
        }
    }

    // Tüm verileri yükleme
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
}

// StorageManager'ı SimpleStorageManager ile değiştir
window.StorageManager = SimpleStorageManager;
