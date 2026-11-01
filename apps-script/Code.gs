/**
 * Google Apps Script - Lớp API xử lý Dữ liệu Thiệp Cưới Online
 * Hợp đồng API: docs/fe/04-api-contract-apps-script.md
 * Quy tắc nghiệp vụ: docs/ba/04-quy-tac-nghiep-vu.md
 */

// Cấu hình tên tab và tiêu đề cột
var SHEET_RSVP = 'RSVP';
var HEADERS_RSVP = ['id', 'createdAt', 'name', 'attendance', 'guests', 'note'];

var SHEET_WISHES = 'Wishes';
var HEADERS_WISHES = ['id', 'createdAt', 'name', 'message', 'Duyệt'];

var CACHE_KEY_WISHES = 'approved_wishes_v1';
var CACHE_TTL_SECONDS = 60; // Bộ nhớ đệm 60 giây
var MAX_WISHES_RETURNED = 200; // Tối đa 200 lời chúc mới nhất

/**
 * Xử lý yêu cầu HTTP GET
 * Hỗ trợ: ?action=wishes - Đọc danh sách lời chúc đã duyệt
 */
function doGet(e) {
  try {
    var action = (e && e.parameter) ? e.parameter.action : '';
    if (action !== 'wishes') {
      return json_({
        ok: false,
        error: 'validation',
        message: 'Hành động không hợp lệ. Chỉ hỗ trợ action=wishes'
      });
    }

    // 1. Kiểm tra cache
    var cache = CacheService.getScriptCache();
    var cachedData = cache.get(CACHE_KEY_WISHES);
    if (cachedData) {
      return json_({
        ok: true,
        data: JSON.parse(cachedData)
      });
    }

    // 2. Đọc từ Google Sheet
    var sheet = getSheetOrCreate_(SHEET_WISHES);
    var lastRow = sheet.getLastRow();
    var approvedList = [];

    if (lastRow > 1) {
      // Dòng 1 là tiêu đề: id, createdAt, name, message, Duyệt
      var numRows = lastRow - 1;
      var values = sheet.getRange(2, 1, numRows, 5).getValues();

      for (var i = 0; i < values.length; i++) {
        var row = values[i];
        var isApproved = (row[4] === true || String(row[4]).trim().toUpperCase() === 'TRUE');
        if (isApproved) {
          approvedList.push({
            id: String(row[0] || ''),
            name: String(row[2] || ''),
            message: String(row[3] || ''),
            createdAt: String(row[1] || '')
          });
        }
      }
    }

    // 3. Mới nhất trước (đảo ngược thứ tự vì dòng mới được append ở cuối)
    approvedList.reverse();

    // 4. Giới hạn tối đa 200 dòng
    if (approvedList.length > MAX_WISHES_RETURNED) {
      approvedList = approvedList.slice(0, MAX_WISHES_RETURNED);
    }

    // 5. Lưu vào cache (tối đa 100KB của CacheService)
    try {
      cache.put(CACHE_KEY_WISHES, JSON.stringify(approvedList), CACHE_TTL_SECONDS);
    } catch (cacheErr) {
      // Nếu payload vượt dung lượng cache thì vẫn tiếp tục trả dữ liệu
    }

    return json_({
      ok: true,
      data: approvedList
    });
  } catch (err) {
    return json_({
      ok: false,
      error: 'server',
      message: err.message || 'Lỗi xử lý máy chủ'
    });
  }
}

