// Burak Aydın'ın kişisel bilgilerini içeren veri modeli
const MODEL = {
  profile: {
    name: "Burak Aydın",
    number: "1911012833",
    title: "Full-Stack Web & iOS Developer",
    summary: "+2 yıldır kullanıcı odaklı iOS ve full-stack uygulamalar geliştiriyorum. Hızlı adapte olur, takım içinde sorumluluk alırım.",
    contact: {
      email: "ios.burakaydin@gmail.com",
      phone: "+90 507 023 15 03",
      linkedin: "https://www.linkedin.com/in/burak0aydin",
      github: "https://github.com/burak0aydin"
    }
  },
  skills: {
    languages: ["Swift", "Java", "C#", "C", "JavaScript", "SQL"],
    frameworks: ["UIKit", "SwiftUI", "Express.js", "Core Data", "MapKit"],
    backend: ["Firebase", "Supabase", "PostgreSQL", "MongoDB", "Node.js", "MySQL", "SQLite", "Sequelize", "Redis", "RabbitMQ"],
    devTools: ["Xcode", "Git/GitHub", "GitLab", "VS Code", "Cursor", "GitHub Copilot"]
  },
  projects: [
    {
      name: "SmartShop (iOS + Node.js)",
      desc: "SwiftUI tabanlı e-ticaret uygulaması; Node.js + PostgreSQL backend; Stripe ile ödeme.",
      stack: ["SwiftUI", "Express.js", "Node.js", "PostgreSQL", "Sequelize", "Redis", "RabbitMQ", "JWT", "REST"],
      link: "https://github.com/burak0aydin/FullStack-ECommerce-App"
    },
    {
      name: "Contacts List App",
      desc: "MVVM + RxSwift mimarisiyle kişi yönetimi (CRUD).",
      stack: ["Swift", "MVVM", "RxSwift"],
      link: "https://github.com/burak0aydin/ContactsListApp-3Version"
    },
    {
      name: "Snake Game App", 
      desc: "SwiftUI ile klasik yılan oyunu; Timer, UserDefaults, Codable vb.",
      stack: ["SwiftUI", "Timers", "UserDefaults", "Codable"],
      link: "https://github.com/burak0aydin/SnakeGame"
    },
    {
      name: "6 Mini Apps (iOS)",
      desc: "Swift ile 6 temel uygulama; CoreData, URLSession, JSON, MapKit, CoreLocation vb.",
      stack: ["Swift", "UIKit", "MVC", "MVVM", "CoreData", "URLSession", "MapKit", "CoreLocation"],
      link: "https://github.com/burak0aydin/6-Pieces-iOSApp"
    },
    {
      name: "17 Mini Apps (iOS)",
      desc: "Swift + UIKit ile 17 mini app; RxSwift, SQLite, Localization, TabBar, Timer vb.",
      stack: ["Swift", "UIKit", "MVC", "MVVM", "RxSwift", "SQLite", "Localization"],
      link: "https://github.com/burak0aydin/17-Piece-iOS-Apps"
    },
    {
      name: "ToDo List App",
      desc: "SwiftUI ile görev yönetimi uygulaması; görev ekleme, tamamlama, filtreleme, bildirim ve çoklu dil desteği.",
      stack: ["SwiftUI", "MVVM", "UserNotifications", "UserDefaults", "Codable", "EnvironmentObject", "NavigationView", "Testing"],
      link: "https://github.com/burak0aydin/ToDoList"
    }
  ]
};

// Uygulama durumunu yöneten global state objesi
window.APP_STATE = {
  textContent: '',
  textTitle: '',
  imageURL: null,
  videoURL: null,
  youtubeUrl: null,
  youtubeVideoId: null,
  isAdminLoggedIn: false
};

// LocalStorage ile veri saklama işlemlerini yöneten sınıf
class StorageManager {
  // Genel içerik kaydetme fonksiyonu
  static saveContent(type, data) {
    try {
      const key = `blog_${type}`;
      localStorage.setItem(key, JSON.stringify(data));
      console.log(`✅ ${type} başarıyla localStorage'a kaydedildi`);
    } catch (error) {
      console.error(`❌ ${type} kaydedilirken hata:`, error);
      throw error;
    }
  }

