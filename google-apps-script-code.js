/**
 * Google Apps Script - Store Screenshots in Same Folder as Sheet
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open https://script.google.com
 * 2. Create a new project or open existing one
 * 3. Replace YOUR_SPREADSHEET_ID with your actual Google Sheet ID
 * 4. Update SHEET_NAME if your sheet is not named "Sheet1"
 * 5. Enable Drive API: Extensions → Apps Script API → Enable
 * 6. Deploy as Web App
 * 
 * Note: Screenshots will be saved in the SAME folder as your spreadsheet
 */

function doPost(e) {
  try {
    // ==========================================
    // CONFIGURATION - UPDATE THESE VALUES
    // ==========================================
    const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // Replace with your Google Sheet ID
    const SHEET_NAME = 'Sheet1'; // Change if your sheet has a different name
    
    // Get your Google Sheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Parse form data (handles both GET and POST)
    let data = {};
    if (e.postData && e.postData.contents) {
      // Try JSON first
      try {
        data = JSON.parse(e.postData.contents);
      } catch (e) {
        // If not JSON, parse as URL-encoded
        data = e.parameter || {};
      }
    } else {
      data = e.parameter || {};
    }
    
    // ==========================================
    // GET FOLDER WHERE SPREADSHEET IS LOCATED
    // ==========================================
    // Get the folder where your spreadsheet is saved (same folder as sheet)
    const spreadsheetFile = DriveApp.getFileById(SPREADSHEET_ID);
    const parentFolders = spreadsheetFile.getParents();
    
    let folder;
    if (parentFolders.hasNext()) {
      // Spreadsheet is in a folder - use that folder
      folder = parentFolders.next();
      Logger.log('Using existing folder: ' + folder.getName());
    } else {
      // Spreadsheet is in My Drive root - create "Payment Screenshots" folder in My Drive
      const folders = DriveApp.getFoldersByName('Payment Screenshots');
      if (folders.hasNext()) {
        folder = folders.next();
      } else {
        folder = DriveApp.createFolder('Payment Screenshots');
        Logger.log('Created folder: Payment Screenshots');
      }
    }
    
    // ==========================================
    // UPLOAD SCREENSHOT TO DRIVE
    // ==========================================
    let screenshotUrl = '';
    let screenshotFileName = '';
    
    if (data.payment_screenshot_base64) {
      try {
        // Convert base64 string to blob
        const base64Data = data.payment_screenshot_base64;
        const imageBlob = Utilities.newBlob(
          Utilities.base64Decode(base64Data),
          data.payment_screenshot_type || 'image/png',
          data.payment_screenshot_filename || 'screenshot.png'
        );
        
        // Create unique filename with child name and timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
                          new Date().getTime();
        const childName = (data.child_name || 'Unknown').replace(/[^a-z0-9]/gi, '_').substring(0, 20);
        const originalFileName = data.payment_screenshot_filename || 'screenshot.png';
        const fileExtension = originalFileName.split('.').pop() || 'png';
        
        screenshotFileName = `Payment_${childName}_${timestamp}.${fileExtension}`;
        
        // Upload to Drive folder
        const file = folder.createFile(imageBlob);
        file.setName(screenshotFileName);
        
        // Get the file URL (view link)
        screenshotUrl = file.getUrl();
        
        Logger.log('Screenshot uploaded: ' + screenshotFileName);
        Logger.log('URL: ' + screenshotUrl);
        
      } catch (error) {
        Logger.log('Error uploading screenshot: ' + error.toString());
        screenshotUrl = 'Error: ' + error.toString();
        screenshotFileName = 'Upload failed';
      }
    }
    
    // ==========================================
    // SAVE DATA TO GOOGLE SHEET
    // ==========================================
    const rowData = [
      new Date(),                              // Column A: Timestamp
      data.child_name || '',                   // Column B: Child Name
      data.parent_name || '',                  // Column C: Parent Name
      data.phone || '',                        // Column D: Phone
      data.email || '',                        // Column E: Email
      data.age_group || '',                    // Column F: Age Group
      data.batch || '',                        // Column G: Batch
      screenshotUrl,                           // Column H: Screenshot URL (Drive link)
      screenshotFileName                       // Column I: Screenshot File Name
    ];
    
    // Append row to sheet
    sheet.appendRow(rowData);
    
    Logger.log('Data saved to sheet successfully');
    
    // ==========================================
    // RETURN SUCCESS RESPONSE
    // ==========================================
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Registration submitted successfully',
      screenshotUrl: screenshotUrl,
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Log error for debugging
    Logger.log('Error in doPost: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
    
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString(),
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * TEST FUNCTION - Run this to test your setup
 * Run → doPostTest
 */
function doPostTest() {
  // Simulate form submission
  const testData = {
    child_name: 'Test Child',
    parent_name: 'Test Parent',
    phone: '1234567890',
    email: 'test@example.com',
    age_group: '4-6 Years',
    batch: 'Batch 1 (10 AM)',
    payment_screenshot_base64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    payment_screenshot_filename: 'test.png',
    payment_screenshot_type: 'image/png'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    },
    parameter: {}
  };
  
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}
