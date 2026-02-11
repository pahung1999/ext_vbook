load('libs.js');
load('config.js');

function execute(url) {
    const HOST = "https://69shuba.tw";
    
    url = url.replace("http://", "https://");
    
    let response = fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": "https://69shuba.tw"
        }
    });

    if (response.ok) {
        let doc = response.html();
        
        let list = [];
        let listItems = doc.select("ul.last9 li");
        
        // --- TÌM TÊN TRUYỆN ĐỂ LỌC ---
        let bookTitle = "";
        // Thử tìm ở nút Back cũ
        let titleElement = doc.select("ul.last9 li.title a.back").first();
        // Thử tìm ở breadcrumb hoặc title trang
        if (!titleElement) {
             let pageTitle = doc.select("title").text(); // VD: 《Truyện A》 Chương 1...
             let match = pageTitle.match(/《(.*?)》/);
             if (match && match[1]) bookTitle = match[1];
        } else {
            let text = titleElement.text();
            let match = text.match(/《(.*?)》/);
            if (match && match[1]) bookTitle = match[1];
        }
        
        Console.log("[TOC] Tên truyện tìm thấy để lọc: '" + bookTitle + "'");

        for (let i = 0; i < listItems.size(); i++) {
            let li = listItems.get(i);
            
            // 1. Kiểm tra class title (Dùng attr để tránh lỗi hasClass)
            let className = li.attr("class");
            if (className && className.indexOf("title") !== -1) {
                continue;
            }
            
            let name = "";
            let link = "";
            let isProtected = false;
            
            // BƯỚC 1: Tìm Link Ẩn (Protected) - Logic cho RAW HTML
            // Trong HTML thô, nó thường là thẻ span, không phải a
            let protectedItem = li.select(".protected-chapter-link").first();
            
            // Fallback: Tìm thẻ bất kỳ có data-cid-url
            if (!protectedItem) {
                protectedItem = li.select("[data-cid-url]").first();
            }

            if (protectedItem) {
                link = protectedItem.attr("data-cid-url");
                // Ưu tiên lấy text hiển thị
                name = protectedItem.text(); 
                // Nếu text rỗng (do ẩn bằng CSS), lấy data-title
                if (!name) name = protectedItem.attr("data-title");
                isProtected = true;
            }

            // BƯỚC 2: Tìm thẻ <a> thường (Nếu bước 1 không có kết quả)
            if (!link || link.length === 0) {
                let a = li.select("a").first();
                if (a) {
                    link = a.attr("href");
                    name = a.text();
                }
            }

            // --- XỬ LÝ DỮ LIỆU CUỐI CÙNG ---
            if (link && link.length > 0) {
                if (link.startsWith("/")) {
                    link = HOST + link;
                }
                
                // Clean Name: Xóa tên truyện
                if (name) {
                    if (bookTitle && name.indexOf(bookTitle) !== -1) {
                        name = name.replace(bookTitle, "").trim();
                    }
                    name = name.trim();
                } else {
                    name = "Chương " + (list.length + 1);
                }

                list.push({
                    name: name,
                    url: link,
                    host: HOST
                });
            }
        }
        
        Console.log("[TOC] Tổng số chương lấy được: " + list.length);
        return Response.success(list);
    } else {
        Console.log("[TOC] Lỗi kết nối: " + response.status);
    }
    
    return null;
}