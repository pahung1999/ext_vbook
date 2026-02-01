load('libs.js');
load('config.js');

function execute(url) {

    url = url.replace("http://", "https://");
    
    // 1. Regex thay thế /book/ thành /indexlist/
    let indexUrl = url.replace(/\/book\//, "/indexlist/");
    
    // 2. Thêm Headers để vượt lỗi 403
    let response = fetch(indexUrl, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": "https://69shuba.tw"
        }
    });
    
    
    if (response.ok) {
        let doc = response.html();
        let pageList = [];
        
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

        if (pageList.length === 0) {
            pageList.push(indexUrl);
        }

        return Response.success(pageList);
    } else {
        Console.log("[PAGE] Lỗi kết nối: " + response.status);
    }
    return null;
}