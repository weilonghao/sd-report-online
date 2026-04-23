# 閲囬泦浠诲姟SD鎶ヨ〃 - 鍦ㄧ嚎鐗?

灏嗛涔﹀鍑虹殑 CSV 鏁版嵁涓婁紶鍚庯紝浠讳綍浜洪€氳繃閾炬帴鍗冲彲鏌ョ湅鍒版渶鏂扮粺璁＄粨鏋溿€傛棤闇€鐧诲綍锛屾敮鎸佺瓫閫夊拰澶?Tab 鏌ョ湅銆?

## 鏈湴杩愯

`ash
cd report_online
npm install
npm start
`

鐒跺悗鎵撳紑娴忚鍣ㄨ闂細

- 鐪嬫澘椤甸潰锛歚http://localhost:3000/report.html
- 涓婁紶椤甸潰锛歚http://localhost:3000/admin.html

## 閮ㄧ讲鍒?Railway锛堝厤璐癸級

[Railway](https://railway.app) 鎻愪緵鍏嶈垂 Node.js 鎵樼锛岃嚜甯︽寔涔呭寲鏂囦欢绯荤粺锛圫QLite 鏁版嵁搴撴枃浠朵細淇濆瓨锛夈€?

### 姝ラ

1. **鍑嗗浠ｇ爜**锛氬皢鏁翠釜 eport_online 鏂囦欢澶逛笂浼犲埌 GitHub 浠撳簱

2. **鍒涘缓 Railway 椤圭洰**锛?
   - 璁块棶 [railway.app](https://railway.app) 骞剁櫥褰曪紙鍙敤 GitHub 璐﹀彿锛?
   - 鐐瑰嚮 "New Project" 鈫?"Deploy from GitHub repo"
   - 閫夋嫨鍖呭惈 eport_online 鐨勪粨搴?
   - Railway 浼氳嚜鍔ㄦ娴?Node.js 骞舵墽琛?
pm install && npm start

3. **閰嶇疆鍚姩鍛戒护**锛圧ailway 閫氬父鑷姩璇嗗埆锛屽闇€鎵嬪姩璁剧疆锛夛細
   - Build Command: 
pm install
   - Start Command: 
pm start
   - Root Directory: eport_online

4. **鑾峰彇璁块棶鍦板潃**锛歊ailway 浼氬垎閰嶄竴涓?.railway.app 鍩熷悕
   - 鐪嬫澘锛歚https://your-app.railway.app/report.html
   - 涓婁紶锛歚https://your-app.railway.app/admin.html

5. **涓婁紶鏁版嵁**锛氭墦寮€涓婁紶椤甸潰锛岄€夋嫨 CSV 鏂囦欢锛屼笂浼犳垚鍔熷悗浼氳嚜鍔ㄨ烦杞埌鐪嬫澘

## 閮ㄧ讲鍒?Render锛堝厤璐癸級

[Render](https://render.com) 鎻愪緵鍏嶈垂 Node.js 鎵樼銆?

### 姝ラ

1. 灏嗕唬鐮佷笂浼犲埌 GitHub 浠撳簱

2. 鍦?Render 鍒涘缓 Web Service锛?
   - Connect GitHub repo
   - Region: Singapore锛堝氨杩戦€夋嫨锛?
   - Branch: main
   - Root Directory: eport_online
   - Runtime: Node
   - Build Command: 
pm install
   - Start Command: 
pm start

3. 閮ㄧ讲瀹屾垚鍚庯紝璁块棶 https://your-app.onrender.com/report.html

## 閮ㄧ讲鍒?Zeabur锛堝厤璐癸紝鍥戒骇锛?

[Zeabur](https://zeabur.com) 鎻愪緵鍏嶈垂 Node.js 鎵樼锛屾敮鎸佷腑鍥借闂€?

### 姝ラ

1. 灏嗕唬鐮佷笂浼犲埌 GitHub 浠撳簱

2. 鍦?Zeabur 鍒涘缓鏂版湇鍔★紝閫夋嫨浠?GitHub 閮ㄧ讲

3. 璁剧疆鍚?Render锛岃闂垎閰嶇殑鍩熷悕鍗冲彲

## 鍔熻兘璇存槑

- **鐪嬫澘椤甸潰** (/report.html)锛氭煡鐪嬬粺璁＄粨鏋滐紝鏀寔鏃ユ湡鑼冨洿銆佺彮娆°€佸嚭杞︿汉銆佽溅鍙枫€佷换鍔′簲涓淮搴︾殑绛涢€夛紝涓変釜 Tab 鍒嗗埆灞曠ず姣忔棩浠诲姟姹囨€汇€佸嚭杞︿汉缁熻銆佷换鍔＄粺璁?
- **涓婁紶椤甸潰** (/admin.html)锛氫笂浼?CSV 鏂囦欢锛屼笂浼犲悗鏇挎崲鍏ㄩ儴鐜版湁鏁版嵁
- **瀹炴椂鍒锋柊**锛氱湅鏉块〉闈㈢偣鍑?鍒锋柊鏁版嵁"鎸夐挳鍙幏鍙栨渶鏂版暟鎹?

## 鏁版嵁璇存槑

涓婁紶鐨?CSV 鏂囦欢闇€瑕佸寘鍚互涓嬪垪锛堥涔﹁〃鏍兼爣鍑嗘牸寮忥級锛?

| 鍒楀悕 | 璇存槑 |
|------|------|
| 鏃堕棿 | 鏃ユ湡锛屾牸寮?YYYY-MM-DD 鎴?YYYY/MM/DD |
| 閲囬泦浠诲姟 | 浠诲姟鍚嶇О |
| 鍑鸿溅浜篠D | 鍑鸿溅浜哄鍚嶏紙鏀寔澶氫汉鐢?/ 鍒嗛殧锛?|
| 鍑鸿溅鏃堕棿 | 鍑哄彂鏃堕棿锛屾牸寮?HH:MM 鎴?HH锛歁M |
| 杞﹀彿 | 杞︾墝鍙凤紙闈炲繀濉級 |

## 鐩綍缁撴瀯

`
report_online/
鈹溾攢鈹€ server/
鈹?  鈹溾攢鈹€ index.js    # Express 鏈嶅姟鍏ュ彛
鈹?  鈹溾攢鈹€ db.js       # SQLite 鏁版嵁搴撴搷浣?
鈹?  鈹斺攢鈹€ parse.js    # CSV 瑙ｆ瀽閫昏緫
鈹溾攢鈹€ public/
鈹?  鈹溾攢鈹€ report.html # 鐪嬫澘椤甸潰
鈹?  鈹斺攢鈹€ admin.html  # 涓婁紶绠＄悊椤甸潰
鈹溾攢鈹€ data/           # SQLite 鏁版嵁搴撴枃浠讹紙閮ㄧ讲鍚庤嚜鍔ㄥ垱寤猴級
鈹斺攢鈹€ package.json
`