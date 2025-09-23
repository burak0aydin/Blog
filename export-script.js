// LocalStorage'dan data.json'a veri aktarma scripti
// Bu scripti browser console'unda çalıştırın

function exportLocalStorageToJSON() {
    const textData = localStorage.getItem('blog_text');
    const imageData = localStorage.getItem('blog_image');
    const videoData = localStorage.getItem('blog_video');
    
    const data = {
        blog_content: {
            text: textData ? JSON.parse(textData) : null,
            image: imageData ? JSON.parse(imageData) : null,
            video: videoData ? JSON.parse(videoData) : null,
            lastUpdated: new Date().toISOString()
        }
    };
    
    console.log('Mevcut localStorage verileri:');
    console.log(JSON.stringify(data, null, 2));
    
    // JSON'u kopyalamak için
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exported-data.json';
    a.click();
    
    console.log('✅ JSON dosyası indirildi!');
    return data;
}

// Çalıştırmak için:
// exportLocalStorageToJSON();
