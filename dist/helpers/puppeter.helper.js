var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import puppeteer from "puppeteer";
export const createDownloadPdfFile = (htmlDoc) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer.launch({
        headless: "shell",
        // args: ["--enable-gpu"],
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = yield browser.newPage();
    yield page.setContent(htmlDoc, { waitUntil: "networkidle0" });
    const pdfBuffer = yield page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
            top: "20mm",
            left: "20mm",
            right: "20mm",
            bottom: "20mm",
        },
    });
    yield browser.close();
    return pdfBuffer;
});
//# sourceMappingURL=puppeter.helper.js.map