/**
 * Xử lý yêu cầu HTTP POST
 * Nhận Content-Type: text/plain;charset=utf-8 thân JSON
 * Hỗ trợ action: 'rsvp' | 'wish'
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json_({
        ok: false,
        error: 'validation',
        message: 'Thiếu nội dung yêu cầu (postData.contents)'
      });
    }

    var payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return json_({
        ok: false,
        error: 'validation',
        message: 'Dữ liệu gửi lên không phải JSON hợp lệ'
      });
    }

    // 1. Kiểm tra Honeypot: Nếu hp có giá trị -> trả ok:true giả nhưng KHÔNG ghi vào Sheet
    if (payload.hp && String(payload.hp).trim() !== '') {
      var fakePrefix = payload.action === 'wish' ? 'w_' : 'r_';
      return json_({
        ok: true,
        data: { id: generateId_(fakePrefix) }
      });
    }

    // 2. Kiểm tra tính hợp lệ của dữ liệu đầu vào
    var validation = validate_(payload);
    if (!validation.valid) {
      return json_({
        ok: false,
        error: 'validation',
        message: validation.message
      });
    }
    var clean = validation.data;

    // 3. Chặn lặp nội dung giống hệt trong 60 giây (Chống spam / Rate limit)
    var cache = CacheService.getScriptCache();
    var rateLimitKey = getRateLimitKey_(clean);
    if (cache.get(rateLimitKey)) {
      return json_({
        ok: false,
        error: 'rate',
        message: 'Nội dung tương tự đã được gửi. Vui lòng chờ 60 giây trước khi gửi lại.'
      });
    }

    // 4. LockService tránh xung đột ghi đồng thời
    var lock = LockService.getScriptLock();
    var lockAcquired = false;
    try {
      lockAcquired = lock.tryLock(10000); // Chờ tối đa 10 giây
    } catch (lockErr) {
      lockAcquired = false;
    }

    if (!lockAcquired) {
      return json_({
        ok: false,
        error: 'server',
        message: 'Hệ thống đang bận xử lý, vui lòng thử lại sau.'
      });
    }

    try {
      var createdAt = formatIsoDateTime_(new Date());

      if (clean.action === 'rsvp') {
        var rsvpId = generateId_('r_');
        appendRow_(SHEET_RSVP, [
          rsvpId,
          createdAt,
          clean.name,
          clean.attendance,
          clean.guests,
          clean.note
        ]);

        // Đánh dấu nội dung đã gửi vào cache chống lặp
        cache.put(rateLimitKey, '1', 60);

        return json_({
          ok: true,
          data: { id: rsvpId }
        });
      } else if (clean.action === 'wish') {
        var wishId = generateId_('w_');
        // Duyệt mặc định là false
        appendRow_(SHEET_WISHES, [
          wishId,
          createdAt,
          clean.name,
          clean.message,
          false
        ]);

        // Đánh dấu nội dung đã gửi vào cache chống lặp
        cache.put(rateLimitKey, '1', 60);

        return json_({
          ok: true,
          data: { id: wishId }
        });
      }
    } finally {
      try {
        lock.releaseLock();
      } catch (relErr) {}
    }
  } catch (err) {
    return json_({
      ok: false,
      error: 'server',
      message: err.message || 'Lỗi máy chủ nội bộ'
    });
  }
}

/**
 * Kiểm tra tính hợp lệ của dữ liệu đầu vào (không tin client)
 * @param {Object} payload Dữ liệu nhận từ client
 * @returns {{ valid: boolean, message?: string, data?: Object }}
 */
function validate_(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { valid: false, message: 'Dữ liệu không đúng định dạng đối tượng' };
  }

  var action = payload.action;
  if (action !== 'rsvp' && action !== 'wish') {
    return { valid: false, message: 'action phải là "rsvp" hoặc "wish"' };
  }

  // Họ tên: 1–60 ký tự sau khi cắt khoảng trắng
  if (payload.name === undefined || payload.name === null) {
    return { valid: false, message: 'Họ tên không được để trống' };
  }
  var name = String(payload.name).trim();
  if (name.length < 1 || name.length > 60) {
    return { valid: false, message: 'Họ tên phải từ 1 đến 60 ký tự' };
  }

  var clean = {
    action: action,
    name: name
  };

  if (action === 'rsvp') {
    // attendance: một trong 4 giá trị vuquy | thanhhon | both | none
    var validAttendances = ['vuquy', 'thanhhon', 'both', 'none'];
    var attendance = payload.attendance;
    if (!attendance || validAttendances.indexOf(attendance) === -1) {
      return { valid: false, message: 'Thông tin tham dự (attendance) phải là vuquy, thanhhon, both hoặc none' };
    }
    clean.attendance = attendance;

    // guests: số nguyên 1–10
    var guests = payload.guests;
    var guestsNum = Number(guests);
    if (!Number.isInteger(guestsNum) || guestsNum < 1 || guestsNum > 10) {
      return { valid: false, message: 'Số lượng khách (guests) phải là số nguyên từ 1 đến 10' };
    }
    clean.guests = guestsNum;

    // note: chuỗi 0–300 ký tự sau khi cắt khoảng trắng
    var note = '';
    if (payload.note !== undefined && payload.note !== null) {
      note = String(payload.note).trim();
    }
    if (note.length > 300) {
      return { valid: false, message: 'Lời nhắn (note) không được vượt quá 300 ký tự' };
    }
    clean.note = note;
  } else if (action === 'wish') {
    // message: chuỗi 1–300 ký tự sau khi cắt khoảng trắng
    if (payload.message === undefined || payload.message === null) {
      return { valid: false, message: 'Lời chúc (message) không được để trống' };
    }
    var message = String(payload.message).trim();
    if (message.length < 1 || message.length > 300) {
      return { valid: false, message: 'Lời chúc (message) phải từ 1 đến 300 ký tự' };
    }
    clean.message = message;
  }

  return { valid: true, data: clean };
}