  // Genel içerik yükleme fonksiyonu
  static loadContent(type) {
    try {
      const key = `blog_${type}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
      return null;
    } catch (error) {
      console.error(`❌ ${type} yüklenirken hata:`, error);
      return null;
    }
  }

  // İçerik temizleme fonksiyonu
  static clearContent(type) {
    localStorage.removeItem(`blog_${type}`);
  }

  // Sayfa yenilendiğinde verileri geri yükleme
  static initializeFromStorage() {
    console.log('🚀 localStorage\'dan veriler yükleniyor...');
    
    // Blog yazısı yükleme
    const textData = this.loadContent('text');
    if (textData) {
      window.APP_STATE.textTitle = textData.title || 'Blog Yazısı';
      window.APP_STATE.textContent = textData.content || '';
      console.log('✅ Blog yazısı yüklendi');
    }

    // Resim yükleme
    const imageData = this.loadContent('image');
    if (imageData) {
      window.APP_STATE.imageURL = imageData.data;
      console.log('✅ Resim yüklendi');
    }

    // YouTube video yükleme
    const videoData = this.loadContent('video');
    if (videoData && videoData.type === 'youtube') {
      window.APP_STATE.videoURL = videoData.embedUrl;
      window.APP_STATE.youtubeVideoId = videoData.videoId;
      window.APP_STATE.youtubeUrl = videoData.originalUrl;
      console.log('✅ YouTube video yüklendi');
    }
    
    console.log('🏁 Veri yükleme tamamlandı');
  }
}

// Admin giriş bilgileri
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: '123456'
};

// Admin kimlik doğrulama işlemlerini yöneten sınıf
class AdminAuth {
  constructor() {
    this.checkStoredSession();
    this.initializeAdminListeners();
  }

  // Daha önce giriş yapılıp yapılmadığını kontrol et
  checkStoredSession() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    if (isLoggedIn) {
      window.APP_STATE.isAdminLoggedIn = true;
      this.showAdminContent();
    }
  }

  // Admin giriş butonları ve form event listener'larını ayarla
  initializeAdminListeners() {
    const showLoginBtn = document.getElementById('show-admin-login');
    const loginForm = document.getElementById('admin-login-form');
    const logoutBtn = document.getElementById('admin-logout');

    if (showLoginBtn) {
      showLoginBtn.addEventListener('click', this.showLoginForm.bind(this));
    }
    if (loginForm) {
      loginForm.addEventListener('submit', this.handleLogin.bind(this));
    }
    if (logoutBtn) {
      logoutBtn.addEventListener('click', this.handleLogout.bind(this));
    }
  }

  // Admin giriş formunu göster
  showLoginForm() {
    const loginSection = document.getElementById('admin-login');
    const toggleButton = document.getElementById('admin-toggle');
    
    if (loginSection) {
      loginSection.style.display = 'block';
      loginSection.scrollIntoView({ behavior: 'smooth' });
    }
    if (toggleButton) {
      toggleButton.style.display = 'none';
    }
  }

  // Admin giriş işlemini yönet
  handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    const errorDiv = document.getElementById('login-error');

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      window.APP_STATE.isAdminLoggedIn = true;
      sessionStorage.setItem('adminLoggedIn', 'true');
      
      this.showAdminContent();
      this.hideLoginForm();
      document.getElementById('admin-login-form').reset();
      
      if (errorDiv) errorDiv.style.display = 'none';
    } else {
      if (errorDiv) errorDiv.style.display = 'block';
      document.getElementById('admin-password').value = '';
    }
  }

  // Admin çıkış işlemini yönet
  handleLogout() {
    window.APP_STATE.isAdminLoggedIn = false;
    sessionStorage.removeItem('adminLoggedIn');
    this.hideAdminContent();
    
    const toggleButton = document.getElementById('admin-toggle');
    if (toggleButton) toggleButton.style.display = 'block';
  }

  // Giriş formunu gizle
  hideLoginForm() {
    const loginSection = document.getElementById('admin-login');
    if (loginSection) loginSection.style.display = 'none';
  }

  // Admin özel içeriklerini göster
  showAdminContent() {
    const adminOnlyElements = document.querySelectorAll('.admin-only');
    const logoutContainer = document.getElementById('admin-logout-container');
    const toggleButton = document.getElementById('admin-toggle');

    adminOnlyElements.forEach(element => {
      element.style.display = 'block';
    });
    if (logoutContainer) logoutContainer.style.display = 'block';
    if (toggleButton) toggleButton.style.display = 'none';
  }

  // Admin özel içeriklerini gizle
  hideAdminContent() {
    const adminOnlyElements = document.querySelectorAll('.admin-only');
    const logoutContainer = document.getElementById('admin-logout-container');

    adminOnlyElements.forEach(element => {
      element.style.display = 'none';
    });
    if (logoutContainer) logoutContainer.style.display = 'none';
  }
}

// Ana sayfa controller sınıfı - tüm sayfa işlevlerini yönetir
class ViewController {
  constructor() {
    this.initializeEventListeners();
    this.renderStaticContent();
    this.loadStoredContent();
    this.updateBlogContent();
  }

  // Tüm buton ve input event listener'larını ayarla
  initializeEventListeners() {
    // Blog yazma input alanları
    const blogTitleInput = document.getElementById('blog-title');
    const blogContentInput = document.getElementById('blog-content-input');
    const saveBlogBtn = document.getElementById('save-blog');
    
    if (blogTitleInput && blogContentInput && saveBlogBtn) {
      blogTitleInput.addEventListener('input', this.updateBlogPreview.bind(this));
      blogContentInput.addEventListener('input', this.updateBlogPreview.bind(this));
      saveBlogBtn.addEventListener('click', this.saveBlogContent.bind(this));
    }
    
    // YouTube video ekleme alanları
    const youtubeUrlInput = document.getElementById('youtube-url');
    const addYoutubeBtn = document.getElementById('add-youtube-video');
    
    if (youtubeUrlInput && addYoutubeBtn) {
      youtubeUrlInput.addEventListener('input', this.updateYouTubePreview.bind(this));
      addYoutubeBtn.addEventListener('click', this.addYouTubeVideo.bind(this));
    }
    
    // Resim yükleme
    const imageUpload = document.getElementById('image-upload');
    if (imageUpload) {
      imageUpload.addEventListener('change', this.handleImageUpload.bind(this));
    }

    // Sayfa içi bağlantılar için yumuşak kaydırma
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', this.handleSmoothScroll.bind(this));
    });
  }

  // Sayfa içi bağlantılar için yumuşak kaydırma efekti
  handleSmoothScroll(e) {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Blog yazısı önizlemesini gerçek zamanlı güncelle
  updateBlogPreview() {
    const titleInput = document.getElementById('blog-title');
    const contentInput = document.getElementById('blog-content-input');
    const previewElement = document.querySelector('.text-preview-content');
    
    if (!titleInput || !contentInput || !previewElement) return;
    
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    
    if (title || content) {
      previewElement.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 0.5rem; color: #1f2937;">
          ${title || 'Başlık...'}
        </div>
        <div style="white-space: pre-wrap; line-height: 1.6;">
          ${content || 'İçerik...'}
        </div>
      `;
      previewElement.classList.add('has-content');
    } else {
      previewElement.textContent = 'Blog yazısı henüz yazılmadı';
      previewElement.classList.remove('has-content');
    }
  }

