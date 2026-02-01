load('libs.js');
load('config.js');

function execute(url) {
    url = url.replace("http://", "https://");
    // let response = fetch(url, { headers: HEADERS });
    let response = fetch(url);

    if (response.ok) {
        let doc = response.html();
        
        // --- LẤY DỮ LIỆU TỪ META TAG ---
        let name = doc.select('meta[property="og:title"]').attr("content");
        let cover = doc.select('meta[property="og:image"]').attr("content");
        let author = doc.select('meta[property="og:novel:author"]').attr("content");
        let type = doc.select('meta[property="og:novel:category"]').attr("content");
        let status = doc.select('meta[property="og:novel:status"]').attr("content");
        let updateTime = doc.select('meta[property="og:novel:update_time"]').attr("content");
        let latestChap = doc.select('meta[property="og:novel:latest_chapter_name"]').attr("content");
        let description = doc.select('meta[property="og:description"]').attr("content");

        // Xử lý link ảnh (nếu thiếu https:)
        if (cover && cover.startsWith("//")) {
            cover = "https:" + cover;
        }

        // Xử lý trạng thái ongoing (true nếu status chứa chữ "連載" - Liên tải)
        let ongoing = status.indexOf("連載") !== -1;

        // Tạo chuỗi thông tin chi tiết (hiển thị dòng phụ trên app)
        // Format: Tác giả | Thể loại | Trạng thái | Cập nhật
        let detailInfo = `Tác giả: ${author}<br>Thể loại: ${type}<br>Trạng thái: ${status}<br>Cập nhật: ${updateTime}<br>Mới nhất: ${latestChap}`;

        return Response.success({
            name: name,
            cover: cover,
            host: BASE_URL,
            author: author,
            description: description,
            detail: detailInfo,
            ongoing: ongoing
        });
    }
    return null;
}