/**
 * Chống chèn công thức Sheet (Formula Injection)
 * Thêm dấu ' phía trước chuỗi bắt đầu bằng =, +, -, @
 * @param {*} val Giá trị ô
 * @returns {*} Giá trị đã được bảo vệ
 */
function sanitizeFormula_(val) {
  if (typeof val === 'string') {
    var trimmed = val.trim();
    if (/^[=+\-@]/.test(trimmed)) {
      return "'" + val;
    }
  }
  return val;
}

/**
 * Ghi một hàng vào Sheet, tự động khử công thức nguy hiểm
 * @param {string} sheetName Tên tab
 * @param {Array} row Mảng dữ liệu của hàng
 * @returns {Array} Mảng dữ liệu đã khử
 */
function appendRow_(sheetName, row) {
  var sheet = getSheetOrCreate_(sheetName);
  var sanitizedRow = row.map(function(cell) {
    return sanitizeFormula_(cell);
  });
  // Ghi vào dòng trống đầu tiên theo cột A (id), không dùng appendRow:
  // appendRow nhảy qua mọi ô có định dạng/ô tick sẵn nên có thể ghi lệch xuống dòng rất thấp.
  var targetRow = lastDataRow_(sheet) + 1;
  sheet.getRange(targetRow, 1, 1, sanitizedRow.length).setValues([sanitizedRow]);
  if (sheetName === SHEET_WISHES) {
    // Cột E (Duyệt) là ô tick để chủ thiệp bấm duyệt; dòng mới mặc định chưa tick.
    sheet.getRange(targetRow, HEADERS_WISHES.length).insertCheckboxes();
    sheet.getRange(targetRow, HEADERS_WISHES.length).setValue(false);
  }
  return sanitizedRow;
}

/**
 * Dòng cuối cùng thực sự có dữ liệu, xác định theo cột A (id).
 * @param {Sheet} sheet
 * @returns {number} chỉ số dòng (1 = chỉ có tiêu đề, 0 = trống)
 */
function lastDataRow_(sheet) {
  var maxRows = sheet.getMaxRows();
  if (maxRows < 1) return 0;
  var ids = sheet.getRange(1, 1, maxRows, 1).getValues();
  for (var i = ids.length - 1; i >= 0; i--) {
    if (String(ids[i][0]).trim() !== '') return i + 1;
  }
  return 0;
}

/**
 * Đóng gói phản hồi dưới dạng JSON
 * @param {Object} obj Đối tượng kết quả
 * @returns {TextOutput}
 */
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Lấy Sheet theo tên, tự động tạo tab và hàng tiêu đề nếu chưa có
 * @param {string} sheetName Tên tab cần lấy
 * @returns {Sheet}
 */