  // Blog yazısını localStorage'a kaydet
  async saveBlogContent() {
    const titleInput = document.getElementById('blog-title');
    const contentInput = document.getElementById('blog-content-input');
    
    if (!titleInput || !contentInput) return;
    
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    
    if (!title && !content) {
      alert('Lütfen başlık veya içerik yazın.');
      return;
    }
    
    try {
      StorageManager.clearContent('text');
      
      window.APP_STATE.textTitle = title || 'Blog Yazısı';
      window.APP_STATE.textContent = content;
      
      StorageManager.saveContent('text', {
        title: title || 'Blog Yazısı',
        content: content,
        createdDate: new Date().toISOString()
      });
      
      this.updateBlogContent();
      alert('Blog yazısı başarıyla kaydedildi!');
      console.log('✅ Blog içeriği kaydedildi');
      
    } catch (error) {
      console.error('❌ Blog kaydetme hatası:', error);
      alert('Blog yazısı kaydedilirken bir hata oluştu.');
    }
  }

  // Resim yükleme işlemini yönet
  async handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      alert('Lütfen geçerli bir görsel dosyası yükleyin.');
      return;
    }

    try {
      StorageManager.clearContent('image');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = {
          name: file.name,
          type: file.type,
          data: e.target.result,
          lastModified: file.lastModified
        };
        
        StorageManager.saveContent('image', imageData);
        window.APP_STATE.imageURL = imageData.data;
        
        this.updateImagePreview(imageData.data);
        this.updateFeaturedImage(imageData.data);
        
        console.log('✅ Görsel başarıyla kaydedildi');
      };
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('❌ Görsel yükleme hatası:', error);
      alert('Görsel yüklenirken bir hata oluştu.');
    }
  }

  // YouTube URL'den video ID'sini çıkar
  extractYouTubeVideoId(url) {
    if (!url) return null;
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  // YouTube video önizlemesini gerçek zamanlı güncelle
  updateYouTubePreview() {
    const urlInput = document.getElementById('youtube-url');
    const previewElement = document.querySelector('.video-preview-content');
    
    if (!urlInput || !previewElement) return;
    
    const url = urlInput.value.trim();
    const videoId = this.extractYouTubeVideoId(url);
    
    if (videoId) {
      previewElement.innerHTML = `
        <iframe class="youtube-embed" 
                src="https://www.youtube.com/embed/${videoId}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
        </iframe>
        <p style="margin-top: 0.5rem; color: #6b7280; font-size: 0.9rem;">Video ID: ${videoId}</p>
      `;
    } else if (url) {
      previewElement.innerHTML = '<p style="color: #ef4444;">Geçersiz YouTube linki</p>';
    } else {
      previewElement.innerHTML = 'YouTube video henüz eklenmedi';
    }
  }

  // YouTube video ekle ve kaydet
  async addYouTubeVideo() {
    const urlInput = document.getElementById('youtube-url');
    if (!urlInput) return;
    
    const url = urlInput.value.trim();
    const videoId = this.extractYouTubeVideoId(url);
    
    if (!videoId) {
      alert('Lütfen geçerli bir YouTube linki girin.\n\nÖrnekler:\n• https://www.youtube.com/watch?v=VIDEO_ID\n• https://youtu.be/VIDEO_ID');
      return;
    }
    
    try {
      StorageManager.clearContent('video');
      
      window.APP_STATE.videoURL = `https://www.youtube.com/embed/${videoId}`;
      window.APP_STATE.youtubeVideoId = videoId;
      window.APP_STATE.youtubeUrl = url;
      
      StorageManager.saveContent('video', {
        type: 'youtube',
        videoId: videoId,
        originalUrl: url,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        addedDate: new Date().toISOString()
      });
      
      this.updateVideoPreview(`https://www.youtube.com/embed/${videoId}`);
      this.updateBlogContent();
      
      alert('YouTube video başarıyla eklendi!');
      console.log('✅ YouTube video eklendi:', videoId);
      
    } catch (error) {
      console.error('❌ YouTube video ekleme hatası:', error);
      alert('YouTube video eklenirken bir hata oluştu.');
    }
  }

  // Resim önizlemesini güncelle
  updateImagePreview(imageURL) {
    const previewElement = document.querySelector('.image-preview-content');
    previewElement.innerHTML = `<img src="${imageURL}" alt="Yüklenen görsel" class="preview-image">`;
  }

  // Video önizlemesini güncelle (YouTube embed veya normal video)
  updateVideoPreview(videoURL) {
    const previewElement = document.querySelector('.video-preview-content');
    
    if (videoURL) {
      if (videoURL.includes('youtube.com/embed/')) {
        previewElement.innerHTML = `
          <iframe class="youtube-embed" 
                  src="${videoURL}" 
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen>
          </iframe>
        `;
      } else {
        previewElement.innerHTML = `
          <video src="${videoURL}" controls class="preview-video">
            Tarayıcınız video etiketini desteklemiyor.
          </video>
        `;
      }
    }
  }

  // Hakkımda bölümündeki öne çıkan resmi güncelle
  updateFeaturedImage(imageURL) {
    const featuredElement = document.getElementById('featured-image');
    featuredElement.innerHTML = `<img src="${imageURL}" alt="Öne çıkan görsel" class="featured-image">`;
  }

    // Blog bölümündeki içeriği güncelle (yazı + video)
  updateBlogContent() {
    const blogElement = document.getElementById('blog-content');
    let contentHTML = '';
    
    if (window.APP_STATE.textContent || window.APP_STATE.textTitle) {
      contentHTML = `
        <h3>${window.APP_STATE.textTitle || 'Blog Yazısı'}</h3>
        <div class="blog-content">${window.APP_STATE.textContent}</div>
      `;
      
      // Video varsa blog yazısının altına ekle
      if (window.APP_STATE.videoURL) {
        if (window.APP_STATE.videoURL.includes('youtube.com/embed/')) {
          contentHTML += `
            <div class="blog-video-container">
              <iframe class="youtube-embed blog-video" 
                      src="${window.APP_STATE.videoURL}" 
                      frameborder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowfullscreen>
              </iframe>
            </div>
          `;
        } else {
          contentHTML += `
            <div class="blog-video-container">
              <video src="${window.APP_STATE.videoURL}" controls class="blog-video">
                Tarayıcınız video etiketini desteklemiyor.
              </video>
            </div>
          `;
        }
      }
    } else {
      contentHTML = `
        <h3>Blog Yazılarım</h3>
        <p>Yakında bu bölümde teknoloji, yazılım geliştirme ve kişisel deneyimlerimle ilgili yazılar paylaşacağım. Admin panelinden içerik yükleyebilirsiniz.</p>
      `;
    }
    
    blogElement.innerHTML = contentHTML;
  }

  // Sayfa yüklendiğinde localStorage'dan verileri geri yükle
  loadStoredContent() {
    console.log('🔄 localStorage dan veriler yükleniyor...');
    
    StorageManager.initializeFromStorage();
    
    console.log('📊 Mevcut uygulama durumu:', {
      textTitle: window.APP_STATE.textTitle,
      textContent: window.APP_STATE.textContent ? 'Var' : 'Yok',
      imageURL: window.APP_STATE.imageURL ? 'Var' : 'Yok',
      videoURL: window.APP_STATE.videoURL ? 'Var' : 'Yok'
    });
    
    // Blog içeriği varsa güncelle
    if (window.APP_STATE.textContent || window.APP_STATE.textTitle) {
      console.log('📝 Blog içeriği güncelleniyor...');
      this.updateBlogContent();
      this.loadBlogInputs();
    }
    
    // Resim varsa güncelle
    if (window.APP_STATE.imageURL) {
      console.log('🖼️ Resim önizlemesi güncelleniyor...');
      this.updateImagePreview(window.APP_STATE.imageURL);
      this.updateFeaturedImage(window.APP_STATE.imageURL);
    }
    
    // Video varsa güncelle
    if (window.APP_STATE.videoURL) {
      console.log('🎬 Video önizlemesi güncelleniyor...');
      this.updateVideoPreview(window.APP_STATE.videoURL);
      this.loadYouTubeInput();
      this.updateBlogContent(); // Video'yu blog'da göstermek için tekrar güncelle
    }
    
    console.log('✅ Veri yükleme tamamlandı');
  }

  // Blog yazısını input alanlarına geri yükle
  loadBlogInputs() {
    const titleInput = document.getElementById('blog-title');
    const contentInput = document.getElementById('blog-content-input');
    
    if (titleInput && window.APP_STATE.textTitle) {
      titleInput.value = window.APP_STATE.textTitle;
    }
    if (contentInput && window.APP_STATE.textContent) {
      contentInput.value = window.APP_STATE.textContent;
    }
    
    this.updateBlogPreview();
    console.log('✅ Blog input alanları yüklendi');
  }

  // YouTube URL'ini input alanına geri yükle
  loadYouTubeInput() {
    const urlInput = document.getElementById('youtube-url');
    if (urlInput && window.APP_STATE.youtubeUrl) {
      urlInput.value = window.APP_STATE.youtubeUrl;
      console.log('✅ YouTube URL input alanına yüklendi');
    }
  }

  // Kullanılmayan fonksiyon kaldırıldı
  // updateBlogMedia() artık kullanılmıyor - video blog içeriğinde gösteriliyor

  // Artık kullanılmayan fonksiyon - kod temizliği için kaldırıldı  
  // loadStoredContent() fonksiyonu zaten yukarıda mevcut

  // Statik MODEL verilerini sayfa elemanlarına yerleştir
  renderStaticContent() {
    this.renderSkills();
    this.renderProjects(); 
    this.renderContactDetails();
    this.renderCurrentYear();
  }

  // Beceri kategorilerini ilgili HTML elementlerine yerleştir
  renderSkills() {
    const skillCategories = [
      { id: 'languages-skills', data: MODEL.skills.languages },
      { id: 'frameworks-skills', data: MODEL.skills.frameworks },
      { id: 'backend-skills', data: MODEL.skills.backend },
      { id: 'tools-skills', data: MODEL.skills.devTools }
    ];

    skillCategories.forEach(category => {
      const element = document.getElementById(category.id);
      if (element) {
        element.innerHTML = category.data
          .map(skill => `<span class="skill-tag">${skill}</span>`)
          .join('');
      }
    });
  }

  // Proje listesini HTML olarak oluştur ve yerleştir
  renderProjects() {
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer) return;

    const projectsHTML = MODEL.projects.map(project => {
      const projectContent = `
        <h3>${project.name}</h3>
        <p>${project.desc}</p>
        <div class="project-stack">
          ${project.stack.map(tech => `<span class="stack-tag">${tech}</span>`).join('')}
        </div>
      `;
      
      // Eğer link varsa tıklanabilir kart yap
      if (project.link) {
        return `
          <div class="project-card project-clickable" onclick="window.open('${project.link}', '_blank')" style="cursor: pointer;">
            ${projectContent}
            <div class="project-link-indicator">
              <span>GitHub'da Görüntüle →</span>
            </div>
          </div>
        `;
      } else {
        return `
          <div class="project-card">
            ${projectContent}
          </div>
        `;
      }
    }).join('');

    projectsContainer.innerHTML = projectsHTML;
  }

  // İletişim bilgilerini MODEL'dan al ve HTML'e yerleştir
  renderContactDetails() {
    const contactElement = document.getElementById('contact-details');
    if (!contactElement) return;

    const contactHTML = `
      <div class="contact-item">
        <span class="contact-label">E-posta:</span>
        <span>${MODEL.profile.contact.email}</span>
      </div>
      <div class="contact-item">
        <span class="contact-label">Telefon:</span>
        <span>${MODEL.profile.contact.phone}</span>
      </div>
      <div class="contact-item">
        <span class="contact-label">Öğrenci No:</span>
        <span>${MODEL.profile.number}</span>
      </div>
    `;

    contactElement.innerHTML = contactHTML;
  }

  // Footer'da dinamik yıl gösterimi
  // Footer'da dinamik yıl gösterimi
  renderCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }
}

