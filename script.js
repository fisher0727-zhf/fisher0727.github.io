document.getElementById("patient-form").addEventListener("submit", function(event) {
    event.preventDefault(); // 防止页面刷新

    // 获取输入的数据
    let gender = document.getElementById("gender").value;
    let age = document.getElementById("age").value;
    let diagnosis = document.getElementById("diagnosis").value;
    let staging = document.getElementById("staging").value;
    let surgery = document.getElementById("surgery").value;
    let chemotherapy = document.getElementById("chemotherapy").value;
    let radiotherapy = document.getElementById("radiotherapy").value;
    let diseaseHistory = document.getElementById("reproductive-disease").value;
    let drugHistory = document.getElementById("reproductive-drug").value;
    let treatmentHistory = document.getElementById("reproductive-treatment").value;

    // 计算生育力风险
    let riskLevel = calculateRiskLevel(gender, age, diagnosis, staging, diseaseHistory, drugHistory, treatmentHistory, surgery, chemotherapy, radiotherapy);

    // 显示结果页面
    document.getElementById("decision-path-page").style.display = "none";
    document.getElementById("result-page").style.display = "block";

    // 显示风险等级
    document.getElementById("risk-level").innerText = riskLevel.level;

    // 显示推荐意见
    document.getElementById("recommendation").innerText = riskLevel.recommendation;

    // 显示风险因素
    if (riskLevel.level === "低风险") {
        document.getElementById("risk-factors").innerText = "无";
    } else {
        document.getElementById("risk-factors").innerText = riskLevel.riskFactors.join(", ");
    }
});

// 生育力风险计算函数
function calculateRiskLevel(gender, age, diagnosis, staging, diseaseHistory, drugHistory, treatmentHistory, surgery, chemotherapy, radiotherapy) {
    let riskLevel = { level: "", recommendation: "", riskFactors: [] };

    // 判断疾病史和治疗史（如果选择“有”，则为高风险）
    if (diseaseHistory === "yes") {
        riskLevel.level = "高风险";
        riskLevel.riskFactors.push("以前有影响生育力的疾病");
    }
    if (drugHistory === "yes") {
        if (riskLevel.level !== "高风险") riskLevel.level = "高风险";
        riskLevel.riskFactors.push("以前服用过影响生育力的药物");
    }
    if (treatmentHistory === "yes") {
        if (riskLevel.level !== "高风险") riskLevel.level = "高风险";
        riskLevel.riskFactors.push("以前接受过影响生育力的治疗");
    }

    // 判断年龄
    if ((gender === "female" && age > 40) || (gender === "male" && age > 45)) {
        if (riskLevel.level !== "高风险") riskLevel.level = "高风险";
        riskLevel.riskFactors.push("年龄大于40岁（女性）或45岁（男性）");
    }

    // 判断疾病诊断和术式
    const highRiskConditions = [
        "睾丸癌", "前列腺癌", "根治性前列腺癌", "膀胱癌", "结肠癌腹膜后/盆腔淋巴结清扫术",
        "睾丸切除术", "前列腺癌睾丸切除术", "根治性前列腺癌切除术", "膀胱癌切除术"
    ];
    if (highRiskConditions.some(item => diagnosis.includes(item) || surgery.includes(item))) {
        if (riskLevel.level !== "高风险") riskLevel.level = "高风险";
        riskLevel.riskFactors.push(`疾病诊断或术式为高风险，如: ${diagnosis} / ${surgery}`);
    }

    // 判断化疗药物、放疗、疾病史、药物史等
    const lowRiskDrugs = ["甲氨蝶呤", "长春花碱", "5-氟尿嘧啶", "放线菌素D", "博来霉素"];
    const mediumRiskDrugs = ["顺铂", "阿霉素", "紫杉醇"];
    const highRiskDrugs = ["环磷酰胺", "甲苄肼", "美法仑", "氮芥瘤可宁", "白消安"];

    if (lowRiskDrugs.some(drug => chemotherapy.includes(drug))) {
        if (riskLevel.level !== "高风险") riskLevel.level = "低风险";
        riskLevel.riskFactors.push("化疗药物为低风险，如" + chemotherapy);
    }
    if (mediumRiskDrugs.some(drug => chemotherapy.includes(drug))) {
        if (riskLevel.level !== "高风险") riskLevel.level = "中风险";
        riskLevel.riskFactors.push("化疗药物为中风险，如" + chemotherapy);
    }
    if (highRiskDrugs.some(drug => chemotherapy.includes(drug))) {
        if (riskLevel.level !== "高风险") riskLevel.level = "高风险";
        riskLevel.riskFactors.push("化疗药物为高风险，如" + chemotherapy);
    }

    // 如果没有任何高风险因素
    if (riskLevel.level === "") {
        riskLevel.level = "低风险";
        riskLevel.riskFactors.push("无高风险因素");
    }

    // 汇总推荐意见
    if (riskLevel.level === "低风险") {
        riskLevel.recommendation = "生育力保护技术推荐意见：不推荐";
    } else {
        riskLevel.recommendation = "生育力保护技术推荐意见：推荐";
    }

    return riskLevel;
}
