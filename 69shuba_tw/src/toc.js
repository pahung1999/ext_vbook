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
        
        // Lấy tên truyện để phòng hờ cần lọc (Backup plan)
        let bookTitle = "";
        let titleElement = doc.select("ul.last9 li.title a.back").first();
        if (titleElement) {
            let text = titleElement.text();
            let match = text.match(/《(.*?)》/);
            if (match && match[1]) bookTitle = match[1];
        }
        if (!bookTitle) {
             let pageTitle = doc.select("title").text();
             let match = pageTitle.match(/《(.*?)》/);
             if (match && match[1]) bookTitle = match[1];
        }

        for (let i = 0; i < listItems.size(); i++) {
            let li = listItems.get(i);
            
            // Bỏ qua dòng tiêu đề
            let className = li.attr("class");
            if (className && className.indexOf("title") !== -1) continue;
            
            let name = "";
            let link = "";

            // --- BƯỚC 1: Tìm Link Ẩn (Protected) ---
            let protectedItem = li.select(".protected-chapter-link, [data-cid-url]").first();
            
            if (protectedItem) {
                link = protectedItem.attr("data-cid-url");
                
                // [SỬA ĐỔI QUAN TRỌNG]: Ưu tiên lấy text() trước vì nó là tên sạch
                name = protectedItem.text(); 
                
                // Chỉ khi text rỗng mới lấy data-title (thường chứa tên dài)
                if (!name) name = protectedItem.attr("data-title");
            }

            // --- BƯỚC 2: Tìm thẻ <a> thường (Nếu bước 1 chưa có link) ---
            if (!link || link.length === 0) {
                let a = li.select("a").first();
                if (a) {
                    link = a.attr("href");
                    name = a.text(); // Luôn ưu tiên text
                }
            }

            // --- XỬ LÝ DỮ LIỆU CUỐI CÙNG ---
            if (link && link.length > 0) {
                if (link.startsWith("/")) {
                    link = HOST + link;
                }
                
                // Clean Name: Vẫn giữ logic lọc tên truyện để an toàn tuyệt đối
                // (Trường hợp text() bị lỗi mà phải fallback sang data-title)
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
        
        return Response.success(list);
    }
    
    return null;
}