// Uygulama başlatma - DOM yüklendiğinde çalışır
document.addEventListener('DOMContentLoaded', () => {
  // Önce admin kimlik doğrulamasını başlat
  new AdminAuth();
  
  // Ana view controller'ı başlat
  new ViewController();

  // Klavye navigasyonu desteği ekle
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const target = e.target;
      if (target.classList.contains('upload-label')) {
        e.preventDefault();
        const fileInput = target.querySelector('input[type="file"]');
        if (fileInput) {
          fileInput.click();
        }
      }
    }
  });

  // Dosya input'ları için erişilebilirlik iyileştirmeleri
  const fileInputs = document.querySelectorAll('input[type="file"]');
  fileInputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.style.outline = '2px solid #2563eb';
      input.parentElement.style.outlineOffset = '2px';
    });

    input.addEventListener('blur', () => {
      input.parentElement.style.outline = 'none';
    });
  });

  // Sayfa kapatılırken object URL'leri temizle
  window.addEventListener('beforeunload', () => {
    if (window.APP_STATE.imageURL) {
      URL.revokeObjectURL(window.APP_STATE.imageURL);
    }
    if (window.APP_STATE.videoURL) {
      URL.revokeObjectURL(window.APP_STATE.videoURL);
    }
  });

  // Scroll tabanlı navigasyon vurgulama
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  function highlightActiveNavLink() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', highlightActiveNavLink);
});

// Dosya işlemleri için hata yakalama
window.addEventListener('error', (event) => {
  console.error('Uygulama hatası:', event.error);
});

// Resim yükleme için sürükle-bırak desteği
document.addEventListener('DOMContentLoaded', () => {
  const uploadLabels = document.querySelectorAll('.upload-label');
  
  uploadLabels.forEach(label => {
    const input = label.querySelector('input[type="file"]');
    
    // Tüm drag olayları için varsayılan davranışı engelle
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      label.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Sürükleme sırasında görsel geri bildirim
    ['dragenter', 'dragover'].forEach(eventName => {
      label.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      label.addEventListener(eventName, unhighlight, false);
    });

    // Sürükleme alanını vurgula
    function highlight() {
      label.style.backgroundColor = '#f0f9ff';
      label.style.borderColor = '#2563eb';
    }

    // Vurgulamayı kaldır
    function unhighlight() {
      label.style.backgroundColor = '#f9fafb';
      label.style.borderColor = '#d1d5db';
    }

    // Dosya bırakıldığında işle
    label.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        input.files = files;
        const event = new Event('change', { bubbles: true });
        input.dispatchEvent(event);
      }
    }
  });
});
