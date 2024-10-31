
import fs from "fs";

import {databaseActions} from "@wrappid/service-core";
import puppeteer from "puppeteer";

const mainurl="https://www.medicineindia.org/hospitals-in-india";


const getLinks = async (url: string): Promise<string[]> => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const links = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll("a[href*=\"hospitals-details\"]"));
    return anchors.map(anchor => "https:" + anchor.getAttribute("href"));
  });

  await browser.close();
  console.log(`Found ${links.length} hospital links.`);
  return links;
};
const scrapeHospitalData = async (url: string): Promise<any> => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const data = await page.evaluate(() => {
    const hospitalName = document.querySelector("h1")?.innerText.trim() || "";
    const addressDetails = Array.from(document.querySelectorAll("dd")).map(dd => dd.innerText.trim());

    return {
      hospitalName,
      address: addressDetails[1] || "",
      city: addressDetails[2] || "",
      state: addressDetails[3] || "",
      pinCode: addressDetails[4] || "",
      country: addressDetails[5] || "",
      phoneNumber: addressDetails[6] || ""
    };
  });

  await browser.close();
  return data;
};
const saveHospitalData = async (hospitalData: any, mode = "file", fileName = ""): Promise<void> => {
  if (mode === "file") {
    fs.appendFileSync(fileName, JSON.stringify(hospitalData) + "\n");
  } else if (mode === "db") {
    try {
      const result = await databaseActions.findAll("application", "MedIndiaHospitals");
      await databaseActions.create("application", "MedIndiaHospitals", hospitalData);
      console.log(result);
      //await MedIndiaHospitals.caller()
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};

const scrapeData = async (): Promise<void> => {
  const hospitalLinks = await getLinks(mainurl);

  for (const url of hospitalLinks) {
    const hospitalData = await scrapeHospitalData(url);
    if (hospitalData) {
      await saveHospitalData(hospitalData, "db");
      console.log(`Data from ${url} saved to database`);
    }
  }
};

// scrapeData().catch(console.error);
//module.exports={scrapeData};
export{
  scrapeData
};

