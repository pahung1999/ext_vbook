load('libs.js');
load('config.js');

function execute(url) {
    Console.log("[PAGE] === BẮT ĐẦU XỬ LÝ (BROWSER MODE) ===");
    Console.log("[PAGE] URL đầu vào: " + url);

    url = url.replace("http://", "https://");
    
    // 1. Chuyển đổi URL sang indexlist
    let indexUrl = url.replace(/\/book\//, "/indexlist/");
    
    // 2. SỬ DỤNG BROWSER THAY VÌ FETCH
    let browser = Engine.newBrowser();
    
    // Set User-Agent giống trình duyệt thật để Cloudflare tin tưởng
    browser.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
    
    // Launch trang web với timeout dài (20s) để Cloudflare kịp chạy xác minh
    // Trình duyệt sẽ tự động xử lý redirect nếu Cloudflare refresh trang
    browser.launch(indexUrl, 10000); 
    
    // Lấy HTML sau khi trình duyệt đã tải xong (và vượt qua Cloudflare)
    let doc = browser.html();
    
    // Đóng browser để giải phóng bộ nhớ
    browser.close();
    
    if (doc) {
        let pageList = [];
        
        // Selector options (Logic cũ của bạn)
        let options = doc.select("#indexselect-top option");

        options.forEach(e => {
            let value = e.attr("value");
            if (value) {
                if (value.startsWith("/")) {
                    value = "https://69shuba.tw" + value;
                }
                pageList.push(value);
            }
        });

        // Nếu không tìm thấy phân trang (truyện ngắn hoặc chỉ có 1 trang)
        if (pageList.length === 0) {
            pageList.push(indexUrl);
        }

        Console.log("[PAGE] Kết quả trả về " + pageList.length + " trang.");
        return Response.success(pageList);
    } 
    return null;
}