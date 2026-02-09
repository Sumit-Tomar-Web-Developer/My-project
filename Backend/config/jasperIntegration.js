import { execFile } from "child_process";
import path from "path";
import fs from 'fs'

const jasperIntegration = async (r,p) => {
    const javaPath = "C:\\Program Files\\Eclipse Adoptium\\jdk-25.0.1.8-hotspot\\bin\\java.exe";
    const jarPath = path.resolve("D:\\Sumit\\jasper-runner\\target\\jasper-runner-1.0-SNAPSHOT.jar");
    const jsonFile = path.resolve("D:\\Sumit\\jasper-runner\\input.json");

    // Make sure JSON file exists
    const jsonContent = {
        reportName: r,
        params: p,
    };
    fs.writeFileSync(jsonFile, JSON.stringify(jsonContent), { encoding: "utf8" });

    // Run Java
    execFile(javaPath, ["-jar", jarPath, jsonFile], (err, stdout, stderr) => {
        if (err) {
            console.error("Error:", err);
            console.error(stderr);
            return;
        }
        console.log("Java Output:\n", stdout);
    });
}
jasperIntegration('119 Notice Final',{ WardNo: "1", PropertyNo: 9 })