function getSheetOrCreate_(sheetName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  // Nếu sheet mới tạo hoặc trống rỗng (chưa có hàng nào)
  if (sheet.getLastRow() === 0) {
    if (sheetName === SHEET_RSVP) {
      sheet.appendRow(HEADERS_RSVP);
      sheet.setFrozenRows(1);
    } else if (sheetName === SHEET_WISHES) {
      sheet.appendRow(HEADERS_WISHES);
      sheet.setFrozenRows(1);
      // Không tạo sẵn ô tick hàng loạt: ô tick rỗng bị Sheets tính là "có dữ liệu",
      // làm appendRow ghi xuống dưới cùng. Ô tick được thêm riêng cho từng dòng mới ở appendRow_.
    }
  }
  return sheet;
}

/**
 * Sinh ID ngắn gọn với tiền tố
 * @param {string} prefix Tiền tố 'r_' hoặc 'w_'
 * @returns {string} Ví dụ: 'r_8f3k2a1b'
 */
function generateId_(prefix) {
  var idPart = '';
  if (typeof Utilities !== 'undefined' && Utilities.getUuid) {
    idPart = Utilities.getUuid().replace(/-/g, '').slice(0, 8);
  } else {
    idPart = Math.random().toString(36).substring(2, 10);
  }
  return prefix + idPart;
}

/**
 * Định dạng thời gian theo chuẩn ISO 8601 múi giờ +07:00 (Asia/Ho_Chi_Minh)
 * @param {Date} [date] Đối tượng ngày tháng (mặc định hiện tại)
 * @returns {string} Ví dụ: '2026-11-05T09:30:00+07:00'
 */
function formatIsoDateTime_(date) {
  var d = date || new Date();
  if (typeof Utilities !== 'undefined' && Utilities.formatDate) {
    return Utilities.formatDate(d, 'Asia/Ho_Chi_Minh', "yyyy-MM-dd'T'HH:mm:ss'+07:00'");
  }
  // Dự phòng thuần JS nếu chạy ngoài môi trường Apps Script
  var tzOffset = 7 * 60; // phút
  var localTime = new Date(d.getTime() + (tzOffset + d.getTimezoneOffset()) * 60000);
  var pad = function(n) { return (n < 10 ? '0' : '') + n; };
  return localTime.getFullYear() + '-' +
    pad(localTime.getMonth() + 1) + '-' +
    pad(localTime.getDate()) + 'T' +
    pad(localTime.getHours()) + ':' +
    pad(localTime.getMinutes()) + ':' +
    pad(localTime.getSeconds()) + '+07:00';
}

/**
 * Sinh khóa nhận diện nội dung lặp để chặn spam trong 60 giây
 * @param {Object} clean Dữ liệu đã validate
 * @returns {string} Key cache
 */
function getRateLimitKey_(clean) {
  var content = clean.action + ':' + clean.name + ':';
  if (clean.action === 'rsvp') {
    content += clean.attendance + ':' + clean.guests + ':' + clean.note;
  } else {
    content += clean.message;
  }

  if (typeof Utilities !== 'undefined' && Utilities.computeDigest) {
    var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, content, Utilities.Charset.UTF_8);
    var hex = '';
    for (var i = 0; i < digest.length; i++) {
      var b = digest[i];
      if (b < 0) b += 256;
      var str = b.toString(16);
      if (str.length === 1) str = '0' + str;
      hex += str;
    }
    return 'dup_' + hex;
  }

  var simpleHash = 0;
  for (var j = 0; j < content.length; j++) {
    simpleHash = ((simpleHash << 5) - simpleHash) + content.charCodeAt(j);
    simpleHash |= 0;
  }
  return 'dup_' + Math.abs(simpleHash).toString(16);
}

/**
 * Hàm kiểm chứng thủ công trong trình soạn thảo Google Apps Script
 * Kiểm tra toàn diện hàm validate_, chống chèn công thức, định dạng thời gian và sinh ID
 */
