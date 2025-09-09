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

    // 显示风险等级和推荐意见
    document.getElementById("risk-level").innerText = riskLevel.level;
    document.getElementById("recommendation").innerText = riskLevel.recommendation;
});

// 生育力风险计算函数
function calculateRiskLevel(gender, age, diagnosis, staging, diseaseHistory, drugHistory, treatmentHistory, surgery, chemotherapy, radiotherapy) {
    let riskLevel = { level: "", recommendation: "" };
    let reasons = [];

    // 判断年龄
    if ((gender === "female" && age > 40) || (gender === "male" && age > 45)) {
        riskLevel.level = "高风险";
        reasons.push("年龄大于40岁（女性）或45岁（男性）");
    }

    // 判断疾病诊断和术式
    const highRiskConditions = [
        "睾丸癌", "前列腺癌", "根治性前列腺癌", "膀胱癌", "结肠癌腹膜后/盆腔淋巴结清扫术",
        "睾丸切除术", "前列腺癌睾丸切除术", "根治性前列腺癌切除术", "膀胱癌切除术"
    ];
    if (highRiskConditions.some(item => diagnosis.includes(item) || surgery.includes(item))) {
        if (riskLevel.level !== "高风险") riskLevel.level = "高风险";
        reasons.push(`疾病诊断或术式为高风险，如: ${diagnosis} / ${surgery}`);
    }

    // 判断化疗药物、放疗、疾病史、药物史等
    const lowRiskDrugs = ["甲氨蝶呤", "长春花碱", "5-氟尿嘧啶", "放线菌素D", "博来霉素"];
    const mediumRiskDrugs = ["顺铂", "阿霉素", "紫杉醇"];
    const highRiskDrugs = ["环磷酰胺", "甲苄肼", "美法仑", "氮芥瘤可宁", "白消安"];

    if (lowRiskDrugs.some(drug => chemotherapy.includes(drug))) {
        if (riskLevel.level !== "高风险") riskLevel.level = "低风险";
        reasons.push("化疗药物为低风险，如" + chemotherapy);
    }
    if (mediumRiskDrugs.some(drug => chemotherapy.includes(drug))) {
        if (riskLevel.level !== "高风险") riskLevel.level = "中风险";
        reasons.push("化疗药物为中风险，如" + chemotherapy);
    }
    if (highRiskDrugs.some(drug => chemotherapy.includes(drug))) {
        if (riskLevel.level !== "高风险") riskLevel.level = "高风险";
        reasons.push("化疗药物为高风险，如" + chemotherapy);
    }

    // 生成推荐意见
    riskLevel.recommendation = `根据以下风险因素，您的生育力风险为：${riskLevel.level}，涉及的因素有：\n` + reasons.join("\n");

    return riskLevel;
}

/* 基本样式 */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* 页面标题 */
header {
    background-color: #4CAF50;
    color: white;
    text-align: center;
    padding: 20px 0;
}

h1 {
    margin: 0;
    font-size: 32px;
}

/* 表单样式 */
form {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
}

label, input, select {
    display: block;
    width: 100%;
    margin-bottom: 10px;
    font-size: 14px;
}

input, select {
    padding: 8px;
    margin-top: 5px;
    font-size: 14px;
}

button {
    background-color: #4CAF50;
    color: white;
    padding: 10px;
    border: none;
    cursor: pointer;
    font-size: 16px;
}

button:hover {
    background-color: #45a049;
}

/* 结果页面样式 */
#result-page {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
    text-align: center;
}

h2, h3 {
    font-size: 24px;
}

#recommendation {
    margin-top: 20px;
    font-size: 16px;
    color: #333;
}

<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>肿瘤患者生育力保护决策辅助系统</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- 首页 -->
    <header>
        <h1>肿瘤患者生育力保护决策辅助系统</h1>
    </header>

    <!-- 路径选择页面 -->
    <section id="decision-path-page">
        <h2>填写患者信息</h2>
        <form id="patient-form">
            <label for="gender">患者性别：</label>
            <select id="gender">
                <option value="male">男性</option>
                <option value="female">女性</option>
            </select><br>

            <label for="age">年龄：</label>
            <input type="number" id="age" placeholder="年龄" required><br>

            <label for="diagnosis">病理诊断：</label>
            <input type="text" id="diagnosis" placeholder="病理诊断" required><br>

            <label for="staging">疾病分期：</label>
            <select id="staging">
                <option value="I">I期</option>
                <option value="II">II期</option>
                <option value="III">III期</option>
                <option value="IV">IV期</option>
            </select><br>

            <label for="marital-status">婚姻状况：</label>
            <select id="marital-status">
                <option value="married">已婚</option>
                <option value="single">未婚</option>
                <option value="widowed">丧偶</option>
                <option value="other">其他</option>
            </select><br>

            <label for="children">子女数量：</label>
            <input type="number" id="children" placeholder="子女数量" required><br>

            <h3>选择治疗手段</h3>
            <label for="surgery">术式：</label>
            <input type="text" id="surgery" placeholder="术式"><br>

            <label for="chemotherapy">化疗药物及剂量：</label>
            <input type="text" id="chemotherapy" placeholder="药物与剂量"><br>

            <label for="radiotherapy">放疗部位及剂量：</label>
            <input type="text" id="radiotherapy" placeholder="放疗部位与剂量"><br>

            <label for="treatment-start">治疗开始时间：</label>
            <input type="date" id="treatment-start"><br>

            <h3>疾病史与治疗史</h3>
            <label for="reproductive-disease">以前是否有影响生育力的疾病？</label>
            <select id="reproductive-disease">
                <option value="yes">有</option>
                <option value="no">无</option>
            </select><br>

            <label for="reproductive-drug">以前是否服用过影响生育力的药物？</label>
            <select id="reproductive-drug">
                <option value="yes">有</option>
                <option value="no">无</option>
            </select><br>

            <label for="reproductive-treatment">以前是否接受过影响生育力的治疗？</label>
            <select id="reproductive-treatment">
                <option value="yes">有</option>
                <option value="no">无</option>
            </select><br>

            <button type="submit">提交</button>
        </form>
    </section>

    <!-- 评估结果页面 -->
    <section id="result-page" style="display: none;">
        <h2>生育力风险评估结果</h2>
        <p>风险等级：<span id="risk-level"></span></p>
        <h3>推荐生育力保护技术</h3>
        <div id="recommendation"></div>
    </section>

    <script src="script.js"></script>
</body>
</html>
