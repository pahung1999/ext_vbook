load('libs.js');
load('config.js');

function execute(url) {
    url = url.replace("http://", "https://");
    let response = fetch(url);
    
    if (response.ok) {
        let doc = response.html();
        
        doc.select(".hide720, .ads, .txtinfo").remove(); 
        
        // 2. Lấy nội dung từ thẻ #nr1
        let content = doc.select("#nr1").html();
        

        if (content) {
            // 3. Xử lý chuỗi (Regex clean text)
            content = content
                // Thay thế khoảng trắng đặc biệt
                .replace(/&nbsp;/g, " ")
                // Xóa dòng "Hết chương"
                .replace(/\(本章完\)/g, "")
                .replace(/（本章完）/g, "")
                // Xóa tên thương hiệu web (cả phồn và giản)
                .replace(/69書吧/g, "")
                .replace(/69书吧/g, "")
                .replace(/www\.69shuba\.tw/g, "")
                // Xóa các dòng thừa nếu có
                .replace(/<p>.*?69shuba.*?<\/p>/g, "");
                
            return Response.success(content);
        }
    }
    return null;
}