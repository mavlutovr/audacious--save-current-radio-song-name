const config = require('config');
const {exec} = require('child_process');
const fs = require('fs');
const alert = require('alert');


exec('audtool current-song', (error, stdout, stderr) => {

  if (error) {
    console.error(`error: ${error.message}`);
  }

  if (stderr) {
    console.error(`strerr: ${stderr}`);
  }




  // Song name
  console.log(`Full song name: ${stdout}`);

  let songName = stdout;
  if (config.removeFromFilenames && config.removeFromFilenames.length) {
    for (let i in config.removeFromFilenames) {
      let remove = config.removeFromFilenames[i];

      songName = songName.replace(remove, '');
    }
  }

  console.log(`Saved song name: ${songName}`);


  // File content
  let fileContent = fs.existsSync(config.file)
    ? fs.readFileSync(config.file, 'utf8')
    : '';


  // Already exists
  if (fileContent.indexOf(songName+'\n') !== -1) {
    alert('The song was added before.', 'notify-send');
    return;
  }


  // Add
  // Markdown style
  if (config.format === 'markdown') {

    // H1
    if (fileContent === '') {
      fileContent = '# Radio songs\n\n'+
      '## 1\n';
    }


    let lines = fileContent.split('\n');
    let addBeforeH2 = false;
    let added = false;
    let modifiedFileContent = '';

    for (let i in lines) {

      let line = lines[i];

      // H2
      if (line.indexOf('##') !== -1) {

        if (addBeforeH2) {
          added = true;
          modifiedFileContent += '- [ ] ' + songName + '\n';
        }

        addBeforeH2 = true;
      }

      modifiedFileContent += line + '\n';
    }

    if (!added) {
      modifiedFileContent += '- [ ] ' + songName;
    }

    // Save
    fs.writeFileSync(config.file, modifiedFileContent);
  }


  // Plain style
  else {

    // Add song
    fileContent += songName+'\n';

    // Save
    fs.writeFileSync(config.file, fileContent);
  }


  alert('The song is added.', 'notify-send');
});
