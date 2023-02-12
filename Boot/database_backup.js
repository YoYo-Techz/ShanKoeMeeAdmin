
const fs = require('fs');
const _ = require('lodash');
const exec = require('child_process').exec;
const path = require('path');
var zipFolder = require('zip-folder');

const nodemailer = require('nodemailer');
var defaultTransport = nodemailer.createTransport({
 service: 'Gmail',
 host: "smtp.gmail.com",
 port: 587,
 auth: {
   user: "no-reply@therummyround.com",
   pass: "Shree@1204"
 }
});
// Concatenate root directory path with our backup folder.
const backupDirPath = path.join(__dirname, '../public/database-backup');
console.log("DB PATH : "+backupDirPath);

const dbOptions = {
  user: '',
  pass: '',
  host: '127.0.0.1',
  port: 27017,
  database: 'express-rummy',
  autoBackup: true,
  removeOldBackup: true,
  keepLastDaysBackup: 0,
  autoBackupPath: backupDirPath
};

// return stringDate as a date object.
exports.stringToDate = dateString => {
  return new Date(dateString);
};

// Check if variable is empty or not.
exports.empty = mixedVar => {
  let undef, key, i, len;
  const emptyValues = [undef, null, false, 0, '', '0'];
  for (i = 0, len = emptyValues.length; i < len; i++) {
    if (mixedVar === emptyValues[i]) {
      return true;
    }
  }
  if (typeof mixedVar === 'object') {
    for (key in mixedVar) {
      return false;
    }
    return true;
  }
  return false;
};

// Auto backup function
exports.dbAutoBackUp = () => {

  // check for auto backup is enabled or disabled
  if (dbOptions.autoBackup == true) {
  console.log("TRUE / FLASE : "+dbOptions.autoBackup);
    let date = new Date();
    console.log("Current Date : "+date);
    let beforeDate, oldBackupDir, oldBackupPath;

    // Current date
    currentDate = this.stringToDate(date);
    let newBackupDir =
      currentDate.getFullYear() +
      '-' +
      (currentDate.getMonth() + 1) +
      '-' +
      currentDate.getDate();

    // New backup path for current backup process
    let newBackupPath = dbOptions.autoBackupPath + '-mongodump-' + newBackupDir;
   console.log("newBackupPath : "+newBackupPath);
    // check for remove old backup after keeping # of days given in configuration
    if (dbOptions.removeOldBackup == true) {
      beforeDate = _.clone(currentDate);
      // Substract number of days to keep backup and remove old backup
      beforeDate.setDate(beforeDate.getDate() - dbOptions.keepLastDaysBackup);
      oldBackupDir =
        beforeDate.getFullYear() +
        '-' +
        (beforeDate.getMonth() + 1) +
        '-' +
        beforeDate.getDate();
      // old backup(after keeping # of days)
      oldBackupPath = dbOptions.autoBackupPath + 'mongodump-' + oldBackupDir;
    }

    // Command for mongodb dump process
    let cmd =
      'mongodump --host ' +
      dbOptions.host +
      ' --port ' +
      dbOptions.port +
      ' --db ' +
      dbOptions.database +
      // ' --username ' +
      // dbOptions.user +
      // ' --password ' +
      // dbOptions.pass +
      ' --out ' +
      newBackupPath;
      console.log("CMD : "+cmd);
    exec(cmd, (error, stdout, stderr) => {
      if (this.empty(error)) {
        // check for remove old backup after keeping # of days given in configuration.
        if (dbOptions.removeOldBackup == true) {
          if (fs.existsSync(oldBackupPath)) {
            exec('rm -rf ' + oldBackupPath, err => {});
             exec('rm -rf ' + oldBackupPath+'.zip', err => {});
          }
        }
      }
         console.log("//***** -- Zip Database Folder -- *****//");
                
        zipFolder(newBackupPath, newBackupPath+'.zip', function(err) {
            if(err) {
                console.log('oh no!', err);
            } else {
                console.log('EXCELLENT');
                  var mailOptions = {
                          to: "backup@kalpcorporate.com",
                          from: 'The RummyRounds',
                          subject: 'Therummyround Database Backup' ,
                          text: 'Hello' +'  Admin' +',\n\n  Therummyround MongoDB Databse Backup'+',\n\n  Server time : '+ new Date().toLocaleString(),
                          attachments: [
                            {   // utf-8 string as an attachment
                                path:  newBackupPath+'.zip'
                            },
                          ]  
                  };
                  defaultTransport.sendMail(mailOptions, function(err) {
                          if (!err) {
                           console.log("Databse Backup Mail Sent Successfully.");
                            defaultTransport.close();
                          } else {
                            console.log("Error sending mail,please try again After some time", err);
                          }

                  });
            }
        });
      
    });
   
  }
};