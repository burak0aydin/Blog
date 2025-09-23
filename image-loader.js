document.addEventListener('DOMContentLoaded', function() {
    // Profil resmini önbelleğe almak için
    var profileImg = new Image();
    profileImg.onload = function() {
        // Resim başarıyla yüklendiğinde
        var mainProfileImg = document.querySelector('.profile-image');
        if (mainProfileImg) {
            mainProfileImg.src = this.src;
        }
    };
    profileImg.onerror = function() {
        console.log('Profil resmi yüklenemedi, yerel dosyayı deniyorum...');
        // GitHub'dan yüklenemediyse yerel dosyayı dene
        this.src = 'assets/profile.jpg?v=1.0.4';
    };
    
    // Önce GitHub'dan yüklemeyi dene (önbelleğe almak için)
    profileImg.src = 'https://raw.githubusercontent.com/burak0aydin/Blog/main/assets/profile.jpg?v=1.0.4';
});
