const fetch = require('node-fetch')
require('dotenv').config()

let secret = {
    nik: process.env.NIK,
    chatID: process.env.chatID,
    botToken: process.env.botToken
}

async function sendResult(hasil) {
    try {
        let msg
        if (hasil) {
            msg = `Pemeriksaan status data dalam program vaksinasi _COVID-19 gratis_ dari pemerintah. \n\nNIK: ${secret.nik} \nHasil: *Selamat Anda terpilih sebagai calon penerima vaksinasi COVID-19 GRATIS.* `
        } else {
            msg = `Pemeriksaan status data dalam program vaksinasi _COVID-19 gratis_ dari pemerintah. \n\nNIK: ${secret.nik} \nHasil: *Mohon maaf, Anda saat ini BELUM termasuk calon penerima vaksinasi COVID-19 GRATIS pada periode ini.*`
        }
        
        let res = await fetch(`https://api.telegram.org/bot${secret.botToken}/sendMessage?chat_id=${secret.chatID}&parse_mode=markdown&text=${msg}`)
        let json = await res.json()
        console.log(json)
    } catch (e) {
        console.error(e)
    }
}

;
(async () => {
    try {
        let response = await fetch('https://api.pedulilindungi.id/vaccine/v1/dashboard/nik/status', {
            'method': 'POST',
            'headers': {
                'accept': 'application/json',
                'authorization': 'Basic VkFLU0lOOjVmYmNkNjc4NDE2ZjVkOTUzMzFlODJhNA==',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4349.3 Safari/537.36',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                "nik": secret.nik
            })
        })
        let json = await response.json()
        if (json) {
            if (json.code == 200 && json.success == true)
            console.log('Hasil: ' + json.data)
                await sendResult(json.data)
        }
    } catch (e) {
        console.error(e)
    }
})()