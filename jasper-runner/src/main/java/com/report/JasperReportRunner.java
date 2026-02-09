package com.report;
// package com.report;

// import net.sf.jasperreports.engine.*;
// import net.sf.jasperreports.engine.util.JRLoader;

// import java.sql.Connection;
// import java.sql.DriverManager;
// import java.util.HashMap;
// import java.util.Map;

// public class JasperReportRunner {

//     public static void main(String[] args) {
//         try {
//             // 1️⃣ Path to compiled .jasper file
//             String jasperFile = "C:\\Users\\sumit.t\\JaspersoftWorkspace\\Ntis_project\\Blank_A4.jasper";

//             // 2️⃣ Load compiled report (NO COMPILATION)
//             JasperReport jasperReport = (JasperReport) JRLoader.loadObjectFromFile(jasperFile);

//             // 3️⃣ Parameters
//             Map<String, Object> params = new HashMap<>();
//             params.put("NewWardNo", 5);

//             // 4️⃣ Database connection (example MySQL)
//             String url = "jdbc:mysql://localhost:3306/ntis_updated"; // replace with your DB
//             String username = "root";
//             String password = "Core@1234";

//             Connection conn = DriverManager.getConnection(url, username, password);

//             JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, params, conn);

//             // 6️⃣ Export PDF
//             String outputPdf = "C:\\Users\\sumit.t\\JaspersoftWorkspace\\Ntis_project\\output\\output.pdf";

//             JasperExportManager.exportReportToPdfFile(jasperPrint, outputPdf);

//             System.out.println("✅ PDF generated successfully:");
//             System.out.println(outputPdf);

//             conn.close();

//         } catch (Exception e) {
//             e.printStackTrace();
//         }
//     }
// }

// import java.awt.GraphicsEnvironment;

// public class ListFonts {
// public static void main(String[] args) {
// GraphicsEnvironment ge = GraphicsEnvironment.getLocalGraphicsEnvironment();
// String[] fonts = ge.getAvailableFontFamilyNames();
// for (String f : fonts) {
// System.out.println(f);
// }
// }
// }

// import net.sf.jasperreports.engine.*;
// import net.sf.jasperreports.engine.util.JRLoader;
// import net.sf.jasperreports.engine.fonts.FontUtil;

// import java.sql.Connection;
// import java.sql.DriverManager;
// import java.util.HashMap;
// import java.util.Map;

// public class JasperReportRunner {

//     public static void main(String[] args) {
//         try {
//             // 1️⃣ Register system fonts (optional, but ensures JVM sees the fonts)
//             // FontUtil.registerFonts("C:\\Windows\\Fonts"); // register all system fonts

//             // 2️⃣ Path to compiled .jasper file
//             String jasperFile = "C:\\Users\\sumit.t\\JaspersoftWorkspace\\Ntis_project\\Blank_A4.jrxml";

//             // 3️⃣ Load compiled report (no compilation needed)
//             JasperReport jasperReport = (JasperReport) JRLoader.loadObjectFromFile(jasperFile);

//             // 4️⃣ Parameters
//             Map<String, Object> params = new HashMap<>();
//             params.put("NewWardNo", 5);

//             // 5️⃣ Database connection (MySQL example)
//             String url = "jdbc:mysql://localhost:3306/ntis_updated"; // your DB URL
//             String username = "jasper"; // use the user you created
//             String password = "Core@1234"; // password for DB user

//             Connection conn = DriverManager.getConnection(url, username, password);

//             // 6️⃣ Fill the report
//             JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, params, conn);

//             // 7️⃣ Export PDF
//             String outputPdf = "C:\\Users\\sumit.t\\JaspersoftWorkspace\\Ntis_project\\output\\output.pdf";
//             JasperExportManager.exportReportToPdfFile(jasperPrint, outputPdf);

//             System.out.println("✅ PDF generated successfully:");
//             System.out.println(outputPdf);

//             conn.close();

