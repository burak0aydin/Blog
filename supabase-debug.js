// Supabase Test Scripti
// Bu scripti browser console'unda çalıştırarak Supabase bağlantısını test edin

async function testSupabaseConnection() {
    console.log('🔍 Supabase bağlantısı test ediliyor...');
    
    // Supabase config kontrol
    if (!window.SUPABASE_CONFIG) {
        console.error('❌ SUPABASE_CONFIG bulunamadı');
        return;
    }
    
    console.log('📋 Supabase Config:', {
        url: window.SUPABASE_CONFIG.url,
        key: window.SUPABASE_CONFIG.key ? 'Mevcut' : 'Eksik'
    });
    
    // Supabase client kontrol
    if (!window.supabase) {
        console.error('❌ Supabase client başlatılmamış');
        return;
    }
    
    try {
        // Test query
        const { data, error } = await window.supabase
            .from('blog_content')
            .select('*')
            .limit(1);
        
        if (error) {
            console.error('❌ Supabase sorgu hatası:', error);
            return;
        }
        
        console.log('✅ Supabase bağlantısı başarılı!');
        console.log('📊 Mevcut veriler:', data);
        
        // Test insert
        const testData = {
            content_type: 'test_' + Date.now(),
            content_data: { test: true, timestamp: new Date().toISOString() }
        };
        
        const { data: insertData, error: insertError } = await window.supabase
            .from('blog_content')
            .insert([testData])
            .select();
        
        if (insertError) {
            console.error('❌ Supabase insert hatası:', insertError);
        } else {
            console.log('✅ Supabase insert başarılı:', insertData);
            
            // Test verisini sil
            await window.supabase
                .from('blog_content')
                .delete()
                .eq('content_type', testData.content_type);
            
            console.log('✅ Test verisi temizlendi');
        }
        
    } catch (error) {
        console.error('❌ Supabase test hatası:', error);
    }
}

// Çalıştırmak için console'da: testSupabaseConnection()
console.log('📝 Supabase test fonksiyonu hazır. Çalıştırmak için: testSupabaseConnection()');
