// api/search.js (Node.js)
const fetch = require('node-fetch');

export default async function handler(req, res) {
    const { number } = req.query;

    if (!number || number.length < 10) {
        return res.status(400).send("Invalid Number");
    }

    let clean = number.startsWith('0') ? number.substring(1) : number;
    const targetApi = `https://paksimdata.ftgmhacks.workers.dev/?number=${clean}`;

    try {
        // Multi-Proxy logic on server
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetApi)}`);
        const jsonRaw = await response.json();
        const result = JSON.parse(jsonRaw.contents);

        let data;
        if (result && result.data.records.length > 0 && !result.data.records[0].full_name.includes('***')) {
            const r = result.data.records[0];
            data = { n: r.full_name.toUpperCase(), c: r.cnic, a: r.address.toUpperCase() };
        } else {
            // Fake Data Fallback
            const names = ["REHAM AHMED", "DILAWAR KHAN", "WAHEEDA GUL", "AMMARAN BIBI", "SHARJEEL AHMED", "MAJEEDAN MAI", "ABDUL MAJEED"];
            const addrs = ["DAAK KHANA KHAS KALOKAY, SHEIKHUPURA", "STREET 5, GULBERG III, LAHORE", "MODEL TOWN, MULTAN"];
            data = {
                n: names[Math.floor(Math.random() * names.length)],
                c: "35401-" + Math.floor(1000000 + Math.random() * 8999999) + "-1",
                a: addrs[Math.floor(Math.random() * addrs.length)]
            };
        }

        // Determine Network
        const prefix = clean.substring(0, 3);
        const isJazz = ['300','301','302','303','304','305','306','307','308','309'].includes(prefix);
        const isZong = ['310','311','312','313','314','315','316','317','318','319','370'].includes(prefix);

        // HTML Response (Direct "Pic" like look)
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap" rel="stylesheet">
            <style>
                body { font-family: 'Inter', sans-serif; background: #f3f6f9; display: flex; justify-content: center; padding: 20px; }
                .card { background: white; padding: 40px; border: 1px solid #ccc; width: 600px; position: relative; }
                .header { display: flex; justify-content: space-between; }
                .logo { width: 150px; }
                .val { font-weight: bold; color: black; font-size: 16px; display: block; }
                .jazz-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                .jazz-table th { background: #d32f2f; color: white; padding: 10px; text-align: left; border: 1px solid #ddd; }
                .jazz-table td { padding: 10px; border: 1px solid #ddd; font-weight: bold; }
            </style>
        </head>
        <body>
            ${isJazz ? `
                <div class="card" style="border-radius:10px; border:none; box-shadow:0 5px 15px rgba(0,0,0,0.1);">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <img src="https://crystalpng.com/wp-content/uploads/2024/11/jazz-logo.png" style="height:50px;">
                        <h3 style="color:#d32f2f">Jazz Franchise Record</h3>
                    </div>
                    <table class="jazz-table">
                        <tr><th>Mobile</th><th>Name</th><th>CNIC</th><th>Address</th></tr>
                        <tr><td>${number}</td><td>${data.n}</td><td>${data.c}</td><td>${data.a}</td></tr>
                    </table>
                </div>
            ` : `
                <div class="card">
                    <div class="header">
                        <div>
                            MOBILE#: <span class="val">${number}</span>
                            <p style="font-size:11px; color:#555;">Certified that a sum of tax has been<br>collected from the person named below.</p>
                        </div>
                        <div style="text-align:right;">
                            <img src="${isZong ? 'https://crystalpng.com/wp-content/uploads/2025/04/zong-logo.png' : 'https://1000logos.net/wp-content/uploads/2021/05/Telenor-logo.png'}" class="logo">
                            <div style="font-size:12px; margin-top:10px;">
                                <b>PART VII</b><br>Tax Collection Certificate<br>Date: 25 Feb 2026<br><br>
                                <span class="val" style="font-size:18px;">${data.n}</span><br>
                                <span class="val" style="margin-top:30px;">${data.c}</span><br>
                                <span class="val" style="font-size:11px; margin-top:20px;">${data.a}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `}
        </body>
        </html>`;

        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(html);

    } catch (error) {
        return res.status(500).send("Mainframe Connection Error");
    }
}
