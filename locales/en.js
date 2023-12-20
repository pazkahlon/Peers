export default {
  dir: 'ltr',
  header: 'Transfer your files between devices without any hastle',
  sendFiles: 'Send Files',
  receiveFiles: 'Receive Files',
  connect: 'Connect',
  makeSure:
    'Please make sure both you & your peer have a good internet connection to secure a fast, stable transfer.',
  allEndToEnd: 'All the transactions are end-to-end encrypted.',
  removeAds: 'Remove ads',
  copyright: 'Copyright © 2020 Peers. All rights reserved.',
  send: {
    dragHere: 'Drag file/s here',
    orClickUpload: 'or click the upload button',
    upload: 'Upload',
    dragToAdd: 'Drag file/s here to add more',
    orClickAdd: "or click the 'Add more' button",
    addMore: 'Add More',
    acceptAndContinue: 'Accept and Continue',
    removeFile: 'Remove file',
    limit: 'Maximum limit of 20GB',

    stepsHeader: 'Invite your peer',
    stepOne: 'Make sure your peer has the website open',
    stepTwo: ['Ask your peer to choose ', ''],
    stepThree: 'On your peer’s computer, enter the code:',
    or: 'or',
    copyLink: 'click here to copy a link instead',
    whenStepsDone:
      'When all three steps would be done, the transaction will begin.',
  },
  receive: {
    stepsHeader: 'Connect to your peer',
    stepOne: 'Make sure your peer has the website open',
    stepTwo: ['Ask your peer to choose ', ''],
    stepThree: 'Enter the code that’s on your peer’s device',
  },
  progress: {
    progress: 'Progress',
    perecentReceived: '{percent}% Received',
    sizeReceived: '{received} out of {total}',
    speed: 'At {mbPerSecond}mb/s',
    dontClose:
      'Make sure you and peer don’t close the tabs or the progress will be lost!',

    estimatedTimeRemaining: 'Estimated time remaining',
    seconds: 'About {seconds} Seconds',
    minutes: 'About {minutes} Minutes',
    hours: 'About {hours} Hours',
    hoursMinutes: 'About {hours} Hours and {minutes} Minutes',
    calculating: 'Calculating...',
    complete: 'Complete',

    queue: 'Queue',
    filesReceived: '{received} / {total} files received',

    cancel: 'Cancel Transaction',
    note: 'Please note that canceling the transaction may not erase the parts that alreaday been sent.',
    cancelPrompt:
      'Are you sure you want to cancel the transaction?\nDownloaded files would not be removed.',
    done: {
      header: 'Transaction is Done!',
      description: 'Feel free to refresh or leave the site',
    },
  },
  fileTypes: {
    file: 'File',
    video: 'Video File',
  },
  prompts: {
    waitingForPeer: 'Waiting for peer...',
    pairedAndWaiting: 'Paired successfully. Waiting for connection...',
    connectedAndExchanging:
      'Connected successfully. Exchanging keys for end-to-end encryption...',
    gettingFilesMeta: 'Getting files information...',
    sendingFilesMeta: 'Sending files information...',
    peerCanceled: 'The peer has canceled the transaction.\nReloading...',
    peerDisconnected: 'The peer has disconnected.\nReloading...',
  },
}