//         } catch ( Exception e ) {
//             System.err.println("⚠️ Font error: " + e.getMessage());
//             System.err.println("Make sure Arial Unicode MS or a substitute font is installed and registered.");
//             // jrf.printStackTrace();
//         } 
//     }
// }

// import net.sf.jasperreports.engine.*;
// import net.sf.jasperreports.engine.util.JRLoader;

import java.sql.Connection;
import java.sql.DriverManager;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.ObjectMapper;

import net.sf.jasperreports.engine.DefaultJasperReportsContext;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.JasperReportsContext;
import net.sf.jasperreports.engine.fonts.FontUtil;
import net.sf.jasperreports.engine.util.JRLoader;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import net.sf.jasperreports.engine.fonts.FontUtil;
// import net.sf.jasperreports.engine.JasperReportsContext;
// import net.sf.jasperreports.engine.DefaultJasperReportsContext;
import java.util.List;
import java.util.ArrayList;
import java.util.Collection;

public class JasperReportRunner {

    public static void main(String[] args) {
        try {
            if (args.length == 0) {
                throw new RuntimeException("Missing JSON payload from Node.js");
            }
            JasperReportsContext context = DefaultJasperReportsContext.getInstance();
            Collection<String> families = FontUtil.getInstance(context).getFontFamilyNames();

            System.out.println("--- Registered Font Families ---");
            if (families.isEmpty()) {
                System.out.println("⚠️ No custom fonts detected! Check your extension properties file.");
            } else {
                for (String family : families) {
                    System.out.println("✅ Found Font: " + family);
                }
            }
            byte[] bytes = Files.readAllBytes(Paths.get(args[0]));
            String json = new String(bytes, StandardCharsets.UTF_8);

            // Remove BOM if present
            if (json.startsWith("\uFEFF")) {
                json = json.substring(1);
            }

            System.out.print(json);
            ObjectMapper mapper = new ObjectMapper();
            mapper.enable(JsonParser.Feature.ALLOW_UNQUOTED_FIELD_NAMES);

            @SuppressWarnings("unchecked")
            Map<String, Object> input = mapper.readValue(json, Map.class);

            String reportName = (String) input.get("reportName");
            if (reportName == null || reportName.isBlank()) {
                throw new RuntimeException("reportName is required");
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> reportParams = (Map<String, Object>) input.getOrDefault("params", new HashMap<>());

            System.out.println("Report: " + reportName);
            System.out.println("Params: " + reportParams);

            if (reportName == null || reportName.isBlank()) {
                throw new RuntimeException("reportName is required");
            }

            // Paths
            String basePath = "C:\\Users\\sumit.t\\JaspersoftWorkspace\\Ntis_project\\";
            String jrxmlPath = basePath + reportName + ".jrxml";
            String compiledDir = basePath + "reports_compiled\\";
            String outputDir = basePath + "output\\";
            String jasperPath = compiledDir + reportName + ".jasper";

            new File(compiledDir).mkdirs();
            new File(outputDir).mkdirs();

            // Compile if needed
            if (!new File(jasperPath).exists()) {
                System.out.println("⚠️ Compiling JRXML: " + reportName);
                JasperCompileManager.compileReportToFile(jrxmlPath, jasperPath);
            }

            JasperReport jasperReport = (JasperReport) JRLoader.loadObjectFromFile(jasperPath);

            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String outputPdf = outputDir + reportName + "_" + timestamp + ".pdf";
            // 4️⃣ Database connection
            String url = "jdbc:mysql://localhost:3306/new_db";
            String username = "root";
            String password = "root";
            Connection conn = DriverManager.getConnection(url, username, password);

            // 5️⃣ Fill the report
            JasperPrint print = JasperFillManager.fillReport(jasperReport, reportParams, conn);
            JasperExportManager.exportReportToPdfFile(print, outputPdf);
            conn.close();

            System.out.println(outputPdf);

        } catch (

        Exception e) {
            System.err.println("REPORT_ERROR::" + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }
}