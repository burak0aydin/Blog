window.addEventListener('DOMContentLoaded', function() {
    const img = document.querySelector('.profile-image');
    if (!img) return;

    // Resim yükleme fonksiyonu
    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const tempImg = new Image();
            tempImg.onload = () => resolve(src);
            tempImg.onerror = () => reject();
            tempImg.src = src;
        });
    }

    // Sırayla farklı kaynakları dene
    const sources = [
        'assets/profile.jpg',
        'https://raw.githubusercontent.com/burak0aydin/Blog/main/assets/profile.jpg',
        'https://raw.githubusercontent.com/burak0aydin/Blog/main/assets/profile.jpg?v=' + Date.now()
    ];

    async function tryLoadImage() {
        for (let src of sources) {
            try {
                const validSrc = await loadImage(src);
                img.src = validSrc;
                return; // Başarılı olduğunda döngüyü sonlandır
            } catch (e) {
                console.log('Failed to load:', src);
                continue; // Sonraki kaynağı dene
            }
        }
    }

    // Resim yüklemeyi başlat
    tryLoadImage().catch(err => {
        console.error('Failed to load profile image from all sources');
    });
});