function selfTest_() {
  var passed = 0;
  var failed = 0;

  function assert(condition, testName) {
    if (condition) {
      Logger.log('  [PASS] ' + testName);
      passed++;
    } else {
      Logger.log('  [FAIL] ' + testName);
      failed++;
    }
  }

  Logger.log('==================================================');
  Logger.log('BẮT ĐẦU SELF-TEST APPS SCRIPT (KIỂM TRA HỢP ĐỒNG API)');
  Logger.log('==================================================');

  // --- Nhóm 1: Kiểm tra validate_ cho RSVP ---
  Logger.log('\n--- 1. Kiểm tra RSVP ---');
  assert(validate_({
    action: 'rsvp',
    name: 'Nguyễn Văn A',
    attendance: 'both',
    guests: 2,
    note: 'Chúc mừng hai bạn!'
  }).valid, 'RSVP hợp lệ đầy đủ các trường');

  assert(validate_({
    action: 'rsvp',
    name: '  Trần Thị B  ',
    attendance: 'vuquy',
    guests: 1
  }).valid, 'RSVP hợp lệ không có note và tự động trim tên');

  assert(validate_({
    action: 'rsvp',
    name: 'Lê Văn C',
    attendance: 'thanhhon',
    guests: 10,
    note: ''
  }).valid, 'RSVP hợp lệ với guests = 10 (biên trên)');

  assert(validate_({
    action: 'rsvp',
    name: 'Phạm Thị D',
    attendance: 'none',
    guests: 1
  }).valid, 'RSVP hợp lệ với attendance = none');

  assert(!validate_({
    action: 'rsvp',
    name: '',
    attendance: 'both',
    guests: 2
  }).valid, 'RSVP từ chối khi tên rỗng');

  assert(!validate_({
    action: 'rsvp',
    name: '   ',
    attendance: 'both',
    guests: 2
  }).valid, 'RSVP từ chối khi tên toàn khoảng trắng');

  assert(!validate_({
    action: 'rsvp',
    name: null,
    attendance: 'both',
    guests: 2
  }).valid, 'RSVP từ chối khi tên là null');

  var name61 = new Array(62).join('a');
  assert(!validate_({
    action: 'rsvp',
    name: name61,
    attendance: 'both',
    guests: 2
  }).valid, 'RSVP từ chối khi tên > 60 ký tự');

  assert(!validate_({
    action: 'rsvp',
    name: 'Nguyễn A',
    attendance: 'khong_di',
    guests: 2
  }).valid, 'RSVP từ chối khi attendance sai');

  assert(!validate_({
    action: 'rsvp',
    name: 'Nguyễn A',
    attendance: 'both',
    guests: 0
  }).valid, 'RSVP từ chối khi guests < 1');

  assert(!validate_({
    action: 'rsvp',
    name: 'Nguyễn A',
    attendance: 'both',
    guests: 11
  }).valid, 'RSVP từ chối khi guests > 10');

  assert(!validate_({
    action: 'rsvp',
    name: 'Nguyễn A',
    attendance: 'both',
    guests: 1.5
  }).valid, 'RSVP từ chối khi guests là số thực');

  assert(!validate_({
    action: 'rsvp',
    name: 'Nguyễn A',
    attendance: 'both',
    guests: 'abc'
  }).valid, 'RSVP từ chối khi guests không phải số');

  var note301 = new Array(302).join('x');
  assert(!validate_({
    action: 'rsvp',
    name: 'Nguyễn A',
    attendance: 'both',
    guests: 2,
    note: note301
  }).valid, 'RSVP từ chối khi note > 300 ký tự');

  // --- Nhóm 2: Kiểm tra validate_ cho Wish ---
  Logger.log('\n--- 2. Kiểm tra Wish ---');
  assert(validate_({
    action: 'wish',
    name: 'Bạn thời cấp 3',
    message: 'Trăm năm hạnh phúc, sớm có quý tử!'
  }).valid, 'Wish hợp lệ đầy đủ name và message');

  var msg300 = new Array(301).join('w');
  assert(validate_({
    action: 'wish',
    name: 'Bạn thân',
    message: msg300
  }).valid, 'Wish hợp lệ với message đúng 300 ký tự');

  assert(!validate_({
    action: 'wish',
    name: 'Bạn thân',
    message: ''
  }).valid, 'Wish từ chối khi message rỗng');

  assert(!validate_({
    action: 'wish',
    name: 'Bạn thân',
    message: '    '
  }).valid, 'Wish từ chối khi message chỉ có khoảng trắng');

  assert(!validate_({
    action: 'wish',
    name: 'Bạn thân',
    message: null
  }).valid, 'Wish từ chối khi message là null');

  var msg301 = new Array(302).join('w');
  assert(!validate_({
    action: 'wish',
    name: 'Bạn thân',
    message: msg301
  }).valid, 'Wish từ chối khi message > 300 ký tự');

  // --- Nhóm 3: Kiểm tra validate_ chung ---
  Logger.log('\n--- 3. Kiểm tra Validate chung ---');
  assert(!validate_(null).valid, 'Từ chối payload null');
  assert(!validate_('string').valid, 'Từ chối payload dạng chuỗi');
  assert(!validate_([1, 2, 3]).valid, 'Từ chối payload dạng mảng');
  assert(!validate_({ action: 'unknown', name: 'A' }).valid, 'Từ chối action không hợp lệ');

  // --- Nhóm 4: Chống công thức tính Sheet (sanitizeFormula_) ---
  Logger.log('\n--- 4. Kiểm tra Chống Formula Injection ---');
  assert(sanitizeFormula_('=SUM(A1:B10)') === "'=SUM(A1:B10)", 'Bảo vệ chuỗi bắt đầu bằng "="');
  assert(sanitizeFormula_('+1234567890') === "'+1234567890", 'Bảo vệ chuỗi bắt đầu bằng "+"');
  assert(sanitizeFormula_('-CMD|calc') === "'-CMD|calc", 'Bảo vệ chuỗi bắt đầu bằng "-"');
  assert(sanitizeFormula_('@mention') === "'@mention", 'Bảo vệ chuỗi bắt đầu bằng "@"');
  assert(sanitizeFormula_('  =A1+B1') === "'  =A1+B1", 'Bảo vệ chuỗi có khoảng trắng trước ký tự "="');
  assert(sanitizeFormula_('Nguyễn Văn A') === 'Nguyễn Văn A', 'Giữ nguyên chuỗi an toàn không có ký tự đặc biệt');
  assert(sanitizeFormula_(10) === 10, 'Giữ nguyên giá trị kiểu số');
  assert(sanitizeFormula_(true) === true, 'Giữ nguyên giá trị kiểu boolean');

  // --- Nhóm 5: Kiểm tra Sinh ID và Múi giờ ISO 8601 ---
  Logger.log('\n--- 5. Kiểm tra Sinh ID và Múi giờ ---');
  var rsvpId = generateId_('r_');
  assert(/^r_[a-z0-9]{8}$/i.test(rsvpId), 'Sinh ID RSVP đúng tiền tố r_ (nhận: ' + rsvpId + ')');

  var wishId = generateId_('w_');
  assert(/^w_[a-z0-9]{8}$/i.test(wishId), 'Sinh ID Wish đúng tiền tố w_ (nhận: ' + wishId + ')');

  var isoDate = formatIsoDateTime_(new Date());
  assert(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+07:00$/.test(isoDate), 'Thời gian đúng chuẩn ISO 8601 múi +07:00 (nhận: ' + isoDate + ')');

  // --- Nhóm 6: Kiểm tra Logic Honeypot ---
  Logger.log('\n--- 6. Kiểm tra Honeypot ---');
  var botPayload = { action: 'rsvp', name: 'Bot Spam', hp: 'http://spam.com', attendance: 'both', guests: 1 };
  var isBotDetected = Boolean(botPayload.hp && String(botPayload.hp).trim() !== '');
  assert(isBotDetected, 'Nhận diện chính xác honeypot hp có dữ liệu');

  var normalPayload = { action: 'rsvp', name: 'Khách Thật', hp: '', attendance: 'both', guests: 1 };
  var isNormalNotBot = !normalPayload.hp || String(normalPayload.hp).trim() === '';
  assert(isNormalNotBot, 'Honeypot hp rỗng được nhận diện là người dùng hợp lệ');

  Logger.log('\n==================================================');
  Logger.log('TỔNG KẾT: ĐẠT ' + passed + ' / ' + (passed + failed) + ' CA KIỂM TRA (LỖI: ' + failed + ')');
  Logger.log('==================================================');
}
