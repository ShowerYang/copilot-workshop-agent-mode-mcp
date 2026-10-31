![工作坊完成徽章](https://img.shields.io/badge/GitHub_Copilot_實戰工作坊-已完成-1F883D?style=for-the-badge&logo=githubcopilot&logoColor=white)

# 待辦清單 Web App

這是在 GitHub Copilot 實戰工作坊完成的待辦清單 Web App。使用者可以管理日常待辦、依完成狀態篩選項目，並切換深淺色主題；資料與偏好設定會保存在瀏覽器中，方便重新整理後繼續使用。

## 線上展示

https://<你的帳號>.github.io/<你的repo名稱>/

## 功能

- 新增待辦事項，空白內容不會新增。
- 勾選或取消勾選待辦；已完成項目會顯示刪除線並淡化。
- 刪除單筆待辦事項。
- 即時顯示整份清單的未完成數量，不受目前篩選條件影響。
- 依「全部」、「未完成」或「已完成」篩選待辦，並記住上次選擇的篩選條件。
- 篩選結果為空時顯示提示，說明項目仍在清單中，可切換至「全部」查看。
- 切換淺色與深色模式，並記住手動選擇的主題；若尚未手動選擇，則跟隨作業系統的外觀設定。
- 清單為空時顯示提示。
- 以置中卡片呈現介面，支援手機螢幕。
- 使用 localStorage 保存待辦事項、篩選條件與主題偏好。

## 技術

- 使用 HTML、CSS 與原生 JavaScript 製作。
- 不使用前端框架或套件，沒有 `package.json` 或建置流程。
- 不引用外部 CDN，可離線開啟。
- 使用 CSS 變數管理介面色彩，並以 `prefers-color-scheme` 偵測系統深淺色偏好。
- 使用瀏覽器的 localStorage 保存待辦清單與使用者偏好。

## 開發方式

- 使用 GitHub Copilot Agent Mode，依需求建立及修改待辦清單 App。
- 透過 MCP 查閱 Microsoft Learn 官方文件，並讀取 GitHub issue 作為工作需求。
- 在 `.github/copilot-instructions.md` 記錄專案技術限制、程式風格與協作規則。
- 在 `.github/prompts/fix-issue.prompt.md` 定義可重複使用的 issue 修復流程，包含讀取 issue、提出計畫、建立分支、修改、驗證、提交與建立 Pull Request。
- 透過瀏覽器操作驗證功能，並以 Git 分支與 Pull Request 管理修正。

## 我學到什麼

- 將需求、技術限制與驗收方式清楚寫出，有助於 Agent Mode 產生符合預期的變更。
- 使用 MCP 可以讓 AI 在工作流程中查詢官方文件與 GitHub issue。
- 將專案規則與重複任務寫成 repo 內的 Markdown 檔案，能讓工作方式更容易重複執行與檢視。
- 透過瀏覽器實際操作驗證，比只檢查程式碼更能確認使用者流程是否正常。
- 使用分支與 Pull Request，可以讓修改範圍與審查流程更清楚。
