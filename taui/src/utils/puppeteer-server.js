// Server to run puppeteer from, since it cannot be run from the client-side

const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;

// Testing text message alert, can ignore for now
// const project_id = '000b0f55-e7c9-4832-b184-fd5e610084f5'
// const api_token = 'PT26cf16548864703e6b394a3047f91222bc40f2914eb0ad29'

// const { RestClient } = require('@signalwire/node')
// const client = new RestClient(project_id, api_token, {signalwireSpaceUrl: 'echo-locator.signalwire.com'})

// client.messages
//     .create({from: '+14137495930', to: '+14084802571', body: 'Hello World!'})
//     .then(message => console.log(message.sid))
//     .done();

// Caled from bha-data-extraction in the request.get function
app.get('/get_data', async (req, res) => {

    // Trinity's administrative crednetials
    const username = 'bostonhousing\\tgao',
        password = 'yLTkf%bFEK8TgE'

    const browser = await puppeteer.launch({
        ignoreHTTPSErrors: true,
        headless: true
    });

    // Goes to the login page
    const page = await browser.newPage();
    await page.goto(req.query.url, {waitUntil: 'networkidle0'}); // URL is given by the "user" (your client-side application)

    console.log('Connected to page')

    // Types in the credentials to login
    await page.type('#userNameInput', username)
    await page.type('#passwordInput', password)
    await Promise.all([
        page.click('#submitButton'),
        page.waitForNavigation({ waitUntil: 'networkidle0'}),
    ]);

    console.log('Successfully logged in')

    // Navigates to the page with the all the data
    await page.goto('https://www.bostonhousing.org/Admin/cmsadministration.aspx#e56cf9d4-8d83-4480-8146-2ccf5862830e', {waitUntil: 'networkidle0'})

    // Navigates to the iframe containing the various spreadsheets
    let table_url
    for (const frame of page.mainFrame().childFrames()) {
        table_url = frame.url()
    }

    // Goes to the spreadsheet we want with the listings in it
    await page.goto(table_url, {waitUntil: 'networkidle0'})

    await Promise.all([
        page.click('#m_c_uniGrid_v_ctl02_aedit'),
        page.waitForNavigation({ waitUntil: 'networkidle0'})
    ]);

    // Sends the table data as a string (since we can only send a Buffer or string instance)
    let data = await page.evaluate(() => {
    
        let table = new XMLSerializer().serializeToString(document.querySelector('#m_c_customTableDataList_gridData_v'))
        return table

    })
    .catch(err => {
        console.log(err)
    });

    console.log('Successfully got data')



    res.writeHead(200);
    res.end(data);

    await browser.close();

})


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
